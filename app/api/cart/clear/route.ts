import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateCart, clearCart } from "@/lib/cart"
import { tracer } from "@/lib/tracing"

export async function POST(request: NextRequest) {
  const span = tracer.startSpan('api.cart.clear')

  try {
    const { sessionId } = await request.json()

    const cartId = await getOrCreateCart(sessionId)
    await clearCart(cartId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Clear cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    span.end()
  }
}
