import { Button } from "@/components/ui/button"
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
  {
    id: 6,
    image: "/placeholder.svg?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$9,100",
    timeLeft: "6h 40m",
    badges: ["Exclusive"],
  },
  {
    id: 7,
    image: "/placeholder.svg?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$2,800",
    timeLeft: "8h 15m",
    badges: ["New"],
  },
  {
    id: 8,
    image: "/placeholder.svg?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$11,200",
    timeLeft: "1h 05m",
    badges: ["Premium"],
  },
]

export function LatestAuctionSection() {
  return (
    <section className="container py-12 md:py-16">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <SectionHeader title="Latest Auction" />
        <Button variant="outline" className="border-[#8a7357] text-[#8a7357]">
          Explore All
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {auctions.map((auction) => (
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
