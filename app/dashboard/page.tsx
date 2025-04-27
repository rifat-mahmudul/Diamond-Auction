"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/dashboard/layout";
import { apiService } from "@/lib/api-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

interface Auction {
  _id: string;
  title: string;
  currentBid: number;
  status: string;
  endsIn?: string;
}

interface TopBidder {
  _id: string;
  username: string;
  auctionsWon: number;
  totalAmount: number;
}

export default function Dashboard() {
  const [recentAuctions, setRecentAuctions] = useState<Auction[]>([]);
  const [topBidders, setTopBidders] = useState<TopBidder[]>([]);
  const [stats, setStats] = useState({
    revenue: 11020,
    sellers: 8020,
    bidders: 6020,
    liveAuctions: 20,
  });
  const session = useSession();
  const user = session.data?.user;
  console.log({ user });
  // console.log(user?.accessToken, "access token");

  useEffect(() => {
    if (user?.accessToken) {
      apiService.setToken(user.accessToken);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // if (user?.accessToken) {
        //   const response = await apiService.setToken(user.accessToken);
        // } else {
        //   console.error("Access token is undefined");
        // }
        const auctionsResponse = (await apiService.getAllAuctions()) as {
          status: string;
          data: Auction[];
        };
        if (auctionsResponse.status === "success" && auctionsResponse.data) {
          setRecentAuctions(auctionsResponse.data.slice(0, 8));
        }

        const biddersResponse = await apiService.getTopBidders();
        if (biddersResponse.status === true && biddersResponse.data) {
          setTopBidders(biddersResponse.data as TopBidder[]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back to your auction admin panel
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.revenue}</div>
              <p className="text-xs text-muted-foreground">All Time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Seller
              </CardTitle>
              <Store className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sellers}</div>
              <p className="text-xs text-muted-foreground">All Time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Bidders
              </CardTitle>
              <Users className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bidders}</div>
              <p className="text-xs text-muted-foreground">All Time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Live Auctions
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.liveAuctions}</div>
              <p className="text-xs text-muted-foreground">All Time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
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
                  {recentAuctions.map((auction) => (
                    <div
                      key={auction._id}
                      className="grid grid-cols-5 items-center"
                    >
                      <div className="font-medium">Classic and timeless</div>
                      <div>22</div>
                      <div>${auction.currentBid || 2022}</div>
                      <div>2 hours</div>
                      <div>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                        >
                          Active
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-blue-500 hover:underline cursor-pointer">
                  View All Auctions →
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Bidders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {topBidders.map((bidder) => (
                  <div
                    key={bidder._id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{bidder.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {bidder.auctionsWon} auctions won
                      </p>
                    </div>
                    <div className="font-medium text-green-600">
                      ${bidder.totalAmount.toLocaleString()}
                    </div>
                  </div>
                ))}
                {Array.from({ length: 8 - topBidders.length }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-muted-foreground">
                        12 auctions won
                      </p>
                    </div>
                    <div className="font-medium text-green-600">$14,250</div>
                  </div>
                ))}
                <div className="text-sm text-blue-500 hover:underline cursor-pointer">
                  View All Bidders →
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
