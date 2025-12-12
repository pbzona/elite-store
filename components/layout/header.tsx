import Link from "next/link"

import { CartDrawer } from "@/components/cart/cart-drawer"
import { ThemeToggle } from "@/components/theme-toggle"

import { HeaderMobileMenu } from "./header-mobile-menu"
import { HeaderSearch } from "./header-search"
import { HeaderUserMenu } from "./header-user-menu"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-hover)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-xl">EliteStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/categories" className="text-sm font-medium hover:text-[var(--brand-primary)] transition-colors">
              Categories
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-[var(--brand-primary)] transition-colors">
              Products
            </Link>
            <Link href="/featured" className="text-sm font-medium hover:text-[var(--brand-primary)] transition-colors">
              Featured
            </Link>
          </nav>

          {/* Search Bar - Desktop Only */}
          <HeaderSearch className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-6" />

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <CartDrawer />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu - Desktop Only */}
            <HeaderUserMenu />

            {/* Mobile Menu Toggle */}
            <HeaderMobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
