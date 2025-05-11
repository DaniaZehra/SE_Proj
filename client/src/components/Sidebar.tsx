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
    title: "Browse Activities",
    url: "/all-activities",
  },
  {
    title: "List my Activity",
    url: "/list-activity"
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
