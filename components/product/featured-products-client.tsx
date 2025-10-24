"use client"

import { useState, useMemo } from "react"
import type { Product } from "@/lib/products"
import { ProductGrid } from "@/components/product/product-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Star } from "lucide-react"

interface FeaturedProductsClientProps {
  initialProducts: Product[]
}

export function FeaturedProductsClient({ initialProducts }: FeaturedProductsClientProps) {
  const [sortBy, setSortBy] = useState("newest")

  const sortedProducts = useMemo(() => {
    const products = [...initialProducts]
    switch (sortBy) {
      case "price_low":
        return products.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
      case "price_high":
        return products.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
      case "name":
        return products.sort((a, b) => a.name.localeCompare(b.name))
      case "newest":
      default:
        return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }, [initialProducts, sortBy])

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {sortedProducts.length} featured {sortedProducts.length === 1 ? "product" : "products"}
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
      {sortedProducts.length === 0 ? (
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
        <ProductGrid products={sortedProducts} />
      )}
    </div>
  )
}
