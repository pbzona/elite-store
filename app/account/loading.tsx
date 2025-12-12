import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="h-10 w-48 bg-muted animate-pulse rounded-lg mb-8" />

        <div className="space-y-6">
          {/* Profile Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                </div>
                <div className="w-16 h-16 bg-muted animate-pulse rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-10 w-full bg-muted animate-pulse rounded" />
                </div>
              ))}
              <div className="h-10 w-32 bg-muted animate-pulse rounded-lg mt-6" />
            </CardContent>
          </Card>

          {/* Color Affinity Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-32 w-full bg-muted animate-pulse rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
