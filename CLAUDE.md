# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an e-commerce application built with Next.js 15, featuring a unique RGB-based product affinity system. Products and users have RGB values (0-255) that power personalized recommendations. The app uses the Next.js App Router, React Server Components, and Drizzle ORM with PostgreSQL.

## Development Commands

**Start development server:**
```bash
pnpm dev
```
The app runs on http://localhost:3000

**Build for production:**
```bash
pnpm build
```

**Run production build:**
```bash
pnpm start
```

**Linting:**
```bash
pnpm lint
```

**Database commands:**
```bash
# Generate migration files from schema changes
pnpm db:generate

# Run migrations against database
pnpm db:migrate

# Open Drizzle Studio (database GUI)
pnpm db:studio

# Seed database with sample data (18 products, 3 users)
pnpm db:seed

# Seed database with large dataset for load testing (180 products, 30 users)
pnpm db:seed:large
```

**Database setup:**
The app can run without a database using mock data. To use PostgreSQL:
1. Create a `.env` file with `DATABASE_URL` (see `.env.example`)
   - Example: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/elite_store`
2. Run migrations: `pnpm db:migrate`
3. Seed the database: `pnpm db:seed`

**Seed scripts:**

- `scripts/seed.ts` - Small dataset: 6 categories, 18 products, 3 users
- `scripts/seed-large.ts` - Large dataset for k6 load testing: 6 categories, 180 products (30 per category), 30 users, 50 orders
- All users have password: `password123`
- All products and categories have Lucide icon names for SVG rendering

## Architecture

### RGB Affinity System
The core feature is an RGB-based product recommendation system:

- Each product has RGB values (r, g, b) representing its color profile
- Each user has RGB affinity values (affinityR, affinityG, affinityB) representing preferences
- These values drive personalized product recommendations and sorting
- Users get random affinity values assigned on registration (can be customized)

### Database Schema (lib/db/schema.ts)
**Key tables:**

- `users` - User accounts with RGB affinity values
- `products` - Products with RGB values, pricing, inventory, Lucide icon names
- `categories` - Product categories with Lucide icon names
- `product_images` - Product image URLs (multiple per product)
- `carts` - Shopping carts (tied to user or session)
- `cart_items` - Items in carts
- `orders` - Order history with shipping info
- `order_items` - Individual items in orders

**Icon System:**

- Both products and categories have an `icon` field storing Lucide icon names
- Icons are rendered using the `Icon` component from `lib/icons.tsx`
- Provides graceful fallback to Package icon if specified icon doesn't exist
- No broken images - all visuals use SVG icons on RGB-colored backgrounds

**Important relationships:**

- Products belong to categories
- Products have many images
- Carts can be tied to authenticated users or guest sessions
- Orders are always tied to authenticated users

### Data Access Layer

**lib/db/index.ts** - Database connection with graceful degradation to mock data if PostgreSQL unavailable

**Core data modules:**
- `lib/auth.ts` - Authentication (JWT tokens in HTTP-only cookies), password hashing, user management
- `lib/products.ts` - Product queries, category queries, search/filtering with fallback to mock data
- `lib/cart.ts` - Cart operations (add, update, remove, clear)
- `lib/orders.ts` - Order creation and retrieval

All data modules check `isDatabaseAvailable()` and fall back to mock data if database is down.

### API Routes (app/api/)
RESTful API endpoints following Next.js 15 Route Handler conventions:
- `auth/` - login, register, logout, me (current user)
- `products/` - GET all products, GET by slug
- `categories/` - GET all categories, GET by slug
- `cart/` - GET cart, add, update, remove, clear
- `orders/` - GET orders, create order, GET by ID

All routes return JSON. Auth routes set/clear `auth-token` HTTP-only cookies.

### Pages (app/)
App Router pages with Server Components:
- `/` - Home page with featured products
- `/products` - Product listing with filtering
- `/products/[slug]` - Product detail page
- `/categories` - Category listing
- `/categories/[slug]` - Category-filtered products
- `/cart` - Shopping cart page
- `/checkout` - Checkout flow
- `/orders` - Order history
- `/orders/[id]` - Order detail
- `/login`, `/register` - Authentication pages
- `/account` - User account page
- `/search` - Search results
- `/featured` - Featured products

### Components
**Component organization:**
- `components/ui/` - shadcn/ui components (Button, Card, Input, etc.)
- `components/auth/` - LoginForm, RegisterForm
- `components/product/` - ProductCard, ProductGrid
- `components/cart/` - CartDrawer
- `components/layout/` - Header

**Styling:** Tailwind CSS v4 with shadcn/ui design system

### Context Providers (hooks/)
App wrapped in providers at layout.tsx:
- `AuthProvider` - Manages current user state, login/logout
- `CartProvider` - Manages cart state, add/remove items

## Key Technical Details

**Authentication:**
- JWT tokens stored in HTTP-only cookies (7-day expiration)
- Tokens contain userId only
- `getCurrentUser()` retrieves full user data from database using token
- Passwords hashed with bcrypt (12 rounds)

**Cart behavior:**
- Guest users get session-based carts
- Authenticated users get persistent carts tied to user ID
- Cart operations are optimistic with server updates

**Mock data:**
- Products and categories defined in lib/products.ts and app/api/products/route.ts
- Used automatically when database unavailable
- Includes 8 sample products across 6 categories

**Path aliasing:**
- `@/*` maps to repository root (configured in tsconfig.json)

**Fonts:**
- Inter (sans-serif) and JetBrains Mono (monospace) from Google Fonts
- Loaded via next/font/google with automatic optimization
- Applied via CSS variables (--font-sans, --font-mono) in layout.tsx

## Important Patterns

**Data fetching:**
- Server Components fetch data directly from lib/ modules
- API routes used only for client-side mutations and cart operations
- All database queries use Drizzle ORM with proper error handling

**Error handling:**
- Database operations wrapped in try-catch with fallback to mock data
- API routes return appropriate HTTP status codes
- Console warnings logged when falling back to mock data

**Type safety:**
- Full TypeScript with strict mode
- Zod schemas used for form validation (via react-hook-form + @hookform/resolvers)
- Type-safe database queries with Drizzle
