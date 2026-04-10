import { Header } from "@/components/layout/header"

export default function DiscoverLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-6 animate-pulse">
        <div className="h-40 rounded-2xl bg-muted/50" />
        <div className="h-72 rounded-2xl bg-muted/40" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 rounded-xl bg-muted/40" />
          <div className="h-40 rounded-xl bg-muted/40" />
          <div className="h-40 rounded-xl bg-muted/40" />
        </div>
      </div>
    </div>
  )
}
