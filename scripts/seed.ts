import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "../lib/db/schema"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL!

async function seed() {
  console.log("🌱 Starting database seed...")

  const pool = new Pool({ connectionString })
  const db = drizzle(pool, { schema })

  try {
    // Clear existing data (in reverse order of dependencies)
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

    // Get category IDs by slug for reference
    const categoryMap = Object.fromEntries(categoriesData.map((cat) => [cat.slug, cat.id]))

    // Insert products with RGB values
    console.log("📦 Inserting products...")
    const productsData = await db
      .insert(schema.products)
      .values([
        // Smart Home Category
        {
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
          categoryId: categoryMap["smart-home"],
          icon: "Lightbulb",
          featured: true,
          active: true,
        },
        {
          name: "Echo Hub Smart Display",
          slug: "echo-hub-smart-display",
          description:
            "Central control hub with 10-inch touchscreen for managing all your smart home devices in one place.",
          shortDescription: "Smart home control hub",
          price: "249.99",
          compareAtPrice: null,
          r: 50,
          g: 150,
          b: 255,
          sku: "EHS-001",
          inventory: 75,
          categoryId: categoryMap["smart-home"],
          icon: "Monitor",
          featured: false,
          active: true,
        },
        {
          name: "Thermal Guardian Security Camera",
          slug: "thermal-guardian-camera",
          description:
            "AI-powered security camera with night vision, motion detection, and cloud storage for ultimate home protection.",
          shortDescription: "AI security camera with night vision",
          price: "199.99",
          compareAtPrice: "249.99",
          r: 200,
          g: 50,
          b: 100,
          sku: "TGC-001",
          inventory: 200,
          categoryId: categoryMap["smart-home"],
          icon: "Camera",
          featured: true,
          active: true,
        },
        // Audio & Music Category
        {
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
          categoryId: categoryMap["audio-music"],
          icon: "Headphones",
          featured: true,
          active: true,
        },
        {
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
          categoryId: categoryMap["audio-music"],
          icon: "Speaker",
          featured: false,
          active: true,
        },
        {
          name: "Studio Monitor Earbuds",
          slug: "studio-monitor-earbuds",
          description:
            "Professional-grade wireless earbuds with custom EQ, transparency mode, and premium carrying case.",
          shortDescription: "Professional wireless earbuds",
          price: "179.99",
          compareAtPrice: "219.99",
          r: 150,
          g: 255,
          b: 100,
          sku: "SME-001",
          inventory: 250,
          categoryId: categoryMap["audio-music"],
          icon: "Ear",
          featured: false,
          active: true,
        },
        // Gaming Category
        {
          name: "Quantum Gaming Keyboard",
          slug: "quantum-gaming-keyboard",
          description:
            "Mechanical gaming keyboard with RGB backlighting, programmable keys, and ultra-responsive switches.",
          shortDescription: "RGB mechanical gaming keyboard",
          price: "159.99",
          compareAtPrice: "199.99",
          r: 255,
          g: 50,
          b: 150,
          sku: "QGK-001",
          inventory: 90,
          categoryId: categoryMap["gaming"],
          icon: "Keyboard",
          featured: true,
          active: true,
        },
        {
          name: "Precision Gaming Mouse",
          slug: "precision-gaming-mouse",
          description:
            "High-DPI wireless gaming mouse with customizable buttons, RGB lighting, and 70-hour battery life.",
          shortDescription: "High-DPI gaming mouse",
          price: "89.99",
          compareAtPrice: "119.99",
          r: 200,
          g: 255,
          b: 100,
          sku: "PGM-001",
          inventory: 160,
          categoryId: categoryMap["gaming"],
          icon: "Mouse",
          featured: false,
          active: true,
        },
        {
          name: "Immersion VR Headset",
          slug: "immersion-vr-headset",
          description:
            "Next-generation VR headset with 4K displays, spatial tracking, and wireless connectivity for ultimate gaming.",
          shortDescription: "4K VR gaming headset",
          price: "599.99",
          compareAtPrice: "699.99",
          r: 100,
          g: 150,
          b: 255,
          sku: "IVH-001",
          inventory: 45,
          categoryId: categoryMap["gaming"],
          icon: "Glasses",
          featured: true,
          active: true,
        },
        // Fitness Tech Category
        {
          name: "Pulse Fitness Tracker",
          slug: "pulse-fitness-tracker",
          description:
            "Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life.",
          shortDescription: "Advanced fitness tracker with GPS",
          price: "199.99",
          compareAtPrice: "249.99",
          r: 255,
          g: 200,
          b: 50,
          sku: "PFT-001",
          inventory: 200,
          categoryId: categoryMap["fitness-tech"],
          icon: "Watch",
          featured: true,
          active: true,
        },
        {
          name: "Smart Scale Pro",
          slug: "smart-scale-pro",
          description:
            "Intelligent body composition scale that tracks weight, BMI, muscle mass, and syncs with your fitness apps.",
          shortDescription: "Smart body composition scale",
          price: "79.99",
          compareAtPrice: "99.99",
          r: 50,
          g: 255,
          b: 200,
          sku: "SSP-001",
          inventory: 130,
          categoryId: categoryMap["fitness-tech"],
          icon: "Scale",
          featured: false,
          active: true,
        },
        {
          name: "Hydration Smart Bottle",
          slug: "hydration-smart-bottle",
          description:
            "Temperature-controlled smart water bottle with hydration tracking, LED indicators, and app connectivity.",
          shortDescription: "Smart water bottle with tracking",
          price: "69.99",
          compareAtPrice: "89.99",
          r: 150,
          g: 100,
          b: 255,
          sku: "HSB-001",
          inventory: 175,
          categoryId: categoryMap["fitness-tech"],
          icon: "Droplet",
          featured: true,
          active: true,
        },
        // Mobile Accessories Category
        {
          name: "Armor Case Pro",
          slug: "armor-case-pro",
          description:
            "Military-grade phone case with wireless charging compatibility, drop protection, and built-in kickstand.",
          shortDescription: "Military-grade phone case",
          price: "39.99",
          compareAtPrice: "49.99",
          r: 100,
          g: 100,
          b: 100,
          sku: "ACP-001",
          inventory: 300,
          categoryId: categoryMap["mobile-accessories"],
          icon: "Shield",
          featured: false,
          active: true,
        },
        {
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
          categoryId: categoryMap["mobile-accessories"],
          icon: "Zap",
          featured: true,
          active: true,
        },
        {
          name: "Power Bank Ultra",
          slug: "power-bank-ultra",
          description:
            "20,000mAh portable charger with fast charging, multiple ports, and digital display showing remaining power.",
          shortDescription: "20,000mAh portable charger",
          price: "59.99",
          compareAtPrice: "79.99",
          r: 200,
          g: 100,
          b: 255,
          sku: "PBU-001",
          inventory: 180,
          categoryId: categoryMap["mobile-accessories"],
          icon: "Battery",
          featured: true,
          active: true,
        },
        // Workspace Category
        {
          name: "Ergonomic Desk Chair",
          slug: "ergonomic-desk-chair",
          description:
            "Premium office chair with lumbar support, adjustable height, breathable mesh, and 360-degree swivel.",
          shortDescription: "Premium ergonomic office chair",
          price: "349.99",
          compareAtPrice: "449.99",
          r: 50,
          g: 50,
          b: 50,
          sku: "EDC-001",
          inventory: 60,
          categoryId: categoryMap["workspace"],
          icon: "Armchair",
          featured: true,
          active: true,
        },
        {
          name: "Standing Desk Converter",
          slug: "standing-desk-converter",
          description:
            "Adjustable standing desk converter with keyboard tray, monitor mount, and smooth height adjustment.",
          shortDescription: "Adjustable standing desk converter",
          price: "249.99",
          compareAtPrice: "299.99",
          r: 150,
          g: 100,
          b: 50,
          sku: "SDC-001",
          inventory: 85,
          categoryId: categoryMap["workspace"],
          icon: "Monitor",
          featured: false,
          active: true,
        },
        {
          name: "Monitor Light Bar",
          slug: "monitor-light-bar",
          description:
            "USB-powered monitor light with adjustable brightness, color temperature, and asymmetric lighting design.",
          shortDescription: "USB monitor light",
          price: "89.99",
          compareAtPrice: "109.99",
          r: 255,
          g: 255,
          b: 200,
          sku: "MLB-001",
          inventory: 140,
          categoryId: categoryMap["workspace"],
          icon: "Lamp",
          featured: false,
          active: true,
        },
      ])
      .returning()

    console.log(`✅ Inserted ${productsData.length} products`)

    // Create product map for reference
    const productMap = Object.fromEntries(productsData.map((prod) => [prod.slug, prod.id]))

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

    // Insert sample users with RGB affinities
    console.log("👥 Inserting users...")
    // Password is "password123" for all demo users
    const hashedPassword = await bcrypt.hash("password123", 12)

    const usersData = await db
      .insert(schema.users)
      .values([
        {
          email: "demo@example.com",
          password: hashedPassword,
          firstName: "Demo",
          lastName: "User",
          affinityR: 180,
          affinityG: 120,
          affinityB: 200,
        },
        {
          email: "alice@example.com",
          password: hashedPassword,
          firstName: "Alice",
          lastName: "Johnson",
          affinityR: 255,
          affinityG: 100,
          affinityB: 150,
        },
        {
          email: "bob@example.com",
          password: hashedPassword,
          firstName: "Bob",
          lastName: "Smith",
          affinityR: 100,
          affinityG: 255,
          affinityB: 80,
        },
      ])
      .returning()

    console.log(`✅ Inserted ${usersData.length} users (password: password123)`)

    const userMap = Object.fromEntries(usersData.map((user) => [user.email, user.id]))

    // Insert sample orders
    console.log("📋 Inserting orders...")
    const ordersData = await db
      .insert(schema.orders)
      .values([
        {
          userId: userMap["demo@example.com"],
          orderNumber: "ORD-2024-001",
          status: "delivered",
          subtotal: "329.98",
          tax: "29.70",
          shipping: "9.99",
          total: "369.67",
          shippingFirstName: "Demo",
          shippingLastName: "User",
          shippingAddress1: "123 Main St",
          shippingAddress2: null,
          shippingCity: "San Francisco",
          shippingState: "CA",
          shippingZip: "94102",
          shippingCountry: "US",
          paymentMethod: "credit_card",
          paymentStatus: "paid",
        },
        {
          userId: userMap["alice@example.com"],
          orderNumber: "ORD-2024-002",
          status: "shipped",
          subtotal: "459.98",
          tax: "41.40",
          shipping: "0.00",
          total: "501.38",
          shippingFirstName: "Alice",
          shippingLastName: "Johnson",
          shippingAddress1: "456 Oak Ave",
          shippingAddress2: "Apt 4B",
          shippingCity: "New York",
          shippingState: "NY",
          shippingZip: "10001",
          shippingCountry: "US",
          paymentMethod: "paypal",
          paymentStatus: "paid",
        },
        {
          userId: userMap["bob@example.com"],
          orderNumber: "ORD-2024-003",
          status: "processing",
          subtotal: "199.99",
          tax: "18.00",
          shipping: "5.99",
          total: "223.98",
          shippingFirstName: "Bob",
          shippingLastName: "Smith",
          shippingAddress1: "789 Pine Rd",
          shippingAddress2: null,
          shippingCity: "Los Angeles",
          shippingState: "CA",
          shippingZip: "90210",
          shippingCountry: "US",
          paymentMethod: "credit_card",
          paymentStatus: "pending",
        },
      ])
      .returning()

    console.log(`✅ Inserted ${ordersData.length} orders`)

    // Insert order items
    console.log("📦 Inserting order items...")
    await db.insert(schema.orderItems).values([
      {
        orderId: ordersData[0].id,
        productId: productMap["sonic-wave-pro-headphones"],
        quantity: 1,
        price: "299.99",
      },
      {
        orderId: ordersData[0].id,
        productId: productMap["wireless-charging-pad"],
        quantity: 1,
        price: "49.99",
      },
      {
        orderId: ordersData[1].id,
        productId: productMap["immersion-vr-headset"],
        quantity: 1,
        price: "599.99",
      },
      {
        orderId: ordersData[1].id,
        productId: productMap["quantum-gaming-keyboard"],
        quantity: 1,
        price: "159.99",
      },
      {
        orderId: ordersData[2].id,
        productId: productMap["pulse-fitness-tracker"],
        quantity: 1,
        price: "199.99",
      },
    ])
    console.log("✅ Inserted order items")

    // Insert sample cart for demo user
    console.log("🛒 Inserting cart items...")
    const [demoCart] = await db
      .insert(schema.carts)
      .values({
        userId: userMap["demo@example.com"],
      })
      .returning()

    await db.insert(schema.cartItems).values([
      {
        cartId: demoCart.id,
        productId: productMap["aurora-smart-light-strip"],
        quantity: 2,
      },
      {
        cartId: demoCart.id,
        productId: productMap["hydration-smart-bottle"],
        quantity: 1,
      },
    ])
    console.log("✅ Inserted cart items")

    console.log("\n✨ Database seeded successfully!")
    console.log("\n📝 Demo user credentials:")
    console.log("   Email: demo@example.com")
    console.log("   Email: alice@example.com")
    console.log("   Email: bob@example.com")
    console.log("   Password: password123\n")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  } finally {
    await pool.end()
  }
}

seed()
