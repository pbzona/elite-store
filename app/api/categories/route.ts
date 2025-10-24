import { getCategories } from "@/lib/products"
import { tracer } from "@/lib/tracing"
import { NextResponse } from "next/server"

export async function GET() {
  const span = tracer.startSpan('api.categories.list')

  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    span.end()
  }
}
