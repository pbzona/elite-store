"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Plus, Minus, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { Icon } from "@/lib/icons"
import Link from "next/link"

export function CartDrawer() {
  const { cart, loading, updateQuantity, removeFromCart } = useCart()
  const [open, setOpen] = useState(false)

  const itemCount = cart?.itemCount || 0
  const subtotal = cart?.subtotal || 0

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[var(--brand-primary)] text-white text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">Add some products to get started</p>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cart.items.map((item) => {
                  const rgbColor = `rgb(${item.product.r}, ${item.product.g}, ${item.product.b})`
                  const primaryImage = item.product.images[0]

                  return (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg border border-border/50 bg-card/50">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <div
                          className="h-full w-full flex items-center justify-center"
                          style={{ backgroundColor: rgbColor }}
                        >
                          <Icon name={item.product.icon} className="h-10 w-10 text-white/90" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight mb-1">{item.product.name}</h4>
                        <p className="text-sm font-semibold">${item.product.price}</p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="border-t border-border/50 pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)]" asChild onClick={() => setOpen(false)}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild onClick={() => setOpen(false)}>
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
