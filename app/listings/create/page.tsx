import { Metadata } from "next";
import { Suspense } from "react";

import CreateListingForm from "@/components/listings/ListingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Create Listing",
  description: "Create a new listing to sell your tennis equipment",
};

export default async function CreateListingPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ListingFormSkeleton />}>
            <CreateListingForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function ListingFormSkeleton() {
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
