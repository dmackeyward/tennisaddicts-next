// Add this component to your project
// MobileTrigger.jsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import Icon from "./Icon";

export function MobileTrigger() {
  const { setOpenMobile, isMobile } = useSidebar();

  // Only show on mobile
  if (!isMobile) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed top-4 left-4 z-50"
      onClick={() => setOpenMobile(true)}
      aria-label="Open Menu"
    >
      <Icon name="tennisball" size={24} />
    </Button>
  );
}
