"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuctionCard } from '../auction-card';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface AuctionItem {
  _id: number;
  images: string[];
  title: string;
  currentBid: string;
  timeLeft: string;
  badges?: string[];
}

interface Category {
  _id: number;
  name: string;
}

const carratWeight = [
  { id: 1, value: { low: 0, high: 0.50 }, label: 'Under 0.50' },
  { id: 2, value: { low: 0.50, high: 1.00 }, label: '0.50 - 1.00' },
  { id: 3, value: { low: 1.00, high: 2.00 }, label: '1.00 - 2.00' },
  { id: 4, value: { low: 2.00, high: 3.00 }, label: '2.00 - 3.00' },
  { id: 5, value: { low: 3.00, high: 10000 }, label: '3.00+ Carats' },
].map(item => ({
  ...item,
  value: `${item.value.low.toFixed(2)}-${item.value.high.toFixed(2)}`,
}));

const salesTypes = [
  { value: 'upcoming', label: 'upcoming' },
  { value: 'latest', label: 'latest' },
  { value: 'live-auction', label: 'live-auction' },
  { value: 'popular', label: 'popular' },
  { value: 'highest-bidding', label: 'highest-bidding' },
];

export default function AllAuction() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('allday');
  const [selectedCaratRange, setSelectedCaratRange] = useState<string | undefined>(undefined);
  const [selectedSalesType, setSelectedSalesType] = useState<string | undefined>(undefined);

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  // Fetch categories
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/admin/categories/with-auctions`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBiMDMxOGJhZTMxMjljYzlmNWUyYzYiLCJpYXQiOjE3NDU1NTIxNzcsImV4cCI6MTc0NjE1Njk3N30.BTfUHFU6SD9xKkGJATNyvNQS92Ij-TnVHyGHkr7mma0`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
      return res.json();
    },
    select: (responseData) => responseData.data,
  });

  // Fetch auctions with all filters including time range
  const {
    data: filteredAuctions,
    isLoading: isAuctionsLoading,
    isError: isAuctionsError,
    error: auctionsError,
  } = useQuery({
    queryKey: ['auctions', debouncedSearchQuery, selectedCategory, selectedTimeRange, selectedCaratRange, selectedSalesType],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const queryParams = new URLSearchParams();

      // Add all filter parameters
      if (debouncedSearchQuery) queryParams.set('searchQuery', debouncedSearchQuery);
      if (selectedCategory) queryParams.set('category', selectedCategory);
      if (selectedCaratRange) queryParams.set('caratWeight', selectedCaratRange);
      if (selectedSalesType) queryParams.set('typeOfSales', selectedSalesType);

      // Add time range parameter
      if (selectedTimeRange !== 'allday') {
        queryParams.set('timeRange', selectedTimeRange);
      }

      const url = `${baseUrl}/auctions/search?${queryParams.toString()}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBiMDMxOGJhZTMxMjljYzlmNWUyYzYiLCJpYXQiOjE3NDU1NTIxNzcsImV4cCI6MTc0NjE1Njk3N30.BTfUHFU6SD9xKkGJATNyvNQS92Ij-TnVHyGHkr7mma0`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch auctions: ${res.statusText}`);
      return res.json();
    },
    select: (responseData) => responseData.data ?? responseData.auctions ?? [],
  });

  // Handlers
  const handleCategoryChange = (categoryName: string, isChecked: boolean) => {
    setSelectedCategory(isChecked ? categoryName : '');
  };

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
  };

  const handleCaratRangeChange = (value: string) => {
    setSelectedCaratRange(value);
  };

  const handleSalesTypeChange = (value: string) => {
    setSelectedSalesType(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTimeRange('allday');
    setSelectedCaratRange(undefined);
    setSelectedSalesType(undefined);
  };

  // Loading state
  if (isAuctionsLoading || isCategoriesLoading) {
    return (
      <section className="py-12">
        <div className="text-center pb-10">
          <h2 className="text-[40px] text-[#645949] font-bold">All Auction</h2>
        </div>
        <div className="grid grid-cols-10 gap-10">
          <div className="col-span-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse h-64 rounded-md"></div>
              ))}
            </div>
          </div>
          <div className="col-span-3">
            <div className="flex flex-col gap-5 p-5 rounded-md bg-[#DFC5A2]">
              <div className="bg-gray-200 animate-pulse h-10 rounded-md"></div>
              <div className="bg-gray-200 animate-pulse h-40 rounded-md"></div>
              <div className="bg-gray-200 animate-pulse h-10 rounded-md"></div>
              <div className="bg-gray-200 animate-pulse h-40 rounded-md"></div>
              <div className="bg-gray-200 animate-pulse h-40 rounded-md"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isAuctionsError || isCategoriesError) {
    return (
      <section className="py-12">
        <div className="text-center pb-10">
          <h2 className="text-[40px] text-[#645949] font-bold">All Auction</h2>
        </div>
        <p className="text-red-500 text-center">
          {isAuctionsError && isCategoriesError
            ? `Error fetching auctions and categories: ${auctionsError?.message} / ${categoriesError?.message}`
            : isAuctionsError
              ? `Error fetching auctions: ${auctionsError?.message}`
              : `Error fetching categories: ${categoriesError?.message}`}
        </p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="text-center pb-10">
        <h2 className="text-[40px] text-[#645949] font-bold">All Auction</h2>
      </div>

      <div className="grid grid-cols-10 gap-10">
        <div className="col-span-7">
          {filteredAuctions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-[#645949]">No auctions found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-[#645949] text-white rounded-md hover:bg-[#534738] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {filteredAuctions.map((auction: AuctionItem) => (
                <AuctionCard
                  key={auction._id}
                  image={auction.images[0]}
                  title={auction.title}
                  currentBid={auction.currentBid}
                  timeLeft={auction.timeLeft}
                  auctionId={(auction._id).toString()}
                  startTime=''
                  endTime=''
                />
              ))}
            </div>
          )}
        </div>

        <div className="col-span-3">
          <div className="flex flex-col gap-5 p-5 rounded-md bg-[#DFC5A2]">
            {/* Search Input */}
            <div className="relative">
              <Input
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="text-[#645949] border-[#645949]"
                placeholder="Search by title, description..."
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4" />
            </div>

            {/* Category List */}
            <div>
              <h4 className="text-xl font-medium text-[#000000] pb-4">Category</h4>
              <ul className='space-y-3'>
                {categories?.map((category: Category) => (
                  <li key={category._id} className='flex items-center gap-1'>
                    <Checkbox
                      id={`category-${category._id}`}
                      checked={selectedCategory === category.name}
                      onCheckedChange={(checked) => handleCategoryChange(category.name, !!checked)}
                    />
                    <label
                      htmlFor={`category-${category._id}`}
                      className="text-base text-[#645949] font-medium capitalize cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Time Range Filter */}
            <div className="">
              <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-full border-[#645949]">
                  <SelectValue placeholder="All Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="allday">All day</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Carat Weight Filter */}
            <div className="space-y-3">
              <h4 className="text-xl font-medium text-[#000000] pb-1">Carat Weight</h4>
              <RadioGroup value={selectedCaratRange} onValueChange={handleCaratRangeChange}>
                {carratWeight.map((carrat) => (
                  <div key={carrat.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={carrat.value}
                      id={`carratweight-${carrat.id}`}
                    />
                    <Label
                      htmlFor={`carratweight-${carrat.id}`}
                      className="text-base text-[#645949] font-medium capitalize cursor-pointer"
                    >
                      {carrat.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Sales Type Filter */}
            <div className="space-y-3">
              <h4 className="text-xl font-medium text-[#000000] pb-1">Type Of Sales</h4>
              <RadioGroup value={selectedSalesType} onValueChange={handleSalesTypeChange}>
                {salesTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={`sales-type-${type.value}`} />
                    <Label
                      htmlFor={`sales-type-${type.value}`}
                      className="text-base text-[#645949] font-medium capitalize cursor-pointer"
                    >
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="w-full py-2 bg-[#645949] text-white rounded-md hover:bg-[#534738] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}