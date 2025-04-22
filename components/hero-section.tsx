import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="container grid items-center gap-6 py-12 md:grid-cols-2 md:py-16 lg:py-20">
        <div className="flex flex-col gap-4">
          <div className="text-sm font-medium text-[#8a7357]">
            Auction & Bid Tag
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Discover Exclusive Auctions for Luxury
          </h1>
          <p className="text-xl text-muted-foreground">Own Your Dream</p>
          <p className="text-sm text-muted-foreground">
            Starting a journey to find the perfect luxury item for your
            collection
          </p>
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button className="bg-[#8a7357] hover:bg-[#6d5a44] text-white">
              Explore
            </Button>
            <Button
              variant="outline"
              className="border-[#8a7357] text-[#8a7357]"
            >
              Create account
            </Button>
          </div>
        </div>
        <div className="relative aspect-square md:aspect-auto">
          <div className="relative h-full w-full overflow-hidden rounded-lg">
            <Image
              src="/assets/hero.png"
              alt="Luxury Diamond"
              width={600}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-white">
              <p className="text-sm">
                Take your luck to the Beyond — Auction live in 2 days
              </p>
              <p className="text-xs opacity-80">Paris</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
