'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Booking {
  _id: string;
  userId: string;
  propertyId: string;
  roomType: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  price: number;
  status: string;
  property: {
    name: string;
    location: {
      city: string;
      country: string;
    };
    propertyType: string;
  };
}

export default function PendingProperties() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch('http://localhost:4000/api/admin/bookings/pending', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Please login again');
          return;
        }
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch pending bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatusUpdate = async (bookingId: string, status: 'approved' | 'cancelled') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/admin/bookings/${bookingId}/status`,
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

      toast.success(`Booking ${status} successfully`);
      fetchPendingBookings();
    } catch (error) {
      toast.error(`Failed to ${status} booking`);
      console.error('Error updating booking status:', error);
    }
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pending Property Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <Card key={booking._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{booking.property?.name || 'Property Name Not Available'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Room Type:</strong> {booking.roomType}</p>
                <p><strong>Guests:</strong> {booking.guests}</p>
                <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
                <p><strong>Total Price:</strong> ${booking.price}</p>
                <p><strong>Location:</strong> {booking.property?.location.city}, {booking.property?.location.country}</p>
                <p><strong>Property Type:</strong> {booking.property?.propertyType}</p>
                <div className="flex gap-4 mt-4">
                  <Button
                    onClick={() => handleBookingStatusUpdate(booking._id, 'approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleBookingStatusUpdate(booking._id, 'cancelled')}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {bookings.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No pending bookings found
          </div>
        )}
      </div>
    </div>
  );
} 