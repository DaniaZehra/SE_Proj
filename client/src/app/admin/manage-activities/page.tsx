'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ActivityBooking {
  _id: string;
  userId: string;
  activityId: string;
  slotsBooked: number;
  bookingStatus: string;
  totalPrice: number;
  loyaltyPointsEarned: number;
  schedule: {
    date: string;
    time: string;
  };
  createdAt: string;
  activity?: {
    title: string;
    location: {
      address: string;
      city: string;
      country: string;
    };
    price: number;
    type: string;
  } | null;
}

export default function ManageActivities() {
  const [bookings, setBookings] = useState<ActivityBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivityBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch('http://localhost:4000/api/admin/activities/pending', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include' 
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Please login again');
          return;
        }
        throw new Error('Failed to fetch activity bookings');
      }

      const data = await response.json();
      setBookings(data || []);
    } catch (error) {
      toast.error('Failed to fetch activity bookings');
      console.error('Error fetching activity bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatusUpdate = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/admin/activities/${bookingId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Please login again');
          return;
        }
        throw new Error(`Failed to ${status} booking`);
      }

      toast.success(`Activity booking ${status} successfully`);
      fetchActivityBookings();
    } catch (error) {
      toast.error(`Failed to ${status} booking`);
      console.error('Error updating booking status:', error);
    }
  };

  useEffect(() => {
    fetchActivityBookings();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Activity Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{booking.activity?.title || 'Activity Name Not Available'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Slots Booked:</strong> {booking.slotsBooked || 0}</p>
                  <p><strong>Date:</strong> {booking.schedule?.date ? new Date(booking.schedule.date).toLocaleDateString() : 'Not specified'}</p>
                  <p><strong>Time:</strong> {booking.schedule?.time || 'Not specified'}</p>
                  <p><strong>Total Price:</strong> ${booking.totalPrice || 0}</p>
                  <p><strong>Loyalty Points:</strong> {booking.loyaltyPointsEarned || 0}</p>
                  <p><strong>Location:</strong> {booking.activity?.location ? `${booking.activity.location.address}, ${booking.activity.location.city}, ${booking.activity.location.country}` : 'Not specified'}</p>
                  <p><strong>Activity Type:</strong> {booking.activity?.type || 'Not specified'}</p>
                  <div className="flex gap-4 mt-4">
                    <Button
                      onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={() => handleBookingStatusUpdate(booking._id, 'cancelled')}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No pending activity bookings found
          </div>
        )}
      </div>
    </div>
  );
} 