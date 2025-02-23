// app/@modal/(.)listings/[id]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ListingDetail from "@/components/listings/ListingDetail";
import { getListing } from "@/db/queries/listings";
import { PLACEHOLDER_LISTING } from "@/types/listings";
import { Modal } from "./modal";

export const dynamic = "force-dynamic";

function ListingLoading() {
  return <ListingDetail listing={PLACEHOLDER_LISTING} isLoading={true} />;
}

async function ListingContent({ id }: { id: string }) {
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="relative rounded-lg bg-white shadow-xl">
      <ListingDetail listing={listing} isLoading={false} />
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
      <Suspense fallback={<ListingLoading />}>
        <ListingContent id={id} />
      </Suspense>
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
