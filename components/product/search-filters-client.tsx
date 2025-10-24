"use client"

import { useState, useMemo } from "react"
import type { Product, Category } from "@/lib/products"
import { ProductGrid } from "@/components/product/product-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import Link from "next/link"

interface SearchFiltersClientProps {
  initialProducts: Product[]
  categories: Category[]
  query: string
}

export function SearchFiltersClient({ initialProducts, categories, query }: SearchFiltersClientProps) {
  const [filters, setFilters] = useState({
    category: "all",
    sortBy: "newest",
    minPrice: "",
    maxPrice: "",
  })
  const [showFilters, setShowFilters] = useState(false)

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

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...initialProducts]

    // Filter by category
    if (filters.category !== "all") {
      products = products.filter((p) => p.categoryId?.toString() === filters.category)
    }

    // Filter by price range
    if (filters.minPrice || filters.maxPrice) {
      products = products.filter((product) => {
        const price = Number.parseFloat(product.price)
        const min = filters.minPrice ? Number.parseFloat(filters.minPrice) : 0
        const max = filters.maxPrice ? Number.parseFloat(filters.maxPrice) : Number.POSITIVE_INFINITY
        return price >= min && price <= max
      })
    }

    // Sort products
    switch (filters.sortBy) {
      case "price_low":
        products.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
        break
      case "price_high":
        products.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
        break
      case "name":
        products.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
      default:
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return products
  }, [initialProducts, filters])

  const hasActiveFilters = filters.category !== "all" || filters.minPrice || filters.maxPrice

  return (
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
              {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? "result" : "results"}
            </Badge>
            {query && (
              <p className="text-sm text-muted-foreground">
                Showing results for <span className="font-medium">"{query}"</span>
              </p>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
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
                <Link href="/products">Browse All Products</Link>
              </Button>
            </div>
          </div>
        ) : (
          <ProductGrid products={filteredAndSortedProducts} />
        )}
      </div>
    </div>
  )
}
