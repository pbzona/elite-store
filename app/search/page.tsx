import type { Product, Category } from "@/lib/products"
import { getProducts, getCategories } from "@/lib/products"
import { SearchFiltersClient } from "@/components/product/search-filters-client"
import { Header } from "@/components/layout/header"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q || ""

  // Fetch all products and categories server-side
  const [products, categories] = await Promise.all([
    getProducts({ search: query }),
    getCategories(),
  ])

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

        {/* Search Results with Client-Side Filtering */}
        <SearchFiltersClient initialProducts={products} categories={categories} query={query} />
      </div>
    </div>
  )
}
