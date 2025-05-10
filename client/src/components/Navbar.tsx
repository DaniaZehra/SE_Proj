"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, Check, ChevronDown, Globe, HelpCircle, LifeBuoy, LogOut, Menu, Settings, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavbarProps {
  landingPage?: boolean
}

export function Navbar({ landingPage = false }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const languages = [
    { name: "English", code: "en" },
    { name: "Spanish", code: "es" },
    { name: "French", code: "fr" },
    { name: "German", code: "de" },
    { name: "Japanese", code: "ja" },
  ]

  const [selectedLanguage, setSelectedLanguage] = React.useState(languages[0])
  
  // Comprehensive list of all auth paths
  const authPaths = [
    '/login/customer',
    '/login/owner',
    '/login/admin',
    '/login/driver',
    '/register/admin',
    '/register/customer',
    '/register/owner',
    '/register/driver'
  ]
  const isAuthPage = authPaths.some(path => pathname?.startsWith(path))

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary/90">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold ml-2">WayFare</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {/* Always show Support and Language */}
          <Button variant="ghost" size="sm" className="gap-1">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline-block">Support</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline-block">{selectedLanguage.name}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-slate-50">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => setSelectedLanguage(language)}
                  className="flex items-center justify-between"
                >
                  {language.name}
                  {selectedLanguage.code === language.code && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {!isAuthPage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline-block">Login/Register</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-50">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="flex items-center justify-between w-full">
                      <span>Login As</span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-48 bg-slate-50">
                  <DropdownMenuItem onClick={() => router.push('/login/customer')}>
                    Customer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/login/driver')}>
                    Driver
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/login/owner')}>
                    Property Owner
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/login/admin')}>
                    Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenuSeparator />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="flex items-center justify-between w-full">
                      <span>Register As</span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-48 bg-slate-50">
                  <DropdownMenuItem onClick={() => router.push('/register/customer')}>
                    Customer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/register/driver')}>
                    Driver
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/register/owner')}>
                    Property Owner
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

          {/* Only show notifications and profile when NOT on landing page AND NOT on auth pages */}
          {!landingPage && !isAuthPage && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-slate-50">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="flex flex-col gap-2 p-2">
                    <div className="flex items-start gap-2 rounded p-2 hover:bg-muted">
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                      <div>
                        <p className="text-sm font-medium">New message received</p>
                        <p className="text-xs text-muted-foreground">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 rounded p-2 hover:bg-muted">
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Your order has shipped</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 rounded p-2 hover:bg-muted">
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Welcome to our platform!</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Button variant="ghost" className="w-full justify-center" size="sm">
                    View all notifications
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-50">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LifeBuoy className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* Mobile Menu - Only show when NOT on auth pages AND NOT on landing page */}
          {!isAuthPage && !landingPage && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-50">
                <div className="flex flex-col gap-6 py-6">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                      <span className="text-xl font-bold">WayFare</span>
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex flex-col gap-4">
                    <Link
                      href="/dashboard"
                      className={cn(
                        "text-base font-medium transition-colors hover:text-primary",
                        pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/products"
                      className={cn(
                        "text-base font-medium transition-colors hover:text-primary",
                        pathname === "/products" ? "text-primary" : "text-muted-foreground",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      href="/analytics"
                      className={cn(
                        "text-base font-medium transition-colors hover:text-primary",
                        pathname === "/analytics" ? "text-primary" : "text-muted-foreground",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Analytics
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}