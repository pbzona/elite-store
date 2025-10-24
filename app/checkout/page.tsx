import { getCurrentUser } from "@/lib/auth"
import { getCart, getOrCreateCart } from "@/lib/cart"
import { CheckoutFormClient } from "@/components/checkout/checkout-form-client"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag } from "lucide-react"
import { Icon } from "@/lib/icons"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function CheckoutPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/checkout")
  }

  const cookieStore = await cookies()
  const sessionId = cookieStore.get("cart-session-id")?.value

  let cart = null
  try {
    const cartId = await getOrCreateCart(sessionId)
    cart = await getCart(cartId)
  } catch (error) {
    console.error("Failed to fetch cart:", error)
  }

  if (!cart || cart.items.length === 0) {
    redirect("/cart")
  }

  const subtotal = cart.subtotal
  const tax = subtotal * 0.08
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + tax + shipping

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutFormClient cartId={parseInt(cart.id)} />
          </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cart.items.map((item) => {
                      const rgbColor = `rgb(${item.product.r}, ${item.product.g}, ${item.product.b})`
                      const primaryImage = item.product.images[0]
                      const itemTotal = Number.parseFloat(item.product.price) * item.quantity

                      return (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <div
                              className="h-full w-full flex items-center justify-center"
                              style={{ backgroundColor: rgbColor }}
                            >
                              <Icon name={item.product.icon} className="h-8 w-8 text-white/90" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm leading-tight">{item.product.name}</h4>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold">${itemTotal.toFixed(2)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
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
                    {shipping === 0 && (
                      <Badge className="bg-[var(--success-light)] text-[var(--success)] border-[var(--success)] text-xs">
                        Free shipping applied!
                      </Badge>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>
    </div>
  )
}
