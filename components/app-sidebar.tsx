"use client";

// Import Tooltip components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Rest of your imports remain the same
import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Search,
  LogIn,
  UserPlus,
  DotIcon,
} from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { SearchForm } from "./ui/search-form";

// This is sample data.
const data = {
  news: [
    {
      title: "Latest Tennis News",
      url: "/news",
      icon: SquareTerminal,
    },
  ],
  listings: [
    {
      title: "View listings",
      url: "/listings",
      icon: SquareTerminal,
    },
    {
      title: "Create a listing",
      url: "/listings/create",
      icon: Map,
    },
  ],
  support: [
    {
      title: "About us",
      url: "/about",
      icon: SquareTerminal,
    },
    {
      title: "Get in touch",
      url: "/contact",
      icon: Map,
    },
  ],
};

// Enhanced Sidebar component with click-to-toggle functionality
const EnhancedSidebar = React.forwardRef<
  React.ComponentRef<typeof Sidebar>,
  React.ComponentPropsWithoutRef<typeof Sidebar> & { clickToToggle?: boolean }
>(({ clickToToggle = false, className, children, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  const handleSidebarClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (clickToToggle) {
        // Prevent toggling when clicking on interactive elements
        const isInteractiveElement = (event.target as HTMLElement).closest(
          'button, a, input, select, textarea, [role="button"]'
        );

        if (!isInteractiveElement) {
          event.preventDefault();
          toggleSidebar();
        }
      }
    },
    [clickToToggle, toggleSidebar]
  );

  // We're using a wrapper div to catch clicks without modifying the Sidebar component
  return (
    <div onClick={clickToToggle ? handleSidebarClick : undefined}>
      <Sidebar ref={ref} className={className} {...props}>
        {children}
      </Sidebar>
    </div>
  );
});
EnhancedSidebar.displayName = "EnhancedSidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { user } = useUser();

  return (
    <TooltipProvider>
      <EnhancedSidebar collapsible="icon" clickToToggle={true} {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Tennis Addicts</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {state === "collapsed" ? <></> : <SearchForm />}
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.news} group="News" />
          <NavMain items={data.listings} group="Listings" />
          <NavMain items={data.support} group="Support" />
        </SidebarContent>
        <SidebarFooter>
          <SignedOut>
            {state === "collapsed" ? (
              <div className="flex flex-col items-center gap-4 px-2 py-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex items-center justify-center rounded-md p-2 hover:bg-sidebar-muted">
                      <UserPlus className="size-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign In</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <>
                <SignInButton>
                  <button className="pb-5">Sign In</button>
                </SignInButton>
              </>
            )}
          </SignedOut>
          <SignedIn>
            {state === "expanded" && user && (
              <div className="items-center justify-center flex flex-col gap-4 px-2 py-4">
                <UserButton showName={true} />
              </div>
            )}
            {state === "collapsed" && user && (
              <div className="items-center justify-center flex flex-col gap-4 px-2 py-4">
                <UserButton />
              </div>
            )}
          </SignedIn>
        </SidebarFooter>
        <SidebarRail />
      </EnhancedSidebar>
    </TooltipProvider>
  );
}
