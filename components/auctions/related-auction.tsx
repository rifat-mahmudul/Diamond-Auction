import { useQuery } from '@tanstack/react-query';
import React from 'react'


interface AuctionCategory {
    name: string
}

export default function RelatedAuction({ name }: AuctionCategory) {


    const {
        data: relatedAuctions,
        isLoading: isRelatedAuctionsLoading,
        error: errorRelatedAuctions,
    } = useQuery({
        queryKey: ["related-auctions", name],
        queryFn: async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auctions/related-auctions?category=${name}`,
                {
                    headers: {
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBiMDMxOGJhZTMxMjljYzlmNWUyYzYiLCJpYXQiOjE3NDU2Mzc4NzksImV4cCI6MTc0NjI0MjY3OX0.zLPAwxo0f0NFPuS-PkjIVL73cII6FFAmEY-aDmmE7po`,
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch auction details");
            }


            if (isRelatedAuctionsLoading) {
                return (
                    <div>Loading...</div>
                )
            }

            if (errorRelatedAuctions) {
                return (
                    <div>Error: {errorRelatedAuctions.message}</div>
                )
            }


            return response.json();
        },
        select: (responseData) => responseData.data,
    });

    console.log("Category name", name)
    console.log(relatedAuctions)


    return (
        <div className="pt-10">
            <div className="pb-5">
                <h2 className="text-5xl font-bold">Related Auctions</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {relatedAuctions.map((auction: any) => (
                    <div key={auction._id} className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">{auction.title}</h3>
                        <p className="text-gray-600">{auction.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
