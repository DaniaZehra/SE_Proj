<<<<<<< Updated upstream
import type { ReactNode } from "react"
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  type LucideIcon,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"


export interface SubNavigationItem {
  title: string
  url: string
  isActive?: boolean
}

export interface NavigationItem {
  title: string
  icon?: LucideIcon
  url: string
  isActive?: boolean
  badge?: string | number
  items?: SubNavigationItem[]
}

export interface AppSidebarProps {
  navigationItems?: NavigationItem[]
  title?: string
  logo?: ReactNode
  subtitle?: string
}

const defaultNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
    isActive: true,
  },
  {
    title: "Upcoming",
    icon: BarChart3,
    url: "/upcoming",
  },
  {
    title: "Calendar",
    icon: Calendar,
    url: "/calendar",
  },

  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
]


export function AppSidebar({ navigationItems = defaultNavigationItems}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
          <Separator className="mt-12 ml-1 top-4 left-2 p-2 flex items-center "/>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                    <a href={item.url}>
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>

                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                            <a href={subItem.url}>{subItem.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
=======
import {
    Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput,
    CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from "@/components/ui/command"
import Link from "next/link";
import { LayoutDashboard, Hotel, Car, Plane, Activity, Package, User, PieChart, MessageCircle } from 'lucide-react'

const Sidebar = () => {
    return (
        <div>
            <Command>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Bookings Management">
                        <CommandItem>
                            <Link href="/bookings/hotels">
                                <Hotel className="mr-2" /> Hotels
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/bookings/rides">
                                <Car className="mr-2" /> Rides
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/bookings/flights">
                                <Plane className="mr-2" /> Flights
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/bookings/activities">
                                <Activity className="mr-2" /> Activities
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />

                    <CommandGroup heading="Listings Management">
                        <CommandItem>
                            <Link href="/listings/properties">
                                <LayoutDashboard className="mr-2" /> Properties
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/listings/packages">
                                <Package className="mr-2" /> Packages
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/listings/activities">
                                <Activity className="mr-2" /> Activities
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />

                    <CommandGroup heading="User Management">
                        <CommandItem>
                            <Link href="/users/all">
                                <User className="mr-2" /> Users
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/users/organizers">
                                <User className="mr-2" /> Organizers
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/users/drivers">
                                <User className="mr-2" /> Drivers
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />

                    <CommandGroup heading="Reports & Analytics">
                        <CommandItem>
                            <Link href="/reports/bookings">
                                <PieChart className="mr-2" /> Bookings Statistics
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/reports/engagement">
                                <PieChart className="mr-2" /> User Engagement
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/reports/revenue">
                                <PieChart className="mr-2" /> Revenue Reports
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Support and Feedback">
                        <CommandItem>
                            <Link href="/support/communication_logs">
                                <MessageCircle className="mr-2" /> Bookings Statistics
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/support/support tickets">
                                <MessageCircle className="mr-2" /> User Engagement
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />

                </CommandList>
            </Command>
        </div>
    );
}

export default Sidebar;
>>>>>>> Stashed changes
