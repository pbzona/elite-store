import { categories, db, isDatabaseAvailable, productImages, products } from "@/lib/db"
import { tracer } from "@/lib/tracing"
import { and, asc, desc, eq, ilike, inArray } from "drizzle-orm"

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  shortDescription: string | null
  price: string
  compareAtPrice: string | null
  r: number
  g: number
  b: number
  sku: string | null
  inventory: number
  weight: string | null
  dimensions: string | null
  categoryId: number | null
  icon: string | null
  featured: boolean | null
  active: boolean | null
  createdAt: Date
  updatedAt: Date
  category?: {
    id: number
    name: string
    slug: string
  } | null
  images: {
    id: number
    url: string
    altText: string | null
    sortOrder: number | null
  }[]
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  icon: string | null
  createdAt: Date
  updatedAt: Date
}

// Mock data for when database is not available
const mockCategories: Category[] = [
  {
    id: 1,
    name: "Smart Home",
    slug: "smart-home",
    description: "Intelligent devices to automate and enhance your living space",
    image: "/placeholder.svg?height=400&width=600",
    icon: "Home",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Audio & Music",
    slug: "audio-music",
    description: "Premium headphones, speakers, and audio equipment",
    image: "/placeholder.svg?height=400&width=600",
    icon: "Headphones",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Gaming",
    slug: "gaming",
    description: "High-performance gaming gear and accessories",
    image: "/placeholder.svg?height=400&width=600",
    icon: "Gamepad2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: "Fitness Tech",
    slug: "fitness-tech",
    description: "Wearables and devices to track and improve your health",
    image: "/placeholder.svg?height=400&width=600",
    icon: "Activity",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    name: "Mobile Accessories",
    slug: "mobile-accessories",
    description: "Cases, chargers, and accessories for your devices",
    image: "/placeholder.svg?height=400&width=600",
    icon: "Smartphone",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    name: "Workspace",
    slug: "workspace",
    description: "Ergonomic and stylish products for your home office",
    image: "/placeholder.svg?height=400&width=600",
    icon: "Monitor",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Aurora Smart Light Strip",
    slug: "aurora-smart-light-strip",
    description:
      "Transform any space with this 16.4ft RGB LED strip featuring millions of colors, music sync, and voice control compatibility.",
    shortDescription: "RGB LED strip with smart controls",
    price: "49.99",
    compareAtPrice: "69.99",
    r: 255,
    g: 100,
    b: 200,
    sku: "ASL-001",
    inventory: 150,
    weight: "0.5",
    dimensions: "16.4ft",
    categoryId: 1,
    icon: "Lightbulb",
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[0],
    images: [
      {
        id: 1,
        url: "/placeholder.svg?height=400&width=400",
        altText: "Aurora Smart Light Strip",
        sortOrder: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Sonic Wave Pro Headphones",
    slug: "sonic-wave-pro-headphones",
    description:
      "Premium wireless headphones with active noise cancellation, 30-hour battery, and studio-quality sound.",
    shortDescription: "Wireless headphones with ANC",
    price: "299.99",
    compareAtPrice: "399.99",
    r: 100,
    g: 200,
    b: 255,
    sku: "SWP-001",
    inventory: 120,
    weight: "0.8",
    dimensions: "7.5 x 6.5 x 3.2 inches",
    categoryId: 2,
    icon: "Headphones",
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[1],
    images: [
      {
        id: 2,
        url: "/placeholder.svg?height=400&width=400",
        altText: "Sonic Wave Pro Headphones",
        sortOrder: 1,
      },
    ],
  },
  {
    id: 3,
    name: "Quantum Gaming Keyboard",
    slug: "quantum-gaming-keyboard",
    description: "Mechanical gaming keyboard with RGB backlighting, programmable keys, and ultra-responsive switches.",
    shortDescription: "RGB mechanical gaming keyboard",
    price: "159.99",
    compareAtPrice: "199.99",
    r: 255,
    g: 50,
    b: 150,
    sku: "QGK-001",
    inventory: 90,
    weight: "2.1",
    dimensions: "17.3 x 5.1 x 1.4 inches",
    categoryId: 3,
    icon: "Keyboard",
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[2],
    images: [
      {
        id: 3,
        url: "/placeholder.svg?height=400&width=400",
        altText: "Quantum Gaming Keyboard",
        sortOrder: 1,
      },
    ],
  },
  {
    id: 4,
    name: "Pulse Fitness Tracker",
    slug: "pulse-fitness-tracker",
    description: "Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life.",
    shortDescription: "Advanced fitness tracker with GPS",
    price: "199.99",
    compareAtPrice: "249.99",
    r: 255,
    g: 200,
    b: 50,
    sku: "PFT-001",
    inventory: 200,
    weight: "0.1",
    dimensions: "1.7 x 1.5 x 0.5 inches",
    categoryId: 4,
    icon: "Watch",
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[3],
    images: [
      {
        id: 4,
        url: "/placeholder.svg?height=400&width=400",
        altText: "Pulse Fitness Tracker",
        sortOrder: 1,
      },
    ],
  },
  {
    id: 5,
    name: "Wireless Charging Pad",
    slug: "wireless-charging-pad",
    description:
      "Fast wireless charger with LED indicators, foreign object detection, and universal device compatibility.",
    shortDescription: "Fast wireless charging pad",
    price: "49.99",
    compareAtPrice: "59.99",
    r: 255,
    g: 255,
    b: 100,
    sku: "WCP-001",
    inventory: 220,
    weight: "0.3",
    dimensions: "4.3 x 4.3 x 0.4 inches",
    categoryId: 5,
    icon: "Zap",
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[4],
    images: [
      {
        id: 5,
        url: "/placeholder.svg?height=400&width=400",
        altText: "Wireless Charging Pad",
        sortOrder: 1,
      },
    ],
  },
  {
    id: 6,
    name: "Ergonomic Desk Chair",
    slug: "ergonomic-desk-chair",
    description: "Premium office chair with lumbar support, adjustable height, breathable mesh, and 360-degree swivel.",
    shortDescription: "Premium ergonomic office chair",
    price: "349.99",
    compareAtPrice: "449.99",
    r: 50,
    g: 50,
    b: 50,
    sku: "EDC-001",
    inventory: 60,
    weight: "45",
    dimensions: "26 x 26 x 40-44 inches",
    categoryId: 6,
    icon: "Armchair",
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[5],
    images: [
      {
        id: 6,
        url: "/placeholder.svg?height=400&width=400",
        altText: "Ergonomic Desk Chair",
        sortOrder: 1,
      },
    ],
  },
  {
    id: 7,
    name: "Echo Hub Smart Display",
    slug: "echo-hub-smart-display",
    description: "Central control hub with 10-inch touchscreen for managing all your smart home devices in one place.",
    shortDescription: "Smart home control hub",
    price: "249.99",
    compareAtPrice: null,
    r: 50,
    g: 150,
    b: 255,
    sku: "EHS-001",
    inventory: 75,
    weight: "1.2",
    dimensions: "9.9 x 6.3 x 4.2 inches",
    categoryId: 1,
    icon: "Monitor",
    featured: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[0],
    images: [
      {
        id: 7,
        url: "/placeholder.svg?height=400&width=400",
        altText: "Echo Hub Smart Display",
        sortOrder: 1,
      },
    ],
  },
  {
    id: 8,
    name: "Bass Cube Bluetooth Speaker",
    slug: "bass-cube-speaker",
    description:
      "Compact yet powerful portable speaker with 360-degree sound, waterproof design, and 20-hour battery life.",
    shortDescription: "Portable Bluetooth speaker",
    price: "129.99",
    compareAtPrice: "159.99",
    r: 255,
    g: 150,
    b: 50,
    sku: "BCS-001",
    inventory: 180,
    weight: "1.5",
    dimensions: "4.1 x 4.1 x 4.1 inches",
    categoryId: 2,
    icon: "Speaker",
    featured: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[1],
    images: [
      {
        id: 8,
        url: "/placeholder.svg?height=400&width=400",
        altText: "Bass Cube Bluetooth Speaker",
        sortOrder: 1,
      },
    ],
  },
]

export async function getProducts(options?: {
  categoryId?: number
  featured?: boolean
  limit?: number
  offset?: number
  search?: string
}): Promise<Product[]> {
  const span = tracer.startSpan('products.getProducts', {
    attributes: {
      'filter.categoryId': options?.categoryId,
      'filter.featured': options?.featured,
      'filter.search': options?.search,
      'pagination.limit': options?.limit,
      'pagination.offset': options?.offset,
    }
  })

  try {
    if (!isDatabaseAvailable() || !db) {
      console.warn("Database not available, using mock data")
      span.setAttributes({ 'db.mock_data': true })
      span.end()
      return getMockProducts(options)
    }

    const conditions = [eq(products.active, true)]

    if (options?.categoryId) {
      conditions.push(eq(products.categoryId, options.categoryId))
    }

    if (options?.featured) {
      conditions.push(eq(products.featured, true))
    }

    if (options?.search) {
      conditions.push(ilike(products.name, `%${options.search}%`))
    }

    const querySpan = tracer.startSpan('products.queryProducts')

    const query = db!
      .select({
        product: products,
        category: categories,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(products.createdAt))

    if (options?.limit) {
      query.limit(options.limit)
    }

    if (options?.offset) {
      query.offset(options.offset)
    }

    const result = await query

    querySpan.setAttributes({
      'db.result_count': result.length,
      'db.filters_applied': conditions.length
    })
    querySpan.end()

    // Get images for all products
    const imagesSpan = tracer.startSpan('products.fetchImages', {
      attributes: {
        'product.count': result.length,
      }
    })
    const productIds = result.map((r) => r.product.id)
    const images =
      productIds.length > 0
        ? await db
          .select()
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
          .orderBy(asc(productImages.sortOrder))
        : []

    imagesSpan.setAttributes({
      'db.images_count': images.length,
      'db.avg_images_per_product': images.length / productIds.length,
    })
    imagesSpan.end()

    // Group images by product ID

    const groupSpan = tracer.startSpan('products.groupImages', {
      attributes: {
        'operation': 'javascript_reduce',
        'images.count': images.length,
      }
    })

    const imagesByProduct = images.reduce(
      (acc, img) => {
        if (!acc[img.productId]) acc[img.productId] = []
        acc[img.productId].push(img)
        return acc
      },
      {} as Record<number, typeof images>,
    )

    groupSpan.end()

    const productsWithImages = result.map(({ product, category }) => ({
      ...product,
      category,
      images: imagesByProduct[product.id] || [],
    }))

    span.setAttributes({
      'result.product_count': productsWithImages.length,
    })
    span.end()

    return productsWithImages
  } catch (error) {
    console.warn("Database query failed, using mock data:", error)
    return getMockProducts(options)
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const span = tracer.startSpan('products.getProductBySlug', {
    attributes: {
      'product.slug': slug,
    }
  })

  if (!isDatabaseAvailable() || !db) {
    console.warn("Database not available, using mock data")
    span.setAttributes({ 'db.mock_data': true })
    span.end()
    return mockProducts.find((product) => product.slug === slug && product.active) || null
  }

  try {
    const [result] = await db
      .select({
        product: products,
        category: categories,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.slug, slug), eq(products.active, true)))

    if (!result) return null

    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, result.product.id))
      .orderBy(asc(productImages.sortOrder))

    span.setAttributes({
      'db.result': result ? 'found' : 'not_found'
    })
    span.end()

    return {
      ...result.product,
      category: result.category,
      images,
    }
  } catch (error) {
    console.warn("Database query failed, using mock data:", error)
    return mockProducts.find((product) => product.slug === slug && product.active) || null
  }
}

export async function getCategories(): Promise<Category[]> {
  const span = tracer.startSpan('products.getCategories')

  if (!isDatabaseAvailable() || !db) {
    console.warn("Database not available, using mock data")
    span.setAttributes({ 'db.mock_data': true })
    span.end()
    return mockCategories
  }

  try {
    const categoriesResult = await db.select().from(categories).orderBy(asc(categories.name))
    span.setAttributes({
      'db.result_count': categoriesResult.length
    })
    span.end()

    return categoriesResult
  } catch (error) {
    console.warn("Database query failed, using mock data:", error)
    return mockCategories
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const span = tracer.startSpan('products.getCategoryBySlug', {
    attributes: {
      'category.slug': slug,
    }
  })

  if (!isDatabaseAvailable() || !db) {
    console.warn("Database not available, using mock data")
    span.setAttributes({ 'db.mock_data': true })
    return mockCategories.find((category) => category.slug === slug) || null
  }

  try {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug))
    span.setAttributes({ 'db.result': category ? 'found' : 'not_found' })
    span.end()
    return category || null
  } catch (error) {
    console.warn("Database query failed, using mock data:", error)
    span.setAttributes({ 'db.mock_data': true })
    span.end()
    return mockCategories.find((category) => category.slug === slug) || null
  }
}

function getMockProducts(options?: {
  categoryId?: number
  featured?: boolean
  limit?: number
  offset?: number
  search?: string
}): Product[] {
  let filteredProducts = mockProducts.filter((product) => product.active)

  if (options?.categoryId) {
    filteredProducts = filteredProducts.filter((product) => product.categoryId === options.categoryId)
  }

  if (options?.featured) {
    filteredProducts = filteredProducts.filter((product) => product.featured)
  }

  if (options?.search) {
    const searchLower = options.search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) || product.description.toLowerCase().includes(searchLower),
    )
  }

  if (options?.offset) {
    filteredProducts = filteredProducts.slice(options.offset)
  }

  if (options?.limit) {
    filteredProducts = filteredProducts.slice(0, options.limit)
  }

  return filteredProducts
}
