"use client";
// components/listings/ClientSideListings.tsx
import { useState, useCallback, useEffect } from "react";
import { ListingsFilters } from "@/app/listings/components/ListingsFilters";
import { ListingGrid } from "@/app/listings/components/ListingGrid";
import type {
  Listing,
  ListingFilters as ListingFiltersType,
} from "@/types/listings";
import prompts from "@/prompts/prompts";
import { useListingsFilters } from "@/hooks/useListingsFilters";

interface ClientSideListingsProps {
  initialListings: Listing[];
}

export function ClientSideListings({
  initialListings,
}: ClientSideListingsProps) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Ensure we stop the loading state even if stuck (safety net)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      // If loading takes more than 10 seconds, force it to stop
      timeoutId = setTimeout(() => {
        console.warn("Loading timeout reached, forcing loading state to end");
        setIsLoading(false);
      }, 10000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  // First, declare the fetchFilteredListings function
  const fetchFilteredListings = useCallback(
    async (filters: ListingFiltersType): Promise<Listing[]> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const filteredResults = initialListings
        .filter((listing) => {
          if (
            filters.tag &&
            listing.tags &&
            !listing.tags.includes(filters.tag)
          ) {
            return false;
          }
          if (
            filters.location?.city &&
            listing.location?.city !== filters.location.city
          ) {
            return false;
          }
          return true;
        })
        .sort((a, b) => {
          if (filters.sortBy === "date") {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
          } else {
            return filters.sortOrder === "asc"
              ? (a.price || 0) - (b.price || 0)
              : (b.price || 0) - (a.price || 0);
          }
        });

      return filteredResults;
    },
    [initialListings] // Only depends on initialListings
  );

  // Then, declare handleFiltersApplied which uses fetchFilteredListings
  const handleFiltersApplied = useCallback(
    async (filters: ListingFiltersType) => {
      // Only set loading if we're not already loading
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetchFilteredListings(filters);
        setListings(response);
      } catch (error) {
        console.error("Error fetching filtered listings:", error);
        setHasError(true);
        // If there's an error, continue showing the previous listings
      } finally {
        // Always reset loading state
        setIsLoading(false);
      }
    },
    [fetchFilteredListings]
  );

  // Use our custom hook for filter state management
  const {
    selectedTag,
    selectedSort,
    selectedCity,
    isFilterOperationInProgress,
    resetFilterTrigger,
    handleSortChange,
    handleTagChange,
    handleCityChange,
    areFiltersActive,
    clearFilters,
  } = useListingsFilters(handleFiltersApplied);

  return (
    <div>
      <div className="mt-8">
        <ListingsFilters
          key={`listings-filters-${resetFilterTrigger}`}
          onFiltersChange={handleFiltersApplied}
          disabled={isFilterOperationInProgress}
          totalItems={listings.length}
          clearFilters={clearFilters}
          areFiltersActive={areFiltersActive}
          // Pass filter state and handlers directly
          selectedTag={selectedTag}
          selectedSort={selectedSort}
          selectedCity={selectedCity}
          handleTagChange={handleTagChange}
          handleSortChange={handleSortChange}
          handleCityChange={handleCityChange}
          isFilterOperationInProgress={isFilterOperationInProgress}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-gray-500">
                {prompts.common.emptyStates.loading || "Loading results..."}
              </p>
              <div className="h-2 bg-gray-200 rounded-full max-w-md mx-auto mt-4"></div>
            </div>
          </div>
        ) : hasError ? (
          <div className="flex justify-center py-12 text-center">
            <div className="text-red-500">
              <p>Error loading results. Please try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <ListingGrid listings={listings} />
        )}
      </div>
    </div>
  );
}
