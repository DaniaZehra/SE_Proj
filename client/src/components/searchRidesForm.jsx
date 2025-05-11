"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SearchForm({ fromDashboard = false, customerId = null }) {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [rides, setRides] = useState([]);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const directionsRenderer = useRef(null);
  const router = useRouter();

  const searchRides = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/customer/searchRides", {
        pickupLocation,
        dropoffLocation,
      });
      const foundRides = res.data.rides || [];
      setRides(foundRides);
      showRouteOnMap(foundRides);
    } catch (err) {
      alert(err?.response?.data?.message || "Error searching rides");
      setRides([]);
      clearMap();
    }
  };

  const handleBooking = (rideId) => {
    if (!fromDashboard || !customerId) {
      router.push("/login/customer");
    } else {
      router.push(`/customer/book/${rideId}`);
    }
  };

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 24.8607, lng: 67.0011 }, 
      zoom: 12,
    });
  };

  const clearMap = () => {
    if (directionsRenderer.current) {
      directionsRenderer.current.setMap(null);
      directionsRenderer.current = null;
    }
  };

  const showRouteOnMap = async (rides) => {
    if (!window.google || !mapInstance.current || rides.length === 0) return;
    clearMap();

    const firstRide = rides[0];
    const directionsService = new window.google.maps.DirectionsService();

    directionsRenderer.current = new window.google.maps.DirectionsRenderer({
      suppressMarkers: false,
      map: mapInstance.current,
    });

    try {
      const response = await directionsService.route({
        origin: firstRide.pickupLocation,
        destination: firstRide.dropoffLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      directionsRenderer.current.setDirections(response);
    } catch (error) {
      console.error("Failed to get directions:", error);
    }
  };

  useEffect(() => {
    if (window.google) {
      initializeMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBASI7w3mC4GGLS-AnwWCWO8-A_j4dtxNo`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Search for Rides</h2>

      <input
        type="text"
        placeholder="Pickup Location"
        value={pickupLocation}
        onChange={(e) => setPickupLocation(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Dropoff Location"
        value={dropoffLocation}
        onChange={(e) => setDropoffLocation(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button onClick={searchRides} className="bg-blue-600 text-white px-4 py-2 rounded">
        Search Rides
      </button>

      {/*displaying the map hehe*/}
      <div ref={mapRef} className="w-full h-96 rounded border shadow" />

      <ul className="space-y-3 mt-4">
        {rides.map((ride) => (
          <li key={ride._id} className="p-4 border rounded shadow bg-white">
            <p><strong>From:</strong> {ride.pickupLocation}</p>
            <p><strong>To:</strong> {ride.dropoffLocation}</p>
            <p><strong>Fare:</strong> Rs {ride.fare}</p>
            <p>
              <strong>Driver:</strong>{" "}
              {ride.driverId?.firstname && ride.driverId?.lastname
                ? `${ride.driverId.firstname} ${ride.driverId.lastname}`
                : "TBD"}
            </p>
            <p><strong>Status:</strong> {ride.status}</p>
            <button
              onClick={() => handleBooking(ride._id)}
              className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
            >
              Book
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
