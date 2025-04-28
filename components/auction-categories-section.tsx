"use client"
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SectionHeader } from "./section-header";
import { CategoryCard } from "./category-card";


interface CategoryType {
  _id: string;
  name: string;
  image: string;
  auctions : object[]
}

export function AuctionCategoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 6;
  const axiosPublic = useAxios();

  const { data: allCategory = [] } = useQuery({
    queryKey: ["category-with-auctions"],
    queryFn: async () => {
      const { data } = await axiosPublic('/admin/categories/with-auctions');
      return data.data;
    }
  });

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : Math.max(allCategory.length - itemsToShow, 0)
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < allCategory.length - itemsToShow ? prev + 1 : 0
    );
  };

  const visibleCategories = allCategory.slice(
    currentIndex,
    currentIndex + itemsToShow
  );

  return (
    <section className="py-12 md:py-16 mt-24 bg-[#e4dcd0]">
      <div className="container">
        <SectionHeader
          title="Auction Categories"
          description="Browse the highlights Browse the highlights Browse the highlights"
          showControls={true}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {visibleCategories.map((category: CategoryType) => (
            <CategoryCard
              key={category._id}
              icon={category.image}
              title={category.name}
              auctions={category.auctions}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
