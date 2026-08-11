import { type NextRequest, NextResponse } from "next/server"
import { getPersonalizedRecommendations } from "@/lib/recommendations"
import { tracer } from "@/lib/tracing"

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

function parseChannel(value: string | null, fallback: number): number {
  if (value === null) return fallback

  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) return fallback

  return Math.max(0, Math.min(255, parsed))
}

export async function GET(request: NextRequest) {
  const span = tracer.startSpan("api.recommendations.list")

  try {
    const { searchParams } = new URL(request.url)

    const r = parseChannel(searchParams.get("r"), 128)
    const g = parseChannel(searchParams.get("g"), 128)
    const b = parseChannel(searchParams.get("b"), 128)

    const maxPriceParam = searchParams.get("maxPrice")
    const parsedMaxPrice = maxPriceParam ? Number.parseFloat(maxPriceParam) : undefined
    const maxPrice =
      parsedMaxPrice === undefined || Number.isNaN(parsedMaxPrice) ? undefined : Math.max(0, parsedMaxPrice)

    const limitParam = searchParams.get("limit")
    const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : DEFAULT_LIMIT
    const limit = Number.isNaN(parsedLimit) ? DEFAULT_LIMIT : Math.max(1, Math.min(MAX_LIMIT, parsedLimit))

    const search = searchParams.get("search") || undefined

    const result = await getPersonalizedRecommendations({
      targetColor: { r, g, b },
      maxPrice,
      limit,
      search,
    })

    span.setAttributes({
      "recommendations.returned": result.recommendations.length,
    })

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Recommendations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    span.end()
  }
}
