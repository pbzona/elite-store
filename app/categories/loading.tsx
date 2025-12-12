import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-lg mx-auto mb-4" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded-lg mx-auto" />
        </div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="h-full border-border/50 bg-card/50">
              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto rounded-lg bg-muted animate-pulse" />
                </div>
                <div className="h-6 w-32 bg-muted animate-pulse rounded-lg mx-auto mb-2" />
                <div className="h-4 w-full bg-muted animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded-lg mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
