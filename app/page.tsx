"use client"

import { useEffect, useState } from "react"
import type { Product, Category } from "@/lib/products"
import { ProductGrid } from "@/components/product/product-grid"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Icon } from "@/lib/icons"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products?featured=true&limit=8"),
          fetch("/api/categories"),
        ])

        const products = await productsRes.json()
        const cats = await categoriesRes.json()

        setFeaturedProducts(products)
        setCategories(cats)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-card via-muted to-background">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-10"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-[var(--brand-primary-light)] text-[var(--brand-primary)] border-[var(--brand-primary)]/30">
              <Sparkles className="mr-2 h-4 w-4" />
              Explore Cutting-Edge Technology
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              Discover products that redefine innovation
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Dive into a world where style meets performance. Experience unparalleled quality with our curated
              collection of premium tech products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white px-8 py-3" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3"
                asChild
              >
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our carefully curated categories to find exactly what you're looking for.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group p-6 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:border-[var(--brand-primary)]/50 text-center"
                >
                  <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary-hover)]/20 flex items-center justify-center group-hover:from-[var(--brand-primary)]/30 group-hover:to-[var(--brand-primary-hover)]/30 transition-all">
                    <Icon name={category.icon} className="h-6 w-6 text-[var(--brand-primary)]" />
                  </div>
                  <h3 className="font-semibold group-hover:text-[var(--brand-primary)] transition-colors">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[var(--brand-primary-light)] text-[var(--brand-primary)] border-[var(--brand-primary)]/30">Featured Collection</Badge>
            <h2 className="text-3xl font-bold mb-4">Experience unparalleled clarity</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked products that showcase the perfect blend of innovation, design, and performance.
            </p>
          </div>

          <ProductGrid products={featuredProducts} />

          {featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link href="/products">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
