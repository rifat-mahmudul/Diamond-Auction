"use client"

import { useQuery } from "@tanstack/react-query"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { AuctionCard } from "../auction-card"

interface AuctionCategory {
    name: string
}

export default function RelatedAuction({ name }: AuctionCategory) {
    const {
        data: relatedAuctions,
        status,
        error: errorRelatedAuctions,
    } = useQuery({
        queryKey: ["relatedAuctions"],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auctions/related-auctions?category=${name}`, {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBiMDMxOGJhZTMxMjljYzlmNWUyYzYiLCJpYXQiOjE3NDU2Mzc4NzksImV4cCI6MTc0NjI0MjY3OX0.zLPAwxo0f0NFPuS-PkjIVL73cII6FFAmEY-aDmmE7po`,
                },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to fetch auction details")
            }

            return response.json()
        },
        select: (responseData) => responseData?.data,
    })

    if (errorRelatedAuctions) {
        return <div>Error: {errorRelatedAuctions.message}</div>
    }

    return (
        <div className="pt-10 bg-[#f8f5f0] px-8 py-12">
            <div className="pb-10">
                <h2 className="text-3xl md:text-5xl font-bold">Related Products</h2>
            </div>

            <div className="relative">
                <Carousel
                    opts={{
                        align: "start",
                        slidesToScroll: 1,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {relatedAuctions?.map((auction: any) => (
                            <CarouselItem key={auction._id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                                <AuctionCard
                                    image={auction.images[0]}
                                    title={auction.title}
                                    currentBid={auction.currentBid}
                                    timeLeft={auction.timeLeft}
                                    badges={auction.badges}
                                    auctionId={auction._id}
                                    startTime=""
                                    endTime=""
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-[92%] -top-16 bg-[#5d5749] hover:bg-[#4a4539] text-white border-none h-10 w-10 rounded-full" />
                    <CarouselNext className="absolute right-2 -top-16 transform -translate-y-1/2 bg-[#5d5749] hover:bg-[#4a4539] text-white border-none h-10 w-10 rounded-full" />
                </Carousel>
            </div>
        </div >
    )
}
