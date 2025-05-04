"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardComponent from "./DynamicExplore";
import  Form  from 'next/form'; 
import { useState } from "react";

type Property = {
  _id: string;
  name: string;
  pricePerNight: number;
  location: {
    city: string;
    country: string;
  };
  // Add any other fields here
};

export default function TabBar() {
  const [hotels, setHotels] = useState<Property[]>([]);
  const [city, setCity] = useState('');
  const [sortBy, setSortBy] = useState('pricePerNight');
  const [order, setOrder] = useState('asc');
  const page = useState(1);
  const limit = 10;

  const handleSearch = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = new URLSearchParams({
      city,
      sortBy,
      order,
      page: String(page),
      limit: String(limit)
    });
    const res = await fetch(`/api/customer/search?${query.toString()}`);
    const data = await res.json();

    setHotels(data.result); 
  };

  return (
    <div className="justify-center w-full flex p-8"> 
      <Tabs defaultValue="hotels" className="w-full max-w-2xl"> 
        <div className="flex justify-center"> 
          <TabsList className="h-12 gap-1 border-separate">
            <TabsTrigger 
              value="hotels" 
              className="px-6 py-2 text-base font-medium border-2px-solid
              data-[state=active]:bg-primary 
              data-[state=active]:text-primary-foreground
              hover:bg-primary/90
              transition-colors" 
            >
              Hotels
            </TabsTrigger>
            <TabsTrigger 
              value="drivers"
              className="px-6 py-2 text-base font-medium border-2px-solid
              data-[state=active]:bg-primary 
              data-[state=active]:text-primary-foreground
              hover:bg-primary/90
              transition-colors"
            >
              Drivers
            </TabsTrigger>
            <TabsTrigger 
              value="flights"
              className="px-6 py-2 text-base font-medium border-2px-solid
              data-[state=active]:bg-primary 
              data-[state=active]:text-primary-foreground
              hover:bg-primary-40
              transition-colors"
            >
              Flights
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="hotels" className="mt-6 flex justify-center"> 
          <div className="w-full max-w-md">
          <CardComponent 
              title="Search for Hotels"
              description="Find your next place to stay"
              footer={<button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Send</button>}
            >
              <Form action="/search" onSubmit={handleSearch}>
                <input 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Enter destination..."
                />
                <select value={sortBy} 
                  onChange={(e)=>setSortBy(e.target.value)} 
                  className="w-full p-2 border rounded mb-2">
                  <option value="pricePerNight">Price</option>
                  <option value="name">Name</option>
                  <option value="createdAt">Date Added</option>
                </select>
                <select name="order" className="w-full p-2 border rounded mb-2">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  Search Hotels
                </button>
              </Form>
              {hotels.length > 0 && (
              <ul className="mt-4">
                {hotels.map((hotel) => (
                  <li key={hotel._id} className="p-2 border-b">
                    <strong>{hotel.name}</strong> – {hotel.location.city} – ${hotel.pricePerNight}/night
                  </li>
                ))}
              </ul>

            )}
            </CardComponent>
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="mt-6">
          <CardComponent 
            title="Search for Drivers"
            description="Find professional drivers"
            footer={<button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Request</button>}
          >
            <div className="p-4">Driver search form would go here</div>
          </CardComponent>
        </TabsContent>

        <TabsContent value="flights" className="mt-6">
          <CardComponent 
            title="Search for Flights"
            description="Book your next flight"
            footer={<button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Book</button>}
          >
            <div className="p-4">Flight search form would go here</div>
          </CardComponent>
        </TabsContent>
      </Tabs>
    </div>
  );
}