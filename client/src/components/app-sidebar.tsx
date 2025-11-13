import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  MessageSquare,
  Hexagon,
  Sparkles,
  Circle,
  Waves,
  Grid3x3,
  Library,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./theme-toggle";

const tools = [
  {
    title: "AI Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Document Library",
    url: "/documents",
    icon: Library,
  },
  {
    title: "Human Design",
    url: "/human-design",
    icon: Hexagon,
  },
  {
    title: "I Ching",
    url: "/iching",
    icon: Sparkles,
  },
  {
    title: "Astrology",
    url: "/astrology",
    icon: Circle,
  },
  {
    title: "Cymatics",
    url: "/cymatics",
    icon: Waves,
  },
  {
    title: "Magic Squares",
    url: "/magic-squares",
    icon: Grid3x3,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-md p-2 -m-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-foreground">Esoteric</h2>
              <p className="text-xs text-muted-foreground">Knowledge System</p>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-serif text-xs uppercase tracking-wide">
            Tools & Analysis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">v1.0.0</p>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
