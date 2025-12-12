"use client"

import { useRouter, useSearchParams } from "next/navigation"
import type { Category } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"

interface SearchFiltersProps {
  categories: Category[]
  currentParams: {
    q?: string
    category?: string
    sortBy?: string
    minPrice?: string
    maxPrice?: string
  }
}

export function SearchFilters({ categories, currentParams }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    if (currentParams.q) {
      params.set("q", currentParams.q)
    }
    router.push(`/search?${params.toString()}`)
  }

  const hasActiveFilters =
    currentParams.category || currentParams.minPrice || currentParams.maxPrice

  return (
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
          <Select
            value={currentParams.category || "all"}
            onValueChange={(value) => updateFilter("category", value === "all" ? "" : value)}
          >
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
              value={currentParams.minPrice || ""}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={currentParams.maxPrice || ""}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={currentParams.sortBy || "newest"}
            onValueChange={(value) => updateFilter("sortBy", value)}
          >
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
              {currentParams.category && (
                <Badge variant="secondary" className="text-xs">
                  {categories.find((c) => c.id.toString() === currentParams.category)?.name}
                </Badge>
              )}
              {currentParams.minPrice && (
                <Badge variant="secondary" className="text-xs">
                  Min: ${currentParams.minPrice}
                </Badge>
              )}
              {currentParams.maxPrice && (
                <Badge variant="secondary" className="text-xs">
                  Max: ${currentParams.maxPrice}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
