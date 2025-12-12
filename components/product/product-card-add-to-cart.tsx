"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import { ShoppingCart } from "lucide-react"

interface ProductCardAddToCartProps {
  productId: number
  productName: string
}

export function ProductCardAddToCart({ productId, productName }: ProductCardAddToCartProps) {
  const { addToCart } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await addToCart(productId)
      toast.success("Added to cart", {
        description: `${productName} has been added to your cart.`,
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to add item to cart.",
      })
    }
  }

  return (
    <Button size="sm" variant="outline" className="px-3 bg-transparent" onClick={handleAddToCart}>
      <ShoppingCart className="h-4 w-4" />
    </Button>
  )
}
