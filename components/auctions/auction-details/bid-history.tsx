"use client"

import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/format"

interface BidHistoryProps {
    auctionId: string
}

interface Bid {
    _id: string
    amount: number
    user: { _id: string, username: string }
    createdAt: string
    isAuto: boolean
}

export default function BidHistory({ auctionId }: BidHistoryProps) {
    // Fetch bid history
    const { data: bidHistoryData, isLoading } = useQuery({
        queryKey: ["bidHistory", auctionId],
        queryFn: async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/bids/auction/${auctionId}/history`,
                {
                    headers: {
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBiMDMxOGJhZTMxMjljYzlmNWUyYzYiLCJpYXQiOjE3NDU2Mzc4NzksImV4cCI6MTc0NjI0MjY3OX0.zLPAwxo0f0NFPuS-PkjIVL73cII6FFAmEY-aDmmE7po`,
                    },
                }
            )
            if (!response.ok) {
                throw new Error("Failed to fetch bid history")
            }
            return response.json()
        },
    })

    const bidHistory = bidHistoryData?.data

    if (isLoading) {
        return <div>Loading bid history...</div>
    }

    if (!bidHistory) {
        return <div>No bid history available</div>
    }


    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex gap-2 items-center text-base font-medium text-[#645949]">
                    <p className="">Starting Bid:</p>
                    <p className="">{formatCurrency(bidHistory.startingBid || 5000)}</p>
                </div>
                <div className="flex gap-2 items-center text-base font-medium text-[#645949]">
                    <p className="">Current Bid:</p>
                    <p className="">{bidHistory.winningBid || formatCurrency(11200)}</p>
                </div>
                <div className="flex gap-2 items-center text-base font-medium text-[#645949]">
                    <p className="">Increment:</p>
                    <p className="">{formatCurrency(100)}</p>
                </div>
            </div>

            <div className="border rounded-none overflow-hidden bg-[#f9f4e8]">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#f9f4e8] hover:bg-[#f9f4e8]">
                            <TableHead className="border font-medium text-foreground py-3 px-4 w-1/4">Date</TableHead>
                            <TableHead className="border font-medium text-foreground py-3 px-4 w-1/4">Bid</TableHead>
                            <TableHead className="border font-medium text-foreground py-3 px-4 w-1/4">User</TableHead>
                            <TableHead className="border font-medium text-foreground py-3 px-4 w-1/4">Auto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bidHistory.map((bid: Bid, index: number) => (
                            <TableRow key={index} className="bg-[#f9f4e8] hover:bg-[#f9f4e8]">
                                <TableCell className="border py-3 px-4">
                                    {format(new Date(bid.createdAt), "MMMM d, yyyy h:mm a")}
                                </TableCell>
                                <TableCell className="border py-3 px-4">{formatCurrency(bid.amount)}</TableCell>
                                <TableCell className="border py-3 px-4">{bid?.user?.username}</TableCell>
                                <TableCell className="border py-3 px-4">{bid.isAuto ? "Yes" : "No"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
