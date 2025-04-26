"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Gavel,
  Users,
  User,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Sidebar className="border-r-0" collapsible="none">
      <SidebarHeader className="h-[72px] flex items-center justify-center border-b border-[#5c5343] bg-[#6b614f]">
        <div className="flex items-center gap-2">
          <Image
            src="/diamond-logo.svg"
            alt="Diamond Auctions"
            width={30}
            height={30}
          />
          <div className="text-amber-100 uppercase text-xs tracking-wider">
            <div className="font-bold">DIAMOND</div>
            <div className="text-[10px]">AUCTIONS</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-0 bg-[#6b614f]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard")}
              className="text-white hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#7d7260]"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/categories")}
              className="text-white hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#7d7260]"
            >
              <Link href="/dashboard/categories">
                <Layers className="h-5 w-5" />
                <span>Categories</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/auctions")}
              className="text-white hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#7d7260] data-[active=true]:font-semibold"
            >
              <Link href="/dashboard/auctions">
                <Gavel className="h-5 w-5" />
                <span>Auctions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/bidders")}
              className="text-white hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#7d7260]"
            >
              <Link href="/dashboard/bidders">
                <Users className="h-5 w-5" />
                <span>Bidders</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/seller")}
              className="text-white hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#7d7260]"
            >
              <Link href="/dashboard/seller">
                <User className="h-5 w-5" />
                <span>Seller</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/blogs")}
              className="text-white hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#7d7260]"
            >
              <Link href="/dashboard/blogs">
                <FileText className="h-5 w-5" />
                <span>Blogs Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/settings")}
              className="text-white hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#7d7260]"
            >
              <Link href="/dashboard/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <div className="mt-auto p-4 bg-[#6b614f]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-white hover:bg-[#7d7260] hover:text-white"
            >
              <Link href="/logout">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
