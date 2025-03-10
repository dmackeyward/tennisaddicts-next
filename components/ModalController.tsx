"use client";

import { useEffect, useState, ReactNode } from "react";
import { isMobileDevice } from "@/utils/device";
import { usePathname } from "next/navigation";

interface ModalControllerProps {
  children: ReactNode;
}

export default function ModalController({ children }: ModalControllerProps) {
  // Start with undefined to avoid initial flash
  const [shouldRender, setShouldRender] = useState<boolean | undefined>(
    undefined
  );
  const pathname = usePathname();

  useEffect(() => {
    // Function to check the flag and mobile status
    const checkShouldRender = () => {
      try {
        // First, check if we're on a mobile device
        const isMobile = isMobileDevice();

        // Then check for the skipModal flag
        const skipModal = sessionStorage.getItem("skipModal") === "true";

        // Log what we're doing
        if (isMobile) {
        }

        if (skipModal) {
          sessionStorage.removeItem("skipModal");
        }

        // Don't render if on mobile or if skipModal is set
        if (isMobile || skipModal) {
          // Convert modal route to main content route
          const parts = pathname.split("/");

          // Check if this is a modal route
          if (parts.length >= 3 && parts[parts.length - 2] === "view") {
            const section = parts[1]; // 'listings' or 'news'
            const id = parts[parts.length - 1]; // The ID

            let mainContentPath;

            // Different handling for different sections
            if (section === "listings") {
              mainContentPath = `/${section}/view/${id}`;
            } else if (section === "news") {
              mainContentPath = `/${section}/view/${id}`;
            } else {
              // Default case for other sections
              mainContentPath = `/${section}/view/${id}`;
            }

            // Use a slight delay to allow React to finish its work
            setTimeout(() => {
              // Use window.location for a hard navigation
              window.location.href = mainContentPath;
            }, 50);
          }

          setShouldRender(false);
        } else {
          setShouldRender(true);
        }
      } catch (e) {
        console.error("Error in ModalController:", e);
        // Default to showing the modal if there's an error
        setShouldRender(true);
      }
    };

    // Check immediately
    checkShouldRender();
  }, [pathname]);

  // If we're still determining (undefined), don't render anything yet
  if (shouldRender === undefined) {
    return null;
  }

  // If we shouldn't render, return null
  if (shouldRender === false) {
    return null;
  }

  // Otherwise, render the children (the modal)
  return <>{children}</>;
}
