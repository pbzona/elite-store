import { addToCart, getOrCreateCart } from "@/lib/cart"
import { tracer } from "@/lib/tracing"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const span = tracer.startSpan('api.cart.add')

  try {
    const { productId, quantity = 1, sessionId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const cartId = await getOrCreateCart(sessionId)
    await addToCart(cartId, productId, quantity)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Add to cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    span.end()
  }
}
