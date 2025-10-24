"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import type { Order } from "@/lib/orders"
import Link from "next/link"
import { Package, CreditCard, MapPin, ArrowLeft, CheckCircle } from "lucide-react"
import { Icon } from "@/lib/icons"

export default function OrderDetailsPage() {
  const { user, loading: authLoading } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user && params.id) {
      fetchOrder(params.id as string)
    }
  }, [user, authLoading, params.id, router])

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else if (response.status === 404) {
        router.push("/orders")
      }
    } catch (error) {
      console.error("Failed to fetch order:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[var(--success-light)] text-[var(--success)] border-[var(--success)]"
      case "pending":
        return "bg-[var(--warning-light)] text-[var(--warning)] border-[var(--warning)]"
      case "shipped":
        return "bg-[var(--info-light)] text-[var(--info)] border-[var(--info)]"
      case "delivered":
        return "bg-[var(--purple-light)] text-[var(--purple)] border-[var(--purple)]"
      default:
        return "bg-muted text-muted-foreground border-muted"
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]"></div>
        </div>
      </div>
    )
  }

  if (!user || !order) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" asChild>
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order {order.orderNumber}</h1>
              <p className="text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <Badge className={getStatusColor(order.status)} size="lg">
              {order.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Order Confirmed</span>
                    <CheckCircle className="h-5 w-5 text-[var(--success)]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Processed</span>
                    <CheckCircle className="h-5 w-5 text-[var(--success)]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Preparing for Shipment</span>
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipped</span>
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const rgbColor = `rgb(${item.product.r}, ${item.product.g}, ${item.product.b})`
                    const itemTotal = Number.parseFloat(item.price) * item.quantity

                    return (
                      <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg border border-border/50">
                        <div
                          className="w-16 h-16 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: rgbColor }}
                        >
                          <Icon name={item.product.icon} className="h-10 w-10 text-white/90" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="hover:text-[var(--brand-primary)] transition-colors"
                            >
                              {item.product.name}
                            </Link>
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            RGB({item.product.r}, {item.product.g}, {item.product.b})
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm">Quantity: {item.quantity}</span>
                            <span className="text-sm">Price: ${item.price}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${itemTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{Number.parseFloat(order.shipping) === 0 ? "Free" : `$${order.shipping}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${order.total}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {order.shippingFirstName} {order.shippingLastName}
                  </p>
                  <p>{order.shippingAddress1}</p>
                  {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
                  <p>
                    {order.shippingCity}, {order.shippingState} {order.shippingZip}
                  </p>
                  <p>{order.shippingCountry}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.paymentMethod.replace("_", " ").toUpperCase()}</p>
                  <Badge className="bg-[var(--success-light)] text-[var(--success)] border-[var(--success)]">
                    {order.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)]" asChild>
                <Link href="/orders">View All Orders</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
