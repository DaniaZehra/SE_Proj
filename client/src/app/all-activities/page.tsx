'use client'
import ActivityCard from "@/components/activityCard"
import { Activity } from "lucide-react"
import { useEffect, useState } from "react"


export interface Activity {
  _id: string
  title: string
  description: string
  location: {
    address: string
    city: string
    country: string
  }
  createdBy: {
    userId: string
    name: string
    contactNo: string
  }
  schedule: Array<{
    date: Date
    time: string
    slotsAvailable: number
    maxSlots: number
  }>
  price: number
  specialNeeds: string[]
  images: string[]
  ratings: {
    average: number
    count: number
  }
  reviews: Array<{
    userId: string
    comment: string
    rating: number
    date: Date
  }>
}

export default function ActivitiesPage() {
    const [length, setLength] = useState<number>()
    const [activities, setActivities] = useState<Activity[]>([])
    useEffect(() => {
        fetch("http://localhost:4000/api/customer/getActivities")
            .then(res => {
                if (!res.ok) {
                    alert("Failed to fetch. Please try again later.");
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then(data => {
                console.log(data.result);
                console.log(data)
                setActivities(data.result);
                setLength(data.length)
            })
            .catch(error => {
                console.error("Fetch error:", error);
            });
    }, []);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Explore Activities</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {length === 0 ? (
              <p className="text-gray-500 text-lg">No activities at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                  <ActivityCard key={activity._id} activity={activity} />
                ))}
              </div>
            )}
            </div>
        </div>
    )
}