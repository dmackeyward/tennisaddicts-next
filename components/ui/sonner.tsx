"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

// Create a separate component for the part that uses useSearchParams and checks sessionStorage
const ToasterContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if redirected from auth middleware
    const authRequired = searchParams.get("authRequired");

    if (authRequired === "true") {
      toast.error("Authentication required", {
        description: "You need to be logged in to access this page.",
        duration: 4000,
      });

      // Clear the authRequired parameter
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.delete("authRequired");
      const newQuery = params.toString() ? `?${params.toString()}` : "";
      router.replace(`${pathname}${newQuery}`);
    }
  }, [searchParams, router, pathname]);

  // Add a separate effect for checking sessionStorage
  useEffect(() => {
    // Check sessionStorage for messages, wrapped in try/catch for SSR safety
    try {
      // Check for listing update success message
      if (sessionStorage.getItem("listingUpdateSuccess") === "true") {
        toast.success("Listing updated successfully", {
          duration: 3000,
        });
        sessionStorage.removeItem("listingUpdateSuccess");
      }

      if (sessionStorage.getItem("alreadySignedIn") === "true") {
        toast.error("You are already signed in", {
          duration: 3000,
        });
        sessionStorage.removeItem("alreadySignedIn");
      }

      // You can add more sessionStorage checks here as needed
      // For example:
      if (sessionStorage.getItem("listingCreated") === "true") {
        toast.success("Listing created successfully", {
          duration: 3000,
        });
        sessionStorage.removeItem("listingCreated");
      }

      if (sessionStorage.getItem("accountUpdated") === "true") {
        toast.success("Account updated successfully", {
          duration: 3000,
        });
        sessionStorage.removeItem("accountUpdated");
      }

      // Check for generic message
      const genericMessage = sessionStorage.getItem("toastMessage");
      if (genericMessage) {
        const messageData = JSON.parse(genericMessage);

        switch (messageData.type) {
          case "success":
            toast.success(messageData.title, {
              description: messageData.description,
              duration: messageData.duration || 3000,
            });
            break;
          case "error":
            toast.error(messageData.title, {
              description: messageData.description,
              duration: messageData.duration || 4000,
            });
            break;
          case "info":
            toast.info(messageData.title, {
              description: messageData.description,
              duration: messageData.duration || 3000,
            });
            break;
          case "warning":
            toast.warning(messageData.title, {
              description: messageData.description,
              duration: messageData.duration || 3500,
            });
            break;
          default:
            toast(messageData.title, {
              description: messageData.description,
              duration: messageData.duration || 3000,
            });
        }

        sessionStorage.removeItem("toastMessage");
      }
    } catch (e) {
      // Handle any sessionStorage access errors (like in SSR context)
      console.error("Error accessing sessionStorage:", e);
    }
  }, []);

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
