"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

// Static user ID for now
const USER_ID = "67fe1177d638e66cd751a11d"

// Dummy data for bid history
const dummyBidHistory = [
  {
    id: 1,
    auctionName: "Black Diamond",
    sku: "#212-121",
    bid: "$5,000.00",
    biddingTime: "8 Dec, 2025",
    status: "Live(10th)",
  },
  {
    id: 2,
    auctionName: "Black Diamond",
    sku: "#212-121",
    bid: "$5,000.00",
    biddingTime: "8 Dec, 2025",
    status: "Live(50th)",
  },
  {
    id: 3,
    auctionName: "Black Diamond",
    sku: "#212-121",
    bid: "$5,000.00",
    biddingTime: "8 Dec, 2025",
    status: "Win(1st)",
  },
  {
    id: 4,
    auctionName: "Black Diamond",
    sku: "#212-121",
    bid: "$5,000.00",
    biddingTime: "8 Dec, 2025",
    status: "Loss(2nd)",
  },
  {
    id: 5,
    auctionName: "Black Diamond",
    sku: "#212-121",
    bid: "$5,000.00",
    biddingTime: "8 Dec, 2025",
    status: "Loss(2nd)",
  },
  {
    id: 6,
    auctionName: "Black Diamond",
    sku: "#212-121",
    bid: "$5,000.00",
    biddingTime: "8 Dec, 2025",
    status: "Loss(2nd)",
  },
  {
    id: 7,
    auctionName: "Black Diamond",
    sku: "#212-121",
    bid: "$5,000.00",
    biddingTime: "8 Dec, 2025",
    status: "Loss(5th)",
  },
  {
    id: 8,
    auctionName: "Black Diamond",
    sku: "#212-121",
    bid: "$5,000.00",
    biddingTime: "8 Dec, 2025",
    status: "Win(1st)",
  },
  {
    id: 9,
    auctionName: "Black Diamond",
    sku: "#212-121",
    bid: "$5,000.00",
    biddingTime: "8 Dec, 2025",
    status: "Loss(3rd)",
  },
]

export default function BidHistoryPage() {
  const [bidHistory, setBidHistory] = useState(dummyBidHistory)
  const [loading, setLoading] = useState(false)

  // In a real implementation, you would fetch the bid history from your API
  // useEffect(() => {
  //   const fetchBidHistory = async () => {
  //     setLoading(true)
  //     try {
  //       const response = await fetch(`${BASE_URL}/bids/history/${USER_ID}`)
  //       const data = await response.json()
  //
  //       if (data.status) {
  //         setBidHistory(data.data)
  //       }
  //     } catch (error) {
  //       console.error("Error fetching bid history:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //
  //   fetchBidHistory()
  // }, [])

  const getStatusColor = (status: string) => {
    if (status.startsWith("Win")) return "text-green-600"
    if (status.startsWith("Loss")) return "text-red-600"
    if (status.startsWith("Live")) return "text-blue-600"
    return ""
  }

  return (
    <Card>
      <CardContent>
        <Table className="">
          <TableHeader className="bg-[#bcac98] text-black ">
            <TableRow>
              <TableHead>Auction Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Bid</TableHead>
              <TableHead>Bidding Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-[#e7dfd3] ">
            {bidHistory.map((bid) => (
              <TableRow key={bid.id}>
                <TableCell className="font-medium">{bid.auctionName}</TableCell>
                <TableCell>{bid.sku}</TableCell>
                <TableCell>{bid.bid}</TableCell>
                <TableCell>{bid.biddingTime}</TableCell>
                <TableCell className={getStatusColor(bid.status)}>{bid.status}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
