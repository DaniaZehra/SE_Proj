'use client';

import { Header } from "@/components/header";
import { Home, PlusSquare, Calendar, MessageSquare, Star, BarChart2 } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PropertyOwnerDashboard() {
  const [ownerId, setOwnerId] = useState<string | null>(null);

  useEffect(() => {
      console.log(ownerId);
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('ownerId');
      if (storedId) setOwnerId(storedId);
    }
  }, []);

  const currentUser = {
    name: "John Doe",
    image: "/property-owner.png",
  };

  return (
    <div>
      <Header
        userName={currentUser.name}
        userImage={currentUser.image}
        role="propertyOwner"
      />

      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">Property Owner Dashboard</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <Link href={`/propertyOwner/properties/${ownerId}`} className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow block">
            <div className="flex items-center gap-3 mb-2">
              <Home className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-lg">My Properties</h3>
            </div>
            <p className="text-muted-foreground">View and manage your listings</p>
          </Link>

          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <PlusSquare className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold text-lg">Add New Property</h3>
            </div>
            <p className="text-muted-foreground">List a new hotel or rental</p>
          </div>

          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold text-lg">Bookings Overview</h3>
            </div>
            <p className="text-muted-foreground">See and manage guest bookings</p>
          </div>

          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-lg">Messages & Inquiries</h3>
            </div>
            <p className="text-muted-foreground">Respond to guest questions</p>
          </div>

          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-lg">Reviews & Ratings</h3>
            </div>
            <p className="text-muted-foreground">View and manage feedback</p>
          </div>

          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <BarChart2 className="h-5 w-5 text-emerald-500" />
              <h3 className="font-semibold text-lg">Earnings & Reports</h3>
            </div>
            <p className="text-muted-foreground">Track your income</p>
          </div>
        </div>
      </main>
    </div>
  );
}