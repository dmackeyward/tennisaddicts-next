"use client";

import * as React from "react";
import {
  UserPlus,
  List,
  Users,
  Mail,
  Newspaper,
  CirclePlus,
  X,
} from "lucide-react";
import {
  SignInButton,
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SearchForm } from "./ui/search-form";
import Link from "next/link";
import Icon from "./Icon";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SheetTitle, SheetDescription } from "@/components/ui/sheet";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile, openMobile, setOpenMobile, toggleSidebar } =
    useSidebar();
  const { user } = useUser();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  // Close mobile sidebar when route changes
  React.useEffect(() => {
    if (openMobile) {
      const handleRouteChange = () => {
        setOpenMobile(false);
      };

      // App Router approach
      window.addEventListener("popstate", handleRouteChange);
      return () => window.removeEventListener("popstate", handleRouteChange);
    }
  }, [openMobile, setOpenMobile]);

  // Completely stop event propagation for Clerk components
  const handleClerkInteraction = (e: React.MouseEvent) => {
    // Stop propagation to prevent sidebar click handler from firing
    e.stopPropagation();
  };

  // Handle clicks outside Clerk menu to close it
  React.useEffect(() => {
    if (userMenuOpen) {
      const handleOutsideClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // If clicking outside Clerk elements and menu is open, update state
        if (!target.closest('[class*="cl-"]')) {
          setUserMenuOpen(false);
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [userMenuOpen]);

  // Handle close button click based on device type
  const handleCloseClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      // For desktop mode, use toggleSidebar to collapse the sidebar
      // This will toggle between expanded and collapsed states
      toggleSidebar();
    }
  };

  // New function to handle navigation link clicks
  const handleNavLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else if (state === "expanded") {
      toggleSidebar();
    }
  };

  return (
    <TooltipProvider>
      <Sidebar
        collapsible={isMobile ? "offcanvas" : "icon"}
        clickToToggle={!isMobile}
        {...props}
      >
        {/* Add these components to fix accessibility warnings using sr-only class */}
        {isMobile && (
          <>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Main navigation links for Tennis Addicts website
            </SheetDescription>
          </>
        )}

        <SidebarHeader>
          <div className="flex items-center justify-between w-full">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild tooltip={"Home"}>
                  <Link
                    href="/"
                    className="flex items-center justify-center"
                    onClick={handleNavLinkClick}
                  >
                    <div className="flex justify-center">
                      <Icon name="tennisball" size={24} />
                    </div>
                    {/* Show title always on mobile, or when expanded on desktop */}
                    {(isMobile || state !== "collapsed") && (
                      <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold">Tennis Addicts</span>
                      </div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Close button for both mobile and desktop */}
            {/* Only show when expanded in desktop or always in mobile */}
            {(isMobile || state === "expanded") && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseClick}
                className="mr-2"
                aria-label="Close Menu"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Show search form always on mobile, or based on original logic for desktop */}
          {isMobile || state !== "collapsed" ? <SearchForm /> : <></>}
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={data.news} group="News" />
          <NavMain items={data.listings} group="Listings" />
          <NavMain items={data.support} group="Support" />
        </SidebarContent>

        <SidebarFooter>
          <SignedOut>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  asChild
                  tooltip={"Sign In or Sign Up"}
                >
                  <Link
                    href="/sign-in"
                    className="flex items-center justify-center"
                    onClick={handleNavLinkClick}
                  >
                    <div className="flex justify-center">
                      <UserPlus className="size-5" />
                    </div>
                    {/* Show title always on mobile, or when expanded on desktop */}
                    {(isMobile || state !== "collapsed") && (
                      <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold">
                          Sign In or Sign Up
                        </span>
                      </div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Maintain desktop behavior but ensure mobile shows the sign-in button */}
            {state === "collapsed" && !isMobile ? (
              <div className="flex flex-col items-center gap-4 px-2 py-4">
                <Link href="/sign-in" onClick={handleNavLinkClick}>
                  <button className="flex items-center justify-center rounded-md p-2 hover:bg-sidebar-muted"></button>
                </Link>
              </div>
            ) : (
              <>
                <SignInButton>
                  <button
                    className="pb-5"
                    onClick={handleNavLinkClick}
                  ></button>
                </SignInButton>
              </>
            )}
          </SignedOut>
          <SignedIn>
            {/* Enhanced user button container with better event handling */}
            {(state === "expanded" || isMobile) && user && (
              <div
                className="items-center justify-center flex flex-col gap-4 px-2 py-4 relative z-50"
                onClick={handleClerkInteraction}
                style={{ position: "relative", zIndex: 50 }}
              >
                <UserButton
                  showName={true}
                  userProfileMode="modal"
                  appearance={{
                    elements: {
                      rootBox: "z-[10000]",
                      userButtonPopoverCard: "z-[10000]",
                    },
                  }}
                />
              </div>
            )}
            {state === "collapsed" && !isMobile && user && (
              <div
                className="items-center justify-center flex flex-col gap-4 px-2 py-4"
                onClick={handleClerkInteraction}
              >
                <UserButton
                  userProfileMode="modal"
                  appearance={{
                    elements: {
                      rootBox: "z-[10000]",
                      userButtonPopoverCard: "z-[10000]",
                    },
                  }}
                />
              </div>
            )}
          </SignedIn>
        </SidebarFooter>
        {!isMobile && <SidebarRail />}
      </Sidebar>
    </TooltipProvider>
  );
}
