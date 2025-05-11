'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import { Navbar } from "@/components/Navbar";
// import { initPostHog } from '../lib/posthog';
// import { useEffect } from "react";

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

// //  useEffect(()=>{
// //   initPostHog();
// //  }
// )

  
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
  //const noNavbarPaths = ["/login"];

  const showSidebar = !(noSidebarPaths.includes(pathname)||pathname.includes('login')||pathname.includes('register'));
  //const showNavbar = !(noNavbarPaths.includes(pathname)||pathname.includes('login')||pathname.includes('register'))

  // if(showNavbar){
  if(showSidebar){
    return(
      <div>
        <Navbar/>
        <div className="flex">
          <LayoutWithSidebar>{children}</LayoutWithSidebar>
        </div>
        </div>
    )
  }
  else{
    return(
      <div>
        <Navbar landingPage={true}/>
          {children}
        </div>
      )
  }
}