import { User, Settings, LogOut, Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  userName?: string
  userImage?: string
  loyaltyPoints?: number
}

export function Header({
  userName = "Sarah",
  userImage = "/placeholder.svg?height=40&width=40",
  loyaltyPoints = 3200,
}: HeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-medium">
            Welcome back, <span className="font-bold">{userName}</span>! Ready for your next adventure?
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-muted/50 p-2 rounded-md flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span className="font-medium">{loyaltyPoints.toLocaleString()} Points</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-10 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
                  <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block font-medium">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{userName}</p>
                  <Badge variant="outline" className="text-xs">
                    Gold Member
                  </Badge>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
