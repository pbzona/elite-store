import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getOrderById } from "@/lib/orders"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const order = await getOrderById(params.id)

    // Ensure user can only access their own orders
    if (order.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Order API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
