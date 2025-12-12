import { getCategoryBySlug, getProducts } from "@/lib/products"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductSortFilter } from "@/components/product/product-sort-filter"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Icon } from "@/lib/icons"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    sortBy?: "newest" | "price_low" | "price_high" | "name"
  }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { sortBy = "newest" } = await searchParams
  
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  // Fetch products in this category with server-side sorting
  const products = await getProducts({ categoryId: category.id, sortBy })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <Link href="/categories" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Categories
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto rounded-lg bg-gradient-to-br from-[var(--brand-primary-light)] to-[var(--brand-primary-light)] flex items-center justify-center">
              <Icon name={category.icon} className="h-12 w-12 text-[var(--brand-primary)]" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              {products.length} {products.length === 1 ? "product" : "products"}
            </Badge>
          </div>

          <ProductSortFilter />
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-4">No products in this category yet</h3>
            <p className="text-muted-foreground mb-8">Check back later for new products in {category.name}.</p>
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}
