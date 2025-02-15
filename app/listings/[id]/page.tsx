import { Suspense } from "react";
import { notFound } from "next/navigation";
import ListingDetail from "@/components/listings/ListingDetail";
import { getListing } from "@/db/queries/listings";
import { ListingImage, PLACEHOLDER_LISTING } from "@/types/listings";
import { Metadata } from "next";
import { use } from "react";

// Loading component stays the same
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

// Main listing content stays the same
async function ListingContent({ id }: { id: string }) {
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  const handleContactSeller = async () => {
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

// Main page component - simplified props type
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

// Generate metadata - using the same simplified type
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
        images: listing.images.map((image: ListingImage) => ({
          url: image.url,
          alt: image.alt,
        })),
      },
    };
  } catch {
    return {
      title: "Listing Details",
      description: "View listing details on our platform.",
    };
  }
}
