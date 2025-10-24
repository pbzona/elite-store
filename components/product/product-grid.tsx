"use client"

import type { Product } from "@/lib/products"
import { ProductCard } from "./product-card"

interface ProductGridProps {
  products: Product[]
  className?: string
}

export function ProductGrid({ products, className = "" }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-muted-foreground">No products found</h3>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or browse our categories.</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
