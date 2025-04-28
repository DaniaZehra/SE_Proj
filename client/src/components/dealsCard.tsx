import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"



interface DynamicCardProps {
  image: string
  title: string
  description: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
}


export default function DynamicCard({
  image,
  title,
  description,
  imageAlt = "Card image",
  imageWidth = 800,
  imageHeight = 400,
}: DynamicCardProps) {
  console.log('Image source: ', image)

  console.log('Image src:', image || '/placeholder.jpg');
  const validatedImage = image?.startsWith('/') || image?.startsWith('http') 
  ? image 
  : '/placeholder.jpg';
  console.log('validated image: ', validatedImage);
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={validatedImage}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          className="object-cover"
          priority
        />
      </div>
      <CardHeader>
        <h3 className="text-xl font-bold">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
