"use client";
// app/listings/ClientListings.tsx
import { useEffect } from "react";
import { ListingsFilters } from "@/components/listings/ListingsFilters";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { useListingsStore } from "@/store/useListings";
import type { Listing } from "@/types/listings";

interface ClientSideListingsProps {
  initialListings: Listing[];
}

export function ClientSideListings({
  initialListings,
}: ClientSideListingsProps) {
  const { listings, isLoading, setListings, updateFilters } =
    useListingsStore();

  // Initialize store with server-fetched data
  useEffect(() => {
    setListings(initialListings);
  }, [initialListings, setListings]);

  return (
    <div>
      <ListingsFilters onFiltersChange={updateFilters} />
      <div className="mt-8">
        <ListingGrid
          listings={listings}
          isLoading={isLoading}
          hasMore={false}
        />
      </div>
    </div>
  );
}
