import Image from "next/image";
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } 
from "@/components/ui/dropdown-menu";  

const Navbar = () => {
    return (
        <div className="bg-[#184E77] dark:bg-slate-700 py-2 px-5 flex justify-between text-white">
            <Link href='/'>
                <Image src="/img/Frame.png" alt="TravelManagementApp" width={40} height={40} />
            </Link>

            <DropdownMenu>
                <DropdownMenuTrigger className='focus:outline-none'>
                    <Avatar>
                        <AvatarImage src="/admin-avatar.png" alt="Admin" />
                        <AvatarFallback className="text-black">AD</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        Profile {/* dania */}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Logout {/* vaniya */}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default Navbar;
