"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { SessionProvider } from "next-auth/react";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/seller-dashboard");

  return (
    <>
      <SessionProvider>
        {!isDashboard && <Navbar />}
        {children}
        {!isDashboard && <ContactSection />}
        {!isDashboard && <Footer />}
      </SessionProvider>
    </>
  );
}