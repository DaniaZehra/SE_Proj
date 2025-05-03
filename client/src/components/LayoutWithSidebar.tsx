import { SidebarProvider, SidebarInset} from "@/components/ui/sidebar";
import SidebarWithTrigger from "@/components/SidebarWithTrigger";
import AppSidebar from "@/components/Sidebar";


export default function LayoutWithSidebar({children}:Readonly<{children:React.ReactNode}>){
    return(
        <SidebarProvider>
            {<AppSidebar />}
          <SidebarWithTrigger/>
            <SidebarInset>
            {children}
            </SidebarInset>
          </SidebarProvider>
    )
}