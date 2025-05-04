import {
    Command, CommandEmpty, CommandGroup, CommandInput,
    CommandItem, CommandList, CommandSeparator
} from "@/components/ui/command"
import Link from "next/link";
import { LayoutDashboard, Hotel, Car, Plane, Package,BarChart2, User,Briefcase, CalendarCheck,Users, Activity, MessagesSquare,Headset } from 'lucide-react'

const Sidebar = () => {
    return (
        <div>
            <Command>
                <CommandInput placeholder="Search" />
                <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    <CommandGroup heading="Bookings Management">
                        <CommandItem>
                            <Link href="/bookings/hotels">
                                <Hotel className="mr-2" />Hotels
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/bookings/rides">
                                <Car className="mr-2" />Rides
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/bookings/flights">
                                <Plane className="mr-2" />Flights
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/bookings/activities">
                                <Activity className="mr-2" />Activities
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />

                    <CommandGroup heading="Listings Management">
                        <CommandItem>
                            <Link href="/listings/properties">
                                <LayoutDashboard className="mr-2" />Properties
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/listings/packages">
                                <Package className="mr-2" />Packages
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />

                    <CommandGroup heading="User Management">
                        <CommandItem>
                            <Link href="/users/all">
                                <User className="mr-2" />Users
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/users/organizers">
                                <Briefcase className="mr-2" />Organizers
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/users/drivers">
                                <Car className="mr-2" />Drivers
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />

                    <CommandGroup heading="Reports & Analytics">
                        <CommandItem>
                            <Link href="/reports/bookings">
                                <CalendarCheck className="mr-2" />Bookings Stats
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/reports/engagement">
                                <Users className="mr-2" />User Engagement
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/reports/revenue">
                                <BarChart2 className="mr-2" />Revenue Reports
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Support and Feedback">
                    <CommandItem>
                            <Link href="/support/communication_logs">
                                <Headset className="mr-2 h-4 w-4" />Help Desk
                            </Link>
                        </CommandItem>
                        <CommandItem>
                            <Link href="/support/support tickets">
                                <MessagesSquare className="mr-2 h-4 w-4" />Support Center
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