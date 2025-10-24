import type { Product, Category } from "@/lib/products"
import { getCategoryBySlug, getProducts } from "@/lib/products"
import { CategoryProductsClient } from "@/components/product/category-products-client"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Icon } from "@/lib/icons"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  // Fetch products in this category
  const products = await getProducts({ categoryId: category.id })

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

        {/* Products Section with Client-Side Sorting */}
        <CategoryProductsClient initialProducts={products} categoryName={category.name} />
      </div>
    </div>
  )
}
