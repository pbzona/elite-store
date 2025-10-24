"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface CartItemControlsProps {
  productId: number
  productName: string
  currentQuantity: number
  maxQuantity?: number
}

export function CartItemControls({
  productId,
  productName,
  currentQuantity,
  maxQuantity = 99,
}: CartItemControlsProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxQuantity) return

    setIsUpdating(true)
    try {
      await updateQuantity(productId, newQuantity)
    } catch (error) {
      toast.error("Failed to update quantity")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    try {
      await removeFromCart(productId)
      toast.success(`Removed ${productName} from cart`)
    } catch (error) {
      toast.error("Failed to remove item")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleUpdateQuantity(currentQuantity - 1)}
          disabled={isUpdating || currentQuantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center font-medium">{currentQuantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleUpdateQuantity(currentQuantity + 1)}
          disabled={isUpdating || currentQuantity >= maxQuantity}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        disabled={isUpdating}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
