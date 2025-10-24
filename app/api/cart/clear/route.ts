import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateCart, clearCart } from "@/lib/cart"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    const cartId = await getOrCreateCart(sessionId)
    await clearCart(cartId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Clear cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
