"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ProductGrid } from "@/components/product/product-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RGBColor, RecommendedProduct } from "@/lib/recommendations"
import { RefreshCcw, SlidersHorizontal, Zap } from "lucide-react"

interface DiscoveryLabClientProps {
  initialRecommendations: RecommendedProduct[]
  initialColor: RGBColor
  initialMaxPrice: number
}

const LIVE_MODE_INTERVAL_MS = 30_000
const CONTROL_DEBOUNCE_MS = 300

const matchLabelStyles: Record<RecommendedProduct["matchLabel"], string> = {
  perfect: "bg-[var(--success-light)] text-[var(--success)] border-[var(--success)]/40",
  strong: "bg-[var(--info-light)] text-[var(--info)] border-[var(--info)]/40",
  good: "bg-[var(--warning-light)] text-[var(--warning)] border-[var(--warning)]/40",
  experimental: "bg-muted text-muted-foreground border-border",
}

export function DiscoveryLabClient({ initialRecommendations, initialColor, initialMaxPrice }: DiscoveryLabClientProps) {
  const [color, setColor] = useState<RGBColor>(initialColor)
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice)
  const [search, setSearch] = useState("")
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>(initialRecommendations)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [liveMode, setLiveMode] = useState(false)
  const activeRequest = useRef<AbortController | null>(null)

  const fetchRecommendations = useCallback(async () => {
    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller

    try {
      setLoading(true)
      setError(null)

      const query = new URLSearchParams({
        r: String(color.r),
        g: String(color.g),
        b: String(color.b),
        maxPrice: String(maxPrice),
        limit: "12",
        search,
      })

      const response = await fetch(`/api/recommendations?${query.toString()}`, { signal: controller.signal })
      if (!response.ok) {
        throw new Error("Failed to refresh recommendations")
      }

      const data: { recommendations: RecommendedProduct[] } = await response.json()
      setRecommendations(data.recommendations)
    } catch (requestError) {
      if (controller.signal.aborted) return

      console.error("Recommendation refresh failed:", requestError)
      setError("Could not refresh recommendations right now.")
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null
        setLoading(false)
      }
    }
  }, [color.r, color.g, color.b, maxPrice, search])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchRecommendations()
    }, CONTROL_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [fetchRecommendations])

  useEffect(() => () => activeRequest.current?.abort(), [])

  useEffect(() => {
    if (!liveMode) return

    const timer = window.setInterval(() => {
      void fetchRecommendations()
    }, LIVE_MODE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [fetchRecommendations, liveMode])

  const compatibilityLoadScore = useMemo(
    () =>
      recommendations.reduce((total, recommendation, index) => {
        const spread = recommendations.reduce(
          (sum, other) => sum + Math.abs(recommendation.affinityScore - other.affinityScore),
          0,
        )

        return total + spread * (index + 1)
      }, 0),
    [recommendations],
  )

  const targetColor = `rgb(${color.r}, ${color.g}, ${color.b})`

  return (
    <div className="space-y-8">
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Tune Your Discovery Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="discovery-red" className="text-sm font-medium">Red ({color.r})</label>
                <input
                  id="discovery-red"
                  type="range"
                  min={0}
                  max={255}
                  value={color.r}
                  onChange={(event) => setColor((prev) => ({ ...prev, r: Number.parseInt(event.target.value, 10) }))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label htmlFor="discovery-green" className="text-sm font-medium">Green ({color.g})</label>
                <input
                  id="discovery-green"
                  type="range"
                  min={0}
                  max={255}
                  value={color.g}
                  onChange={(event) => setColor((prev) => ({ ...prev, g: Number.parseInt(event.target.value, 10) }))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label htmlFor="discovery-blue" className="text-sm font-medium">Blue ({color.b})</label>
                <input
                  id="discovery-blue"
                  type="range"
                  min={0}
                  max={255}
                  value={color.b}
                  onChange={(event) => setColor((prev) => ({ ...prev, b: Number.parseInt(event.target.value, 10) }))}
                  className="w-full mt-2"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-border/60 p-4 space-y-3">
                <div className="text-sm text-muted-foreground">Current Palette</div>
                <div className="h-20 rounded-lg border border-white/20" style={{ backgroundColor: targetColor }} />
                <div className="text-sm font-medium">RGB({color.r}, {color.g}, {color.b})</div>
              </div>

              <div>
                <label htmlFor="discovery-max-price" className="text-sm font-medium">Budget Ceiling (${maxPrice})</label>
                <input
                  id="discovery-max-price"
                  type="range"
                  min={25}
                  max={1000}
                  step={5}
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number.parseInt(event.target.value, 10))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label htmlFor="discovery-search" className="text-sm font-medium">Search Focus</label>
                <input
                  id="discovery-search"
                  type="text"
                  value={search}
                  placeholder="keyboard, speaker, charger..."
                  onChange={(event) => setSearch(event.target.value)}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void fetchRecommendations()} disabled={loading}>
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh Picks
            </Button>
            <Button variant="outline" onClick={() => setLiveMode((prev) => !prev)}>
              <Zap className="mr-2 h-4 w-4" />
              {liveMode ? "Disable Live Mode" : "Enable Live Mode"}
            </Button>
            <Badge variant="secondary">Compatibility Load Index: {Math.round(compatibilityLoadScore).toLocaleString()}</Badge>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recommended For This Palette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recommendations.slice(0, 6).map((recommendation) => (
            <Card key={recommendation.id} className="border-border/50 bg-card/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold line-clamp-1">{recommendation.name}</h3>
                  <Badge className={matchLabelStyles[recommendation.matchLabel]}>{recommendation.matchLabel}</Badge>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">{recommendation.reasoning}</div>
                <div className="flex items-center justify-between text-sm">
                  <span>Affinity score</span>
                  <span className="font-semibold">{recommendation.affinityScore}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Color distance</span>
                  <span className="font-semibold">{recommendation.colorDistance}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ProductGrid products={recommendations} />
    </div>
  )
}
