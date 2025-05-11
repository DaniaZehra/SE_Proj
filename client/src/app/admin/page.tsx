'use client';

import { Header } from "@/components/header";
import { Users, Home, Luggage, HelpCircle } from "lucide-react";
import Link from 'next/link';
import AnalyticsChart from "@/components/dashboard/analytics-chart";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const currentUser = {
    name: "Admin",
    image: "/admin-avatar.png",
  };

  return (
    <div>
      <Header
        userName={currentUser.name}
        userImage={currentUser.image}
        role="admin"
      />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <Link href="/admin/users">
            <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-lg">User Management</h3>
              </div>
              <p className="text-muted-foreground">Manage system users</p>
            </div>
          </Link>


          <Link href="/admin/pending-properties">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Pending Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage pending property listings</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/manage-activities">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Manage Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage activity bookings</p>
              </CardContent>
            </Card>
          </Link>

          <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <HelpCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold text-lg">Help & Support</h3>
            </div>
            <p className="text-muted-foreground">Resolve support related queries</p>
          </div>
        </div>
        <div className="mb-6">
          <AnalyticsChart />
        </div>
      </main>
    </div>
  );
}