import { type NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/products"

export async function GET(request: NextRequest) {
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

    return NextResponse.json(products)
  } catch (error) {
    console.error("Products API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
