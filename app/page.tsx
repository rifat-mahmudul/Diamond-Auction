"use client";
// import { HeroSection } from "@/components/hero-section"
// import { LiveAuctionSection } from "@/Shared/live-auction-section"
// import { AuctionCategoriesSection } from "@/components/auction-categories-section"
// import { HowItWorksSection } from "@/components/how-it-works-section"
// import { FaqSection } from "@/components/faq-section"
// import { ArticlesSection } from "@/components/articles-section"
// import { TestimonialSection } from "@/components/testimonial-section"

// export default function Home() {
//   return (
//     <div className="bg-[#f5f0e8]">
//       <HeroSection />
//       <LiveAuctionSection />
//       <AuctionCategoriesSection />
//       <HowItWorksSection />
//       <LatestAuctionSection />
//       <FaqSection />
//       <ArticlesSection />
//       <TestimonialSection />
//     </div>
//   )
// }

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const testimonials = [
    {
      text: "Diamond Auctions was a dream to work with—knowledgeable, efficient, and respectful. They helped us handle a difficult estate with grace.",
      name: "S. L.",
      location: "Nob Hill",
    },
    {
      text: "Their understanding of San Francisco's art and antique market gave our collection the visibility it deserved.",
      name: "M. C.",
      location: "Mission District",
    },
    {
      text: "I was impressed by their global reach. My grandmother's antique collection found buyers from three different continents!",
      name: "J. P.",
      location: "Pacific Heights",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}

      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center flex flex-col justify-center items-center text-white text-center px-4"
        style={{
          backgroundImage: "url('/assets/ggb.jpg')",
          textShadow: "0 2px 5px rgba(0,0,0,0.7)",
        }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
          Rooted in San Francisco. Trusted Nationwide.
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Estate & Asset Liquidation Specialists with a Local Legacy
        </p>
        <Link href="/about-us">
          <Button className="bg-[#6b5d4d] hover:bg-[#5a4d3d] text-white px-6 py-3 rounded font-bold">
            Learn More
          </Button>
        </Link>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">About Us</h2>
        <p className="text-lg text-gray-700">
          Diamond Auctions LLC is a full-service estate liquidation company
          proudly based in San Francisco. With a deep understanding of Bay Area
          history, culture, and clientele, we bring precision and integrity to
          every sale—from fine art to full estates.
        </p>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#C8B291] text-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">
              Estate Sales & Liquidation
            </h3>
            <p className="">
              We handle everything from cleanouts to private sales with
              professionalism and care.
            </p>
          </div>
          <div className="bg-[#C8B291] text-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Appraisal Services</h3>
            <p className="">
              Certified appraisals for probate, divorce, insurance, or resale
              across diverse asset types.
            </p>
          </div>
          <div className="bg-[#C8B291] text-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Auction Representation</h3>
            <p className="">
              Showcasing select pieces to global bidders via LiveAuctioneers,
              Invaluable, and more.
            </p>
          </div>
        </div>
      </section>

      {/* San Francisco Story Section */}
      <section id="sf" className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Our San Francisco Story
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          We&apos;re proud to call the City by the Bay our home. Our team brings
          insider knowledge of San Francisco&apos;s neighborhoods, collectors, and
          real estate dynamics to every estate consultation and sale. This local
          insight ensures maximum value for our clients.
        </p>
        <p className="text-lg text-gray-700">
          Over the years, our reach has grown far beyond the Bay Area. Through
          our robust online auction platform and partnerships with major bidding
          sites like LiveAuctioneers and Invaluable, we now connect with buyers
          and collectors across the globe. Our worldwide presence allows us to
          showcase unique estate treasures to an international audience,
          maximizing exposure and sale potential for every item we handle. From
          San Francisco to Singapore, our clients benefit from both hometown
          expertise and global market access.
        </p>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            What Our Clients Say
          </h2>

          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/1">
                  <div className="p-4">
                    <div className="bg-[#C8B291] text-white p-6 rounded-lg shadow-md relative">
                      <Quote className="h-8 w-8 text-[#e63946] opacity-50 absolute top-4 left-4" />
                      <div className="pl-10 pt-4">
                        <p className="text-lg italic  mb-4">
                          {testimonial.text}
                        </p>
                        <p className="font-semibold">
                          – {testimonial.name}, {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h2>
        <p className="text-lg text-gray-700 mb-4">
          Ready to get started? Reach out today to schedule a free estate
          consultation or appraisal appointment.
        </p>
        <p className="text-lg font-semibold">
          Email: info@diamondauctionsllc.com
          <br />
          Phone: (415) 625-4540
        </p>
      </section>
    </div>
  );
}
