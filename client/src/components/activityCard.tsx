"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar, MapPin, Star, Users, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface ActivityCardProps {
  activity: Activity
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const nextSchedule = activity.schedule[0]
  const [userId, setUserId] = useState('')
  const formattedDate = nextSchedule
    ? new Date(nextSchedule.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No dates available"

  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [bookingDialog, setBookingDialog] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(activity.schedule[0])
  const [slots, setSlots] = useState(1)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<{success: boolean; message: string} | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUserId(data.user?.id || null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleBooking = async () => {
    if (!userId) {
      setShowLoginPrompt(true)
      return
    }

    setIsBooking(true)
    const totalPrice = activity.price * slots;
    try {
      const response = await fetch('http://localhost:4000/api/customer/bookActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId: activity._id,
          slotsBooked:slots,
          userId,
          totalPrice,
          schedule:selectedSchedule
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setBookingStatus({
          success: true,
          message: "Booking has been confirmed successfully!"
        })
        setBookingDialog(false)
      } else {
        console.log(data.error)

        throw new Error('Booking failed')
      }
    } catch (error) {
      setBookingStatus({
        success: false,
        message: "There was an error processing your booking. Please try again." 
      })
    } finally {
      setIsBooking(false)
    }
  }

  const handleSlotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value > 0 && value <= selectedSchedule.slotsAvailable) {
      setSlots(value)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Status message display */}
      {bookingStatus && (
        <div className={`p-4 ${bookingStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {bookingStatus.message}
        </div>
      )}

      <div className="relative w-full h-56 rounded-t-lg overflow-hidden">
        <Image
          src={activity.images[0] || "/pexels-tobiasbjorkli-2104152.jpg"}
          alt={activity.title}
          fill
          className="object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
          priority
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-black font-medium shadow-md">
            ${activity.price}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold leading-tight line-clamp-2">{activity.title}</CardTitle>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{activity.ratings?.average}</span>
            <span className="text-xs text-muted-foreground">({activity.ratings?.count})</span>
          </div>
        </div>
        <CardDescription className="flex items-center gap-1 mt-1">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span>
            {activity.location.city}, {activity.location.country}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <p className="text-sm line-clamp-3 mb-3 text-gray-700">{activity.description}</p>
        <div className="flex flex-col gap-2 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
          {nextSchedule && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{nextSchedule.time}</span>
            </div>
          )}
          {nextSchedule && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {nextSchedule.slotsAvailable} of {nextSchedule.maxSlots} slots available
              </span>
            </div>
          )}
        </div>
        {showDetails && (
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <h4 className="font-medium mb-1">Special Needs:</h4>
              <div className="flex flex-wrap gap-1">
                {activity.specialNeeds?.map((need, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {need}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Contact:</h4>
              <p>
                {activity.createdBy.name} - {activity.createdBy.contactNo}
              </p>
            </div>
            {activity.reviews?.length > 0 && (
              <div>
                <h4 className="font-medium mb-1">Latest Review:</h4>
                <p className="italic text-muted-foreground">&quot;{activity.reviews[0].comment}&quot;</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 mt-auto">
        <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Less Info
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> More Info
            </>
          )}
        </Button>
        <Button size="sm" onClick={() => setBookingDialog(true)} className="bg-blue-600 text-white hover:bg-blue-700 transition">Book Now</Button>
      </CardFooter>

      {/* Booking Dialog */}
      <Dialog open={bookingDialog} onOpenChange={setBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {activity.title}</DialogTitle>
            <DialogDescription>
              Select a schedule and the number of slots you want to book.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule" className="text-right">
                Schedule
              </Label>
              <Select
                value={selectedSchedule?.date.toString()}
                onValueChange={(value) => {
                  const schedule = activity.schedule.find(
                    (s) => s.date.toString() === value
                  )
                  if (schedule) {
                    setSelectedSchedule(schedule)
                    setSlots(1)
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a schedule" />
                </SelectTrigger>
                <SelectContent>
                  {activity.schedule.map((schedule) => (
                    <SelectItem
                      key={schedule.date.toString()}
                      value={schedule.date.toString()}
                      disabled={schedule.slotsAvailable <= 0}
                    >
                      {new Date(schedule.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at {schedule.time} ({schedule.slotsAvailable} slots available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slots" className="text-right">
                Slots
              </Label>
              <Input
                id="slots"
                type="number"
                min="1"
                max={selectedSchedule?.slotsAvailable}
                value={slots}
                onChange={handleSlotsChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Total</Label>
              <div className="col-span-3 font-medium">
                ${(activity.price * slots).toFixed(2)}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleBooking} disabled={isBooking}>
              {isBooking ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to book an activity.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => {
              window.location.href = '/login'
            }}>
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}