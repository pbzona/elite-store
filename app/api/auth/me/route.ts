import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { tracer } from "@/lib/tracing"

export async function GET() {
  const span = tracer.startSpan('api.auth.me')

  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    span.end()
  }
}
