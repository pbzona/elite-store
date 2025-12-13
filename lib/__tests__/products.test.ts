import { describe, expect, it } from 'vitest'

import { getCategories, getProductBySlug, getProducts } from '@/lib/products'

// Since the functions gracefully fall back to mock data when DB is unavailable,
// we can test them without needing a full DB setup

describe('products', () => {
  describe('getProducts', () => {
    it('should return products', async () => {
      const products = await getProducts()

      expect(products).toBeDefined()
      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeGreaterThan(0)
    })

    it('should return featured products when featured flag is set', async () => {
      const products = await getProducts({ featured: true })

      expect(products.length).toBeGreaterThan(0)
      products.forEach((product) => {
        expect(product.featured).toBe(true)
      })
    })

    it('should limit results when limit is provided', async () => {
      const limit = 3
      const products = await getProducts({ limit })

      expect(products.length).toBeLessThanOrEqual(limit)
    })

    it('should filter by categoryId', async () => {
      const categoryId = 1
      const products = await getProducts({ categoryId })

      products.forEach((product) => {
        expect(product.categoryId).toBe(categoryId)
      })
    })

    it('should search products by name', async () => {
      const search = 'aurora'
      const products = await getProducts({ search })

      expect(products.length).toBeGreaterThan(0)
      const hasSearchTerm = products.some((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
      expect(hasSearchTerm).toBe(true)
    })
  })

  describe('getProductBySlug', () => {
    it('should return a product by slug', async () => {
      const slug = 'aurora-smart-light-strip'
      const product = await getProductBySlug(slug)

      expect(product).not.toBeNull()
      expect(product?.slug).toBe(slug)
      expect(product?.name).toBeDefined()
    })

    it('should return null for non-existent slug', async () => {
      const product = await getProductBySlug('non-existent-product')

      expect(product).toBeNull()
    })
  })

  describe('getCategories', () => {
    it('should return all categories', async () => {
      const categories = await getCategories()

      expect(categories).toBeDefined()
      expect(Array.isArray(categories)).toBe(true)
      expect(categories.length).toBeGreaterThan(0)
    })

    it('should return categories with expected properties', async () => {
      const categories = await getCategories()

      categories.forEach((category) => {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('slug')
        expect(category).toHaveProperty('icon')
      })
    })
  })
})
