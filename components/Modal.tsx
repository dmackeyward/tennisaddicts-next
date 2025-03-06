// components/ui/Modal.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as React from "react";

interface ModalProps {
  children: React.ReactNode;
  maxWidth?: string; // Optional prop to customize max width
  onDismiss?: () => void; // Optional custom dismiss handler
}

export function Modal({
  children,
  maxWidth = "max-w-4xl",
  onDismiss,
}: ModalProps) {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss();
    } else {
      router.back();
    }
  }, [router, onDismiss]);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        handleDismiss();
      }
    },
    [handleDismiss, overlay, wrapper]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleDismiss]);

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className={`fixed left-1/2 top-1/2 w-full ${maxWidth} -translate-x-1/2 -translate-y-1/2`}
      >
        {children}
      </div>
    </div>
  );
}
