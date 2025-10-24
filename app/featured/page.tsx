"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/products"
import { ProductGrid } from "@/components/product/product-grid"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Star, Sparkles } from "lucide-react"

export default function FeaturedPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchFeaturedProducts()
  }, [sortBy])

  const fetchFeaturedProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/products?featured=true")
      const data = await response.json()

      // Sort products
      switch (sortBy) {
        case "price_low":
          data.sort((a: Product, b: Product) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
          break
        case "price_high":
          data.sort((a: Product, b: Product) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
          break
        case "name":
          data.sort((a: Product, b: Product) => a.name.localeCompare(b.name))
          break
        case "newest":
        default:
          data.sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
      }

      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch featured products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]"></div>
        </div>
      </div>
    )
  }

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

        {/* Products Section */}
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {products.length} featured {products.length === 1 ? "product" : "products"}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        </div>

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
