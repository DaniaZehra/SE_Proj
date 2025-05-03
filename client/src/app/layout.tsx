'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppContent>{children}</AppContent>
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noSidebarPaths = ["/login", "/"];
  const noNavbarPaths = ["/login"];

  const showSidebar = !noSidebarPaths.includes(pathname);
  const showNavbar = !noNavbarPaths.includes(pathname);

  return (
    <div className="flex">
      {showSidebar && (
        <div className="hidden md:block h-screen">
          <Sidebar/>
        </div>
      )}
      <div className="flex-1">
        {showNavbar && <Navbar landingPage={!showSidebar} />}
        <div className={showSidebar ? "ml-4" : ""}>
          {showSidebar ? (
            <LayoutWithSidebar>{children}</LayoutWithSidebar>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
