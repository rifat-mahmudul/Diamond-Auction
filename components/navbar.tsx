"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Added
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile-nav";
import { BellRing, Heart, Menu, Search, UserRound } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Auctions", href: "/auctions" },
  { name: "About Us", href: "/about-us" },
  { name: "FAQ", href: "/faq" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const isMobile = useMobile();
  const pathname = usePathname(); // Added

  const iconLinks = [
    { icon: Heart, href: "/wishlist" },
    { icon: BellRing, href: "/notifications" },
    { icon: UserRound, href: "/profile" },
  ];

  const getIconClasses = (href: string) => `
    border-2 rounded-full p-2 transition-colors
    ${pathname === href ? "border-[#E6C475]" : "border-[#D1D1D1] hover:border-[#E4C072] hover:bg-[#E4C072]"}
  `;

  const getIconColor = (href: string) =>
    pathname === href ? "text-[#E6C475]" : "text-white";

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-[#817667] h-[83px] flex justify-center flex-col">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={46}
              height={39}
              className="h-[39px] w-[46px]"
            />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div>
          {!isMobile && (
            <nav className="hidden md:flex md:gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[16px] font-medium text-white transition-colors hover:text-[#E4C072]"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative w-full max-w-sm">
            <Input
              placeholder="Search auctions..."
              className="pr-8 h-[32px] w-[220px] border border-[#D1D1D1] focus:outline-none placeholder:text-gray-400 text-white"
              autoFocus
            />
            <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-white" />
          </div>

          {/* Login Button */}
          <Button variant="default" className="px-6 hidden lg:block">
            Login
          </Button>

          {/* Icon Links */}
          <div className="flex items-center gap-4">
            {iconLinks.map(({ icon: Icon, href }) => (
              <Link key={href} href={href} className={getIconClasses(href)}>
                <Icon className={getIconColor(href)} size={20} />
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-[#f5f0e8]">
                <nav className="flex flex-col gap-4 pt-10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
