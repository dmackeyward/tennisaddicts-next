"use client";

import { useEffect, useState, ReactNode } from "react";

interface ModalControllerProps {
  children: ReactNode;
}

export default function ModalController({ children }: ModalControllerProps) {
  // Start with undefined to avoid initial flash
  const [shouldRender, setShouldRender] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    // Function to check the flag
    const checkFlag = () => {
      try {
        const skipModal = sessionStorage.getItem("skipModal") === "true";

        if (skipModal) {
          console.log("ModalController: skipModal flag found, hiding modal");
          setShouldRender(false);
          // Remove the flag
          sessionStorage.removeItem("skipModal");
        } else {
          console.log("ModalController: No skipModal flag, showing modal");
          setShouldRender(true);
        }
      } catch (e) {
        console.error("Error accessing sessionStorage:", e);
        // Default to showing the modal if there's an error
        setShouldRender(true);
      }
    };

    // Check immediately
    checkFlag();

    // Also set up a small delay to check again (in case the flag is set right after component mounts)
    const timer = setTimeout(checkFlag, 50);

    return () => clearTimeout(timer);
  }, []);

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
