"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";
import ListingCard from "./ListingCard";
import type { Listing, ListingGridProps } from "@/types/listings";

// Separate loading indicator component
const LoadingIndicator = memo(() => (
  <div className="animate-pulse text-gray-500">Loading more...</div>
));

// Separate empty state component
const EmptyState = memo(() => (
  <div
    className="flex flex-col items-center justify-center py-12 px-4"
    role="status"
    aria-label="No listings available"
  >
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No listings found
    </h3>
    <p className="text-gray-500 text-center">
      There are currently no listings available.
    </p>
  </div>
));

// Skeleton loader component
const SkeletonGrid = memo(({ count = 6 }: { count?: number }) => (
  <div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    role="status"
    aria-label="Loading listings"
  >
    {Array.from({ length: count }, (_, index) => (
      <ListingCard key={`skeleton-${index}`} isLoading={true} />
    ))}
  </div>
));

export function ListingGrid({
  listings = [],
  isLoading = false,
  onLoadMore,
  hasMore = false,
}: ListingGridProps) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Memoize the intersection observer callback
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isLoading) {
        onLoadMore?.();
      }
    },
    [isLoading, onLoadMore]
  );

  useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    if (observerTarget.current) {
      observerRef.current.observe(observerTarget.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, handleIntersection, onLoadMore]);

  // Show loading state if no listings and isLoading
  if (listings.length === 0 && isLoading) {
    return <SkeletonGrid />;
  }

  // Show message if no listings and not loading
  if (listings.length === 0 && !isLoading) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="grid"
        aria-busy={isLoading}
        aria-label="Listings grid"
      >
        {listings.map((listing: Listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isLoading={isLoading}
          />
        ))}
        {isLoading && hasMore && <SkeletonGrid />}
      </div>
      {hasMore && (
        <div
          ref={observerTarget}
          className="h-10 w-full flex justify-center items-center"
          role="status"
          aria-label={isLoading ? "Loading more listings" : "Load more trigger"}
        >
          {isLoading && <LoadingIndicator />}
        </div>
      )}
    </div>
  );
}
