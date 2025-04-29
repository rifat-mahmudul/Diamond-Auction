"use client";

import type React from "react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Layout from "@/components/dashboard/layout";
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
import { Trash2 } from "lucide-react";
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

// Base URL from environment variable
const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://your-api-url.com";

// Main component that wraps with Suspense
export default function BiddersPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-4">Loading bidders...</div>}>
        <BiddersContent />
      </Suspense>
    </Layout>
  );
}

// Content component that contains the actual logic
function BiddersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page") || "1";
  const searchParam = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(Number.parseInt(pageParam));
  const [searchQuery, setSearchQuery] = useState(searchParam);

  // Get session and token
  const session = useSession();
  const token = session?.data?.user?.accessToken;

  const queryClient = useQueryClient();

  // API headers with authentication
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch bidders
  const { data, isLoading } = useQuery({
    queryKey: ["bidders", currentPage, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      if (searchQuery) params.append("search", searchQuery);

      const response = await axios.get(
        `${baseURL}/bids/specific-seller-bidders?${params.toString()}`,
        { headers }
      );
      return response.data;
    },
    enabled: !!token,
  });

  // Delete bidder mutation
  const deleteBidder = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${baseURL}/bids/delete/${id}`, {
        headers,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bidders"] });
      toast.success("Bidder deleted successfully");
    },
    /* eslint-disable @typescript-eslint/no-explicit-any */
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete bidder");
    },
  });

  const bidders = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(page, searchQuery);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateUrl(1, searchQuery);
  };

  const updateUrl = (page: number, search: string) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (search) params.set("search", search);
    router.push(`/bidders?${params.toString()}`);
  };

  const handleDeleteBidder = (id: string) => {
    deleteBidder.mutate(id);
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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bidders</h1>
        <p className="text-muted-foreground">Manage your bidder accounts</p>
      </div>

      <div className="bg-white rounded-md">
        <div className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search bidders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </form>
        </div>

        {isLoading ? (
          <div className="rounded-md border p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6b614f]"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F9FAFB] h-14 border-none">
                <TableHead>Bidder</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Total Bids</TableHead>
                <TableHead>Auctions</TableHead>
                <TableHead>Win Auctions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bidders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No bidders found
                  </TableCell>
                </TableRow>
              ) : (
                /* eslint-disable @typescript-eslint/no-explicit-any */
                bidders.map((bidder: any) => (
                  <TableRow
                    key={bidder._id}
                    className="h-16 !border-b border-[#E5E7EB]"
                  >
                    <TableCell className="font-medium">{bidder.user}</TableCell>
                    <TableCell>{bidder.email}</TableCell>
                    <TableCell>{bidder.phone || "N/A"}</TableCell>
                    <TableCell>{formatDate(bidder.joinDate)}</TableCell>
                    <TableCell>{bidder.totalBids}</TableCell>
                    <TableCell>
                      {bidder.auctions
                        /* eslint-disable @typescript-eslint/no-explicit-any */
                        .map((auction: any) => auction.title)
                        .join(", ")}
                    </TableCell>
                    <TableCell>{bidder.winAuctions}</TableCell>
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
                              This action cannot be undone. This will
                              permanently delete the bidder account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBidder(bidder._id)}
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
        )}

        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
