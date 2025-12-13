import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock environment variables
beforeAll(() => {
  process.env.JWT_SECRET = 'test-jwt-secret'
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/elite_store'
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
})
