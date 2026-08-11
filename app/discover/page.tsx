import { DiscoveryLabClient } from "@/components/product/discovery-lab-client"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/auth"
import { getPersonalizedRecommendations } from "@/lib/recommendations"
import { Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DiscoverPage() {
  let initialColor = { r: 128, g: 128, b: 128 }

  try {
    const user = await getCurrentUser()

    if (user) {
      initialColor = {
        r: user.affinityR,
        g: user.affinityG,
        b: user.affinityB,
      }
    }
  } catch (error) {
    console.warn("Unable to preload affinity profile:", error)
  }

  const initialResult = await getPersonalizedRecommendations({
    targetColor: initialColor,
    maxPrice: 450,
    limit: 12,
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <section className="rounded-2xl border border-border/50 bg-gradient-to-r from-[var(--brand-primary)]/10 via-background to-[var(--info)]/10 p-8">
          <Badge className="mb-4 bg-[var(--brand-primary-light)] text-[var(--brand-primary)] border-[var(--brand-primary)]/30">
            <Sparkles className="mr-2 h-4 w-4" />
            Personalized Discovery Lab
          </Badge>
          <h1 className="text-4xl font-bold mb-3">Find products that match your color profile</h1>
          <p className="text-muted-foreground max-w-3xl">
            This workspace turns your RGB affinity into a ranked list of product picks. Adjust the palette and budget
            sliders to shape your recommendations in real time.
          </p>
        </section>

        <DiscoveryLabClient
          initialRecommendations={initialResult.recommendations}
          initialColor={initialResult.targetColor}
          initialMaxPrice={450}
        />
      </div>
    </div>
  )
}
