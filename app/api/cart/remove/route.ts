import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateCart, removeFromCart } from "@/lib/cart"
import { tracer } from "@/lib/tracing"

export async function POST(request: NextRequest) {
  const span = tracer.startSpan('api.cart.remove')

  try {
    const { productId, sessionId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const cartId = await getOrCreateCart(sessionId)
    await removeFromCart(cartId, productId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Remove from cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    span.end()
  }
}
