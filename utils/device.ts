"use client";

/**
 * Checks if the current device is a mobile device based on screen width
 * @returns boolean indicating if the device is mobile
 */
export function isMobileDevice(): boolean {
  // Only run on client side
  if (typeof window === "undefined") return false;

  // Use a common breakpoint for mobile devices (768px)
  return window.innerWidth < 768;
}

/**
 * Sets the skipModal flag before navigating to a modal route on mobile devices
 * @param route The route to navigate to
 * @returns false (to allow normal navigation to continue)
 */
export function handleModalNavigation(route: string): boolean {
  if (isMobileDevice()) {
    try {
      // Set flag to skip modal rendering for mobile devices
      sessionStorage.setItem("skipModal", "true");
      console.log(`Set skipModal flag for mobile device - route: ${route}`);
    } catch (e) {
      console.error("Error setting skipModal flag:", e);
    }
  }

  // Always return false to allow default navigation
  return false;
}
