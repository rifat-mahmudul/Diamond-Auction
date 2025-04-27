"use client"
import type React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container px-4 py-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-medium">My Profile</h1>
        <div className="text-sm text-muted-foreground">
          <Link href="/">Home</Link> &gt; <Link href="/accounts">Accounts</Link>{" "}
          &gt; My Profile
        </div>
      </div>
      <hr className="my-4 border-t border-gray-200" />

      <h1 className="text-3xl font-bold text-center mb-6">Accounts</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-between bg-background border-b rounded-none h-auto p-0">
          <TabsTrigger
            value="profile"
            asChild
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none data-[state=active]:border-primary py-2 px-4"
          >
            <Link href="/accounts">My Profile</Link>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            asChild
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none data-[state=active]:border-primary py-2 px-4"
          >
            <Link href="/accounts/settings">Settings</Link>
          </TabsTrigger>
          <TabsTrigger
            value="bid-history"
            asChild
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none data-[state=active]:border-primary py-2 px-4"
          >
            <Link href="/accounts/bid-history">Bid History</Link>
          </TabsTrigger>
          <TabsTrigger
            value="privacy-policy"
            asChild
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none data-[state=active]:border-primary py-2 px-4"
          >
            <Link href="/accounts/privacy-policy">Privacy Policy</Link>
          </TabsTrigger>
          <TabsTrigger
            value="terms"
            asChild
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none data-[state=active]:border-primary py-2 px-4"
          >
            <Link href="/accounts/terms">Terms & Conditions</Link>
          </TabsTrigger>
          <TabsTrigger
            value="logout"
            asChild
            className="rounded-none text-red-500 py-2 px-4"
          >
            <button
              onClick={() => {
                signOut();
                redirect('/');
              }}
              className="flex items-center w-full text-left"
            >
              <LogOut className="h-4 w-4 mr-1" /> Log out
            </button>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">{children}</div>
    </div>
  );
}
