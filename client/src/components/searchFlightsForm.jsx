"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; 

export default function SearchFlightsForm() {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [airline, setAirline] = useState("");
  const [flights, setFlights] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); 
  const router = useRouter(); 

  const searchFlights = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/flights/search", {
        departure,
        arrival,
        date,
        airline: airline || undefined
      });
      setFlights(res.data);
    } catch (err) {
      alert(err?.response?.data?.error || "Error searching flights");
      setFlights([]);
    }
  };

    const handleBooking = (flightId) => {
    setSuccessMessage("Redirecting to booking page...");
    setTimeout(() => {
      router.push(`/book-flight/${flightId}`);
    }, 1000); 
  };

  return (
    <div className="space-y-4 p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-blue-800">Search Flights</h2>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">From</label>
          <input
            type="text"
            placeholder="Departure city"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="mt-1 border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input
            type="text"
            placeholder="Arrival city"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            className="mt-1 border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 border p-2 rounded w-full"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Airline (Optional)</label>
          <input
            type="text"
            placeholder="e.g., Emirates"
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            className="mt-1 border p-2 rounded w-full"
          />
        </div>
      </div>

      <button 
        onClick={searchFlights} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
      >
        Search Flights
      </button>

      <div className="mt-6 space-y-4">
        {flights.length > 0 ? (
          flights.map((flight) => (
            <div key={flight._id} className="p-4 border rounded-lg shadow bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{flight.airline}</h3>
                  <p className="text-gray-600">
                    {flight.from} → {flight.to}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(flight.date).toLocaleString('en-PK', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-800">Rs {flight.price}</p>
                  <p className="text-sm">
                    {flight.seatsAvailable} seats left
                  </p>
                </div>
              </div>
              <button
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                onClick={() => handleBooking(flight._id)} 
              >
                Book Flight
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            {departure || arrival || date ? "No flights found." : ""}
          </p>
        )}
      </div>
    </div>
  );
}
