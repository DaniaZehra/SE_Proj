'use client';
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Image from "next/image"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const city = searchParams.get('city');
        const types = searchParams.getAll('propertyType');
        const priceOrder = searchParams.get('priceOrder') || 'asc';

        const query = new URLSearchParams();
        if (city) query.append('city', city);
        types.forEach(type => query.append('propertyType', type));
        query.append('sortBy', 'pricePerNight');
        query.append('order', priceOrder);
        query.append('page', currentPage.toString());
        query.append('limit', '6');

        const res = await fetch(`http://localhost:4000/api/customer/search?${query.toString()}`);
        const data = await res.json();
        setProperties(data.result || []);
        setTotalPages(data.pages || 1);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex items-center h-16 px-4">
          <h1 className="text-xl font-bold mr-auto">TravelStay</h1>
          <div className="relative w-full max-w-md mx-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Where are you going?" className="w-full pl-8" />
          </div>
          <Button>Search</Button>
        </div>
      </header>

      <main className="container px-4 py-6">
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="lg:col-span-1">{/* Search filters */}</div>

              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Properties in All Locations</h2>
                  <p className="text-muted-foreground">
                    Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    All Locations
                    <button className="ml-1 h-4 w-4 rounded-full">×</button>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    All Property Types
                    <button className="ml-1 h-4 w-4 rounded-full">×</button>
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <Tabs defaultValue="grid" className="w-auto">
                    <TabsList>
                      <TabsTrigger value="grid">Grid</TabsTrigger>
                      <TabsTrigger value="list">List</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="relative">
                    <select
                      defaultValue="relevance"
                      className="appearance-none w-[180px] px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input pr-8"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
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
                  <div>
                    <Tabs defaultValue="grid" className="w-full">
                      <TabsContent value="grid" className="mt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {properties.map((property) => (
                            <div
                              key={property._id}
                              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                            >
                              <div className="aspect-[4/3] relative bg-muted">
                                <Image
                                  src={property.image || "/placeholder.svg"}
                                  alt={property.name}
                                  fill
                                  className="object-cover"
                                />
                                <Badge className="absolute top-2 right-2">{property.type}</Badge>
                              </div>
                              <div className="p-4">
                                <h3 className="font-medium line-clamp-1">{property.name}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>
                                    {property.location.city}, {property.location.country}
                                  </span>
                                </div>
                                <div className="mt-2">
                                  <span className="font-bold">${property.pricePerNight}</span>
                                  <span className="text-muted-foreground"> / night</span>
                                </div>
                                <Button variant="outline" className="w-full mt-2">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="list" className="mt-0">
                        <div className="space-y-4">
                          {properties.map((property) => (
                            <div
                              key={property._id}
                              className="flex border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                            >
                              <div className="w-40 h-40 relative bg-muted shrink-0">
                                <Image
                                  src={property.image || "/placeholder.svg"}
                                  alt={property.name}
                                  fill
                                  className="object-cover"
                                />
                                <Badge className="absolute top-2 right-2">{property.type}</Badge>
                              </div>
                              <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-medium">{property.name}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>
                                    {property.location.city}, {property.location.country}
                                  </span>
                                </div>
                                <div className="mt-auto flex justify-between items-center">
                                  <div>
                                    <span className="font-bold">${property.pricePerNight}</span>
                                    <span className="text-muted-foreground"> / night</span>
                                  </div>
                                  <Button variant="outline">View Details</Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {properties.length > 0 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}