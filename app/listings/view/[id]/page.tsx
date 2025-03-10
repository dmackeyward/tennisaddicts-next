import { Suspense } from "react";
import { notFound } from "next/navigation";
import ListingDetail from "@/app/listings/components/ListingDetail";
import { getListing } from "@/db/queries/listings";
import { ListingImage, PLACEHOLDER_LISTING } from "@/types/listings";
import { Metadata } from "next";
import { use } from "react";
import { auth } from "@clerk/nextjs/server";
import prompts from "@/prompts/prompts";

export const dynamic = "force-dynamic";

// Loading component with full-width gradient
function ListingLoading() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-green-100">
      <div className="container mx-auto max-w-6xl px-6 py-8">
        <ListingDetail listing={PLACEHOLDER_LISTING} isLoading={true} />
      </div>
    </div>
  );
}

// Main listing content with full-width gradient
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
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-green-100">
      <div className="container mx-auto max-w-6xl px-6 py-8">
        <ListingDetail
          listing={listing}
          isLoading={false}
          isAuthor={isAuthor}
        />
      </div>
    </div>
  );
}

// Main page component
export default function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense fallback={<ListingLoading />}>
      <ListingContent id={id} />
    </Suspense>
  );
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const listing = await getListing(id);

    if (!listing) {
      return {
        title: prompts.error.listingNotFound,
        description: prompts.error.errorLoadingListingDetails,
      };
    }

    return {
      title: `${listing.title} | Tennis Addicts`, // Using the app name from our prompts
      description: listing.description.slice(0, 155) + "...",
      openGraph: {
        title: listing.title,
        description: listing.description.slice(0, 155) + "...",
        images: listing.images.map((image: ListingImage) => ({
          url: image.url,
          alt: image.alt,
        })),
      },
    };
  } catch {
    return {
      title: "Listing Details",
      description: prompts.listings.description,
    };
  }
}
