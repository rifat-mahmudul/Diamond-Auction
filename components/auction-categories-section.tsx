"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { CategoryCard } from "@/components/category-card";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";

const categories = [
  {
    id: 1,
    title: "Jewelry",
    icon: "/assets/Rectangle.png",
    href: "/category/jewelry",
  },
  {
    id: 2,
    title: "Watches",
    icon: "/assets/Rectangle.png",
    href: "/category/watches",
  },
  {
    id: 3,
    title: "Estates",
    icon: "/assets/Rectangle.png",
    href: "/category/estates",
  },
  {
    id: 4,
    title: "Antiques",
    icon: "/assets/Rectangle.png",
    href: "/category/antiques",
  },
  {
    id: 5,
    title: "Fine Art",
    icon: "/assets/Rectangle.png",
    href: "/category/fine-art",
  },
  {
    id: 6,
    title: "Vintage Cars",
    icon: "/assets/Rectangle.png",
    href: "/category/vintage-cars",
  },
  {
    id: 7,
    title: "Collectibles",
    icon: "/assets/Rectangle.png",
    href: "/category/collectibles",
  },
  {
    id: 8,
    title: "Luxury Items",
    icon: "/assets/Rectangle.png",
    href: "/category/luxury-items",
  },
];

export function AuctionCategoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 6;

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : categories.length - itemsToShow
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < categories.length - itemsToShow ? prev + 1 : 0
    );
  };

  const visibleCategories = categories.slice(
    currentIndex,
    currentIndex + itemsToShow
  );

  const axiosPublic = useAxios();

  const {data : allCategory = [] } = useQuery({
    queryKey : ["category-with-auctions"],
    queryFn : async () => {
      const {data} = await axiosPublic('/admin/categories/with-auctions');
      return data.data;
    }
  })

  console.log(allCategory)

  return (
 <section className=" py-12 md:py-16 mt-24 bg-[#e4dcd0]">
      <div
      className=" container"
      >
        <SectionHeader
          title="Auction Categories"
          description="Browse the highlights Browse the highlights Browse the highlights"
          showControls={true}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {visibleCategories.map((category) => (
            <CategoryCard
              key={category.id}
              icon={category.icon}
              title={category.title}
              href={category.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
