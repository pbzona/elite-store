import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "../lib/db/schema"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL!

// Product data templates for generating realistic products
const productTemplates = {
  "smart-home": [
    { name: "Smart Light Bulb", icon: "Lightbulb", base: 15, compare: 25 },
    { name: "Smart Plug", icon: "Plug", base: 12, compare: 18 },
    { name: "Smart Thermostat", icon: "Thermometer", base: 129, compare: 199 },
    { name: "Video Doorbell", icon: "Camera", base: 149, compare: 199 },
    { name: "Smart Lock", icon: "Lock", base: 179, compare: 249 },
    { name: "Motion Sensor", icon: "Radar", base: 29, compare: 39 },
    { name: "Smart Dimmer Switch", icon: "ToggleRight", base: 39, compare: 49 },
    { name: "Smart Smoke Detector", icon: "AlertTriangle", base: 79, compare: 99 },
    { name: "Smart Garage Door Opener", icon: "DoorOpen", base: 199, compare: 279 },
    { name: "Water Leak Sensor", icon: "Droplets", base: 35, compare: 49 },
  ],
  "audio-music": [
    { name: "Wireless Earbuds", icon: "Ear", base: 89, compare: 129 },
    { name: "Over-Ear Headphones", icon: "Headphones", base: 199, compare: 299 },
    { name: "Portable Speaker", icon: "Speaker", base: 79, compare: 119 },
    { name: "Soundbar", icon: "AudioLines", base: 299, compare: 399 },
    { name: "Bluetooth Speaker", icon: "Radio", base: 49, compare: 69 },
    { name: "Studio Monitors", icon: "Music", base: 349, compare: 499 },
    { name: "Audio Interface", icon: "Disc", base: 149, compare: 199 },
    { name: "Microphone", icon: "Mic", base: 99, compare: 149 },
    { name: "Vinyl Record Player", icon: "Disc3", base: 249, compare: 349 },
    { name: "Hi-Fi Amplifier", icon: "Radio", base: 399, compare: 599 },
  ],
  gaming: [
    { name: "Gaming Mouse", icon: "Mouse", base: 59, compare: 89 },
    { name: "Gaming Keyboard", icon: "Keyboard", base: 129, compare: 179 },
    { name: "Gaming Headset", icon: "Headphones", base: 99, compare: 149 },
    { name: "Gaming Chair", icon: "Armchair", base: 299, compare: 449 },
    { name: "Gaming Monitor", icon: "Monitor", base: 349, compare: 499 },
    { name: "Gaming Mousepad", icon: "RectangleHorizontal", base: 29, compare: 39 },
    { name: "VR Headset", icon: "Glasses", base: 399, compare: 599 },
    { name: "Game Controller", icon: "Gamepad2", base: 59, compare: 79 },
    { name: "Streaming Webcam", icon: "Camera", base: 129, compare: 179 },
    { name: "Capture Card", icon: "Tv", base: 149, compare: 199 },
  ],
  "fitness-tech": [
    { name: "Fitness Tracker", icon: "Watch", base: 129, compare: 179 },
    { name: "Smart Watch", icon: "Watch", base: 249, compare: 349 },
    { name: "Smart Scale", icon: "Scale", base: 49, compare: 79 },
    { name: "Heart Rate Monitor", icon: "HeartPulse", base: 79, compare: 99 },
    { name: "Smart Water Bottle", icon: "Droplet", base: 45, compare: 65 },
    { name: "Fitness Band", icon: "Watch", base: 39, compare: 59 },
    { name: "Smart Jump Rope", icon: "Cable", base: 29, compare: 39 },
    { name: "Yoga Mat with Sensors", icon: "RectangleHorizontal", base: 99, compare: 149 },
    { name: "Smart Resistance Bands", icon: "Waypoints", base: 49, compare: 69 },
    { name: "Running Pod", icon: "Activity", base: 59, compare: 79 },
  ],
  "mobile-accessories": [
    { name: "Phone Case", icon: "Smartphone", base: 19, compare: 29 },
    { name: "Screen Protector", icon: "Shield", base: 12, compare: 19 },
    { name: "Wireless Charger", icon: "Zap", base: 29, compare: 49 },
    { name: "Power Bank", icon: "Battery", base: 39, compare: 59 },
    { name: "Car Mount", icon: "Car", base: 24, compare: 34 },
    { name: "Phone Stand", icon: "Smartphone", base: 15, compare: 25 },
    { name: "USB-C Cable", icon: "Cable", base: 9, compare: 15 },
    { name: "Car Charger", icon: "Zap", base: 19, compare: 29 },
    { name: "Pop Socket", icon: "Circle", base: 8, compare: 12 },
    { name: "Phone Ring Holder", icon: "CircleDot", base: 10, compare: 15 },
  ],
  workspace: [
    { name: "Ergonomic Mouse", icon: "Mouse", base: 49, compare: 69 },
    { name: "Mechanical Keyboard", icon: "Keyboard", base: 149, compare: 199 },
    { name: "Monitor Arm", icon: "Monitor", base: 89, compare: 129 },
    { name: "Desk Lamp", icon: "Lamp", base: 59, compare: 89 },
    { name: "Laptop Stand", icon: "Monitor", base: 39, compare: 59 },
    { name: "Cable Management", icon: "Cable", base: 19, compare: 29 },
    { name: "Desk Organizer", icon: "LayoutGrid", base: 29, compare: 39 },
    { name: "Footrest", icon: "Box", base: 49, compare: 69 },
    { name: "Monitor Light Bar", icon: "Lamp", base: 79, compare: 109 },
    { name: "Wireless Presenter", icon: "Presentation", base: 29, compare: 39 },
  ],
}

