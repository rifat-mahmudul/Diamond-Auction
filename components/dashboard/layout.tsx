"use client";

import type React from "react";
import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 left-3 z-50"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[250px]">
          <AppSidebar isMobile />
        </SheetContent>
      </Sheet>

      <SidebarInset className="bg-gray-100 w-full">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="md:hidden w-6"></div> {/* Spacer for mobile */}
          <div className="hidden md:block"></div> {/* Empty div for desktop */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                1
              </span>
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Mr. Raja</span>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>MR</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="p-6 w-full">{children}</main>
      </SidebarInset>
    </div>
  );
}
