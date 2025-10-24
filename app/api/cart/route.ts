import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateCart, getCart } from "@/lib/cart"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    const cartId = await getOrCreateCart(sessionId)
    const cart = await getCart(cartId)

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
