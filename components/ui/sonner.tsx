"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

// Create a separate component for the part that uses useSearchParams
const ToasterContent = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if redirected from auth middleware
    const authRequired = searchParams.get("authRequired");

    if (authRequired === "true") {
      toast.error("Authentication required", {
        description: "You need to be logged in to access this page.",
        duration: 4000,
      });
    }
  }, [searchParams]);

  return null;
};

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <>
      <Suspense fallback={null}>
        <ToasterContent />
      </Suspense>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
        {...props}
      />
    </>
  );
};

export { Toaster };
