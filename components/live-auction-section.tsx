"use client"

import { useState } from "react"
import { SectionHeader } from "@/components/section-header"
import { AuctionCard } from "@/components/auction-card"

const auctions = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$5,000",
    timeLeft: "2h 15m",
    badges: ["New", "Hot"],
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$3,200",
    timeLeft: "4h 30m",
    badges: ["Featured"],
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$7,800",
    timeLeft: "1h 45m",
    badges: ["Popular"],
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$4,500",
    timeLeft: "3h 20m",
    badges: ["Limited"],
  },
  {
    id: 5,
    image: "/placeholder.svg?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$6,300",
    timeLeft: "5h 10m",
    badges: ["Rare"],
  },
]

export function LiveAuctionSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsToShow = 4

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : auctions.length - itemsToShow))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < auctions.length - itemsToShow ? prev + 1 : 0))
  }

  const visibleAuctions = auctions.slice(currentIndex, currentIndex + itemsToShow)

  return (
    <section className="container py-12 md:py-16">
      <SectionHeader title="Live Auction" showControls={true} onPrev={handlePrev} onNext={handleNext} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visibleAuctions.map((auction) => (
          <AuctionCard
            key={auction.id}
            image={auction.image}
            title={auction.title}
            currentBid={auction.currentBid}
            timeLeft={auction.timeLeft}
            badges={auction.badges}
          />
        ))}
      </div>
    </section>
  )
}
