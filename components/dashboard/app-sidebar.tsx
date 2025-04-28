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

export function AppSidebar({}: AppSidebarProps) {
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      <Sidebar className="border-r-0" collapsible="none">
        <SidebarHeader className="h-[72px] flex items-center justify-center border-b border-[#5c5343] bg-[#645949]">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/logo.png"
              alt="Diamond Auctions"
              width={100}
              height={100}
              className="w-[46px] h-[39px]"
            />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4 bg-[#6b614f]">
          <SidebarMenu className="space-y-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/dashboard")}
                className="text-white py-6  hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
              >
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                  <span className="text-base font-medium text-white">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/dashboard/categories")}
                className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
              >
                <Link href="/dashboard/categories" className="flex items-center gap-3 px-4 py-3">
                  <Layers className="h-5 w-5 text-white" />
                  <span className="text-base font-medium text-white">Categories</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/dashboard/auctions")}
                className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
              >
                <Link href="/dashboard/auctions" className="flex items-center gap-3 px-4 py-3">
                  <Gavel className="h-5 w-5 text-white" />
                  <span className="text-base font-medium text-white">Auctions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/dashboard/bidders")}
                className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
              >
                <Link href="/dashboard/bidders" className="flex items-center gap-3 px-4 py-3">
                  <Users className="h-5 w-5 text-white" />
                  <span className="text-base font-medium text-white">Bidders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/dashboard/seller")}
                className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
              >
                <Link href="/dashboard/seller" className="flex items-center gap-3 px-4 py-3">
                  <User className="h-5 w-5 text-white" />
                  <span className="text-base font-medium text-white">Seller</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/dashboard/blogs")}
                className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
              >
                <Link href="/dashboard/blogs" className="flex items-center gap-3 px-4 py-3">
                  <FileText className="h-5 w-5 text-white" />
                  <span className="text-base font-medium text-white">Blogs Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/dashboard/settings")}
                className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
              >
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3">
                  <Settings className="h-5 w-5 text-white" />
                  <span className="text-base font-medium text-white">Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <div className="mt-auto p-4 bg-[#6b614f] border-t border-[#5c5343]">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsLogoutDialogOpen(true)}
                className="text-white hover:bg-[#7d7260] hover:text-white flex items-center gap-3 px-4 py-3"
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
                onClick={() => {
                  localStorage.clear();
                  signOut({ callbackUrl: "/login" });
                }}
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