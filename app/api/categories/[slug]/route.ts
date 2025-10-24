import { type NextRequest, NextResponse } from "next/server"
import { getCategoryBySlug } from "@/lib/products"
import { tracer } from "@/lib/tracing"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const span = tracer.startSpan('api.categories.get')

  try {
    const { slug } = await params
    const category = await getCategoryBySlug(slug)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Category API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    span.end()
  }
}
