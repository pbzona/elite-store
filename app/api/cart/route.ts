import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateCart, getCart } from "@/lib/cart"
import { tracer } from "@/lib/tracing"

export async function POST(request: NextRequest) {
  const span = tracer.startSpan('api.cart.get')

  try {
    const { sessionId } = await request.json()

    const cartId = await getOrCreateCart(sessionId)
    const cart = await getCart(cartId)

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    span.end()
  }
}
