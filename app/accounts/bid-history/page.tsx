"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define the type for bid data
type Bid = {
  id: number
  auctionName: string
  sku: string
  bid: string
  biddingTime: string
  status: string
}

export default function BidHistoryPage() {
  const [bidHistory, setBidHistory] = useState<Bid[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Function to fetch data from the API
  const fetchBidHistory = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bids/user`)
      if (response.data.status) {
        setBidHistory(response.data.data)
      } else {
        setError("Failed to fetch bids.")
      }
    } catch (err) {
      setError("An error occurred while fetching bids.")
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  console.log(bidHistory)

  // Fetch data when component mounts
  useEffect(() => {
    fetchBidHistory()
  }, [])

  const getStatusColor = (status: string) => {
    if (status.startsWith("Win")) return "text-green-600"
    if (status.startsWith("Loss")) return "text-red-600"
    if (status.startsWith("Live")) return "text-blue-600"
    return ""
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
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
