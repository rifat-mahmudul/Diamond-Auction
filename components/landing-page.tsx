"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Preload hero image
    const img = typeof window !== "undefined" ? new window.Image() : null;
    if (img) {
      img.src = "/assets/ggb.jpg";
    }
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  if (!mounted)
    return (
      <div className="min-h-screen">
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      </div>
    );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-white text-center px-4 overflow-hidden">
        {/* Background Image with priority loading */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/assets/ggb.jpg"
            alt="Golden Gate Bridge"
            fill
            priority
            quality={85}
            className="object-cover"
          />
        </div>

        {/* Overlay with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 z-0"></div>

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="z-10"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2"
            style={{ textShadow: "0 2px 5px rgba(0,0,0,0.7)" }}
          >
            Rooted in San Francisco. Trusted Nationwide.
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl mb-8"
            style={{ textShadow: "0 2px 3px rgba(0,0,0,0.7)" }}
          >
            Estate & Asset Liquidation Specialists with a Local Legacy
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link href="/about-us">
              <Button className="bg-[#6b5d4d] hover:bg-[#5a4d3d] text-white px-6 py-3 rounded font-bold transition-transform hover:scale-105">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <motion.section
        id="about"
        className="py-16 px-4 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          About Us
        </motion.h2>
        <motion.p
          className="text-lg text-gray-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Diamond Auctions LLC is a full-service estate liquidation company
          proudly based in San Francisco. With a deep understanding of Bay Area
          history, culture, and clientele, we bring precision and integrity to
          every sale—from fine art to full estates.
        </motion.p>
      </motion.section>

      {/* Services Section */}
      <motion.section
        id="services"
        className="py-16 px-4 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Our Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            title="Estate Sales & Liquidation"
            description="We handle everything from cleanouts to private sales with professionalism and care."
            delay={0}
          />
          <ServiceCard
            title="Appraisal Services"
            description="Certified appraisals for probate, divorce, insurance, or resale across diverse asset types."
            delay={0.1}
          />
          <ServiceCard
            title="Auction Representation"
            description="Showcasing select pieces to global bidders via LiveAuctioneers, Invaluable, and more."
            delay={0.2}
          />
        </div>
      </motion.section>

      {/* San Francisco Story Section */}
      <motion.section
        id="sf"
        className="py-16 px-4 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Our San Francisco Story
        </motion.h2>
        <motion.p
          className="text-lg text-gray-700 mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          We&apos;re proud to call the City by the Bay our home. Our team brings
          insider knowledge of San Francisco&apos;s neighborhoods, collectors,
          and real estate dynamics to every estate consultation and sale. This
          local insight ensures maximum value for our clients.
        </motion.p>
        <motion.p
          className="text-lg text-gray-700"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Over the years, our reach has grown far beyond the Bay Area. Through
          our robust online auction platform and partnerships with major bidding
          sites like LiveAuctioneers and Invaluable, we now connect with buyers
          and collectors across the globe. Our worldwide presence allows us to
          showcase unique estate treasures to an international audience,
          maximizing exposure and sale potential for every item we handle. From
          San Francisco to Singapore, our clients benefit from both hometown
          expertise and global market access.
        </motion.p>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-16 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            What Our Clients Say
          </motion.h2>

          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/1">
                  <motion.div
                    className="p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="bg-[#C8B291] text-white p-6 rounded-lg shadow-md relative">
                      <Quote className="h-8 w-8 text-[#e63946] opacity-50 absolute top-4 left-4" />
                      <div className="pl-10 pt-4">
                        <p className="text-lg italic mb-4">
                          {testimonial.text}
                        </p>
                        <p className="font-semibold">
                          – {testimonial.name}, {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="py-16 px-4 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Contact Us
        </motion.h2>
        <motion.p
          className="text-lg text-gray-700 mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Ready to get started? Reach out today to schedule a free estate
          consultation or appraisal appointment.
        </motion.p>
        <motion.p
          className="text-lg font-semibold"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Email: info@diamondauctionsllc.com
          <br />
          Phone: (415) 625-4540
        </motion.p>
      </motion.section>
    </div>
  );
}

// Service Card Component with animation
type ServiceCardProps = {
  title: string;
  description: string;
  delay?: number;
};

function ServiceCard({ title, description, delay = 0 }: ServiceCardProps) {
  return (
    <motion.div
      className="bg-[#C8B291] text-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{
        scale: 1.03,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="">{description}</p>
    </motion.div>
  );
}
