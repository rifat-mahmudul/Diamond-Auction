import type React from "react";
import { Inter } from "next/font/google";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={inter.className}>
      <SidebarProvider>{children}</SidebarProvider>
    </body>
  );
}

export const metadata = {
  generator: "Fahim",
};