const brands = ["Pro", "Elite", "Ultra", "Premium", "Smart", "Max", "Plus", "Advanced", "Supreme", "Master"]
const adjectives = ["Essential", "Professional", "Deluxe", "Superior", "Ultimate", "Perfect", "Optimal", "Prime", "Exclusive", "Signature"]

function generateRGB(): { r: number; g: number; b: number } {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }
}

function generateSKU(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  return (
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)] +
    "-" +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)]
  )
}

async function seed() {
  console.log("🌱 Starting large database seed for load testing...")

  const pool = new Pool({ connectionString })
  const db = drizzle(pool, { schema })

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...")
    await db.delete(schema.orderItems)
    await db.delete(schema.orders)
    await db.delete(schema.cartItems)
    await db.delete(schema.carts)
    await db.delete(schema.productImages)
    await db.delete(schema.products)
    await db.delete(schema.categories)
    await db.delete(schema.users)

    // Insert categories
    console.log("📁 Inserting categories...")
    const categoriesData = await db
      .insert(schema.categories)
      .values([
        {
          name: "Smart Home",
          slug: "smart-home",
          description: "Intelligent devices to automate and enhance your living space",
          image: "/placeholder.svg?height=400&width=600",
          icon: "Home",
        },
        {
          name: "Audio & Music",
          slug: "audio-music",
          description: "Premium headphones, speakers, and audio equipment",
          image: "/placeholder.svg?height=400&width=600",
          icon: "Headphones",
        },
        {
          name: "Gaming",
          slug: "gaming",
          description: "High-performance gaming gear and accessories",
          image: "/placeholder.svg?height=400&width=600",
          icon: "Gamepad2",
        },
        {
          name: "Fitness Tech",
          slug: "fitness-tech",
          description: "Wearables and devices to track and improve your health",
          image: "/placeholder.svg?height=400&width=600",
          icon: "Activity",
        },
        {
          name: "Mobile Accessories",
          slug: "mobile-accessories",
          description: "Cases, chargers, and accessories for your devices",
          image: "/placeholder.svg?height=400&width=600",
          icon: "Smartphone",
        },
        {
          name: "Workspace",
          slug: "workspace",
          description: "Ergonomic and stylish products for your home office",
          image: "/placeholder.svg?height=400&width=600",
          icon: "Monitor",
        },
      ])
      .returning()

    console.log(`✅ Inserted ${categoriesData.length} categories`)

    const categoryMap = Object.fromEntries(categoriesData.map((cat) => [cat.slug, cat.id]))

    // Generate products
    console.log("📦 Generating and inserting products...")
    const productsToInsert = []

    for (const [categorySlug, templates] of Object.entries(productTemplates)) {
      for (const template of templates) {
        // Create 3 variations of each template
        for (let i = 0; i < 3; i++) {
          const brand = brands[Math.floor(Math.random() * brands.length)]
          const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
          const variation = i === 0 ? brand : i === 1 ? adjective : `${brand} ${adjective}`
          const name = `${variation} ${template.name}`
          const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
          const rgb = generateRGB()
          const priceVariation = 1 + (Math.random() * 0.4 - 0.2) // ±20% price variation
          const price = (template.base * priceVariation).toFixed(2)
          const compareAtPrice = template.compare ? (template.compare * priceVariation).toFixed(2) : null
          const inventory = Math.floor(Math.random() * 500) + 50
          const featured = Math.random() < 0.15 // 15% chance of being featured

          productsToInsert.push({
            name,
            slug,
            description: `Experience premium quality with the ${name}. Designed for performance and reliability, this product delivers exceptional value and innovation.`,
            shortDescription: `High-quality ${template.name.toLowerCase()} for modern lifestyles`,
            price,
            compareAtPrice,
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            sku: generateSKU(),
            inventory,
            categoryId: categoryMap[categorySlug],
            icon: template.icon,
            featured,
            active: true,
          })
        }
      }
    }

    const productsData = await db.insert(schema.products).values(productsToInsert).returning()
    console.log(`✅ Inserted ${productsData.length} products`)

    // Insert product images
    console.log("🖼️  Inserting product images...")
    const productImagesData = []
    for (const product of productsData) {
      productImagesData.push({
        productId: product.id,
        url: "/placeholder.svg?height=400&width=400",
        altText: product.name,
        sortOrder: 0,
      })
    }
    await db.insert(schema.productImages).values(productImagesData)
    console.log(`✅ Inserted ${productImagesData.length} product images`)

    // Generate users
    console.log("👥 Inserting users...")
    const hashedPassword = await bcrypt.hash("password123", 12)
    const usersToInsert = []

    const firstNames = ["Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn", "Dakota", "Rowan", "Sage", "River", "Phoenix", "Sky", "Drew", "Cameron", "Blake", "Jamie", "Reese"]
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"]

    // Create 30 users with varied RGB affinities
    for (let i = 0; i < 30; i++) {
      const firstName = firstNames[i % firstNames.length]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const rgb = generateRGB()
      usersToInsert.push({
        email: `user${i + 1}@example.com`,
        password: hashedPassword,
        firstName,
        lastName,
        affinityR: rgb.r,
        affinityG: rgb.g,
        affinityB: rgb.b,
      })
    }

    const usersData = await db.insert(schema.users).values(usersToInsert).returning()
    console.log(`✅ Inserted ${usersData.length} users (password: password123)`)

    // Generate realistic orders
    console.log("📋 Inserting orders...")
    const ordersToInsert = []
    const orderItemsToInsert = []

    const statuses = ["pending", "confirmed", "processing", "shipped", "delivered"]
    const paymentMethods = ["credit_card", "paypal", "apple_pay"]
    const paymentStatuses = ["pending", "paid", "failed"]

    // Create 50 orders
    for (let i = 0; i < 50; i++) {
      const user = usersData[Math.floor(Math.random() * usersData.length)]
      const numItems = Math.floor(Math.random() * 4) + 1
      const selectedProducts = []
      let subtotal = 0

      for (let j = 0; j < numItems; j++) {
        const product = productsData[Math.floor(Math.random() * productsData.length)]
        const quantity = Math.floor(Math.random() * 3) + 1
        selectedProducts.push({ product, quantity })
        subtotal += parseFloat(product.price) * quantity
      }

      const tax = subtotal * 0.09
      const shipping = subtotal > 50 ? 0 : 9.99
      const total = subtotal + tax + shipping

      const order = {
        userId: user.id,
        orderNumber: `ORD-2024-${String(i + 1).padStart(4, "0")}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        shippingFirstName: user.firstName,
        shippingLastName: user.lastName,
        shippingAddress1: `${Math.floor(Math.random() * 9999) + 1} Main St`,
        shippingAddress2: Math.random() < 0.3 ? `Apt ${Math.floor(Math.random() * 50) + 1}` : null,
        shippingCity: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][Math.floor(Math.random() * 5)],
        shippingState: ["NY", "CA", "IL", "TX", "AZ"][Math.floor(Math.random() * 5)],
        shippingZip: String(Math.floor(Math.random() * 90000) + 10000),
        shippingCountry: "US",
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      }

      ordersToInsert.push(order)
    }

    const ordersData = await db.insert(schema.orders).values(ordersToInsert).returning()
    console.log(`✅ Inserted ${ordersData.length} orders`)

    // Insert order items
    console.log("📦 Inserting order items...")
    for (const order of ordersData) {
      const numItems = Math.floor(Math.random() * 4) + 1
      for (let j = 0; j < numItems; j++) {
        const product = productsData[Math.floor(Math.random() * productsData.length)]
        orderItemsToInsert.push({
          orderId: order.id,
          productId: product.id,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: product.price,
        })
      }
    }
    await db.insert(schema.orderItems).values(orderItemsToInsert)
    console.log(`✅ Inserted ${orderItemsToInsert.length} order items`)

    // Create sample carts for some users
    console.log("🛒 Inserting cart items...")
    const cartsToInsert = []
    const cartItemsToInsert = []

    // Create carts for 15 random users
    for (let i = 0; i < 15; i++) {
      const user = usersData[Math.floor(Math.random() * usersData.length)]
      cartsToInsert.push({ userId: user.id })
    }

    const cartsData = await db.insert(schema.carts).values(cartsToInsert).returning()

    for (const cart of cartsData) {
      const numItems = Math.floor(Math.random() * 5) + 1
      for (let j = 0; j < numItems; j++) {
        const product = productsData[Math.floor(Math.random() * productsData.length)]
        cartItemsToInsert.push({
          cartId: cart.id,
          productId: product.id,
          quantity: Math.floor(Math.random() * 3) + 1,
        })
      }
    }
    await db.insert(schema.cartItems).values(cartItemsToInsert)
    console.log(`✅ Inserted ${cartItemsToInsert.length} cart items`)

    console.log("\n✨ Large database seed completed successfully!")
    console.log(`\n📊 Summary:`)
    console.log(`   Categories: ${categoriesData.length}`)
    console.log(`   Products: ${productsData.length}`)
    console.log(`   Users: ${usersData.length}`)
    console.log(`   Orders: ${ordersData.length}`)
    console.log(`   Order Items: ${orderItemsToInsert.length}`)
    console.log(`   Carts: ${cartsData.length}`)
    console.log(`   Cart Items: ${cartItemsToInsert.length}`)
    console.log(`\n📝 All users have password: password123`)
    console.log(`   Sample users: user1@example.com, user2@example.com, user3@example.com, etc.\n`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  } finally {
    await pool.end()
  }
}

seed()
