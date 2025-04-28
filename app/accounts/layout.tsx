"use client";
import type React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import PathTracker from "@/Shared/PathTracker";

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mt-28">
      <div className="border-b border-black pb-5">
        <PathTracker />
      </div>

      <div className="mt-5">
        <h1 className="text-3xl font-bold text-center mb-6">Accounts</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-between bg-background border-b rounded-none h-auto p-0 gap-2 sm:gap-4">
            <TabsTrigger
              value="profile"
              asChild
              className="flex-1 min-w-[120px] text-center rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              <Link href="/accounts">My Profile</Link>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              asChild
              className="flex-1 min-w-[120px] text-center rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              <Link href="/accounts/settings">Settings</Link>
            </TabsTrigger>
            <TabsTrigger
              value="bid-history"
              asChild
              className="flex-1 min-w-[120px] text-center rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              <Link href="/accounts/bid-history">Bid History</Link>
            </TabsTrigger>
            <TabsTrigger
              value="privacy-policy"
              asChild
              className="flex-1 min-w-[120px] text-center rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              <Link href="/accounts/privacy-policy">Privacy Policy</Link>
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              asChild
              className="flex-1 min-w-[120px] text-center rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              <Link href="/accounts/terms">Terms & Conditions</Link>
            </TabsTrigger>
            <TabsTrigger
              value="logout"
              asChild
              className="flex-1 min-w-[120px] text-center rounded-none text-red-500 py-2 px-4"
            >
              <button
                onClick={() => {
                  localStorage.clear();
                  signOut({ callbackUrl: "/login" });
                }}
                className="flex items-center justify-center w-full text-left"
              >
                <LogOut className="h-4 w-4 mr-1" /> Log out
              </button>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
