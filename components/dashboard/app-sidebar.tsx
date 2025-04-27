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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface AppSidebarProps {
  isMobile?: boolean;
}

export function AppSidebar({ isMobile = false }: AppSidebarProps) {
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = () => {
    // Handle logout logic here
    setIsLogoutDialogOpen(false);
    // Redirect to login page or perform other logout actions
  };

  return (
    <>
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
                isActive={isActive("/dashboard/categories")}
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
                isActive={isActive("/dashboard/auctions")}
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
                isActive={isActive("/dashboard/bidders")}
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
                isActive={isActive("/dashboard/seller")}
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
                isActive={isActive("/dashboard/blogs")}
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
                isActive={pathname.startsWith("/settings")}
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
                onClick={() => setIsLogoutDialogOpen(true)}
                className="text-white hover:bg-[#7d7260] hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[#6b614f] text-white border-none">
          <div className="flex flex-col items-center justify-center py-4">
            <Image
              src="/diamond-logo.svg"
              alt="Diamond Auctions"
              width={50}
              height={50}
              className="mb-4"
            />
            <DialogTitle className="text-xl font-bold text-center">
              Are You Sure To Log Out?
            </DialogTitle>
            <div className="flex gap-4 mt-6 w-full">
              <Button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex-1 bg-[#6b614f] border border-white hover:bg-[#7d7260]"
                variant="outline"
              >
                Yes
              </Button>
              <Button
                onClick={() => setIsLogoutDialogOpen(false)}
                className="flex-1 bg-amber-100 text-[#6b614f] hover:bg-amber-200 hover:text-[#6b614f]"
              >
                No
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
