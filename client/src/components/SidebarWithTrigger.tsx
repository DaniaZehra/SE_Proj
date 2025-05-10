'use client';

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function SidebarWithTrigger() {
  console.log(useSidebar())
  const {open} = useSidebar()

  return (
    <div className="relative">
      <SidebarTrigger
        className={cn(
          "transition-transform duration-300 sticky top-4 left-2 z-50 flex items-center justify-center p-2 bg-white shadow rounded-full ml-2 mt-2",
          open? "translate-x-[115px]" : "translate-x-0"
        )}
      >
      </SidebarTrigger>
    </div>
  );
}
