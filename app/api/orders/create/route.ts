import { getCurrentUser } from "@/lib/auth"
import { clearCart, getCart } from "@/lib/cart"
import { createOrder } from "@/lib/orders"
import { tracer } from "@/lib/tracing"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const span = tracer.startSpan('api.orders.create')

  try {
    const user = await getCurrentUser()
    if (!user) {
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

    // Clear cart after successful order
    await clearCart(cartId)

    return NextResponse.json(order)
  } catch (error) {
    console.error("Create order API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    span.end()
  }
}
