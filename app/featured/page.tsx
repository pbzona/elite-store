import type { Product } from "@/lib/products"
import { getProducts } from "@/lib/products"
import { FeaturedProductsClient } from "@/components/product/featured-products-client"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default async function FeaturedPage() {
  // Fetch featured products server-side
  const products = await getProducts({ featured: true })

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

        {/* Products Section with Client-Side Sorting */}
        <FeaturedProductsClient initialProducts={products} />

        {/* Call to Action */}
        {products && products.length > 0 && (
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
