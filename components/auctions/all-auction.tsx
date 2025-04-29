"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { AuctionCard } from "../auction-card"
import { Input } from "../ui/input"
import { Menu, Search } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface AuctionItem {
  _id: number
  images: string[]
  title: string
  currentBid: string
  startTime: string
  endTime: string
  badges?: string[]
}

interface Category {
  _id: number
  name: string
}

const carratWeight = [
  { id: 1, value: { low: 0, high: 0.5 }, label: "Under 0.50" },
  { id: 2, value: { low: 0.5, high: 1.0 }, label: "0.50 - 1.00" },
  { id: 3, value: { low: 1.0, high: 2.0 }, label: "1.00 - 2.00" },
  { id: 4, value: { low: 2.0, high: 3.0 }, label: "2.00 - 3.00" },
  { id: 5, value: { low: 3.0, high: 10000 }, label: "3.00+ Carats" },
].map((item) => ({
  ...item,
  value: `${item.value.low.toFixed(2)}-${item.value.high.toFixed(2)}`,
}))

const salesTypes = [
  { value: "upcoming", label: "upcoming" },
  { value: "latest", label: "latest" },
  { value: "live-auction", label: "live-auction" },
  { value: "popular", label: "popular" },
  { value: "highest-bidding", label: "highest-bidding" },
]

