import { getCurrentUser } from "@/lib/auth"
import { clearCart, getCart } from "@/lib/cart"
import { createOrder } from "@/lib/orders"
import { trace } from "@opentelemetry/api"
import { type NextRequest, NextResponse } from "next/server"

const tracer = trace.getTracer('elite-store')

export async function POST(request: NextRequest) {
  const routeSpan = tracer.startSpan('api.orders.create')

  try {
    const user = await getCurrentUser()
    if (!user) {
      routeSpan.setAttributes({ 'auth.result': 'user_not_found' })
      routeSpan.end()
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cartId, checkoutData } = await request.json()

    if (!cartId || !checkoutData) {
      return NextResponse.json({ error: "Cart ID and checkout data are required" }, { status: 400 })
    }

    // Get cart
    const cart = await getCart(cartId)
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Create order
    const order = await createOrder(cart, checkoutData)

    routeSpan.setAttributes({
      'order.id': order.id,
      'order.total': order.total,
    })
    routeSpan.end()

    // Clear cart after successful order
    await clearCart(cartId)

    return NextResponse.json(order)
  } catch (error) {
    console.error("Create order API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
