"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SortOption = "default" | "price-asc" | "price-desc" | "name" | "affinity"

interface ProductSortFilterProps {
  className?: string
}

export function ProductSortFilter({ className }: ProductSortFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = (searchParams.get("sort") as SortOption) || "default"

  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "default") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="name">Name</SelectItem>
        <SelectItem value="affinity">Affinity</SelectItem>
      </SelectContent>
    </Select>
  )
}
