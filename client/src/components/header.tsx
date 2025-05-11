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
  role?: 'admin' | 'propertyOwner' | 'driver' | 'customer'
}

function getGreeting(role: HeaderProps['role'], userName: string) {
  switch (role) {
    case 'admin':
      return `Welcome back, ${userName}. Lets get back to work.`
    case 'propertyOwner':
      return `Welcome back, ${userName}. Manage your property listings here.`
    case 'driver':
      return `Welcome back, ${userName}. Ready for your next delivery?`
    case 'customer':
      return `Welcome back, ${userName}! Ready for your next adventure?`
    default:
      return `Welcome back, ${userName}!`
  }
}

export function Header({
  userName = "Sarah",
  userImage = "/placeholder.svg?height=40&width=40",
  loyaltyPoints = 3200,
  role = 'customer' //for default,

}: HeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
        <h1 className="text-xl font-medium">
          {getGreeting(role, userName)}
        </h1>

        </div>

        <div className="flex items-center gap-4">
          {/* Only show loyalty points for users */}
          {role !== 'admin' && role !== 'propertyOwner' && role !== 'driver' && (
          <div className="bg-muted/50 p-2 rounded-md flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span className="font-medium">{loyaltyPoints.toLocaleString()} Points</span>
          </div>
          )}

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
                  {['customer', 'driver', 'property-owner', 'admin'].includes(role) && (
                  <Badge variant="outline" className="text-xs">
                    {{
                      admin: 'Administrator',
                      'propertyOwner': 'Host',
                      driver: 'Transport Partner',
                      customer: 'Gold Member',
                    }[role]}
                  </Badge>
                )}
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
