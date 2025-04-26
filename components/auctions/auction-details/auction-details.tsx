"use client"

import { useState } from "react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Heart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import AuctionCountdown from "./auction-countdown"
import { formatCurrency } from "@/lib/format"
import AuctionImageGallery from "./auction-image-gallery"
import BidHistory from "./bid-history"

interface AuctionDetailsProps {
    auctionId: string
}

export default function AuctionDetails({ auctionId }: AuctionDetailsProps) {
    const [bidAmount, setBidAmount] = useState<string>("")
    const [activeTab, setActiveTab] = useState<string>("description")
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    // Fetch auction details
    const { data: auctionData, isLoading: isLoadingAuction } = useQuery({
        queryKey: ["auction", auctionId],
        queryFn: async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auctions/get-auction/${auctionId}`,
                {
                    headers: {
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBiMDMxOGJhZTMxMjljYzlmNWUyYzYiLCJpYXQiOjE3NDU2Mzc4NzksImV4cCI6MTc0NjI0MjY3OX0.zLPAwxo0f0NFPuS-PkjIVL73cII6FFAmEY-aDmmE7po`,
                    },
                }
            )
            if (!response.ok) {
                throw new Error("Failed to fetch auction details")
            }
            return response.json()
        },
    })

    const auction = auctionData?.data?.auction

    // Calculate time remaining
    const now = new Date()
    const endTime = auction ? new Date(auction.endTime) : null
    const isAuctionEnded = endTime ? now > endTime : false

    // Handle bid increment/decrement
    const handleIncrement = () => {
        if (!auction) return
        const currentValue = bidAmount ? Number.parseFloat(bidAmount) : auction.currentBid
        setBidAmount((currentValue + auction.bidIncrement).toString())
    }

    const handleDecrement = () => {
        if (!auction) return
        const currentValue = bidAmount ? Number.parseFloat(bidAmount) : auction.currentBid
        const newValue = Math.max(currentValue - auction.bidIncrement, auction.currentBid)
        setBidAmount(newValue.toString())
    }

    const handleBid = () => {
        // Implement bid submission logic here
        console.log("Placing bid:", bidAmount)
    }

    if (isLoadingAuction || !auction) {
        return <div>Loading auction details...</div>
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                        <Image
                            src={auction.images[selectedImageIndex] || "/placeholder.svg"}
                            alt={auction.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <AuctionImageGallery
                        images={auction.images}
                        selectedIndex={selectedImageIndex}
                        onSelect={setSelectedImageIndex}
                    />
                </div>

                {/* Auction Details */}
                <div className="space-y-4">
                    <div>
                        <p className="text-lg font-medium text-[#645949] pb-6">SKU #{auction.sku}</p>
                        <div className="flex justify-between items-center pb-6">
                            <h1 className="text-[40px] font-bold inline-block">{auction.title}</h1>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <p className="text-base text-[#645949] pb-10">
                        {auction.description}
                    </p>

                    <div className="space-y-1 text-[#645949] pb-6">
                        <p className="text-base pb-2">Current bid:</p>
                        <p className="text-2xl font-semibold">{formatCurrency(auction.currentBid)}</p>
                    </div>

                    {!isAuctionEnded && (
                        <div className="text-[#645949]">
                            <div>
                                <p className="text-sm font-medium mb-3">Time left:</p>
                                <AuctionCountdown endTime={auction.endTime} />
                            </div>

                            <div className="space-y-3 text-[#645949] pb-6">
                                <p className="text-base">Auction ends: {format(new Date(auction.endTime), "MMM d, yyyy h:mm a")}</p>
                                <p className="text-base">Timezone: UTC {new Date().getTimezoneOffset() === 0 ? "0" : ""}</p>
                            </div>

                            <div className="space-y-6">
                                <p className="text-base font-medium">
                                    {auction.reserveMet ? "Reserve price has been met" : "Reserve price not met"}
                                </p>
                                <p className="text-xs pb-2 text-muted-foreground">
                                    (Enter more than or equal to: {formatCurrency(auction.currentBid)})
                                </p>
                            </div>

                            <div className="flex justify-between items-center space-x-2">
                                <div className="w-2/3 flex justify-between items-center space-x-2">
                                    <Button variant="outline" size="icon" onClick={handleDecrement} disabled={!auction} className="text-white w-12 bg-[#645949] hover:bg-[#645949]/90">
                                        <Minus className="h-6 w-6" />
                                    </Button>
                                    <Input
                                        type="text"
                                        value={bidAmount || ""}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        placeholder={auction ? auction.currentBid.toString() : ""}
                                        className="text-center"
                                    />
                                    <Button variant="outline" size="icon" onClick={handleIncrement} disabled={!auction} className="text-white w-12 bg-[#645949] hover:bg-[#645949]/90">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button
                                    className="text-white w-52 bg-[#645949] hover:bg-[#645949]/90"
                                    onClick={handleBid}
                                    disabled={!bidAmount || Number.parseFloat(bidAmount) <= auction.currentBid}
                                >
                                    Bid
                                </Button>
                            </div>
                        </div>
                    )}

                    {isAuctionEnded && (
                        <div className="p-4 bg-muted rounded-md">
                            <p className="font-medium">This auction has ended</p>
                            {auction.winner === auction.seller._id ? (
                                <p>YOU WON the bid: {formatCurrency(auction.currentBid)}</p>
                            ) : (
                                <p>Final bid: {formatCurrency(auction.currentBid)}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="border-b rounded-none w-full bg-transparent justify-start h-auto p-0">
                    <TabsTrigger
                        value="description"
                        className={cn(
                            "rounded-none data-[state=active]:shadow-none py-2.5 px-4",
                            activeTab === "description" ? "font-medium" : "",
                        )}
                    >
                        Description
                    </TabsTrigger>
                    <TabsTrigger
                        value="bidHistory"
                        className={cn(
                            "rounded-none data-[state=active]:shadow-none py-2.5 px-4",
                            activeTab === "bidHistory" ? "font-medium" : "",
                        )}
                    >
                        Bid History
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">{auction.title}: The Most Precious</h2>
                        <p className="text-sm">{auction.description}</p>

                        <div className="space-y-2">
                            <h3 className="font-medium">Key Features:</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li>
                                    <span className="font-medium">Rare & Unique:</span> Unlike classic white diamonds, this diamond
                                    features a deep, opaque luster, giving it a bold and captivating presence.
                                </li>
                                <li>
                                    <span className="font-medium">Natural Beauty:</span> Formed over millions of years, each diamond
                                    showcases distinct inclusions and characteristics, adding to its authenticity.
                                </li>
                                <li>
                                    <span className="font-medium">Durable & Timeless:</span> Ranking high on the Mohs hardness scale,
                                    diamonds are exceptionally strong, ensuring long-lasting brilliance.
                                </li>
                                <li>
                                    <span className="font-medium">Versatile Elegance:</span> Perfect for rings, necklaces, bracelets, and
                                    statement jewelry pieces, diamonds complement both classic and modern styles.
                                </li>
                                <li>
                                    <span className="font-medium">Symbol of Strength:</span> Representing power, mystery, and
                                    sophistication, diamonds make a meaningful and unforgettable choice.
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-medium">Care & Maintenance:</h3>
                            <p className="text-sm">
                                To preserve its beauty, clean your diamond with a soft cloth and mild soap. Avoid harsh chemicals and
                                store separately to prevent scratches. PLEASE NOTE: As a natural gemstone, each diamond varies in tone
                                and inclusions, making every piece one-of-a-kind.
                            </p>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="bidHistory" className="pt-4">
                    <BidHistory auctionId={auctionId} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
