import { type NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/products"
import { tracer } from "@/lib/tracing"

export async function GET(request: NextRequest) {
  const span = tracer.startSpan('api.products.list')

  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")
    const search = searchParams.get("search")

    const products = await getProducts({
      categoryId: categoryId ? Number.parseInt(categoryId) : undefined,
      featured: featured === "true" ? true : undefined,
      limit: limit ? Number.parseInt(limit) : undefined,
      offset: offset ? Number.parseInt(offset) : undefined,
      search: search || undefined,
    })

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800',
      },
    })
  } catch (error) {
    console.error("Products API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    span.end()
  }
}
