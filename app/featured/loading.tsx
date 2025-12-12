import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"

export default function FeaturedLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-6 w-40 bg-muted animate-pulse rounded-full mx-auto mb-6" />
          <div className="h-10 w-64 bg-muted animate-pulse rounded-lg mx-auto mb-4" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded-lg mx-auto" />
        </div>

        {/* Controls Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="h-8 w-40 bg-muted animate-pulse rounded-lg" />
          <div className="h-10 w-48 bg-muted animate-pulse rounded-lg" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-6 w-full bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-4" />
                <div className="flex items-center justify-between mb-3">
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-muted animate-pulse rounded" />
                  <div className="h-10 w-10 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
