"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { Product, Category } from "@/lib/products"
import { ProductGrid } from "@/components/product/product-grid"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Folder } from "lucide-react"
import { Icon } from "@/lib/icons"

export default function CategoryPage() {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const params = useParams()

  useEffect(() => {
    if (params.slug) {
      fetchCategoryAndProducts(params.slug as string)
    }
  }, [params.slug, sortBy])

  const fetchCategoryAndProducts = async (slug: string) => {
    setLoading(true)
    try {
      // Fetch category details
      const categoryResponse = await fetch(`/api/categories/${slug}`)
      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json()
        setCategory(categoryData)

        // Fetch products in this category
        const productsResponse = await fetch(`/api/products?categoryId=${categoryData.id}`)
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()

          // Sort products
          switch (sortBy) {
            case "price_low":
              productsData.sort((a: Product, b: Product) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
              break
            case "price_high":
              productsData.sort((a: Product, b: Product) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
              break
            case "name":
              productsData.sort((a: Product, b: Product) => a.name.localeCompare(b.name))
              break
            case "newest":
            default:
              productsData.sort(
                (a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              )
              break
          }

          setProducts(productsData)
        }
      }
    } catch (error) {
      console.error("Failed to fetch category and products:", error)
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

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Category not found</h1>
            <Button asChild>
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <Link href="/categories" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Categories
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto rounded-lg bg-gradient-to-br from-[var(--brand-primary-light)] to-[var(--brand-primary-light)] flex items-center justify-center">
              <Icon name={category.icon} className="h-12 w-12 text-[var(--brand-primary)]" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
          )}
        </div>

        {/* Products Section */}
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {products.length} {products.length === 1 ? "product" : "products"}
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
          <ProductGrid products={products} />

          {products.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-4">No products in this category yet</h3>
              <p className="text-muted-foreground mb-8">Check back later for new products in {category.name}.</p>
              <Button asChild>
                <Link href="/products">Browse All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
