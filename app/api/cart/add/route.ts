import { addToCart, getOrCreateCart } from "@/lib/cart"
import { trace } from "@opentelemetry/api"
import { type NextRequest, NextResponse } from "next/server"

const tracer = trace.getTracer('elite-store')

export async function POST(request: NextRequest) {
  const routeSpan = tracer.startSpan('api.cart.add')

  try {
    const { productId, quantity = 1, sessionId } = await request.json()

    routeSpan.setAttributes({
      'product.id': productId,
      'quantity': quantity,
      'session.id': sessionId,
    })

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const cartId = await getOrCreateCart(sessionId)
    await addToCart(cartId, productId, quantity)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Add to cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
