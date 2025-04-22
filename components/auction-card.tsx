import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AuctionCardProps {
  image: string
  title: string
  currentBid?: string
  timeLeft?: string
  badges?: string[]
}

export function AuctionCard({ image, title, currentBid, timeLeft, badges = [] }: AuctionCardProps) {
  return (
    <Card className="overflow-hidden border-none bg-[#f5f0e8]">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={300}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {badges && badges.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="bg-black/70 text-white">
                {badge}
              </Badge>
            ))}
          </div>
        )}
        {timeLeft && (
          <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white">{timeLeft}</div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium">{title}</h3>
        {currentBid && <p className="text-sm text-muted-foreground">Current bid: {currentBid}</p>}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full border-[#8a7357] text-[#8a7357]">
          Bid now
        </Button>
      </CardFooter>
    </Card>
  )
}
