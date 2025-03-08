"use client";
// components/listings/ClientSideListings.tsx
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ListingsFilters } from "@/components/listings/ListingsFilters";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { useListingsStore } from "@/store/useListings";
import type { Listing, ListingFilters } from "@/types/listings";

interface ClientSideListingsProps {
  initialListings: Listing[];
  rawSearchParams?: { [key: string]: string | string[] | undefined };
}

export function ClientSideListings({
  initialListings,
  rawSearchParams,
}: ClientSideListingsProps) {
  const {
    listings,
    isLoading,
    hasMore,
    filters,
    initializeListings,
    updateFilters,
  } = useListingsStore();

  // For URL management
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize store with server-fetched data
  useEffect(() => {
    initializeListings(initialListings);

    // Extract initial filters from URL or from passed rawSearchParams
    const initialFilters: ListingFilters = {
      sortBy: "date",
      sortOrder: "desc",
    };

    // Function to get value regardless of source (URL or rawSearchParams)
    // Make sure we're handling all parameters safely
    const getParamValue = (key: string): string | null => {
      try {
        // First try URL searchParams (for client-side navigation)
        if (searchParams && searchParams.has(key)) {
          return searchParams.get(key);
        }
        // Then try rawSearchParams (for initial server render)
        if (rawSearchParams && key in rawSearchParams) {
          const value = rawSearchParams[key];
          return typeof value === "string"
            ? value
            : Array.isArray(value)
            ? value[0]
            : null;
        }
        return null;
      } catch (error) {
        console.error(`Error accessing parameter ${key}:`, error);
        return null;
      }
    };

    // Parse sort options
    const sortBy = getParamValue("sortBy");
    if (sortBy) {
      initialFilters.sortBy = sortBy as "price" | "date" | "location";
    }

    const sortOrder = getParamValue("sortOrder");
    if (sortOrder) {
      initialFilters.sortOrder = sortOrder as "asc" | "desc";
    }

    // Parse tag
    const tag = getParamValue("tag");
    if (tag) {
      initialFilters.tag = tag;
    }

    // Parse location
    const city = getParamValue("city");
    const club = getParamValue("club");
    if (city || club) {
      initialFilters.location = {};

      if (city) {
        initialFilters.location.city = city;
      }

      if (club) {
        initialFilters.location.club = club;
      }
    }

    // Parse price range
    const minPrice = getParamValue("minPrice");
    if (minPrice) {
      initialFilters.minPrice = parseFloat(minPrice);
    }

    const maxPrice = getParamValue("maxPrice");
    if (maxPrice) {
      initialFilters.maxPrice = parseFloat(maxPrice);
    }

    // Set initial filters in store without triggering an API call
    if (
      Object.keys(initialFilters).length > 2 ||
      initialFilters.sortBy !== "date" ||
      initialFilters.sortOrder !== "desc"
    ) {
      updateFilters(initialFilters);
    }
  }, [
    initialListings,
    initializeListings,
    searchParams,
    updateFilters,
    rawSearchParams,
  ]);

  // Handle filter changes and update URL
  const handleFiltersChange = async (newFilters: ListingFilters) => {
    // Create URL search params
    const params = new URLSearchParams();

    // Add sort params
    if (newFilters.sortBy) {
      params.set("sortBy", newFilters.sortBy);
    }

    if (newFilters.sortOrder) {
      params.set("sortOrder", newFilters.sortOrder);
    }

    // Add tag param
    if (newFilters.tag) {
      params.set("tag", newFilters.tag);
    }

    // Add location params
    if (newFilters.location?.city) {
      params.set("city", newFilters.location.city);
    }

    if (newFilters.location?.club) {
      params.set("club", newFilters.location.club);
    }

    // Add price range params
    if (newFilters.minPrice !== undefined) {
      params.set("minPrice", newFilters.minPrice.toString());
    }

    if (newFilters.maxPrice !== undefined) {
      params.set("maxPrice", newFilters.maxPrice.toString());
    }

    // Update URL without refreshing the page
    router.push(`${pathname}?${params.toString()}`);

    // Update filters in store which will trigger a refresh
    await updateFilters(newFilters);
  };

  return (
    <div>
      <ListingsFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />
      <div className="mt-8">
        <ListingGrid
          listings={listings}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
}