export default function AllAuction() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTimeRange, setSelectedTimeRange] = useState("allday")
  const [selectedCaratRange, setSelectedCaratRange] = useState<string | undefined>(undefined)
  const [selectedSalesType, setSelectedSalesType] = useState<string | undefined>(undefined)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchQuery])

  // Close drawer when any filter is applied
  useEffect(() => {
    if (isDrawerOpen) {
      setIsDrawerOpen(true)
    }
  }, [debouncedSearchQuery, selectedCategory, selectedTimeRange, selectedCaratRange, selectedSalesType, isDrawerOpen])

  // Fetch categories
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      const res = await fetch(`${baseUrl}/admin/categories/with-auctions`)
      if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`)
      return res.json()
    },
    select: (responseData) => responseData.data,
  })

  // Fetch auctions with all filters including time range
  const {
    data: filteredAuctions,
    isLoading: isAuctionsLoading,
    isError: isAuctionsError,
    error: auctionsError,
  } = useQuery({
    queryKey: [
      "auctions",
      debouncedSearchQuery,
      selectedCategory,
      selectedTimeRange,
      selectedCaratRange,
      selectedSalesType,
    ],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      const queryParams = new URLSearchParams()

      // Add all filter parameters
      if (debouncedSearchQuery) queryParams.set("searchQuery", debouncedSearchQuery)
      if (selectedCategory) queryParams.set("category", selectedCategory)
      if (selectedCaratRange) queryParams.set("caratWeight", selectedCaratRange)
      if (selectedSalesType) queryParams.set("typeOfSales", selectedSalesType)

      // Add time range parameter
      if (selectedTimeRange !== "allday") {
        queryParams.set("timeRange", selectedTimeRange)
      }

      const url = `${baseUrl}/auctions/search?${queryParams.toString()}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed to fetch auctions: ${res.statusText}`)
      return res.json()
    },
    select: (responseData) => responseData.data ?? responseData.auctions ?? [],
  })

  // Handlers
  const handleCategoryChange = (categoryName: string, isChecked: boolean) => {
    setSelectedCategory(isChecked ? categoryName : "")
    setIsDrawerOpen(false)
  }

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value)
    setIsDrawerOpen(false)
  }

  const handleCaratRangeChange = (value: string) => {
    setSelectedCaratRange(value)
    setIsDrawerOpen(false)
  }

  const handleSalesTypeChange = (value: string) => {
    setSelectedSalesType(value)
    setIsDrawerOpen(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)

  }

  const clearFilters = () => {
    setSearchQuery("")
    setDebouncedSearchQuery("")
    setSelectedCategory("")
    setSelectedTimeRange("allday")
    setSelectedCaratRange(undefined)
    setSelectedSalesType(undefined)
    setIsDrawerOpen(false)
  }

  // Filter sidebar component to reuse in both desktop and mobile views
  const FilterSidebar = () => (
    <div className="flex flex-col gap-5 p-5 rounded-md bg-[#DFC5A2] h-full overflow-y-auto">
      {/* Search Input */}
      <div className="relative hidden lg:block">
        <Input
          onChange={handleSearchChange}
          value={searchQuery}
          className="text-[#645949] border-[#645949]"
          placeholder="Search by title, description..."
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4" />
      </div>

      {/* Category List */}
      <div>
        <h4 className="text-xl font-medium text-[#000000] pb-4">Category</h4>
        <ul className="space-y-3">
          {categories?.map((category: Category) => (
            <li key={category._id} className="flex items-center gap-1">
              <Checkbox
                id={`category-${category._id}-${isDrawerOpen ? "mobile" : "desktop"}`}
                checked={selectedCategory === category.name}
                onCheckedChange={(checked) => handleCategoryChange(category.name, !!checked)}
              />
              <label
                htmlFor={`category-${category._id}-${isDrawerOpen ? "mobile" : "desktop"}`}
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
                id={`carratweight-${carrat.id}-${isDrawerOpen ? "mobile" : "desktop"}`}
              />
              <Label
                htmlFor={`carratweight-${carrat.id}-${isDrawerOpen ? "mobile" : "desktop"}`}
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
              <RadioGroupItem
                value={type.value}
                id={`sales-type-${type.value}-${isDrawerOpen ? "mobile" : "desktop"}`}
              />
              <Label
                htmlFor={`sales-type-${type.value}-${isDrawerOpen ? "mobile" : "desktop"}`}
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
  )

  // Loading state
  if (isAuctionsLoading || isCategoriesLoading) {
    return (
      <section className="py-12 md:px-6 lg:px-0">
        <div className="text-center pb-10">
          <h2 className="text-[32px] md:text-[40px] text-[#645949] font-bold">All Auction</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 md:gap-10">
          <div className="col-span-1 md:col-span-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse h-64 rounded-md"></div>
              ))}
            </div>
          </div>
          <div className="hidden md:block md:col-span-3">
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
    )
  }

  // Error state
  if (isAuctionsError || isCategoriesError) {
    return (
      <section className="py-12 px-4 md:px-6">
        <div className="text-center pb-10">
          <h2 className="text-[32px] md:text-[40px] text-[#645949] font-bold">All Auction</h2>
        </div>
        <p className="text-red-500 text-center">
          {isAuctionsError && isCategoriesError
            ? `Error fetching auctions and categories: ${auctionsError?.message} / ${categoriesError?.message}`
            : isAuctionsError
              ? `Error fetching auctions: ${auctionsError?.message}`
              : `Error fetching categories: ${categoriesError?.message}`}
        </p>
      </section>
    )
  }

  // Calculate if any filters are active
  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "" ||
    selectedTimeRange !== "allday" ||
    selectedCaratRange !== undefined ||
    selectedSalesType !== undefined

  return (
    <section className="py-12 px-4 md:px-6 lg:px-0">
      <div className="text-center pb-10 relative">
        {/* Mobile hamburger menu */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 md:hidden">
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#645949] relative">
                <Menu className="h-6 w-6" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#645949] text-[10px] text-white">
                    •
                  </span>
                )}
                <span className="sr-only">Toggle filter menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[85%] sm:w-[350px] p-0 bg-transparent border-none"
              onInteractOutside={() => setIsDrawerOpen(false)}
              onEscapeKeyDown={() => setIsDrawerOpen(false)}
            >
              <div className="h-full">
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <h2 className="text-[32px] md:text-[40px] text-[#645949] font-bold">All Auction</h2>
      </div>

      {/* Mobile search bar - only visible on mobile */}
      <div className="relative mb-6 md:hidden">
        <Input
          onChange={handleSearchChange}
          value={searchQuery}
          className="text-[#645949] border-[#645949]"
          placeholder="Search by title, description..."
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-6">
        {/* Main content */}
        <div className="col-span-1 md:col-span-8">
          {filteredAuctions?.length === 0 ? (
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {filteredAuctions?.map((auction: AuctionItem) => (
                <AuctionCard
                  key={auction._id}
                  image={auction.images[0]}
                  title={auction.title}
                  currentBid={auction.currentBid}
                  auctionId={auction._id.toString()}
                  startTime={auction.startTime}
                  endTime={auction.endTime}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden md:block md:col-span-3">
          <FilterSidebar />
        </div>
      </div>
    </section>
  )
}
