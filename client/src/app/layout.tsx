'use client'
//import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider, SidebarInset} from "@/components/ui/sidebar";
import SidebarWithTrigger from "@/components/SidebarWithTrigger";
import { User, LogOut, Settings } from 'lucide-react';


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

const currentUser = {
  name: "Jane Doe",
  avatar: "/custom-avatar.jpg",
  initials: "JD"
};

const accountItems = [
  { 
    label: "Profile", 
    href: '/profile',
    icon: <User className="w-4 h-4" />
  },
  { 
    label: "Settings", 
    href: '/settings',
    icon: <Settings className="w-4 h-4" />
  },
  { 
    label: "Logout", 
    onClick: () => console.log("Logging out..."),
    icon: <LogOut className="w-4 h-4" />
  }
];


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Navbar  avatar={{
          src: currentUser.avatar,
          fallbackText: currentUser.initials,
          alt: `${currentUser.name}'s profile picture`
        }}
        accountItems={accountItems}
        theme={{
          background: "bg-indigo-600 dark:bg-indigo-900",
          text: "text-white"
        }}
      >
        <div className="text-sm text-white mr-4">
          Welcome, {currentUser.name}
        </div>
      </Navbar>
        <div className="flex">
          <SidebarProvider>
          <AppSidebar />
          <SidebarWithTrigger/>
            <SidebarInset>
            {children}
            </SidebarInset>
          </SidebarProvider>
          </div>
      </body>
    </html>
  );
}