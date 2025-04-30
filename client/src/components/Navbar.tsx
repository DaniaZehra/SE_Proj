import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } 
from "@/components/ui/dropdown-menu";  

interface NavbarItem{
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
}

interface NavbarProps{
    logo?: {
        src: string;
        alt: string;
        width?: number;
        height?: number;
      };
      avatar?: {
        src?: string;
        alt?: string;
        fallbackText?: string;
      };
      accountItems?: NavbarItem[];
      children?: React.ReactNode;
      className?: string;
      theme?: {
        background?: string;
        text?: string;
    };
}


const Navbar = ({

    avatar={
        src: "/admin-avatar.png",
        alt: "Admin Profile Picture",
        fallbackText: "AD"
    },
    accountItems=[
        {label: "Profile", href: '/profile'},
        {label: "Logout", href: '/logout'}
    ],
    children,
    className=" ",
    theme={
        background:"bg-[#184E77] dark:bg-slate-700",
        text:"text-white"
    }

}: NavbarProps) => {
    return (
        <div className={`${theme.background} ${theme.text} py-2 px-5 flex justify-between items-center ${className}`}>

            <div className="flex-1"></div>
            <div className="flex items-center gap-4"> {/* New container */}
        {children && (
          <div className="flex items-center">
            {children}
          </div>
        )}
            <DropdownMenu>
                <DropdownMenuTrigger className='focus:outline-none'>
                    <Avatar>
                        <AvatarImage src={avatar.src} alt={avatar.alt} className="m1-auto"/>
                        <AvatarFallback className="text-black">{avatar.fallbackText}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {accountItems.map((item, index) => (
                        <DropdownMenuItem key={index}>
                        {item.href ? (
                            <Link href={item.href} className="w-full flex items-center gap-2">
                            {item.icon && <span>{item.icon}</span>}
                            {item.label}
                            </Link>
                        ) : (
                        <button 
                            onClick={item.onClick}
                            className="w-full text-left flex items-center gap-2"
                        >
                        {item.icon && <span>{item.icon}</span>}
                        {item.label}
                        </button>
                    )}
                        </DropdownMenuItem>
                     ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        </div>
    );
}

export default Navbar;
