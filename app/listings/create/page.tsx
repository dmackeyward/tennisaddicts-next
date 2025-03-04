import { Metadata } from "next";
import { Suspense } from "react";
import CreateListingForm from "@/app/components/listings/CreateListingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Create Listing",
  description: "Create a new listing to sell your tennis equipment",
};

export default async function CreateListingPage() {
  return (
    <div>
      {/* Fixed position background that covers the entire page */}
      <div className="fixed inset-0 bg-gradient-to-b from-white to-green-100 -z-10" />

      {/* Content container */}
      <div className="relative container mx-auto max-w-6xl px-6 py-8 min-h-screen">
        <Card className="mb-12">
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
    </div>
  );
}

function CreateListingFormSkeleton() {
  return (
    <div className="space-y-6 pb-12">
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
