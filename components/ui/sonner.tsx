"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import prompts from "@/prompts/prompts";

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
      toast.error("Authentication Required", {
        description: prompts.toast.signInRequired,
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
      // Listing related notifications
      if (sessionStorage.getItem("listingUpdateSuccess") === "true") {
        toast.success("Listing Updated", {
          description: prompts.toast.listingUpdated,
          duration: 3000,
        });
        sessionStorage.removeItem("listingUpdateSuccess");
      }

      if (sessionStorage.getItem("listingCreated") === "true") {
        toast.success("Listing Created", {
          description: prompts.toast.listingCreated,
          duration: 3000,
        });
        sessionStorage.removeItem("listingCreated");
      }

      if (sessionStorage.getItem("listingDeleted") === "true") {
        toast.success("Listing Deleted", {
          description: prompts.toast.listingDeleted,
          duration: 3000,
        });
        sessionStorage.removeItem("listingDeleted");
      }

      // Account related notifications
      if (sessionStorage.getItem("alreadySignedIn") === "true") {
        toast.error("Already Signed In", {
          description: prompts.toast.genericError,
          duration: 3000,
        });
        sessionStorage.removeItem("alreadySignedIn");
      }

      if (sessionStorage.getItem("accountUpdated") === "true") {
        toast.success("Profile Updated", {
          description: prompts.toast.update,
          duration: 3000,
        });
        sessionStorage.removeItem("accountUpdated");
      }

      if (sessionStorage.getItem("accountCreated") === "true") {
        toast.success("Welcome to Tennis Addicts!", {
          description: prompts.toast.accountCreated,
          duration: 4000,
        });
        sessionStorage.removeItem("accountCreated");
      }

      // Booking related notifications
      if (sessionStorage.getItem("bookingSuccess") === "true") {
        toast.success("Court Reserved", {
          description: prompts.toast.bookingSuccess,
          duration: 3000,
        });
        sessionStorage.removeItem("bookingSuccess");
      }

      if (sessionStorage.getItem("bookingCancelled") === "true") {
        toast.info("Booking Cancelled", {
          description: prompts.toast.bookingCancelled,
          duration: 3000,
        });
        sessionStorage.removeItem("bookingCancelled");
      }

      // Community interaction notifications
      if (sessionStorage.getItem("messageReceived") === "true") {
        toast.info("New Message", {
          description: prompts.toast.messageReceived,
          duration: 3000,
        });
        sessionStorage.removeItem("messageReceived");
      }

      if (sessionStorage.getItem("connectionRequest") === "true") {
        toast.info("Connection Request", {
          description: prompts.toast.connectionRequest,
          duration: 3000,
        });
        sessionStorage.removeItem("connectionRequest");
      }

      if (sessionStorage.getItem("eventJoined") === "true") {
        toast.success("Event Registration", {
          description: prompts.toast.eventJoined,
          duration: 3000,
        });
        sessionStorage.removeItem("eventJoined");
      }

      // Payment related notifications
      if (sessionStorage.getItem("paymentSuccess") === "true") {
        toast.success("Payment Successful", {
          description: prompts.toast.paymentSuccess,
          duration: 3000,
        });
        sessionStorage.removeItem("paymentSuccess");
      }

      if (sessionStorage.getItem("paymentFailed") === "true") {
        toast.error("Payment Failed", {
          description: prompts.toast.paymentFailed,
          duration: 4000,
        });
        sessionStorage.removeItem("paymentFailed");
      }

      // File upload notifications
      if (sessionStorage.getItem("uploadSuccess") === "true") {
        toast.success("Upload Complete", {
          description: prompts.toast.uploadSuccess,
          duration: 3000,
        });
        sessionStorage.removeItem("uploadSuccess");
      }

      if (sessionStorage.getItem("uploadError") === "true") {
        toast.error("Upload Failed", {
          description: prompts.toast.uploadError,
          duration: 4000,
        });
        sessionStorage.removeItem("uploadError");
      }

      // Generic message handler (for custom or one-off notifications)
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
