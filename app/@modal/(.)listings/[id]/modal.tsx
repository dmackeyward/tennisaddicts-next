// app/@modal/(.)listings/[id]/modal.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as React from "react";

interface ModalProps {
  children: React.ReactNode;
}

export function Modal({ children }: ModalProps) {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss]);

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="fixed left-1/2 top-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2"
      >
        {children}
      </div>
    </div>
  );
}
