"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { Product, Category } from "@/lib/products"
import { ProductGrid } from "@/components/product/product-grid"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "all",
    sortBy: "newest",
    minPrice: "",
    maxPrice: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [query, filters])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append("search", query)
      if (filters.category !== "all") params.append("categoryId", filters.category)

      const response = await fetch(`/api/products?${params}`)
      let data = await response.json()

      // Apply client-side filtering and sorting
      if (filters.minPrice || filters.maxPrice) {
        data = data.filter((product: Product) => {
          const price = Number.parseFloat(product.price)
          const min = filters.minPrice ? Number.parseFloat(filters.minPrice) : 0
          const max = filters.maxPrice ? Number.parseFloat(filters.maxPrice) : Number.POSITIVE_INFINITY
          return price >= min && price <= max
        })
      }

      // Sort products
      switch (filters.sortBy) {
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
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: "all",
      sortBy: "newest",
      minPrice: "",
      maxPrice: "",
    })
  }

  const hasActiveFilters = filters.category !== "all" || filters.minPrice || filters.maxPrice

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{query ? `Search Results for "${query}"` : "Search Products"}</h1>
          <p className="text-muted-foreground">
            {loading ? "Searching..." : `${products.length} ${products.length === 1 ? "product" : "products"} found`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </span>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                    <SelectTrigger>
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

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="space-y-2">
                    <Label>Active Filters</Label>
                    <div className="flex flex-wrap gap-2">
                      {filters.category !== "all" && (
                        <Badge variant="secondary" className="text-xs">
                          {categories.find((c) => c.id.toString() === filters.category)?.name}
                        </Badge>
                      )}
                      {filters.minPrice && (
                        <Badge variant="secondary" className="text-xs">
                          Min: ${filters.minPrice}
                        </Badge>
                      )}
                      {filters.maxPrice && (
                        <Badge variant="secondary" className="text-xs">
                          Max: ${filters.maxPrice}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full justify-center bg-transparent"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  {products.length} {products.length === 1 ? "result" : "results"}
                </Badge>
                {query && (
                  <p className="text-sm text-muted-foreground">
                    Showing results for <span className="font-medium">"{query}"</span>
                  </p>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4">No products found</h3>
                <p className="text-muted-foreground mb-8">
                  {query
                    ? `No products match your search for "${query}". Try adjusting your filters or search terms.`
                    : "Try adjusting your filters to see more results."}
                </p>
                <div className="space-x-4">
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                  <Button asChild>
                    <a href="/products">Browse All Products</a>
                  </Button>
                </div>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
