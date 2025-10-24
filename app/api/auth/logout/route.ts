import { tracer } from "@/lib/tracing"
import { NextResponse } from "next/server"

export async function POST() {
  const span = tracer.startSpan('api.auth.logout')

  try {
    const response = NextResponse.json({ success: true })
    response.cookies.delete("auth-token")
    return response
  } finally {
    span.end()
  }
}
