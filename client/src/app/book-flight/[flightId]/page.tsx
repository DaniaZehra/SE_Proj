// app/book-flight/[flightId]/page.tsx
"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function BookFlightPage({ params }: { params: { flightId: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/flights/book', {
        flightId: params.flightId,
        ...formData
      });

      setBookingSuccess(true);
      setBookingId(response.data.bookingId);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book flight');
    }
  };

  const handleCancel = async () => {
    try {
      await axios.patch(`http://localhost:4000/api/flights/cancel/${bookingId}`);
      router.push('/');
       alert('Booking cancelled successfully!'); 
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const handleReturn = () => {
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Book Your Flight</h1>
      
      {!bookingSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              className="w-full p-2 border rounded"
              required
              pattern="[+]{0,1}[0-9]{10,15}"
              title="Enter a valid phone number"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Confirm Booking
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 text-green-700 rounded">
            <p className="font-semibold">Booking Successful!</p>
            <p>Your booking ID: {bookingId}</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleCancel}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Cancel Flight
            </button>
            <button
              onClick={handleReturn}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}