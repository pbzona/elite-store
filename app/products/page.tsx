import type { Product, Category } from "@/lib/products"
import { getProducts, getCategories } from "@/lib/products"
import { ProductGrid } from "@/components/product/product-grid"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { CategoryFilter } from "@/components/product/category-filter"

interface ProductsPageProps {
  searchParams: Promise<{ search?: string; categoryId?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Fetch data server-side based on search params
  const { search, categoryId } = await searchParams

  const [products, categories] = await Promise.all([
    getProducts({
      search,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
    }),
    getCategories(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{search ? `Search Results for "${search}"` : "All Products"}</h1>
          <p className="text-muted-foreground">Discover our complete collection of premium tech products</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <CategoryFilter categories={categories} />

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {products.length} {products.length === 1 ? "product" : "products"}
            </Badge>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
