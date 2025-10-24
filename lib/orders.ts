import { getCurrentUser } from "@/lib/auth"
import type { Cart } from "@/lib/cart"
import { db, orderItems, orders, products } from "@/lib/db"
import { tracer } from "@/lib/tracing"
import { SpanStatusCode } from "@opentelemetry/api"
import { desc, eq } from "drizzle-orm"

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: string
  subtotal: string
  tax: string
  shipping: string
  total: string
  shippingFirstName: string
  shippingLastName: string
  shippingAddress1: string
  shippingAddress2: string | null
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingCountry: string
  paymentMethod: string
  paymentStatus: string
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
}

export interface OrderItem {
  id: number
  orderId: string
  productId: number
  quantity: number
  price: string
  createdAt: Date
  product: {
    id: number
    name: string
    slug: string
    r: number
    g: number
    b: number
    icon: string | null
  }
}

export interface CheckoutData {
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    state: string
    zip: string
    country: string
  }
  paymentMethod: string
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export async function createOrder(cart: Cart, checkoutData: CheckoutData): Promise<Order> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("User must be authenticated to create an order")
  }

  const span = tracer.startSpan('orders.createOrder', {
    attributes: {
      'cart.id': cart.id,
      'cart.itemCount': cart.itemCount,
      'checkout.shippingAddress.country': checkoutData.shippingAddress.country,
      'user.id': user.id,
    }
  })

  try {

    const orderNumber = generateOrderNumber()
    const subtotal = cart.subtotal
    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 100 ? 0 : 15 // Free shipping over $100
    const total = subtotal + tax + shipping

    // Create order
    const [order] = await db!
      .insert(orders)
      .values({
        userId: user.id,
        orderNumber,
        status: "pending",
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        shippingFirstName: checkoutData.shippingAddress.firstName,
        shippingLastName: checkoutData.shippingAddress.lastName,
        shippingAddress1: checkoutData.shippingAddress.address1,
        shippingAddress2: checkoutData.shippingAddress.address2 || null,
        shippingCity: checkoutData.shippingAddress.city,
        shippingState: checkoutData.shippingAddress.state,
        shippingZip: checkoutData.shippingAddress.zip,
        shippingCountry: checkoutData.shippingAddress.country,
        paymentMethod: checkoutData.paymentMethod,
        paymentStatus: "pending",
      })
      .returning()

    // Create order items
    const orderItemsData = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }))

    await db!.insert(orderItems).values(orderItemsData)

    const paymentSpan = tracer.startSpan('orders.simulatePayment', {
      attributes: { 'payment.simulated': true }
    })

    const delay = Math.floor(Math.random() * 1000 + 1000);

    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, delay)) // Simulate processing time

    // Update order status to completed (mock successful payment)
    await db!
      .update(orders)
      .set({
        status: "confirmed",
        paymentStatus: "paid",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id))

    paymentSpan.setAttributes({
      'payment.duration_ms': delay,
      'payment.status': 'success'
    })
    paymentSpan.end()

    span.setAttributes({
      'order.id': order.id,
      'order.total': order.total,
    })

    span.end()
    return getOrderById(order.id)
  } catch (error) {
    span.recordException?.(error as Error);
    span.setStatus({ code: SpanStatusCode.ERROR })
    span.end()
    throw error
  }
}

export async function getOrderById(orderId: string): Promise<Order> {
  const [order] = await db!.select().from(orders).where(eq(orders.id, orderId))

  if (!order) {
    throw new Error("Order not found")
  }

  // Get order items with product details
  const items = await db!
    .select({
      orderItem: orderItems,
      product: products,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId))

  const orderItemsWithProducts: OrderItem[] = items.map(({ orderItem, product }) => ({
    ...orderItem,
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      r: product.r,
      g: product.g,
      b: product.b,
      icon: product.icon ?? null
    },
  }))

  return {
    ...order,
    items: orderItemsWithProducts,
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const span = tracer.startSpan('orders.getUserOrders', {
    attributes: { 'user.id': userId }
  })

  try {
    const ordersSpan = tracer.startSpan('orders.fetchOrdersList', {
      attributes: { 'user.id': userId }
    })

    const userOrders = await db!.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt))

    ordersSpan.setAttributes({
      'db.result_count': userOrders.length
    })
    ordersSpan.end()

    const itemsSpan = tracer.startSpan('orders.fetchOrderItems', {
      attributes: {
        'order.count': userOrders.length,
        'db.queries_executed': userOrders.length
      }
    })

    const ordersWithItems = await Promise.all(
      userOrders.map(async (order, idx) => {
        const singleOrderSpan = tracer.startSpan('orders.fetchSingleOrderItems', {
          attributes: {
            'order.id': order.id,
            'order.index': idx
          }
        })

        const items = await db!
          .select({
            orderItem: orderItems,
            product: products,
          })
          .from(orderItems)
          .innerJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id))

        singleOrderSpan.setAttributes({
          'db.result_count': items.length
        })
        singleOrderSpan.end()

        const orderItemsWithProducts: OrderItem[] = items.map(({ orderItem, product }) => ({
          ...orderItem,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            r: product.r,
            g: product.g,
            b: product.b,
            icon: product.icon ?? null
          },
        }))

        return {
          ...order,
          items: orderItemsWithProducts,
        }
      }),
    )

    itemsSpan.setAttributes({
      'total_items_fetched': ordersWithItems.reduce((sum, o) => sum + o.items.length, 0)
    })

    itemsSpan.end()
    span.setAttributes({
      'result.order_count': ordersWithItems.length,
    })
    span.end()

    return ordersWithItems
  } catch (error) {
    span.recordException?.(error as Error);
    span.setStatus({ code: SpanStatusCode.ERROR })
    span.end()
    throw error
  }
}
