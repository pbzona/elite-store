"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ClearCartButton() {
  const { clearCart } = useCart()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCart = async () => {
    setIsClearing(true)
    try {
      await clearCart()
      toast.success("Cart cleared")
    } catch (error) {
      toast.error("Failed to clear cart")
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClearCart}
      disabled={isClearing}
      className="text-muted-foreground hover:text-destructive"
    >
      {isClearing ? "Clearing..." : "Clear Cart"}
    </Button>
  )
}
