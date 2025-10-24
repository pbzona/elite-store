import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateCart, updateCartItem } from "@/lib/cart"
import { tracer } from "@/lib/tracing"

export async function POST(request: NextRequest) {
  const span = tracer.startSpan('api.cart.update')

  try {
    const { productId, quantity, sessionId } = await request.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 })
    }

    const cartId = await getOrCreateCart(sessionId)
    await updateCartItem(cartId, productId, quantity)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    span.end()
  }
}
