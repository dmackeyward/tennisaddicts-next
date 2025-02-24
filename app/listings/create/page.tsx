// app/listings/create/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CreateListingForm from "@/app/components/listings/CreateListingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Create Listing",
  description: "Create a new listing to sell your tennis equipment",
};

async function checkCreatePermission() {
  // Add your permission check logic here
  // For example:
  // const session = await getSession();
  // if (!session?.user) return false;
  // return session.user.canCreateListings;
  return true;
}

export default async function CreateListingPage() {
  const hasPermission = await checkCreatePermission();

  if (!hasPermission) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<CreateListingFormSkeleton />}>
            <CreateListingForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateListingFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Title skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Description skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-32 w-full" />
      </div>

      {/* Price skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full max-w-xs" />
      </div>

      {/* Location skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full max-w-md" />
      </div>

      {/* Tags skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full max-w-xs" />
      </div>

      {/* Image upload skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-40 w-full" />
      </div>

      {/* Submit button skeleton */}
      <Skeleton className="h-10 w-24" />
    </div>
  );
}
