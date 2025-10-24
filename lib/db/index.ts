import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// DATABASE_URL environment variable is required
const connectionString = process.env.DATABASE_URL!

let db: ReturnType<typeof drizzle> | null = null
let pool: Pool | null = null

try {
  pool = new Pool({ connectionString })
  db = drizzle(pool, { schema })
} catch (error) {
  console.warn("Database connection failed, will use mock data:", error)
  db = null
  pool = null
}

// Export a safe database instance that can be null
export { db }
export * from "./schema"

// Helper function to check if database is available
export function isDatabaseAvailable(): boolean {
  return db !== null
}
