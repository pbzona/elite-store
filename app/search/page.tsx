import { getProducts, getCategories } from "@/lib/products"
import { Header } from "@/components/layout/header"
import { ProductGrid } from "@/components/product/product-grid"
import { SearchFilters } from "@/components/product/search-filters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search } from "lucide-react"

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    sortBy?: "newest" | "price_low" | "price_high" | "name"
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ""
  const categoryId = params.category ? parseInt(params.category) : undefined
  const sortBy = params.sortBy || "newest"
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined

  // Fetch products with server-side filtering and sorting
  const [products, categories] = await Promise.all([
    getProducts({
      search: query,
      categoryId,
      sortBy,
      minPrice,
      maxPrice,
    }),
    getCategories(),
  ])

  const hasActiveFilters = categoryId !== undefined || minPrice !== undefined || maxPrice !== undefined

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{query ? `Search Results for "${query}"` : "Search Products"}</h1>
          <p className="text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters categories={categories} currentParams={params} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  {products.length} {products.length === 1 ? "result" : "results"}
                </Badge>
                {query && (
                  <p className="text-sm text-muted-foreground">
                    Showing results for <span className="font-medium">"{query}"</span>
                  </p>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4">No products found</h3>
                <p className="text-muted-foreground mb-8">
                  {query
                    ? `No products match your search for "${query}". Try adjusting your filters or search terms.`
                    : "Try adjusting your filters to see more results."}
                </p>
                <div className="space-x-4">
                  {hasActiveFilters && (
                    <Button variant="outline" asChild>
                      <Link href="/search">Clear Filters</Link>
                    </Button>
                  )}
                  <Button asChild>
                    <Link href="/products">Browse All Products</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
