import { getCurrentUser } from "@/lib/auth"
import { getUserOrders } from "@/lib/orders"
import { getStatusColor } from "@/lib/order-utils"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Calendar, CreditCard } from "lucide-react"
import { Icon } from "@/lib/icons"
import { redirect } from "next/navigation"

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const orders = await getUserOrders(user.id)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">You haven't placed any orders yet.</p>
            <Button size="lg" asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order {order.orderNumber}
                    </CardTitle>
                    <Badge className={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      {order.paymentMethod.replace("_", " ").toUpperCase()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item) => {
                        const rgbColor = `rgb(${item.product.r}, ${item.product.g}, ${item.product.b})`
                        return (
                          <div key={item.id} className="flex items-center gap-3 text-sm">
                            <div
                              className="w-8 h-8 rounded flex items-center justify-center"
                              style={{ backgroundColor: rgbColor }}
                            >
                              <Icon name={item.product.icon} className="h-5 w-5 text-white/90" />
                            </div>
                            <span className="flex-1">{item.product.name}</span>
                            <span className="text-muted-foreground">Qty: {item.quantity}</span>
                            <span className="font-medium">${item.price}</span>
                          </div>
                        )
                      })}
                      {order.items.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{order.items.length - 3} more {order.items.length - 3 === 1 ? "item" : "items"}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="text-lg font-semibold">Total: ${order.total}</div>
                      <Button variant="outline" asChild>
                        <Link href={`/orders/${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
