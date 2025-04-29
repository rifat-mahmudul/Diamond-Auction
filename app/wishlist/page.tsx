"use client";

import { WishlistCard } from "@/components/card/wishlistCard";
import PathTracker from "@/Shared/PathTracker";
import React, { useEffect } from "react";
import { Auction } from "./_components/type";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

const fetchWishlist = async (
  token: string | undefined
): Promise<{ data: { auctions: Auction[] } }> => {
  if (!token) {
    return { data: { auctions: [] } };
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }
  return response.json();
};

function Page() {
  const session = useSession();
  const token = session?.data?.user?.accessToken;
  const {
    data: wishlistData,
    isLoading: loading,
    isError: error,
    error: errorObject,
    refetch,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => fetchWishlist(token),
    enabled: !!token,
  });

  const wishlistItems = wishlistData?.data?.auctions || [];

  useEffect(() => {
    refetch();
  });

  if (loading) {
    return (
      <section className="container mt-24">
        <div className="border-b border-black pb-5">
          <PathTracker />
        </div>
        <div>Loading your wishlist...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mt-24">
        <div className="border-b border-black pb-5">
          <PathTracker />
        </div>
        <div>
          Error: {(errorObject as Error)?.message || "Failed to load wishlist"}
        </div>
      </section>
    );
  }

  console.log(wishlistItems);

  return (
    <section className="container mt-24">
      <div className="border-b border-black pb-5">
        <PathTracker />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((item) => (
            <WishlistCard key={item._id} wishlistItems={wishlistItems} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            Your wishlist is empty
          </div>
        )}
      </div>
    </section>
  );
}

export default Page;
