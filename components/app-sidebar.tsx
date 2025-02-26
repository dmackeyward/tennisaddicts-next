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
  List,
  ListPlus,
  Plus,
  Users,
  Mail,
  Newspaper,
  CirclePlus,
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
import Link from "next/link";
import Icon from "./Icon";

// This is sample data.
const data = {
  news: [
    {
      title: "Latest Tennis News",
      url: "/news",
      icon: Newspaper,
    },
  ],
  listings: [
    {
      title: "View listings",
      url: "/listings",
      icon: List,
    },
    {
      title: "Create a listing",
      url: "/listings/create",
      icon: CirclePlus,
    },
  ],
  support: [
    {
      title: "About us",
      url: "/about",
      icon: Users,
    },
    {
      title: "Get in touch",
      url: "/contact",
      icon: Mail,
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
                <a href="/" className="flex items-center justify-center">
                  <div className="flex justify-center">
                    <Icon name="tennisball" size={24} />
                  </div>
                  {state !== "collapsed" && (
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">Tennis Addicts</span>
                    </div>
                  )}
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
                    <Link href="/sign-in">
                      <button className="flex items-center justify-center rounded-md p-2 hover:bg-sidebar-muted">
                        <UserPlus className="size-5" />
                      </button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign In or Sign Up</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <>
                <SignInButton>
                  <button className="pb-5">Sign In or Sign Up</button>
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
