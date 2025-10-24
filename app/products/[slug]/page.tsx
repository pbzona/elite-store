import type { Product } from "@/lib/products"
import { getProductBySlug } from "@/lib/products"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AddToCartButton } from "@/components/product/add-to-cart-button"
import Link from "next/link"
import { ArrowLeft, Heart, Share2 } from "lucide-react"
import { Icon } from "@/lib/icons"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const rgbColor = `rgb(${product.r}, ${product.g}, ${product.b})`

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <Link href="/products" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Products
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/categories/${product.category.slug}`} className="hover:text-foreground">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <div
                className="h-full w-full flex items-center justify-center"
                style={{ backgroundColor: rgbColor }}
              >
                <Icon name={product.icon} className="h-64 w-64 text-white/90" />
              </div>

              {/* RGB Color Indicator */}
              <div
                className="absolute top-4 right-4 h-6 w-6 rounded-full border-2 border-white/50 shadow-lg"
                style={{ backgroundColor: rgbColor }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <Badge variant="secondary" className="mb-2">
                  {product.category.name}
                </Badge>
              )}
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.shortDescription && <p className="text-lg text-muted-foreground">{product.shortDescription}</p>}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.compareAtPrice && (
                <span className="text-xl text-muted-foreground line-through">${product.compareAtPrice}</span>
              )}
            </div>

            {/* RGB Color Info */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Color Profile</h3>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-white/20"
                    style={{ backgroundColor: rgbColor }}
                  />
                  <div className="text-sm">
                    <div>
                      RGB({product.r}, {product.g}, {product.b})
                    </div>
                    <div className="text-muted-foreground">Unique color signature</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                quantity={1}
                size="lg"
                className="flex-1 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white"
              />
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Product Details</h3>
                <div className="space-y-2 text-sm">
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span>{product.sku}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    <span className={product.inventory > 0 ? "text-[var(--success)]" : "text-destructive"}>
                      {product.inventory > 0 ? `${product.inventory} in stock` : "Out of stock"}
                    </span>
                  </div>
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span>{product.weight} lbs</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span>{product.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-4">
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
