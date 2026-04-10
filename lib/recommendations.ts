import { type Product, getProducts } from "@/lib/products"
import { tracer } from "@/lib/tracing"

export interface RGBColor {
  r: number
  g: number
  b: number
}

export interface RecommendedProduct extends Product {
  affinityScore: number
  colorDistance: number
  matchLabel: "perfect" | "strong" | "good" | "experimental"
  reasoning: string
}

interface RecommendationOptions {
  targetColor: RGBColor
  maxPrice?: number
  limit?: number
  search?: string
}

interface RecommendationResult {
  recommendations: RecommendedProduct[]
  targetColor: RGBColor
}

const MAX_RGB_DISTANCE = Math.sqrt(255 * 255 * 3)

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value * 10) / 10))
}

function normalizeColor(color: RGBColor): RGBColor {
  return {
    r: clampChannel(color.r),
    g: clampChannel(color.g),
    b: clampChannel(color.b),
  }
}

function getColorDistance(target: RGBColor, product: Product): number {
  const dr = target.r - product.r
  const dg = target.g - product.g
  const db = target.b - product.b

  return Math.sqrt(dr * dr + dg * dg + db * db)
}

function getMatchLabel(score: number): RecommendedProduct["matchLabel"] {
  if (score >= 85) return "perfect"
  if (score >= 70) return "strong"
  if (score >= 55) return "good"
  return "experimental"
}

function getReasoning(matchLabel: RecommendedProduct["matchLabel"], colorDistance: number, price: number, maxPrice?: number): string {
  const roundedDistance = Math.round(colorDistance)

  if (maxPrice !== undefined && price > maxPrice) {
    const overage = Math.round(((price - maxPrice) / Math.max(maxPrice, 1)) * 100)
    return `${matchLabel} color alignment (distance ${roundedDistance}), but ${overage}% above your budget cap.`
  }

  return `${matchLabel} color alignment with distance score ${roundedDistance}.`
}

export async function getPersonalizedRecommendations(options: RecommendationOptions): Promise<RecommendationResult> {
  const normalizedColor = normalizeColor(options.targetColor)
  const span = tracer.startSpan("recommendations.getPersonalizedRecommendations", {
    attributes: {
      "recommendations.limit": options.limit,
      "recommendations.search": options.search,
      "recommendations.maxPrice": options.maxPrice,
      "recommendations.target.r": normalizedColor.r,
      "recommendations.target.g": normalizedColor.g,
      "recommendations.target.b": normalizedColor.b,
    },
  })

  try {
    const products = await getProducts({ search: options.search })

    const rankedProducts = products
      .map((product) => {
        const price = Number.parseFloat(product.price)
        const colorDistance = getColorDistance(normalizedColor, product)
        const colorScore = ((MAX_RGB_DISTANCE - colorDistance) / MAX_RGB_DISTANCE) * 100
        const featuredBonus = product.featured ? 4 : 0

        const overBudgetPenalty =
          options.maxPrice !== undefined && price > options.maxPrice
            ? ((price - options.maxPrice) / Math.max(options.maxPrice, 1)) * 25
            : 0

        const affinityScore = clampScore(colorScore + featuredBonus - overBudgetPenalty)
        const matchLabel = getMatchLabel(affinityScore)

        return {
          ...product,
          affinityScore,
          colorDistance: Math.round(colorDistance * 10) / 10,
          matchLabel,
          reasoning: getReasoning(matchLabel, colorDistance, price, options.maxPrice),
        }
      })
      .sort((a, b) => b.affinityScore - a.affinityScore)
      .slice(0, options.limit ?? 10)

    span.setAttributes({
      "recommendations.products.total": products.length,
      "recommendations.products.returned": rankedProducts.length,
    })

    return {
      recommendations: rankedProducts,
      targetColor: normalizedColor,
    }
  } finally {
    span.end()
  }
}
