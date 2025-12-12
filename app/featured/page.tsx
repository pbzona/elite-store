import { getProducts } from "@/lib/products"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductSortFilter } from "@/components/product/product-sort-filter"
import Link from "next/link"
import { Sparkles, Star } from "lucide-react"

// Revalidate featured page every 30 minutes
export const revalidate = 1800

interface FeaturedPageProps {
  searchParams: Promise<{
    sortBy?: "newest" | "price_low" | "price_high" | "name"
  }>
}

export default async function FeaturedPage({ searchParams }: FeaturedPageProps) {
  const params = await searchParams
  const sortBy = params.sortBy || "newest"

  // Fetch featured products with server-side sorting
  const products = await getProducts({ featured: true, sortBy })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-[var(--brand-primary-light)] text-[var(--brand-primary)] border-[var(--brand-primary)]/30">
            <Sparkles className="mr-2 h-4 w-4" />
            Featured Collection
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Featured Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked products that showcase the perfect blend of innovation, design, and performance
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {products.length} featured {products.length === 1 ? "product" : "products"}
            </Badge>
          </div>

          <ProductSortFilter />
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-4">No featured products yet</h3>
            <p className="text-muted-foreground mb-8">
              Check back later for our curated selection of featured products.
            </p>
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}

        {/* Call to Action */}
        {products.length > 0 && (
          <div className="text-center mt-16 p-8 rounded-lg bg-gradient-to-r from-[var(--brand-primary)]/10 to-[var(--brand-primary-hover)]/10 border border-[var(--brand-primary)]/20">
            <h2 className="text-2xl font-bold mb-4">Discover More</h2>
            <p className="text-muted-foreground mb-6">Explore our complete collection of premium products</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/products">View All Products</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
