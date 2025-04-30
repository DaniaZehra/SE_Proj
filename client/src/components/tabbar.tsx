import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardComponent from "./DynamicExplore";
import  Form  from 'next/form'; 

export default function TabBar() {
  return (
    <div className="w-full justify-center flex"> 
      <Tabs defaultValue="hotels" className="w-full max-w-2xl"> 
        <div className="flex justify-center"> 
          <TabsList className="h-12 gap-1">
            <TabsTrigger 
              value="hotels" 
              className="px-6 py-2 text-base font-medium" 
            >
              Hotels
            </TabsTrigger>
            <TabsTrigger 
              value="drivers"
              className="px-6 py-2 text-base font-medium"
            >
              Drivers
            </TabsTrigger>
            <TabsTrigger 
              value="flights"
              className="px-6 py-2 text-base font-medium"
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
              <Form action="/search">
                <input 
                  name="query" 
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Enter destination..."
                />
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  Search Hotels
                </button>
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