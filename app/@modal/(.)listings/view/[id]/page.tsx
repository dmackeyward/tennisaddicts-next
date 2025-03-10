// app/@modal/(.)listings/[id]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ListingDetail from "@/app/listings/components/ListingDetail";
import { getListing } from "@/db/queries/listings";
import { PLACEHOLDER_LISTING } from "@/types/listings";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { auth } from "@clerk/nextjs/server";
import { Modal } from "@/components/Modal";
import ModalController from "@/components/ModalController";
import prompts from "@/prompts/prompts";

export const dynamic = "force-dynamic";

function ListingLoading() {
  return <ListingDetail listing={PLACEHOLDER_LISTING} isLoading={true} />;
}

async function ListingContent({ id }: { id: string }) {
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  const { userId } = await auth();
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
    <ModalController>
      <Modal>
        <ErrorBoundary
          fallback={
            <div className="p-6 bg-white rounded-lg">
              <h2 className="text-xl font-semibold text-red-600">
                {prompts.error.errorLoadingNews}
              </h2>
              <p className="mt-2 text-gray-600">
                {prompts.error.errorLoadingNewsDetails}
              </p>
            </div>
          }
        >
          <Suspense fallback={<ListingLoading />}>
            <ListingContent id={id} />
          </Suspense>
        </ErrorBoundary>
      </Modal>
    </ModalController>
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
      title: prompts.error.listingNotFound,
    };
  }

  return {
    title: listing.title,
  };
}
