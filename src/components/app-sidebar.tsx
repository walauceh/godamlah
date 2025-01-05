import { Box, Calendar, Inbox, Send, User } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items with updated icons based on titles
const items = [
  {
    title: "Inbox",
    url: "/",
    icon: Inbox, 
  },
  {
    title: "Sent",
    url: "/",
    icon: Send, 
  },
  {
    title: "Schedule",
    url: "/",
    icon: Calendar, 
  },
  {
    title: "Archive",
    url: "/",
    icon: Box,
  },
  {
    title: "Social",
    url: "/",
    icon: User, 
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarTrigger />
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="sidebar-menu-item">
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
