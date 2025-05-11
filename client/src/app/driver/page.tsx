'use client';

import { Header } from "@/components/header";
import { Car, CalendarDays, DollarSign } from "lucide-react"; // Import icons

export default function AdminDashboard() {
  return (
    <div>
      <Header
        userName="Driver"
        userImage="/driver.png"
        role="driver"
      />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">Driver Dashboard</h2>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Car className="h-6 w-6 text-blue-500" />
              <h3 className="font-semibold text-lg">Ride Requests</h3>
            </div>
            <p className="text-muted-foreground">View and accept new ride requests</p>
          </div>

          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <CalendarDays className="h-6 w-6 text-green-500" />
              <h3 className="font-semibold text-lg">Schedule Management</h3>
            </div>
            <p className="text-muted-foreground">Plan and organize your driving shifts</p>
          </div>

          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-6 w-6 text-amber-500" />
              <h3 className="font-semibold text-lg">Earnings</h3>
            </div>
            <p className="text-muted-foreground">Track your daily and weekly earnings</p>
          </div>
        </div>
      </main>
    </div>
  );
}