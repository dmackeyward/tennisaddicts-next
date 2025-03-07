// utils/device.ts

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
 * Handles navigation to a modal route, setting skipModal flag for mobile devices
 * @param route The route to navigate to
 */
export function handleModalNavigation(route: string): void {
  if (isMobileDevice()) {
    try {
      // Set flag to skip modal rendering for mobile devices
      sessionStorage.setItem("skipModal", "true");
      console.log("Set skipModal flag for mobile device");
    } catch (e) {
      console.error("Error setting skipModal flag:", e);
    }
  }
}
