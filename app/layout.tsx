import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import AppProvider from "@/Provider/AppProvider";
import LayoutShell from "./layout-shell";
import { Toaster } from "sonner";
import { SocketProvider } from "@/Provider/SocketProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Diamond Auction",
  description: "Claim your diamond now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <AppProvider>
          <SocketProvider>
            <LayoutShell>{children}</LayoutShell>
            <Toaster position="top-right" />
          </SocketProvider>
        </AppProvider>
      </body>
    </html>
  );
}
