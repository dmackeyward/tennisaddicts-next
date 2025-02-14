// app/listings/[id]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ListingDetail from "@/components/listings/ListingDetail";
import { getListing } from "@/db/queries/listings";
import { ListingPageProps, PLACEHOLDER_LISTING } from "@/app/types/listings";

// Loading component
function ListingLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ListingDetail
        listing={PLACEHOLDER_LISTING}
        onContactSeller={() => {}}
        isLoading={true}
      />
    </div>
  );
}

// Main listing content
async function ListingContent({ id }: { id: string }) {
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  const handleContactSeller = async () => {
    // Implement contact seller logic
    console.log("Contact seller for listing:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ListingDetail
        listing={listing}
        onContactSeller={handleContactSeller}
        isLoading={false}
      />
    </div>
  );
}

// Main page component
export default async function ListingPage({ params }: ListingPageProps) {
  return (
    <Suspense fallback={<ListingLoading />}>
      <ListingContent id={params.id} />
    </Suspense>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: ListingPageProps) {
  try {
    const listing = await getListing(params.id);

    if (!listing) {
      return {
        title: "Listing Not Found",
        description: "The requested listing could not be found.",
      };
    }

    return {
      title: `${listing.title} | Your Platform Name`,
      description: listing.description.slice(0, 155) + "...",
      openGraph: {
        title: listing.title,
        description: listing.description.slice(0, 155) + "...",
        images: listing.images.map((image: any) => ({
          url: image.url,
          alt: image.alt,
        })),
      },
    };
  } catch (error) {
    return {
      title: "Listing Details",
      description: "View listing details on our platform.",
    };
  }
}
