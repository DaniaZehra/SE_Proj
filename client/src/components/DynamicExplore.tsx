'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface CardComponentProps {
    title: string,
    description: string,
    children: React.ReactNode,
    footer?: React.ReactNode
}

export default function CardComponent({title, description, children, footer}:CardComponentProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
               {children}
            </CardContent>
            <CardFooter>
            {footer && <CardFooter>{footer}</CardFooter>}
            </CardFooter>
        </Card>
    )
}  
  
