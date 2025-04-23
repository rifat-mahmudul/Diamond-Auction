import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden mt-16">
      <div className="container grid items-center gap-6 py-12 md:grid-cols-2 md:py-16 lg:py-20">
        {/* card 1 */}
        <div className="flex flex-col relative">
          <div className=" z-20">
            <div className="text-[16px] border border-[#6459494D] w-[150px] text-center rounded-sm font-medium text-[#8a7357]">
              Bid Now & Win Big!
            </div>
            <h1 className="text-4xl text-[#645949] font-bold tracking-tight md:text-5xl lg:text-6xl my-6">
              Discover Exclusive Auctions for Luxury Own Your Dream
            </h1>
            <p className="text-[16px] text-[#595959]">
              Explore Exclusive Auctions and Bid on Premium Products. Win Big
              and Own the Luxury You Deserve!
            </p>
            <div className="flex flex-col gap-3 sm:flex-row mt-6">
              <Button className="bg-[#8a7357] hover:bg-[#6d5a44] text-white h-[51px] lg:w-[191px] text-[16px]">
                Register
              </Button>
              <Button
                variant="outline"
                className="border-[#8a7357] text-[#8a7357] h-[51px] lg:w-[191px] text-[16px]"
              >
                View current auctions
              </Button>
            </div>
          </div>

          <div>
            <Image
              src={"/assets/hero-union.png"}
              alt="hero union"
              width={493}
              height={112}
              className=" absolute top-8 right-0"
            />
          </div>
        </div>

        {/* card 2 */}
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
          </div>
        </div>
      </div>
    </section>
  );
}
