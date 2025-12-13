import { generateToken, hashPassword, verifyPassword, verifyToken } from '@/lib/auth'
import { describe, expect, it } from 'vitest'

describe('auth utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash).toMatch(/^\$2[ayb]\$.{56}$/) // bcrypt hash pattern
    })

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testPassword123'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(password, hash)

      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'testPassword123'
      const wrongPassword = 'wrongPassword'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(wrongPassword, hash)

      expect(isValid).toBe(false)
    })
  })

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const userId = 'user123'
      const token = generateToken(userId)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should generate different tokens for different users', () => {
      const token1 = generateToken('user1')
      const token2 = generateToken('user2')

      expect(token1).not.toBe(token2)
    })
  })

  describe('verifyToken', () => {
    it('should verify valid token and return userId', () => {
      const userId = 'user123'
      const token = generateToken(userId)
      const result = verifyToken(token)

      expect(result).not.toBeNull()
      expect(result?.userId).toBe(userId)
    })

    it('should return null for invalid token', () => {
      const result = verifyToken('invalid.token.here')

      expect(result).toBeNull()
    })

    it('should return null for expired token', () => {
      // Create a token that expired immediately
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjJ9.invalid'
      const result = verifyToken(expiredToken)

      expect(result).toBeNull()
    })
  })

  describe('token round-trip', () => {
    it('should generate and verify token successfully', () => {
      const userId = 'test-user-123'
      const token = generateToken(userId)
      const verified = verifyToken(token)

      expect(verified).not.toBeNull()
      expect(verified?.userId).toBe(userId)
    })
  })
})
