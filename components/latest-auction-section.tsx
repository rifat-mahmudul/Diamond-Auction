import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/section-header"
import { AuctionCard } from "@/components/auction-card"
import { MoveRight } from "lucide-react"

const auctions = [
  {
    id: 5,
    image: "/assets/CartImg.png?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$6,300",
    timeLeft: "5h 10m",
    badges: "live",
  },
  {
    id: 5,
    image: "/assets/CartImg.png?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$6,300",
    timeLeft: "5h 10m",
    badges: "live",
  },
  {
    id: 5,
    image: "/assets/CartImg.png?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$6,300",
    timeLeft: "5h 10m",
    badges: "live",
  },
  {
    id: 5,
    image: "/assets/CartImg.png?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$6,300",
    timeLeft: "5h 10m",
    badges: "live",
  },
  {
    id: 5,
    image: "/assets/CartImg.png?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$6,300",
    timeLeft: "5h 10m",
    badges: "live",
  },
  {
    id: 5,
    image: "/assets/CartImg.png?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$6,300",
    timeLeft: "5h 10m",
    badges: "live",
  },
  {
    id: 5,
    image: "/assets/CartImg.png?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$6,300",
    timeLeft: "5h 10m",
    badges: "live",
  },
  {
    id: 5,
    image: "/assets/CartImg.png?height=300&width=300",
    title: "Classic and timeless",
    currentBid: "$6,300",
    timeLeft: "5h 10m",
    badges: "live",
  },
]

export function LatestAuctionSection() {
  return (
    <section className="container mt-24">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <SectionHeader title="Latest Auction" />
        <Button className="bg-[#645949]">
          Explore All <MoveRight />
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
