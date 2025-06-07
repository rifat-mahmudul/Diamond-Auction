"use client";

import Image from "next/image";
import { MoveLeft, MoveRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const testimonials = [
  {
    text: `This auction platform made it easy to register and start bidding right away. I've won several great items and the process was seamless from start to finish. Highly recommend for beginners and experienced bidders alike!`,
    name: "Sarah T.",
    role: "Verified Bidder",
    image: "/assets/hero.png",
  },
  {
    text: `Registering was quick and easy! I started bidding right away and even sold a few collectibles through their seller program. The mailing list keeps me informed about all the hottest auctions!`,
    name: "Michael R.",
    role: "Collector & Seller",
    image: "/assets/hero.png",
  },
  {
    text: "I was new to online auctions, but Diamond Auctions made me feel confident from day one. Their detailed listings, transparent bidding process, and secure payment system gave me peace of mind. I love receiving early access alerts through their mailing list—it helps me stay ahead of the competition! I highly recommend Diamond Auctions to anyone looking for a trustworthy, top-notch auction house.",
    name: "Michael R.",
    role: "First-Time Bidder",
    image: "/assets/hero.png",
  }

];

export function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const testimonial = testimonials[currentIndex];

  return (
    <section className="container mt-24">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-6">
        <div className="col-span-2">
          <h2 className="lg:mb-4 text-2xl lg:text-5xl font-bold tracking-tight">
            What does our client say?
          </h2>
        </div>

        <div className="col-span-4">
          <div className="relative mb-5 pl-6">
            <Quote className="absolute left-0 top-0 h-5 w-5 text-[#8a7357] rotate-180" />
            <p className="text-lg italic text-muted-foreground">{testimonial.text}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm lg:text-lg font-medium">{testimonial.name}</h4>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </div>

            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-[48px] w-[80px] rounded-sm border-[#645949]"
                onClick={handlePrev}
              >
                <MoveLeft className="h-4 w-4 -rotate-45" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-[48px] w-[80px] rounded-sm border-[#645949]"
                onClick={handleNext}
              >
                <MoveRight className="h-4 w-4 -rotate-45" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
