'use client'
import TabBar from "@/components/tabbar"
import {Header} from "@/components/header"
export default function CustomerDashboard(){
    return (
          <div>
          <Header/>
          <main className="flex-1 p-6">
          <div>
            <TabBar/>
          </div>
          <h2 className="text-2xl font-bold mb-6">Your Dashboard</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-medium mb-2">Recent Activity</h3>
              <p className="text-muted-foreground">No recent activity</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-medium mb-2">Upcoming Events</h3>
              <p className="text-muted-foreground">No upcoming events</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-medium mb-2">Tasks</h3>
              <p className="text-muted-foreground">No pending tasks</p>
            </div>
          </div>
        </main>
        </div>
    )
}
