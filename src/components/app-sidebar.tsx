// app-sidebar.tsx
import { Box, Calendar, Inbox, Send, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigation } from '@/components/NavigationContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Inbox", icon: Inbox, id: 'inbox' },
  { title: "Sent", icon: Send, id: 'sent' },
  { title: "Schedule", icon: Calendar, id: 'schedule' },
  { title: "Archive", icon: Box, id: 'archive' },
  { title: "Social", icon: User, id: 'social' },
  { title: "MyFiles", icon: Box, id: 'my-Files' }
];

export function AppSidebar() {
  const { setCurrentSection } = useNavigation();
  
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarTrigger />
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="sidebar-menu-item">
                  <SidebarMenuButton 
                    onClick={() => setCurrentSection(item.id)}
                    className="w-full"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}