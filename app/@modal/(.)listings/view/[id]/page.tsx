// app/@modal/(.)listings/[id]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ListingDetail from "@/components/listings/ListingDetail";
import { getListing } from "@/db/queries/listings";
import { PLACEHOLDER_LISTING } from "@/types/listings";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { auth } from "@clerk/nextjs/server";
import { Modal } from "@/components/Modal";

export const dynamic = "force-dynamic";

function ListingLoading() {
  return <ListingDetail listing={PLACEHOLDER_LISTING} isLoading={true} />;
}

async function ListingContent({ id }: { id: string }) {
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  // Get current user to check if they're the author
  const { userId } = await auth();

  // Check if the current user is the author of this listing
  const isAuthor = userId ? userId === listing.userId : false;

  return (
    <div className="relative rounded-lg bg-white shadow-xl">
      <ListingDetail listing={listing} isLoading={false} isAuthor={isAuthor} />
    </div>
  );
}

export default async function ListingModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Modal>
      <ErrorBoundary
        fallback={
          <div className="p-6 bg-white rounded-lg">
            <h2 className="text-xl font-semibold text-red-600">
              Error Loading Listing
            </h2>
            <p className="mt-2 text-gray-600">
              There was a problem loading this listing.
            </p>
          </div>
        }
      >
        <Suspense fallback={<ListingLoading />}>
          <ListingContent id={id} />
        </Suspense>
      </ErrorBoundary>
    </Modal>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params object to get the id
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    return {
      title: "Listing Not Found",
    };
  }

  return {
    title: listing.title,
  };
}
