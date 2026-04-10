"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { Cart } from "@/lib/cart"
import { useAuth } from "@/hooks/use-auth"

interface CartContextType {
  cart: Cart | null
  loading: boolean
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Inline helper to get session ID (avoids circular dependency)
  const getSessionId = () => {
    let sessionId = localStorage.getItem("cart-session-id")
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem("cart-session-id", sessionId)
    }
    return sessionId
  }

  const refreshCart = useCallback(async () => {
    try {
      const sessionId = user ? undefined : getSessionId()
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })

      if (response.ok) {
        const cartData = await response.json()
        setCart(cartData)
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    } finally {
      setLoading(false)
    }
  }, [user]) // Only depends on user now

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addToCart = useCallback(async (productId: number, quantity = 1) => {
    try {
      const sessionId = user ? undefined : getSessionId()
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, sessionId }),
      })

      if (response.ok) {
        await refreshCart()
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }, [user, refreshCart])

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    try {
      const sessionId = user ? undefined : getSessionId()
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, sessionId }),
      })

      if (response.ok) {
        await refreshCart()
      }
    } catch (error) {
      console.error("Failed to update cart:", error)
    }
  }, [user, refreshCart])

  const removeFromCart = useCallback(async (productId: number) => {
    try {
      const sessionId = user ? undefined : getSessionId()
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, sessionId }),
      })

      if (response.ok) {
        await refreshCart()
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error)
    }
  }, [user, refreshCart])

  const clearCart = useCallback(async () => {
    try {
      const sessionId = user ? undefined : getSessionId()
      const response = await fetch("/api/cart/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })

      if (response.ok) {
        await refreshCart()
      }
    } catch (error) {
      console.error("Failed to clear cart:", error)
    }
  }, [user, refreshCart])

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
