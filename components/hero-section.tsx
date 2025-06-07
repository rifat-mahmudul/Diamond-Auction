"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import type { Auction } from "@/app/wishlist/_components/type"

export function HeroSection() {
  const { data: auctionItems } = useQuery({
    queryKey: ["auctions"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auctions/get-all-auctions?status=active`)
      return res.json()
    },
    select: (responseData) => responseData?.data.slice(0, 3),
  })

  console.log(auctionItems)

  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const { status } = useSession()

  useEffect(() => {
    if (!api) {
      return
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const handleRadioChange = (value: string) => {
    const index = auctionItems?.findIndex((item: Auction) => item._id === value)
    if (index >= 0 && api) {
      api.scrollTo(index)
    }
  }

  // Get the current item's ID based on the carousel position
  const currentItemId = auctionItems?.[current]?._id || ""

  return (
    <section className="relative w-full overflow-hidden mt-16">
      <div className="container grid items-center gap-6 py-12 grid-cols-1 lg:grid-cols-2 md:py-16 lg:py-20">
        {/* Left Content */}
        <div className="flex flex-col relative">
          <div className="z-20">
            <div className="text-[16px] border border-[#6459494D] w-[150px] text-center rounded-sm font-medium text-[#8a7357]">
              Bid Now & Win Big!
            </div>
            <h1 className="text-4xl text-[#645949] font-bold tracking-tight md:text-5xl lg:text-7xl my-6">
              Bid Boldly. Win Brilliantly. Shine Bright!
            </h1>
            <p className="text-[16px] text-[#595959]">
              Explore Exclusive Auctions and Bid on Premium Products.Win Big and Own the Luxury You Deserve!
            </p>
            <div className="flex gap-4 mt-4">
              {status !== "authenticated" && (
                <Link href="/sign-up">
                  <Button className="bg-[#8a7357] hover:bg-[#6d5a44] text-white h-[51px] lg:w-[191px] text-[16px]">
                    Register
                  </Button>
                </Link>
              )}

              <Link href="/auctions">
                <Button variant="outline" className="border-[#8a7357] text-[#8a7357] h-[51px] lg:w-[191px] text-[16px]">
                  View current auctions
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <Image
              src={"/assets/hero-union.png"}
              alt="hero union"
              width={493}
              height={112}
              className="absolute top-8 right-0"
            />
          </div>
        </div>

        {/* Right Carousel */}
        <div className="relative w-full h-[400px] lg:h-[550px]">
          <Carousel className="w-full h-full bg-[#64594933] p-2" setApi={setApi}>
            <CarouselContent className="h-full">
              {auctionItems?.map((item: Auction) => (
                <CarouselItem key={item._id} className="h-full p-0">
                  <div className="relative w-full h-full overflow-hidden">
                    <Link href={`/auctions/${item._id}`}>
                      <Image
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        width={500}
                        height={500}
                        className="object-cover w-[500px] h-[380px] md:w-full lg:w-[600px] lg:h-[530px] cursor-pointer"
                        priority
                      />
                      {/* Text overlay matching the design */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-[#bbac98] backdrop-blur-lg">
                        <div className="space-y-2">
                          <p className="text-lg leading-tight font-medium">{item.title}</p>
                          <p className="text-sm opacity-80">
                            {typeof item.seller === "object" ? item.seller.username : item.seller}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Radio Button Controls */}
          <div className="absolute bottom-6 right-6 z-20">
            <RadioGroup value={currentItemId} className="flex gap-4" onValueChange={handleRadioChange}>
              {auctionItems?.map((item: Auction) => (
                <div key={item._id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={item._id}
                    id={item._id}
                    className="h-3 w-3 border-2 border-white/60 bg-transparent data-[state=checked]:bg-white data-[state=checked]:border-white [&>span]:hidden"
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </section>
  )
}
