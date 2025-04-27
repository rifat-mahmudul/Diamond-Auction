"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarClock, Heart, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import AuctionCountdown from "./auction-countdown";
import { formatCurrency } from "@/lib/format";
import AuctionImageGallery from "./auction-image-gallery";
import BidHistory from "./bid-history";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RelatedAuction from "../related-auction";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface AuctionDetailsProps {
    auctionId: string;
}

interface PlaceBidParams {
    auctionId: string;
    amount: number;
}

export default function AuctionDetails({ auctionId }: AuctionDetailsProps) {
    const [bidAmount, setBidAmount] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("description");
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const queryClient = useQueryClient();

    const session = useSession();
    // Fetch auction details
    const {
        data: auctionData,
        isLoading: isLoadingAuction,
        error: errorAuction,
    } = useQuery({
        queryKey: ["auction", auctionId],
        queryFn: async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auctions/get-auction/${auctionId}`
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch auction details");
            }
            return response.json();
        },
    });

    const auction = auctionData?.data?.auction;


    // Handle bidding
    async function placeBid({ auctionId, amount }: PlaceBidParams) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/bids/auctions/${auctionId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBiMDMxOGJhZTMxMjljYzlmNWUyYzYiLCJpYXQiOjE3NDU2Mzc4NzksImV4cCI6MTc0NjI0MjY3OX0.zLPAwxo0f0NFPuS-PkjIVL73cII6FFAmEY-aDmmE7po`,
                },
                body: JSON.stringify({ amount }),
            }
        );


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to place bid");
        }

        return response.json(); // Or handle the response as needed
    }


    const {
        mutate,
        status,
        isSuccess: isBidSuccess,
        isError: isBidError,
        error: bidError,
    } = useMutation({
        mutationFn: placeBid,
        onSuccess: (data) => {
            setBidAmount("");
            console.log(data);
            queryClient.invalidateQueries({ queryKey: ["bidHistory"] });
        },
        onError: (err) => {
            console.error("Error placing bid:", err.message);
            // Optionally show an error message
        },
    });

    const isPlacingBid = status === 'pending';



    // Handle Bidding
    const handleBid = () => {
        if (bidAmount && Number.parseFloat(bidAmount) > auction?.currentBid) {
            mutate({
                auctionId: auctionId,
                amount: Number.parseFloat(bidAmount),
            });
        } else if (auction) {
            console.warn(
                `Bid amount must be greater than the current bid: ${formatCurrency(
                    auction.currentBid
                )}`
            );
            // Optionally show a message to the user
        } else {
            console.warn("Auction details not loaded yet.");
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBidAmount(event.target.value);
    };




    // Calculate time remaining




    // Handle bid increment/decrement
    const handleIncrement = () => {
        if (!auction) return;
        const currentValue = bidAmount ? Number.parseFloat(bidAmount) : auction.currentBid;
        setBidAmount((currentValue + auction.bidIncrement).toString());
    };

    const handleDecrement = () => {
        if (!auction) return;
        const currentValue = bidAmount ? Number.parseFloat(bidAmount) : auction.currentBid;
        const newValue = Math.max(
            currentValue - auction.bidIncrement,
            auction.currentBid
        );
        setBidAmount(newValue.toString());
    };

    if (isLoadingAuction) {
        return <div>Loading auction details...</div>;
    }

    if (errorAuction) {
        return <div>Error loading auction details: {errorAuction.message}</div>;
    }

    if (!auction) {
        return <div>Auction not found.</div>;
    }



    const winner = auction.winner

    const user = session?.data?.user?.id



    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                        <Image
                            src={auction.images[selectedImageIndex] || "/placeholder.svg"}
                            alt={auction.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <AuctionImageGallery
                        images={auction.images}
                        selectedIndex={selectedImageIndex}
                        onSelect={setSelectedImageIndex}
                    />
                </div>

                {/* Auction Details */}
                <div className="space-y-4">
                    <div>
                        <p className="text-lg font-medium text-[#645949] pb-6">
                            SKU #{auction.sku}
                        </p>
                        <div className="flex justify-between items-center pb-6">
                            <h1 className="text-[40px] font-bold inline-block">
                                {auction.title}
                            </h1>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <p className="text-base text-[#645949] pb-10">
                        {auction.description}
                    </p>

                    {auction.status === "live"
                        ?
                        (
                            <div className="">
                                <div className="space-y-1 text-[#645949] pb-6">
                                    <p className="text-base pb-2">Current bid:</p>
                                    <p className="text-2xl font-semibold">
                                        {formatCurrency(auction.currentBid)}
                                    </p>
                                </div>

                                {!isAuctionEnded && (
                                    <div className="text-[#645949]">
                                        <div>
                                            <p className="text-sm font-medium mb-3">Time left:</p>
                                            <AuctionCountdown endTime={auction.endTime} />
                                        </div>

                                        <div className="space-y-3 text-[#645949] pb-6">
                                            <p className="text-base">
                                                Auction ends: {format(new Date(auction.endTime), "MMM d, yyyy h:mm a")}
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <p className="text-base font-medium">
                                                {auction.reserveMet
                                                    ? "Reserve price has been met"
                                                    : "Reserve price not met"}
                                            </p>
                                            <p className="text-xs pb-2 text-muted-foreground">
                                                (Enter more than or equal to:{" "}
                                                {formatCurrency(auction.currentBid)})
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center space-x-2">
                                            <div className="w-2/3 flex justify-between items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={handleDecrement}
                                                    disabled={!auction || isPlacingBid}
                                                    className="text-white w-12 bg-[#645949] hover:bg-[#645949]/90"
                                                >
                                                    <Minus className="h-6 w-6" />
                                                </Button>
                                                <Input
                                                    type="text"
                                                    value={bidAmount || ""}
                                                    onChange={handleInputChange}
                                                    placeholder={auction ? auction.currentBid.toString() : ""}
                                                    className="text-center"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={handleIncrement}
                                                    disabled={!auction || isPlacingBid}
                                                    className="text-white w-12 bg-[#645949] hover:bg-[#645949]/90"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Button
                                                className="text-white w-52 bg-[#645949] hover:bg-[#645949]/90"
                                                onClick={handleBid}
                                                disabled={
                                                    !bidAmount ||
                                                    Number.parseFloat(bidAmount) <= auction.currentBid ||
                                                    isPlacingBid
                                                }
                                            >
                                                {isPlacingBid ? "Bidding..." : "Bid"}
                                            </Button>
                                        </div>

                                        {isBidSuccess && (
                                            <div className="mt-4 text-green-500">Bid placed successfully!</div>
                                        )}
                                        {isBidError && (
                                            <div className="mt-4 text-red-500">
                                                Error placing bid: {bidError?.message} Register to place bid
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                        :
                        auction.status === "pending" || auction.status === "scheduled" ? (
                            <Card className="border border-[#a39a85] overflow-hidden bg-[#f5f1e8]">
                                <div className="bg-[#8a8170] py-3 px-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[#f5f1e8] font-semibold text-lg">Auction Coming Soon</h3>
                                        <Badge variant="outline" className="bg-[#f5f1e8]/10 text-[#f5f1e8] border-[#f5f1e8]/30">
                                            Exclusive
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#e6e0d4] rounded-full p-2.5">
                                            <CalendarClock className="h-5 w-5 text-[#8a8170]" />
                                        </div>
                                        <p className="text-[#5d5545] font-medium">This item will be available for auction soon</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                            :
                            auction.status === "completed" ? (
                                <div className="">
                                    <Card className="border border-[#a39a85] overflow-hidden bg-[#f5f1e8]">
                                        <div className="bg-[#8a8170] py-3 px-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-[#f5f1e8] font-semibold text-lg">Auction Has Completed</h3>
                                                <Badge variant="outline" className="bg-[#f5f1e8]/10 text-[#f5f1e8] border-[#f5f1e8]/30">
                                                    Exclusive
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#e6e0d4] rounded-full p-2.5">
                                                    <CalendarClock className="h-5 w-5 text-[#8a8170]" />
                                                </div>
                                                <p className="text-[#5d5545] font-medium">This item will not be available for auction</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    {
                                        winner == user && (
                                            <div className="pt-6">
                                                <h4 className="font-semibold text-[#645949] pb-4">You won the bid: ${auction.currentBid}</h4>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setIsOpen(true)}
                                                    disabled={!auction || isPlacingBid}
                                                    className="text-white h-12 w-32 bg-[#645949] hover:bg-[#645949]/90"
                                                >
                                                    Pay Now
                                                </Button>
                                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                                    <DialogContent className="sm:max-w-[900px] p-0 bg-white">
                                                        <div className="flex">
                                                            {/* Close button */}
                                                            <button
                                                                onClick={() => setIsOpen(false)}
                                                                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                <span className="sr-only">Close</span>
                                                            </button>

                                                            {/* Billing Information */}
                                                            <div className="w-1/2 p-6 border-r">
                                                                <h2 className="text-xl font-semibold mb-4">Billing Information</h2>

                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <label htmlFor="fullName" className="block text-sm mb-1">
                                                                            Full Name
                                                                        </label>
                                                                        <Input id="fullName" className="w-full" />
                                                                    </div>

                                                                    <div>
                                                                        <label htmlFor="address" className="block text-sm mb-1">
                                                                            Address
                                                                        </label>
                                                                        <Input id="address" className="w-full" />
                                                                    </div>

                                                                    <div>
                                                                        <label htmlFor="email" className="block text-sm mb-1">
                                                                            Email address
                                                                        </label>
                                                                        <Input id="email" type="email" className="w-full" />
                                                                    </div>

                                                                    <div>
                                                                        <label htmlFor="phone" className="block text-sm mb-1">
                                                                            Phone Number
                                                                        </label>
                                                                        <Input id="phone" className="w-full" />
                                                                    </div>

                                                                    <div className="flex items-center space-x-2">
                                                                        <Checkbox id="saveInfo" />
                                                                        <label htmlFor="saveInfo" className="text-sm">
                                                                            Save this information for faster check out next time
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Order Summary */}
                                                            <div className="w-1/2 p-6">
                                                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                                                                <div className="flex items-center mb-4">
                                                                    <div className="w-12 h-12 bg-gray-100 rounded mr-3 overflow-hidden">
                                                                        <Image src={auction?.images[0]} alt={auction?.title} width={48} height={48} />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="font-medium">{auction?.title}</div>
                                                                    </div>
                                                                    <div className="font-medium">${auction?.currentBid}</div>
                                                                </div>

                                                                <div className="space-y-2 border-t pt-4">
                                                                    <div className="flex justify-between">
                                                                        <span>Subtotal</span>
                                                                        <span>${auction?.currentBid}</span>
                                                                    </div>

                                                                    <div className="flex justify-between">
                                                                        <span>Shipping</span>
                                                                        <span>$55</span>
                                                                    </div>

                                                                    <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                                                        <span>Total</span>
                                                                        <span>${auction?.currentBid + 55}</span>
                                                                    </div>
                                                                </div>

                                                                <Button
                                                                    className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white"
                                                                    onClick={() => console.log("Processing payment...")}
                                                                >
                                                                    Pay With <span className="font-semibold ml-1 text-xl">stripe</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                                :
                                auction.status === "cancelled" ? (
                                    <Card className="border border-[#a39a85] overflow-hidden bg-[#f5f1e8]">
                                        <div className="bg-[#8a8170] py-3 px-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-[#f5f1e8] font-semibold text-lg">Auction Has Been Cancelled</h3>
                                                <Badge variant="outline" className="bg-[#f5f1e8]/10 text-[#f5f1e8] border-[#f5f1e8]/30">
                                                    Exclusive
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#e6e0d4] rounded-full p-2.5">
                                                    <CalendarClock className="h-5 w-5 text-[#8a8170]" />
                                                </div>
                                                <p className="text-[#5d5545] font-medium">This item will not be available for auction</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                                    : null
                    }

                </div>
            </div>

            {/* Tabs */}
            <Tabs
                defaultValue="description"
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <TabsList className="border-b rounded-none w-full bg-transparent justify-start h-auto p-0">
                    <TabsTrigger
                        value="description"
                        className={cn(
                            "rounded-none data-[state=active]:shadow-none py-2.5 px-4",
                            activeTab === "description" ? "font-medium" : ""
                        )}
                    >
                        Description
                    </TabsTrigger>
                    <TabsTrigger
                        value="bidHistory"
                        className={cn(
                            "rounded-none data-[state=active]:shadow-none py-2.5 px-4",
                            activeTab === "bidHistory" ? "font-medium" : ""
                        )}
                    >
                        Bid History
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">
                            {auction.title}: The Most Precious
                        </h2>
                        <p className="text-sm">{auction.description}</p>

                        <div className="space-y-2">
                            <h3 className="font-medium">Key Features:</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li>
                                    <span className="font-medium">Rare & Unique:</span> Unlike
                                    classic white diamonds, this diamond features a deep, opaque
                                    luster, giving it a bold and captivating presence.
                                </li>
                                <li>
                                    <span className="font-medium">Natural Beauty:</span> Formed over
                                    millions of years, each diamond showcases distinct inclusions
                                    and characteristics, adding to its authenticity.
                                </li>
                                <li>
                                    <span className="font-medium">Durable & Timeless:</span> Ranking
                                    high on the Mohs hardness scale, diamonds are exceptionally
                                    strong, ensuring long-lasting brilliance.
                                </li>
                                <li>
                                    <span className="font-medium">Versatile Elegance:</span> Perfect
                                    for rings, necklaces, bracelets, and statement jewelry pieces,
                                    diamonds complement both classic and modern styles.
                                </li>
                                <li>
                                    <span className="font-medium">Symbol of Strength:</span>{" "}
                                    Representing power, mystery, and sophistication, diamonds make
                                    a meaningful and unforgettable choice.
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-medium">Care & Maintenance:</h3>
                            <p className="text-sm">
                                To preserve its beauty, clean your diamond with a soft cloth and
                                mild soap. Avoid harsh chemicals and store separately to prevent
                                scratches. PLEASE NOTE: As a natural gemstone, each diamond
                                varies in tone and inclusions, making every piece one-of-a-kind.
                            </p>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="bidHistory" className="pt-4">
                    <BidHistory auctionId={auctionId} />
                </TabsContent>
            </Tabs>


            <RelatedAuction name={auction?.category?.name} />
        </div>
    );
}