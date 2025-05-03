'use client';

import {Header} from "@/components/header";

export default function AdminDashboard() {
  return (
    <div>
      <Header />
      <main className="flex-1 p-6">
        <div>
        </div>
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium mb-2">Users</h3>
            <p className="text-muted-foreground">Manage system users</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium mb-2">Listings</h3>
            <p className="text-muted-foreground">Manage property listings</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium mb-2">Reports</h3>
            <p className="text-muted-foreground">View system reports</p>
          </div>
        </div>
      </main>
    </div>
  );
}
