"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { HeaderSearch } from "./header-search"

export function HeaderMobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAuth()

  return (
    <>
      {/* Mobile Menu Toggle */}
      <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 py-4">
          <div className="space-y-4">
            {/* Mobile Search */}
            <HeaderSearch mobile className="flex items-center space-x-2" />

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <Link
                href="/categories"
                className="text-sm font-medium hover:text-[var(--brand-primary)] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium hover:text-[var(--brand-primary)] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/featured"
                className="text-sm font-medium hover:text-[var(--brand-primary)] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Featured
              </Link>
            </nav>

            {/* Mobile Auth */}
            {!user && (
              <div className="flex flex-col space-y-2 pt-4 border-t border-border/40">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button size="sm" className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)]" asChild>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
