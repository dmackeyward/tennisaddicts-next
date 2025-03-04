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
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const { user } = useUser();

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
                  <Link href="/" className="flex items-center justify-center">
                    <div className="flex justify-center">
                      <Icon name="tennisball" size={24} />
                    </div>
                    {state !== "collapsed" && (
                      <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold">Tennis Addicts</span>
                      </div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Mobile close button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenMobile(false)}
                className="mr-2"
                aria-label="Close Menu"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {state === "collapsed" ? <></> : <SearchForm />}
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
                  >
                    <div className="flex justify-center">
                      <UserPlus className="size-5" />
                    </div>
                    {state !== "collapsed" && (
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
            {state === "collapsed" ? (
              <div className="flex flex-col items-center gap-4 px-2 py-4">
                <Link href="/sign-in">
                  <button className="flex items-center justify-center rounded-md p-2 hover:bg-sidebar-muted"></button>
                </Link>
              </div>
            ) : (
              <>
                <SignInButton>
                  <button className="pb-5"></button>
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
        {!isMobile && <SidebarRail />}
      </Sidebar>
    </TooltipProvider>
  );
}
