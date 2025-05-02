'use client'
//import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import {Navbar} from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Travel Management App",
//   description: "Seamless Travel, Unforgettable Experiences!",
// };



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex">
          <AppContent>{children}</AppContent>
          </div>
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const noSidebarPaths = ["/login", "/"]
  const noNavbarPaths = ["/login"]
  
  if (noSidebarPaths.includes(pathname)) {
    if(noNavbarPaths.includes(pathname)){
      return <div>{children}</div>
    }
    else{
      return (
      <div>
        <Navbar landingPage={true}/>
        <div>{children}</div>
      </div>
    )
    }
  }
  
  return (
    <div className="flex-1">
      <Navbar/>
      <div className="ml-4">
      <LayoutWithSidebar>{children}</LayoutWithSidebar>
      </div>
    </div>
  )
}