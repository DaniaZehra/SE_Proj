"use client";

import { useEffect, useState } from "react";
import { notFound} from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

type Property = {
  _id: string;
  name: string;
  image: string;
  pricePerNight: number;
  description?: string;
  propertyType: string
  location: {
    city: string;
    country: string;
  };
};

export default function PropertyDetail({ params }: { params: { id: string } }) {

  const router = useRouter()  
  const [property, setProperty] = useState<Property | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // Simulated
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [numGuests, setNumGuests] = useState<number>(0)
  const [endDate, setEndDate] = useState("");
  const [response, setResponse] = useState("")
  const [bookingResponseDiaglogue, setBookingResponseDialogue] = useState(false)
  params = useParams()
  const id = params.id as string


 useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent with request
        });

        if (res.ok) {
          const data = await res.json();
          setUserId(data.user?.id || null); // Set userId if exists
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
}, []);


  const handleBookings = async () => {

  console.log(`User Id: ${userId}, Property Id: ${property?._id}`)
  if (!userId) {
    setShowLoginPrompt(true);
    return;
  }

  if (!startDate || !endDate) {
    alert("Please select a valid date range.");
    return;
  }

  if(!numGuests || numGuests<0){
    alert("Please select valid number of guests")
  }

  try {
    const res = await fetch("http://localhost:4000/api/customer/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        propertyId: property?._id,
        userId,
        checkIn: startDate,
        checkOut: endDate,
        guests:numGuests,
        propertyType: property?.propertyType
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      setResponse(`Booking Unsuccessful: ${errorText}`)
      setBookingResponseDialogue(true)
      throw new Error(errorText);
    }

    const result = await res.json();
    console.log("Booking successful:", result);
    setResponse("Booking Successful")
    setBookingResponseDialogue(true)
    setMenuOpen(false);
  } catch (error) {
    console.error("Booking failed:", error);
    alert("Booking failed. Please try again.");
  }
};


  
  useEffect(() => {
    const fetchProperty = async () => {
        try {
        const res = await fetch(`http://localhost:4000/api/customer/property/${id}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            notFound(); // This will redirect to 404 page
            return;
        }

        const data = await res.json();
        
        // Validate the response structure
        if (!data?.location) {
          throw new Error('Invalid property data structure: missing location');
        }

        setProperty(data);
        } catch (err) {
        console.error("Error fetching property:", err);
        notFound();
        }
    };

    fetchProperty();
  }, [id]);

  if (!property) return <div className="p-6">Loading...</div>;

return (
  <div className="p-6 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
    <Image
      src={property.image || '/placeholder.jpg'}
      alt={property.name}
      width={800}
      height={400}
      className="w-full rounded mb-4 object-cover"
    />
    <p className="text-muted-foreground mb-2">
      {property?.location?.city || 'No city specified'}, {property?.location?.country || 'No city specified'}
    </p>
    <p className="text-lg font-semibold mb-2">${property.pricePerNight} / night</p>
    <p className="text-base">{property.description || "No description provided."}</p>

    <Button variant="outline" className="w-full mt-4" onClick={() => setMenuOpen(true)}>
      Book It
    </Button>

    {/* Booking Dialog */}
    <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
      <DialogContent className="bg-slate-50">
        <DialogHeader>
          <DialogTitle>Book {property.name}</DialogTitle>
          <DialogDescription>
            Confirm your stay in {property.location.city}, {property.location.country}.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex flex-col space-y-2">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <input
            type="number"
            value={numGuests}
            onChange={(e)=>setNumGuests(Number(e.target.value))}
            className="border rounded px-2 py-1"
          />

          <p>
            Price per night: <strong>${property.pricePerNight}</strong>
          </p>

          {startDate && endDate && (
            <p>
              Total cost:{" "}
              <strong>
                $
                {(() => {
                  const days =
                    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                    (1000 * 60 * 60 * 24);
                  return days > 0 ? property.pricePerNight * days : 0;
                })()}
              </strong>
            </p>
          )}
        </div>

        <DialogFooter className="mt-4 bg-slate-50">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleBookings}>Confirm Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={bookingResponseDiaglogue} onOpenChange={setBookingResponseDialogue}>
      <DialogContent className="mt-4 bg-slate-50">
  <DialogHeader>
    <DialogTitle>Booking Status</DialogTitle>
    <DialogClose />
  </DialogHeader>
  <DialogDescription>
    {response}
  </DialogDescription>
</DialogContent>
    </Dialog>

    {/* Login Required Dialog */}
    <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in required</DialogTitle>
          <DialogDescription>
            You must be signed in to book a property.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button onClick={() => router.push('/login/customer')}>
            Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
);

}
