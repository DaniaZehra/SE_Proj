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