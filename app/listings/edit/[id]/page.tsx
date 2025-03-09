// app/listings/edit/[id]/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import EditListingForm from "@/app/listings/components/EditListingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@clerk/nextjs/server";
import { getListing } from "@/db/queries/listings";

export const metadata: Metadata = {
  title: "Edit Listing",
  description: "Edit your listing details",
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  // Get current user to check if they're the author
  const { userId } = await auth();

  // Check if the current user is the author of this listing
  const isAuthor = userId ? userId === listing.userId : false;

  // After checking isAuthor
  if (!isAuthor) {
    // If user is not authenticated, redirect to sign in
    if (!userId) {
      redirect("/sign-in");
    }
    // If authenticated but not author, show 404
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl px-6 py-8  bg-gradient-to-b from-white to-green-100">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EditListingFormSkeleton />}>
            <EditListingForm listing={listing} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function EditListingFormSkeleton() {
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
      <div className="flex justify-end space-x-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
