"use client"

import { useState } from "react"
import { SectionHeader } from "@/components/section-header"
import { CategoryCard } from "@/components/category-card"

const categories = [
  { id: 1, title: "Jewelry", icon: "/placeholder.svg?height=48&width=48", href: "/category/jewelry" },
  { id: 2, title: "Watches", icon: "/placeholder.svg?height=48&width=48", href: "/category/watches" },
  { id: 3, title: "Estates", icon: "/placeholder.svg?height=48&width=48", href: "/category/estates" },
  { id: 4, title: "Antiques", icon: "/placeholder.svg?height=48&width=48", href: "/category/antiques" },
  { id: 5, title: "Fine Art", icon: "/placeholder.svg?height=48&width=48", href: "/category/fine-art" },
  { id: 6, title: "Vintage Cars", icon: "/placeholder.svg?height=48&width=48", href: "/category/vintage-cars" },
  { id: 7, title: "Collectibles", icon: "/placeholder.svg?height=48&width=48", href: "/category/collectibles" },
  { id: 8, title: "Luxury Items", icon: "/placeholder.svg?height=48&width=48", href: "/category/luxury-items" },
]

export function AuctionCategoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsToShow = 6

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : categories.length - itemsToShow))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < categories.length - itemsToShow ? prev + 1 : 0))
  }

  const visibleCategories = categories.slice(currentIndex, currentIndex + itemsToShow)

  return (
    <section className="container py-12 md:py-16">
      <SectionHeader
        title="Auction Categories"
        description="Find the perfect auction to match your interests and highlights"
        showControls={true}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {visibleCategories.map((category) => (
          <CategoryCard key={category.id} icon={category.icon} title={category.title} href={category.href} />
        ))}
      </div>
    </section>
  )
}
