"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, X, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { Icon } from "@/lib/icons"
import Link from "next/link"

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart()

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]"></div>
        </div>
      </div>
    )
  }

  const itemCount = cart?.itemCount || 0
  const subtotal = cart?.subtotal || 0
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal > 100 ? 0 : 15 // Free shipping over $100
  const total = subtotal + tax + shipping

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {itemCount === 0 ? "Your cart is empty" : `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`}
          </p>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Button size="lg" asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Cart Items</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Clear Cart
                </Button>
              </div>

              {cart.items.map((item) => {
                const rgbColor = `rgb(${item.product.r}, ${item.product.g}, ${item.product.b})`
                const primaryImage = item.product.images[0]
                const itemTotal = Number.parseFloat(item.product.price) * item.quantity

                return (
                  <Card key={item.id} className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <div
                            className="h-full w-full flex items-center justify-center"
                            style={{ backgroundColor: rgbColor }}
                          >
                            <Icon name={item.product.icon} className="h-16 w-16 text-white/90" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                <Link
                                  href={`/products/${item.product.slug}`}
                                  className="hover:text-[var(--brand-primary)] transition-colors"
                                >
                                  {item.product.name}
                                </Link>
                              </h3>
                              <p className="text-muted-foreground mb-2">
                                RGB({item.product.r}, {item.product.g}, {item.product.b})
                              </p>
                              <p className="text-lg font-semibold">${item.product.price}</p>
                            </div>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 w-9 p-0 bg-transparent"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-lg font-medium w-12 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 w-9 p-0 bg-transparent"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-semibold">${itemTotal.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-border/50 sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping === 0 && subtotal > 0 && (
                      <p className="text-sm text-[var(--success)]">🎉 You qualify for free shipping!</p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <Button className="w-full mt-6 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)]" size="lg" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <Button variant="outline" className="w-full mt-3 bg-transparent" asChild>
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
