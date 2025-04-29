"use client"

import { useState } from "react"
import { SectionHeader } from "@/components/section-header"
import { useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { AuctionCard } from "@/components/auction-card"

interface AuctionItem {
  _id: number;
  images: string[];
  title: string;
  currentBid: string;
  startTime : string;
  endTime: string;
  status?: string[];
  auctionId : string
}

export function LiveAuctionSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsToShow = 4

  //api calling here 
  const axiosInstance = useAxios();

  const {data : liveAuctionData = []} = useQuery({
    queryKey : ["live-auction"],
    queryFn : async () => {
      const {data} = await axiosInstance.get(`/auctions/get-live-auctions`);
      return data.data;
    }, 
  })

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : liveAuctionData.length - itemsToShow))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < liveAuctionData.length - itemsToShow ? prev + 1 : 0))
  }

  const visibleAuctions = liveAuctionData.slice(currentIndex, currentIndex + itemsToShow)

  console.log(visibleAuctions)

  return (
    <section className="container">
      <SectionHeader title="Live Auction" showControls={true} onPrev={handlePrev} onNext={handleNext} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visibleAuctions.map((auction : AuctionItem) => (
          <AuctionCard
            key={auction._id}
            image={auction.images[0]}
            title={auction.title}
            currentBid={auction.currentBid}
            startTime={auction.startTime}
            endTime={auction.endTime}
            auctionId={(auction._id).toString()}
            status={status}
          />
        ))}
      </div>
    </section>
  )
}
