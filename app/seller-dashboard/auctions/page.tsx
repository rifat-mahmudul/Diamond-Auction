"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Layout from "@/components/dashboard/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/dashboard/pagination";
import { CreateAuctionDialog } from "./_components/create-auction-dialog";

// Base URL from environment variable
const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://your-api-url.com";

export default function AuctionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "active";
  const pageParam = searchParams.get("page") || "1";
  const searchParam = searchParams.get("search") || "";

  const [activeTab, setActiveTab] = useState(tabParam);
  const [currentPage, setCurrentPage] = useState(Number.parseInt(pageParam));
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Get session and token
  const session = useSession();
  const token = session?.data?.user?.accessToken;

  const queryClient = useQueryClient();

  // API headers with authentication
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch all auctions
  const { data: allAuctionsData, isLoading: isAllAuctionsLoading } = useQuery({
    queryKey: ["auctions", "all", currentPage, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      if (searchQuery) params.append("search", searchQuery);

      const response = await axios.get(
        `${baseURL}/auctions/get-all-auctions?${params.toString()}`,
        { headers }
      );
      return response.data;
    },
    enabled: !!token,
  });

  // Delete auction mutation
  const deleteAuction = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(
        `${baseURL}/auctions/delete-auction/${id}`,
        { headers }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      toast.success("Auction deleted successfully");
    },
    /* eslint-disable @typescript-eslint/no-explicit-any */
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete auction");
    },
  });

  // Filter auctions based on status
  const getFilteredAuctions = () => {
    if (!allAuctionsData?.data) return [];

    switch (activeTab) {
      case "active":
        return allAuctionsData.data.filter(
          /* eslint-disable @typescript-eslint/no-explicit-any */
          (auction: any) => auction.status === "live"
        );
      case "pending":
        return allAuctionsData.data.filter(
          /* eslint-disable @typescript-eslint/no-explicit-any */
          (auction: any) => auction.status === "pending"
        );
      case "scheduled":
        return allAuctionsData.data.filter(
          /* eslint-disable @typescript-eslint/no-explicit-any */
          (auction: any) => auction.status === "scheduled"
        );
      case "end":
        return allAuctionsData.data.filter(
          /* eslint-disable @typescript-eslint/no-explicit-any */
          (auction: any) =>
            auction.status === "completed" || auction.status === "end"
        );
      default:
        return allAuctionsData.data;
    }
  };

  const filteredAuctions = getFilteredAuctions();
  const totalPages = allAuctionsData?.totalPages || 1;
  const isLoading = isAllAuctionsLoading;

  // Handlers
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    updateUrl(value, 1, searchQuery);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(activeTab, page, searchQuery);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateUrl(activeTab, 1, searchQuery);
  };

  const updateUrl = (tab: string, page: number, search: string) => {
    const params = new URLSearchParams();
    params.set("tab", tab);
    params.set("page", page.toString());
    if (search) params.set("search", search);
    router.push(`/seller-dashboard/auctions?${params.toString()}`);
  };

  const handleDeleteAuction = (id: string) => {
    deleteAuction.mutate(id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // Sync URL with state
  useEffect(() => {
    setActiveTab(tabParam);
    setCurrentPage(Number.parseInt(pageParam));
    setSearchQuery(searchParam);
  }, [tabParam, pageParam, searchParam]);

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Auctions</h1>
            <p className="text-muted-foreground">
              Manage your auction listings
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#6b614f] hover:bg-[#5a5142]"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Auction
          </Button>
        </div>

        <div className="bg-white rounded-md">
          <div className="p-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              {/* <Button type="submit" variant="secondary">
                Search
              </Button> */}
            </form>
          </div>

          <Tabs
            defaultValue="active"
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 rounded-lg bg-[#e9dcc9] h-16 border border-[#645949]">
              <TabsTrigger
                value="active"
                className="rounded-md data-[state=active]:bg-[#6b614f] data-[state=active]:text-white h-full"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="rounded-md data-[state=active]:bg-[#6b614f] data-[state=active]:text-white h-full"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="scheduled"
                className="rounded-md data-[state=active]:bg-[#6b614f] data-[state=active]:text-white h-full"
              >
                Scheduled
              </TabsTrigger>
              <TabsTrigger
                value="end"
                className="rounded-md data-[state=active]:bg-[#6b614f] data-[state=active]:text-white h-full"
              >
                End
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <AuctionsTable
                auctions={filteredAuctions}
                onDelete={handleDeleteAuction}
                formatDate={formatDate}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <AuctionsTable
                auctions={filteredAuctions}
                onDelete={handleDeleteAuction}
                formatDate={formatDate}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="scheduled" className="mt-4">
              <AuctionsTable
                auctions={filteredAuctions}
                onDelete={handleDeleteAuction}
                formatDate={formatDate}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="end" className="mt-4">
              <AuctionsTable
                auctions={filteredAuctions}
                onDelete={handleDeleteAuction}
                formatDate={formatDate}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>

          <div className="p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <CreateAuctionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        token={token}
      />
    </Layout>
  );
}

interface AuctionsTableProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  auctions: any[];
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
  isLoading?: boolean;
}

function AuctionsTable({
  auctions,
  onDelete,
  formatDate,
  isLoading,
}: AuctionsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6b614f]"></div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F9FAFB] h-14 border-none">
          <TableHead className="text-center">Auction</TableHead>
          <TableHead className="text-center">Category</TableHead>
          <TableHead className="text-center">SKU</TableHead>
          <TableHead className="text-center">Seller</TableHead>
          <TableHead className="text-center">Start Date</TableHead>
          <TableHead className="text-center">End Date</TableHead>
          <TableHead className="text-center">Current Bid</TableHead>
          <TableHead className="text-center">Bids</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auctions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4">
              No auctions found
            </TableCell>
          </TableRow>
        ) : (
          auctions.map((auction) => (
            <TableRow
              key={auction._id}
              className="text-center h-16 !border-b border-[#E5E7EB]"
            >
              <TableCell className="font-medium">{auction.title}</TableCell>
              <TableCell>
                {typeof auction.category === "object"
                  ? auction.category.name
                  : "Unknown"}
              </TableCell>
              <TableCell>{auction.sku || "#212-121"}</TableCell>
              <TableCell>
                {typeof auction.seller === "object" ? (
                  <>
                    <h5>
                      {auction?.seller?.displayName?.split("#")[0] ||
                        auction?.seller?.username}
                    </h5>
                    {auction?.seller?.displayName?.split("#")[1] && (
                      <span>
                        #{auction?.seller?.displayName?.split("#")[1]}
                      </span>
                    )}
                  </>
                ) : (
                  "Unknown Seller"
                )}
              </TableCell>
              <TableCell>
                {formatDate(auction.startTime || "2023-01-15T10:00:00.000Z")}
              </TableCell>
              <TableCell>
                {formatDate(auction.endTime || "2023-01-20T10:00:00.000Z")}
              </TableCell>
              <TableCell>${auction.currentBid || 0}</TableCell>
              <TableCell>{auction.bidCount || 0}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the auction.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(auction._id)}
                        className="bg-red-500 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
