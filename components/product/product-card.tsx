"use client"

import type React from "react"

import type { Product } from "@/lib/products"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Icon } from "@/lib/icons"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const rgbColor = `rgb(${product.r}, ${product.g}, ${product.b})`

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await addToCart(product.id)
      toast.success("Added to cart", {
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to add item to cart.",
      })
    }
  }

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/80 hover:shadow-lg hover:shadow-black/20">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <div
            className="h-full w-full flex items-center justify-center"
            style={{ backgroundColor: rgbColor }}
          >
            <Icon name={product.icon} className="h-24 w-24 text-white/90 transition-transform duration-300 group-hover:scale-105" />
          </div>

          {/* RGB Color Indicator */}
          <div
            className="absolute top-3 right-3 h-4 w-4 rounded-full border-2 border-white/50 shadow-lg"
            style={{ backgroundColor: rgbColor }}
          />

          {product.featured && <Badge className="absolute top-3 left-3 bg-[var(--brand-primary)] text-white">Featured</Badge>}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-bold text-lg leading-tight group-hover:text-[var(--brand-primary)] transition-colors">
              {product.name}
            </h3>

            {product.shortDescription && (
              <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">${product.price}</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.compareAtPrice}</span>
                )}
              </div>

              {product.category && (
                <Badge variant="secondary" className="text-xs">
                  {product.category.name}
                </Badge>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <Button
                className="flex-1 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-hover)] hover:from-[var(--brand-primary-hover)] hover:to-[var(--brand-primary-hover)] text-white border-0"
                style={{
                  boxShadow: `0 4px 20px ${rgbColor}20`,
                }}
                asChild
              >
                <span>Shop Now</span>
              </Button>
              <Button size="sm" variant="outline" className="px-3 bg-transparent" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
