"use client";

import { useState, useEffect } from "react";
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
import { Search, Trash2, Filter } from "lucide-react";
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
import { User } from "lucide-react";
import { toast } from "sonner";

interface Seller {
  _id: string;
  username: string;
  contact: {
    email: string;
    phone: string;
  };
  sellerId: string;
  joinDate: string;
  totalAuctions: number;
  liveAuctions: number;
  totalSales: number;
  sellAmount: number;
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [isLoading, setIsLoading] = useState(false)

  // Mock data for sellers since we don't have a specific endpoint
  const mockSellers: Seller[] = Array.from({ length: 8 }, (_, i) => ({
    _id: `seller-${i}`,
    username: "John Smith",
    contact: {
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
    },
    sellerId: "#25002",
    joinDate: "2023-01-15",
    totalAuctions: 48,
    liveAuctions: 12,
    totalSales: 10,
    sellAmount: 12450,
  }));

  useEffect(() => {
    // In a real app, you would fetch from API
    setSellers(mockSellers);
    setFilteredSellers(mockSellers);
    setTotalPages(Math.ceil(mockSellers.length / 10));
  }, [mockSellers]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = sellers.filter(
        (seller) =>
          seller.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          seller.contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSellers(filtered);
    } else {
      setFilteredSellers(sellers);
    }
  }, [searchTerm, sellers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteSeller = (id: string) => {
    // In a real app, you would call API
    const updatedSellers = sellers.filter((seller) => seller._id !== id);
    setSellers(updatedSellers);
    setFilteredSellers(filteredSellers.filter((seller) => seller._id !== id));
    toast.success("Seller deleted successfully");
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sellers</h1>
          <p className="text-muted-foreground">Manage your Sellers accounts</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bidders..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Seller ID</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Total Auctions</TableHead>
                <TableHead>Live Auctions</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Sell Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSellers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No sellers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSellers.map((seller) => (
                  <TableRow key={seller._id}>
                    <TableCell className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <span className="font-medium">{seller.username}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{seller.contact.email}</span>
                        <span className="text-muted-foreground">
                          {seller.contact.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{seller.sellerId}</TableCell>
                    <TableCell>{seller.joinDate}</TableCell>
                    <TableCell>{seller.totalAuctions}</TableCell>
                    <TableCell>{seller.liveAuctions}</TableCell>
                    <TableCell>{seller.totalSales}</TableCell>
                    <TableCell>${seller.sellAmount}</TableCell>
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
                              permanently delete the seller account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSeller(seller._id)}
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
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  );
}
