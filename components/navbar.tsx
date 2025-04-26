"use client";

// import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile-nav";
import { Menu, Search } from "lucide-react";

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
  // const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-[#817667] h-[83px] flex justify-center flex-col">
      <div className="container flex h-16 items-center justify-between">
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

        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Input
              placeholder="Search auctions..."
              className="pr-8 h-[32px] w-[220px] border border-[#D1D1D1] focus:outline-none placeholder:text-gray-400 text-white"
              autoFocus
              // onBlur={() => setIsSearchOpen(false)}
            />
            <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transform  text-white" />
          </div>

          <Button variant="default" className="px-6 hidden lg:block">
            Login
          </Button>

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
