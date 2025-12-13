import { describe, expect, it } from 'vitest'

import { getStatusColor } from '@/lib/order-utils'

describe('order-utils', () => {
  describe('getStatusColor', () => {
    it('should return success colors for confirmed status', () => {
      const result = getStatusColor('confirmed')
      expect(result).toBe('bg-[var(--success-light)] text-[var(--success)] border-[var(--success)]')
    })

    it('should return warning colors for pending status', () => {
      const result = getStatusColor('pending')
      expect(result).toBe('bg-[var(--warning-light)] text-[var(--warning)] border-[var(--warning)]')
    })

    it('should return info colors for shipped status', () => {
      const result = getStatusColor('shipped')
      expect(result).toBe('bg-[var(--info-light)] text-[var(--info)] border-[var(--info)]')
    })

    it('should return purple colors for delivered status', () => {
      const result = getStatusColor('delivered')
      expect(result).toBe('bg-[var(--purple-light)] text-[var(--purple)] border-[var(--purple)]')
    })

    it('should return muted colors for unknown status', () => {
      const result = getStatusColor('unknown')
      expect(result).toBe('bg-muted text-muted-foreground border-muted')
    })

    it('should return muted colors for empty string', () => {
      const result = getStatusColor('')
      expect(result).toBe('bg-muted text-muted-foreground border-muted')
    })
  })
})
