'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PropertyCard from "./PropertyCard";

type Property = {
  _id: string;
  name: string;
  pricePerNight: number;
  type: string;
  image: string;
  location: {
    city: string;
    country: string;
  };
};

export default function SearchResults() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortField, setSortField] = useState('pricePerNight');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const searchParams = useSearchParams()
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        query.append('page', String(page));
        query.append('limit', String(limit));
        query.append('sortBy', sortField);
        query.append('order', sortOrder);
        if (city) query.append('city', city);
        if (country) query.append('country', country);

        console.log(process.env.NEXT_PUBLIC_BACKEND_URL)

        console.log(`query params received in search-component: ${query}`)
        const res = await fetch(`http://localhost:4000/api/customer/search?${query}`);
        if (!res.ok) {
          const text = await res.text();
          console.error("Backend error:", text);
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched data:", data);

        setProperties(data.properties || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, limit, sortField, sortOrder, city, country]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">{/* Optional: Add filter UI here */}</div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Properties in All Locations</h2>
              <p className="text-muted-foreground">
                Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Tabs defaultValue="grid" className="w-auto">
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter city"
                  onChange={(e) => setCity(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </div>

              <div>
                 <input
                  type="text"
                  placeholder="Enter country"
                  onChange={(e) => setCountry(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </div>

              <div className="relative">
                <select
                  value={`${sortField}-${sortOrder}`}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'pricePerNight-asc') {
                      setSortField('pricePerNight');
                      setSortOrder('asc');
                    } else if (value === 'pricePerNight-desc') {
                      setSortField('pricePerNight');
                      setSortOrder('desc');
                    } else if (value === 'rating-desc') {
                      setSortField('rating');
                      setSortOrder('desc');
                    }
                  }}
                  className="appearance-none w-[180px] px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input pr-8"
                >
                  <option value="pricePerNight-asc">Price: Low to High</option>
                  <option value="pricePerNight-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading properties...</p>
              </div>
            ) : (
              <Tabs defaultValue="grid" className="w-full">
                <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {properties.map((property) => (
                      <PropertyCard key={property._id} property={property} layout="grid" />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <PropertyCard key={property._id} property={property} layout="list" />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {properties.length > 0 && totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page - 1);
                      }}
                      className={page === 1 ? "opacity-50 cursor-not-allowed" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <PaginationItem key={pg}>
                      <PaginationLink
                        href="#"
                        isActive={page === pg}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pg);
                        }}
                      >
                        {pg}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page + 1);
                      }}
                      className={page === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
