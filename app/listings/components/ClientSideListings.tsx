"use client";
// components/listings/ClientSideListings.tsx
import { useState, useCallback } from "react";
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

  // Handle filter changes and fetch results
  const handleFiltersApplied = async (filters: ListingFiltersType) => {
    setIsLoading(true);
    try {
      const response = await fetchFilteredListings(filters);
      setListings(response);
    } catch (error) {
      console.error("Error fetching filtered listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use our custom hook for filter state management
  const {
    resetFilterTrigger,
    isFilterOperationInProgress,
    areFiltersActive,
    clearFilters,
  } = useListingsFilters(handleFiltersApplied);

  // Simulated API call - replace with your actual data fetching logic
  const fetchFilteredListings = async (
    filters: ListingFiltersType
  ): Promise<Listing[]> => {
    // This is where you would make an API call to your backend
    // For example:
    // const response = await fetch(`/api/listings?${new URLSearchParams(filterParams)}`)
    // return response.json()

    // For now, we'll just simulate a delay and filter the initial listings client-side
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Longer delay to make loading state more visible

    // Apply filters to initialListings
    const filteredResults = initialListings
      .filter((listing) => {
        // Filter by tag
        if (
          filters.tag &&
          listing.tags &&
          !listing.tags.includes(filters.tag)
        ) {
          return false;
        }

        // Filter by city
        if (
          filters.location?.city &&
          listing.location?.city !== filters.location.city
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by date or price
        if (filters.sortBy === "date") {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else {
          // Sort by price
          return filters.sortOrder === "asc"
            ? (a.price || 0) - (b.price || 0)
            : (b.price || 0) - (a.price || 0);
        }
      });

    return filteredResults;
  };

  return (
    <div>
      <div className="mt-8">
        <ListingsFilters
          key={`listings-filters-${resetFilterTrigger}`}
          onFiltersChange={handleFiltersApplied}
          disabled={isFilterOperationInProgress}
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
        ) : (
          <>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4 px-4">
              <div>
                {listings.length} {prompts.common.pagination.items}
              </div>
              {areFiltersActive() && (
                <button
                  onClick={clearFilters}
                  className="text-blue-500 hover:text-blue-700 font-medium transition-colors focus:outline-none"
                  disabled={isFilterOperationInProgress}
                >
                  {prompts.common.filters.clearFilters}
                </button>
              )}
            </div>
            <ListingGrid listings={listings} />
          </>
        )}
      </div>
    </div>
  );
}
