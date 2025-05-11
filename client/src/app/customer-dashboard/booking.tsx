'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const customerId = typeof window !== 'undefined' ? localStorage.getItem('customerId') : null;
  const rideId = searchParams.get('rideId');

  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/customer/${customerId}/booking/${rideId}`);
        setBookingInfo(res.data.booking);
      } catch (err) {
        console.error('Failed to fetch booking info:', err);
      } finally {
        setLoading(false);
      }
    };

    if (rideId && customerId) {
      fetchBooking();
    }
  }, [rideId, customerId]);

  const handleCancel = async () => {
    try {
      const res = await axios.post(`http://localhost:4000/api/customer/${customerId}/cancelRide/${rideId}`);
      setActionMsg(res.data.message);
      router.push(`/customer-dashboard/cancel`);
    } catch (err: any) {
      setActionMsg(err?.response?.data?.message || 'Cancellation failed.');
    }
  };

  const handlePayment = async () => {
    try {
      const res = await axios.post(`http://localhost:4000/api/customer/${customerId}/ride/${rideId}/pay`);
      setActionMsg(res.data.message);
      router.push(`/customer-dashboard/payment`);
    } catch (err: any) {
      setActionMsg(err?.response?.data?.message || 'Payment failed.');
    }
  };

  if (loading) return <div className="p-4">Loading booking details...</div>;
  if (!bookingInfo) return <div className="p-4">No booking information found.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ride Booking Details</h2>
      <div className="bg-white rounded shadow p-4 mb-4">
        <p><strong>Ride ID:</strong> {bookingInfo.rideId}</p>
        <p><strong>Driver Name:</strong> {bookingInfo.driverName || 'N/A'}</p>
        <p><strong>Pickup:</strong> {bookingInfo.pickupLocation}</p>
        <p><strong>Dropoff:</strong> {bookingInfo.dropoffLocation}</p>
        <p><strong>Fare:</strong> Rs. {bookingInfo.fare}</p>
        <p><strong>Booking Time:</strong> {new Date(bookingInfo.createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> {
          bookingInfo.status === 'pending' ? 'Ongoing'
          : bookingInfo.status === 'cancelled' ? 'Cancelled'
          : bookingInfo.status === 'completed' ? 'Completed'
          : bookingInfo.status
        }</p>
      </div>

      {actionMsg && <div className="text-green-600 font-medium mb-4">{actionMsg}</div>}

      <div className="flex gap-4">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={handleCancel}
          disabled={bookingInfo.status !== 'pending'}
        >
          Cancel Ride
        </button>

        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={handlePayment}
          disabled={bookingInfo.status !== 'pending'}
        >
          Make Payment
        </button>
      </div>
    </div>
  );
}
