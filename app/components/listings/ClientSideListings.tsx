"use client";
// components/listings/ClientSideListings.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ListingsFilters } from "@/components/listings/ListingsFilters";
import { ListingGrid } from "@/components/listings/ListingGrid";
import type {
  Listing,
  ListingFilters as ListingFiltersType,
} from "@/types/listings";

interface ClientSideListingsProps {
  initialListings: Listing[];
}

export function ClientSideListings({
  initialListings,
}: ClientSideListingsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOperationInProgress, setIsFilterOperationInProgress] =
    useState(false);
  const latestFilterRef = useRef<ListingFiltersType | null>(null);

  // Initial filters from URL
  const getInitialFilters = useCallback((): ListingFiltersType => {
    const sortBy = (searchParams.get("sortBy") as "date" | "price") || "date";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const tag = searchParams.get("tag") || undefined;
    const city = searchParams.get("city") || undefined;

    // Create location object if city is present
    const location = city ? { city } : undefined;

    const filters = {
      sortBy,
      sortOrder,
      tag,
      location,
    };

    console.log("Initial filters from URL:", filters);
    return filters;
  }, [searchParams]);

  // Handle filter changes
  const handleFiltersChange = async (filters: ListingFiltersType) => {
    console.log("Filter change requested with filters:", filters);

    // Save the latest filters requested
    latestFilterRef.current = filters;

    // If a filter operation is already in progress, don't start another one
    if (isFilterOperationInProgress) {
      console.log("Filter operation already in progress, skipping");
      return;
    }

    console.log("Starting filter operation");
    setIsFilterOperationInProgress(true);
    setIsLoading(true);

    try {
      console.log("Fetching filtered listings...");
      // Use the latest filters from the ref to ensure we're using the most recent request
      const currentFilters = latestFilterRef.current || filters;
      const response = await fetchFilteredListings(currentFilters);
      console.log("Fetch completed, updating listings");
      setListings(response);
    } catch (error) {
      console.error("Error fetching filtered listings:", error);
    }

    console.log("Setting loading state to false");
    setIsLoading(false);
    setIsFilterOperationInProgress(false);
  };

  // Simulated API call - replace with your actual data fetching logic
  const fetchFilteredListings = async (
    filters: ListingFiltersType
  ): Promise<Listing[]> => {
    console.log("fetchFilteredListings started with filters:", filters);

    // This is where you would make an API call to your backend
    // For example:
    // const response = await fetch(`/api/listings?${new URLSearchParams(filterParams)}`)
    // return response.json()

    // For now, we'll just simulate a delay and filter the initial listings client-side
    console.log("Simulating network delay...");
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Longer delay to make loading state more visible
    console.log("Network delay completed");

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

    console.log(`Filter complete, returning ${filteredResults.length} results`);
    return filteredResults;
  };

  // Effect to apply initial filters only once when component mounts
  useEffect(() => {
    const initialFilters = getInitialFilters();
    console.log("INITIALIZATION: Using initial filters", initialFilters);

    // Skip the initial filter operation if we already have initialListings
    if (initialListings.length > 0) {
      console.log(
        "INITIALIZATION: Using provided initialListings, skipping initial fetch"
      );
      // Just update the latest filter ref without triggering a fetch
      latestFilterRef.current = initialFilters;
      setListings(initialListings);
    } else {
      console.log(
        "INITIALIZATION: No initial listings, applying filters from URL"
      );
      // Set flag directly to prevent any other filter operations from starting
      setIsFilterOperationInProgress(true);

      // Simulate a small delay to ensure our state updates
      setTimeout(async () => {
        try {
          const response = await fetchFilteredListings(initialFilters);
          setListings(response);
        } catch (error) {
          console.error("Error during initialization:", error);
        } finally {
          setIsFilterOperationInProgress(false);
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mt-8">
        {/* Prevent the ListingsFilters component from re-initializing on each render */}
        <ListingsFilters
          key="listings-filters"
          onFiltersChange={handleFiltersChange}
          initialFilters={getInitialFilters()}
          disabled={isFilterOperationInProgress}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-gray-500">Loading results...</p>
              <div className="h-2 bg-gray-200 rounded-full max-w-md mx-auto mt-4"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-500 mb-4 px-4">
              {listings.length} listings found
            </div>
            <ListingGrid listings={listings} />
          </>
        )}
      </div>
    </div>
  );
}
