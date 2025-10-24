"use client"

import { useEffect, useState } from "react"
import type { Category } from "@/lib/products"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Folder, ArrowRight } from "lucide-react"
import { Icon } from "@/lib/icons"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
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
          <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated categories to find exactly what you're looking for
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-4">No categories available</h3>
            <p className="text-muted-foreground">Categories will appear here once they're added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="group">
                <Card className="h-full border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:border-[var(--brand-primary)]/50 hover:shadow-lg hover:shadow-black/10">
                  <CardContent className="p-6 text-center">
                    <div className="mb-6">
                      <div className="w-20 h-20 mx-auto rounded-lg bg-gradient-to-br from-[var(--brand-primary-light)] to-[var(--brand-primary-light)] flex items-center justify-center group-hover:from-[var(--brand-primary)]/30 group-hover:to-[var(--brand-primary-hover)]/30 transition-all">
                        <Icon name={category.icon} className="h-10 w-10 text-[var(--brand-primary)]" />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
                      {category.name}
                    </h3>

                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description}</p>
                    )}

                    <div className="flex items-center justify-center text-sm text-[var(--brand-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Featured Categories Section */}
        {categories.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
              <p className="text-muted-foreground">Most browsed categories this month</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-300 hover:border-[var(--brand-primary)]/50 text-center"
                >
                  <div className="h-8 w-8 mx-auto mb-2 rounded bg-gradient-to-br from-[var(--brand-primary-light)] to-[var(--brand-primary-light)] flex items-center justify-center group-hover:from-[var(--brand-primary)]/30 group-hover:to-[var(--brand-primary-hover)]/30 transition-all">
                    <Icon name={category.icon} className="h-4 w-4 text-[var(--brand-primary)]" />
                  </div>
                  <h4 className="text-sm font-medium group-hover:text-[var(--brand-primary)] transition-colors">{category.name}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
