"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardComponent from "./DynamicExplore";
import  Form  from 'next/form'; 
import {useRouter} from 'next/navigation'



export default function TabBar() {
  
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const city = formData.get('city') as string;
    const priceOrder = formData.get('priceOrder') as string || 'asc';
    const types = formData.getAll('propertyType') as string[];

    const queryParams = new URLSearchParams();
    if (city) queryParams.append('city', city);
    if (types.length) types.forEach(t => queryParams.append('propertyType', t));
    queryParams.append('sortBy', 'pricePerNight');
    queryParams.append('order', priceOrder);

    console.log(`query params from tabbar: ${queryParams.toString()}`)
    router.push(`/search-results?${queryParams.toString()}`);
  };

  return (
    <div className="justify-center w-full flex p-8"> 
      <Tabs defaultValue="Properties" className="w-full max-w-2xl"> 
        <div className="flex justify-center"> 
          <TabsList className="h-12 gap-1 border-separate">
            <TabsTrigger 
              value="Properties" 
              className="px-6 py-2 text-base font-medium border-2px-solid
              data-[state=active]:bg-primary 
              data-[state=active]:text-primary-foreground
              hover:bg-primary/90
              transition-colors" 
            >
              Properties
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

      {/* Search for Hotels Card */}
        <TabsContent value="Properties" className="mt-6 flex justify-center"> 
          <div className="w-full max-w-md">
          <CardComponent 
              title="Search for Properties"
              description="Find your next place to stay"
            >
              <Form action="" onSubmit={handleSubmit}>
                <input 
                  name="city"
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Where are you going?"
                />
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Property Type</label>
                  <div className="flex flex-wrap gap-2">
                    {["Hotel", "Apartment", "Villa", "Hostel"].map((propertyType) => (
                      <label key={propertyType} className="flex items-center gap-2">
                        <input type="checkbox" name="propertyType" value={propertyType} />
                        {propertyType}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort by Price */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Sort by Price</label>
                  <select name="priceOrder" className="w-full p-2 border rounded">
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                  </select>
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Search Properties</button>
              </Form>
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