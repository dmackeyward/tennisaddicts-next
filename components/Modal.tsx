// components/ui/Modal.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { X } from "lucide-react";

interface ModalProps {
  children: React.ReactNode;
  maxWidth?: string; // Optional prop to customize max width
  onDismiss?: () => void; // Optional custom dismiss handler
  showCloseButton?: boolean; // Option to show a close button
  closeOnOutsideClick?: boolean; // Option to control if clicking outside closes modal
  closeOnEscape?: boolean; // Option to control if pressing Escape closes modal
  initialFocus?: React.RefObject<HTMLElement>; // Element to focus when modal opens
  className?: string; // Additional classes for the modal content container
  overlayClassName?: string; // Additional classes for the overlay
  closeButtonPosition?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"; // Position of close button
  closeButtonLabel?: string; // Accessible label for close button
}

export function Modal({
  children,
  maxWidth = "max-w-4xl",
  onDismiss,
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  initialFocus,
  className = "",
  overlayClassName = "",
  closeButtonPosition = "top-right",
  closeButtonLabel = "Close",
}: ModalProps) {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Handle modal dismissal
  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss();
    } else {
      router.back();
    }
  }, [router, onDismiss]);

  // Handle click outside of modal content
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (
        closeOnOutsideClick &&
        (e.target === overlay.current || e.target === wrapper.current)
      ) {
        handleDismiss();
      }
    },
    [handleDismiss, overlay, wrapper, closeOnOutsideClick]
  );

  // Handle keyboard events (Escape key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") handleDismiss();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleDismiss, closeOnEscape]);

  // Handle body scroll lock and focus management
  useEffect(() => {
    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = "hidden";

    // Set focus to initial element or modal container
    if (initialFocus && initialFocus.current) {
      initialFocus.current.focus();
    } else if (wrapper.current) {
      wrapper.current.focus();
    }

    // Animation timing
    const timer = setTimeout(() => setIsOpen(true), 10);

    return () => {
      // Restore body scrolling when modal is closed
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [initialFocus]);

  return (
    <div
      ref={overlay}
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0"
      } ${overlayClassName}`}
      onClick={onClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={wrapper}
        className={`fixed left-1/2 top-1/2 w-full ${maxWidth} -translate-x-1/2 -translate-y-1/2 transform transition-all ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        tabIndex={-1}
      >
        <div
          className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 ${className}`}
        >
          {showCloseButton && (
            <button
              onClick={handleDismiss}
              className={`absolute p-1.5 rounded-full bg-white hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm z-10 transition-colors border border-gray-200 dark:border-gray-700
                ${closeButtonPosition === "top-right" ? "right-3 top-3" : ""}
                ${closeButtonPosition === "top-left" ? "left-3 top-3" : ""}
                ${
                  closeButtonPosition === "bottom-right"
                    ? "right-3 bottom-3"
                    : ""
                }
                ${
                  closeButtonPosition === "bottom-left" ? "left-3 bottom-3" : ""
                }
              `}
              aria-label={closeButtonLabel}
            >
              <X size={18} />
            </button>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
