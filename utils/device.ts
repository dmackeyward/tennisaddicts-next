"use client";

import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Sets the skipModal flag before navigating to a modal route on mobile devices
 * @param route The route to navigate to
 * @returns false (to allow normal navigation to continue)
 */
export function handleModalNavigation(route: string): boolean {
  const isMobile = useIsMobile();

  if (isMobile) {
    try {
      // Set flag to skip modal rendering for mobile devices
      sessionStorage.setItem("skipModal", "true");
    } catch (e) {
      console.error("Error setting skipModal flag:", e);
    }
  }

  // Always return false to allow default navigation
  return false;
}
