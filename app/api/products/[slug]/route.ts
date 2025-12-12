import { type NextRequest, NextResponse } from "next/server"
import { getProductBySlug } from "@/lib/products"
import { tracer } from "@/lib/tracing"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const span = tracer.startSpan('api.products.get')

  try {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800',
      },
    })
  } catch (error) {
    console.error("Product API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    span.end()
  }
}
