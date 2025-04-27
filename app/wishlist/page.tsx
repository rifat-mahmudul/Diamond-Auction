"use client"

import { WishlistCard } from '@/components/card/wishlistCard'
import PathTracker from '@/Shared/PathTracker'
import React, { useEffect, useState } from 'react'
import { Auction } from './_components/type';



function Page() {
  const [wishlistItems, setWishlistItems] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2ZlMTE3N2Q2MzhlNjZjZDc1MWExMWQiLCJpYXQiOjE3NDU2NDg4MTcsImV4cCI6MTc0NjI1MzYxN30.iqtgw8mfQ5zVckOgRaKDXPdUMja4T9hUyEnjmsVX3Z4"

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch('http://localhost:5100/api/v1/wishlist', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist');
        }
        const data = await response.json();
        setWishlistItems(data.data?.auctions);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

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
        <div>Error: {error}</div>
      </section>
    );
  }

  console.log(wishlistItems)

  return (
    <section className="container mt-24">
      <div className="border-b border-black pb-5">
        <PathTracker />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((item) => (
            <WishlistCard
              key={item._id}
              wishlistItems= {wishlistItems}
              // Pass other necessary props to your WishlistCard component
            />
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