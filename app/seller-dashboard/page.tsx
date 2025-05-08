"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DollarSign, Users, ShoppingCart, Store } from "lucide-react";
import Layout from "@/components/dashboard/layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Base URL from environment variable
const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://your-api-url.com";

export default function DashboardPage() {
  // Get session and token
  const session = useSession();
  const token = session?.data?.user?.accessToken;

  // API headers with authentication
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch dashboard statistics
  const { data: statsData } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await axios.get(
        `${baseURL}/auctions/get-seller-statistics`,
        { headers }
      );
      return response.data;
    },
    enabled: !!token,
  });

  // Fetch active auctions
  const { data: auctionsData, isLoading: isAuctionsLoading } = useQuery({
    queryKey: ["auctions", "active", 1, "", 5],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("status", "active");
      params.append("limit", "5");

      const response = await axios.get(
        `${baseURL}/auctions/get-all-auctions?${params.toString()}`,
        { headers }
      );
      return response.data;
    },
    enabled: !!token,
  });

  // Fetch top bidders
  const { data: biddersData, isLoading: isBiddersLoading } = useQuery({
    queryKey: ["bidders", "top"],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/bids/top-bidders`, {
        headers,
      });
      return response.data;
    },
    enabled: !!token,
  });

  const stats = statsData?.data
    ? [
        {
          revenue: statsData.data.totalRevenue?.replace("$", "") || "0",
          sellers: statsData.data.successfulAuctions || 0,
          bidders: statsData.data.endAuctions || 0,
          liveAuctions: statsData.data.liveAuctions || 0,
        },
      ]
    : [
        {
          revenue: "0",
          sellers: 0,
          bidders: 0,
          liveAuctions: 0,
        },
      ];

  const recentAuctions = auctionsData?.data || [];
  const topBidders = biddersData?.data || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.round(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 24) {
      return `${diffHours} hours`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days`;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-[#4B5563] text-sm font-normal">
            Welcome back to your auction admin panel
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center justify-between p-4 bg-white">
            <div className="space-y-1">
              <p className="text-[12px] font-normal text-[#6B7280]">
                Total Revenue
              </p>
              <div className="text-2xl font-bold">${stats[0].revenue}</div>
              <p className="text-[16px] font-normal text-[#6B7280]">All Time</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2695FF] text-white">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </Card>

          <Card className="flex items-center justify-between p-4 bg-white">
            {/* <div className="space-y-1">
              <p className="text-[12px] font-normal text-[#6B7280]">
                Total Seller
              </p>
              <div className="text-2xl font-bold">{stats[0].sellers}</div>
              <p className="text-[16px] font-normal text-[#6B7280]">All Time</p>
            </div> */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981] text-white">
              <Store className="h-8 w-8 text-white" />
            </div>
          </Card>

          <Card className="flex items-center justify-between p-4 bg-white">
            <div className="space-y-1">
              <p className="text-[12px] font-normal text-[#6B7280]">
                Total Bidders
              </p>
              <div className="text-2xl font-bold">{stats[0].bidders}</div>
              <p className="text-[16px] font-normal text-[#6B7280]">All Time</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F59E0B] text-white">
              <Users className="h-8 w-8 text-white" />
            </div>
          </Card>

          <Card className="flex items-center justify-between p-4 bg-white">
            <div className="space-y-1">
              <p className="text-[12px] font-normal text-[#6B7280]">
                Live Auctions
              </p>
              <div className="text-2xl font-bold">{stats[0].liveAuctions}</div>
              <p className="text-[16px] font-normal text-[#6B7280]">All Time</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EF4444] text-white">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1 p-4 bg-white">
            <CardHeader className="mb-4">
              <CardTitle>Recent Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground">
                  <div>Item</div>
                  <div>Bids</div>
                  <div>Highest Bid</div>
                  <div>Ends In</div>
                  <div>Status</div>
                </div>
                <div className="space-y-4">
                  {isAuctionsLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6b614f]"></div>
                    </div>
                  ) : recentAuctions.length === 0 ? (
                    <div className="text-center py-4">No auctions found</div>
                  ) : (
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    recentAuctions.map((auction: any) => (
                      <div
                        key={auction._id}
                        className="grid grid-cols-5 items-center border-b border-gray-200 last:border-b-0 py-2"
                      >
                        <div className="font-medium">{auction.title}</div>
                        <div>{auction.bidCount || 0}</div>
                        <div>${auction.currentBid || 0}</div>
                        <div>{formatDate(auction.endTime)}</div>
                        <div>
                          <Badge
                            variant="outline"
                            className={`${
                              auction.status === "live" ||
                              auction.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                : auction.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                                : auction.status === "completed" ||
                                  auction.status === "end"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                            }`}
                          >
                            {auction.status === "live"
                              ? "Active"
                              : auction.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  href="/auctions"
                  className="text-sm text-blue-500 hover:underline cursor-pointer"
                >
                  View All Auctions →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 p-4 bg-white">
            <CardHeader className="mb-4">
              <CardTitle>Top Bidders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isBiddersLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6b614f]"></div>
                  </div>
                ) : (
                  <>
                    {
                      /* eslint-disable @typescript-eslint/no-explicit-any */
                      topBidders.slice(0, 8).map((bidder: any) => (
                        <div
                          key={bidder._id}
                          className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-b-0"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">{bidder.username}</p>
                            <p className="text-sm text-muted-foreground">
                              {bidder.winAuctions || 0} auctions won
                            </p>
                          </div>
                          <div className="font-medium text-green-600">
                            ${bidder.totalAmount?.toLocaleString() || 0}
                          </div>
                        </div>
                      ))
                    }
                    {topBidders.length === 0 &&
                      Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-b-0"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">John Smith</p>
                            <p className="text-sm text-muted-foreground">
                              12 auctions won
                            </p>
                          </div>
                          <div className="font-medium text-green-600">
                            $14,250
                          </div>
                        </div>
                      ))}
                  </>
                )}
                <Link
                  href="/bidders"
                  className="block pt-4 text-sm text-blue-500 hover:underline cursor-pointer"
                >
                  View All Bidders →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
