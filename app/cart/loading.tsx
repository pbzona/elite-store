import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="h-10 w-48 bg-muted animate-pulse rounded-lg mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted animate-pulse rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                      <div className="flex items-center gap-4 mt-4">
                        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
                        <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Skeleton */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div className="h-8 w-32 bg-muted animate-pulse rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                </div>
                <div className="h-10 w-full bg-muted animate-pulse rounded-lg mt-6" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
