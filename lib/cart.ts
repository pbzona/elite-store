import { getCurrentUser } from "@/lib/auth"
import { cartItems, carts, db, productImages, products } from "@/lib/db"
import { tracer } from "@/lib/tracing"
import { SpanStatusCode } from "@opentelemetry/api"
import { and, desc, eq, inArray } from "drizzle-orm"

export interface CartItem {
  id: number
  cartId: string
  productId: number
  quantity: number
  createdAt: Date
  updatedAt: Date
  product: {
    id: number
    name: string
    slug: string
    price: string
    r: number
    g: number
    b: number
    icon: string | null
    inventory: number
    images: {
      id: number
      url: string
      altText: string | null
    }[]
  }
}

export interface Cart {
  id: string
  userId: string | null
  sessionId: string | null
  items: CartItem[]
  itemCount: number
  subtotal: number
}

export async function getOrCreateCart(sessionId?: string): Promise<string> {
  const user = await getCurrentUser()

  let cart

  if (user) {
    // Look for existing user cart
    ;[cart] = await db!.select().from(carts).where(eq(carts.userId, user.id))

    if (!cart) {
      // Create new cart for user
      ;[cart] = await db!
        .insert(carts)
        .values({
          userId: user.id,
        })
        .returning()
    }
  } else if (sessionId) {
    // Look for existing session cart
    ;[cart] = await db!.select().from(carts).where(eq(carts.sessionId, sessionId))

    if (!cart) {
      // Create new cart for session
      ;[cart] = await db!
        .insert(carts)
        .values({
          sessionId,
        })
        .returning()
    }
  } else {
    throw new Error("No user or session ID provided")
  }

  return cart.id
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const span = tracer.startSpan('cart.getCart', {
    attributes: { 'cart.id': cartId }
  })

  try {
    // Start both cart and items queries in parallel
    const cartPromise = db!.select().from(carts).where(eq(carts.id, cartId))

    const itemsSpan = tracer.startSpan('cart.fetchItems', {
      attributes: { 'cart.id': cartId }
    })
    const itemsPromise = db!
      .select({
        cartItem: cartItems,
        product: products,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cartId))
      .orderBy(desc(cartItems.createdAt))

    // Await both in parallel
    const [[cart], items] = await Promise.all([cartPromise, itemsPromise])

    itemsSpan.setAttributes({
      'db.result_count': items.length
    })
    itemsSpan.end()

    if (!cart) {
      span.setAttributes({ 'cart.found': false })
      span.end()
      return null
    }

    span.setAttributes({ 'cart.found': true })

    // Batch fetch all product images at once using inArray
    const productIds = items.map((item) => item.product.id)
    const images =
      productIds.length > 0
        ? await db!.select().from(productImages).where(inArray(productImages.productId, productIds))
        : []

    // Group images by productId for efficient lookup
    const imagesByProduct = images.reduce((acc, img) => {
      if (!acc[img.productId]) acc[img.productId] = []
      acc[img.productId].push(img)
      return acc
    }, {} as Record<number, typeof images>)

    // Map cart items with images
    const cartItemsWithProducts: CartItem[] = items.map(({ cartItem, product }) => ({
      ...cartItem,
      product: {
        ...product,
        images: imagesByProduct[product.id] || [],
      },
    }))

    const itemCount = cartItemsWithProducts.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = cartItemsWithProducts.reduce((sum, item) => sum + Number.parseFloat(item.product.price) * item.quantity, 0)

    span.setAttributes({
      'result.item_count': itemCount,
      'result.subtotal': subtotal,
    })
    span.end()

    return {
      ...cart,
      items: cartItemsWithProducts,
      itemCount,
      subtotal,
    }
  } catch (error) {
    span.recordException?.(error as Error)
    span.setStatus({ code: SpanStatusCode.ERROR })
    span.end()
    return null
  }
}

export async function addToCart(cartId: string, productId: number, quantity = 1): Promise<void> {
  const span = tracer.startSpan('cart.addToCart', {
    attributes: { 'cart.id': cartId, 'product.id': productId, 'item.quantity': quantity }
  })

  try {
    // Check if item already exists in cart
    const checkSpan = tracer.startSpan('cart.checkExistingItem', {
      attributes: { 'cart.id': cartId, 'product.id': productId }
    })
    const [existingItem] = await db!
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))

    checkSpan.setAttributes({
      'db.result': existingItem ? 'found' : 'not_found'
    })
    checkSpan.end()

    if (existingItem) {
      // Update quantity
      const updateSpan = tracer.startSpan('cart.updateQuantity')
      await db!
        .update(cartItems)
        .set({
          quantity: existingItem.quantity + quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem.id))

      updateSpan.setAttributes({
        'db.operation': 'UPDATE',
        'quantity.old': existingItem.quantity,
        'quantity.new': existingItem.quantity + quantity
      })
      updateSpan.end()
    } else {
      // Add new item
      const insertSpan = tracer.startSpan('cart.insertItem')
      const [newItem] = await db!.insert(cartItems).values({
        cartId,
        productId,
        quantity,
      }).returning()

      insertSpan.setAttributes({
        'item.id': newItem.id
      })
      insertSpan.end()
    }

    // Update cart timestamp
    const touchSpan = tracer.startSpan('cart.touchCart')
    await db!.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId))
    touchSpan.end()

    span.setAttributes({
      'operation': 'success',
      'performance.queries': 3,
      'performance.suggestion': 'Could batch with main operation'
    })
    span.end()
  } catch (error) {
    span.recordException?.(error as Error)
    span.setStatus({ code: SpanStatusCode.ERROR })
    span.end()
  }
}

export async function updateCartItem(cartId: string, productId: number, quantity: number): Promise<void> {
  if (quantity <= 0) {
    await removeFromCart(cartId, productId)
    return
  }

  await db!
    .update(cartItems)
    .set({
      quantity,
      updatedAt: new Date(),
    })
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))

  // Update cart timestamp
  await db!.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId))
}

export async function removeFromCart(cartId: string, productId: number): Promise<void> {
  await db!.delete(cartItems).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))

  // Update cart timestamp
  await db!.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId))
}

export async function clearCart(cartId: string): Promise<void> {
  await db!.delete(cartItems).where(eq(cartItems.cartId, cartId))

  // Update cart timestamp
  await db!.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId))
}
