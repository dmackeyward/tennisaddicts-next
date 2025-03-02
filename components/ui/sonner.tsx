"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

// Create a separate component for the part that uses useSearchParams
const ToasterContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if redirected from auth middleware
    const authRequired = searchParams.get("authRequired");

    // Check if user is already signed in when trying to access sign-in page
    const alreadySignedIn = searchParams.get("alreadySignedIn");

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

    if (alreadySignedIn === "true") {
      toast.info("Already signed in", {
        description: "You're already signed in to your account.",
        duration: 3000,
      });

      // Clear the alreadySignedIn parameter
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.delete("alreadySignedIn");
      const newQuery = params.toString() ? `?${params.toString()}` : "";
      router.replace(`${pathname}${newQuery}`);
    }
  }, [searchParams, router, pathname]);

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
