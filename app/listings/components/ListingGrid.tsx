"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";
import ListingCard from "./ListingCard";
import type { Listing } from "@/types/listings";
import prompts from "@/prompts/prompts";

// Extended ListingGridProps interface with additional properties
interface ListingGridProps {
  listings?: Listing[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  category?: string;
  subcategory?: string;
}

// Separate loading indicator component
const LoadingIndicator = memo(() => (
  <div className="animate-pulse text-gray-500">
    {prompts.common.emptyStates.loading}
  </div>
));
LoadingIndicator.displayName = "LoadingIndicator";

// Separate empty state component
const EmptyState = memo(() => (
  <div
    className="flex flex-col items-center justify-center py-12 px-4"
    role="status"
    aria-label="No listings available"
  >
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      {prompts.common.emptyStates.noResults}
    </h3>
    <p className="text-gray-500 text-center">
      {prompts.common.emptyStates.tryAgain}
    </p>
  </div>
));
EmptyState.displayName = "EmptyState";

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
SkeletonGrid.displayName = "SkeletonGrid";

export function ListingGrid({
  listings = [],
  isLoading = false,
  onLoadMore,
  hasMore = false,
  category,
}: ListingGridProps) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get relevant prompts
  const listingsPrompts = prompts.listings;
  const commonPrompts = prompts.common;

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

  // Get proper empty state message based on category/subcategory
  const getEmptyStateMessage = () => {
    if (category) {
      // Safely check if the category exists in listingsPrompts
      const categoryExists = Object.keys(listingsPrompts).includes(category);
      if (categoryExists) {
        return `No ${category.toLowerCase()} listings found. ${
          prompts.common.emptyStates.tryAgain
        }`;
      }
    }
    return prompts.common.emptyStates.tryAgain;
  };

  // Custom EmptyState with category-specific messaging
  const CategoryEmptyState = () => (
    <div
      className="flex flex-col items-center justify-center py-12 px-4"
      role="status"
      aria-label="No listings available"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {prompts.common.emptyStates.noResults}
      </h3>
      <p className="text-gray-500 text-center">{getEmptyStateMessage()}</p>
    </div>
  );

  // Show loading state if no listings and isLoading
  if (listings.length === 0 && isLoading) {
    return <SkeletonGrid />;
  }

  // Show message if no listings and not loading
  if (listings.length === 0 && !isLoading) {
    return <CategoryEmptyState />;
  }

  // Display informational text about results
  const getResultsText = () => {
    if (listings.length === 0) return "";

    return `${prompts.common.pagination.showing} ${listings.length} ${prompts.common.pagination.items}`;
  };

  return (
    <div className="space-y-6">
      {listings.length > 0 && (
        <div className="text-sm text-gray-500">{getResultsText()}</div>
      )}

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
      </div>

      {isLoading && <SkeletonGrid count={3} />}

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

      {/* Pagination summary - shows at the bottom when there are multiple pages */}
      {listings.length > 0 && hasMore && !isLoading && (
        <div className="flex justify-center items-center text-sm text-gray-500">
          {commonPrompts.pagination.showing} {listings.length}{" "}
          {commonPrompts.pagination.items}
          {hasMore
            ? ` - ${commonPrompts.pagination.next} ${commonPrompts.pagination.page} available`
            : ""}
        </div>
      )}
    </div>
  );
}

export default memo(ListingGrid);
