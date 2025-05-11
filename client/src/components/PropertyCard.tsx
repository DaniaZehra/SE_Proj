import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin} from "lucide-react"
import {useRouter} from 'next/navigation'

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

type Props = {
  property: Property;
  layout?: "grid" | "list";
};


export default function PropertyCard({ property, layout = "grid" }: Props) {
    const router = useRouter();
    return (
        <div
        className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${layout === "list" ? "flex gap-4" : ""}`}>
        <div
            className={`relative bg-muted ${layout === "list" ? "w-1/3 aspect-video" : "aspect-[4/3]"}`}>
        <Image
            src={property.image || "/placeholder.jpg"}
            alt={property.name}
            fill
            className="object-cover"
        />
        <Badge className="absolute top-2 right-2">{property.type}</Badge>
        </div>

        <div className={`${layout === "list" ? "w-2/3 p-4" : "p-4"}`}>
            <h3 className="font-medium text-lg line-clamp-1">{property.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                    {property.location?.city}, {property.location?.country}
                </span>
            </div>
            <div className="mt-2 text-sm">
                <span className="font-bold">${property.pricePerNight}</span>
                <span className="text-muted-foreground"> / night</span>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={()=>router.push(`/property/${property._id}`)}>
                View Details
            </Button>
            </div>
        </div>
    );
    }
