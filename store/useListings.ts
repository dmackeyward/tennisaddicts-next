// store/useListings.ts
import { create } from "zustand";
import type { Listing, ListingFilters } from "@/types/listings";

interface ListingsState {
  listings: Listing[];
  isLoading: boolean;
  hasMore: boolean;
  filters: ListingFilters;

  // Actions
  initializeListings: (initialListings: Listing[]) => void;
  setListings: (listings: Listing[]) => void;
  setLoading: (loading: boolean) => void;
  updateFilters: (filters: ListingFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  refreshListings: () => Promise<void>;
}

// Helper function to create search params
const createSearchParams = (
  filters: ListingFilters
): Record<string, string> => {
  const params: Record<string, string> = {};

  // Handle location object by converting it to a formatted string or using individual parts
  if (filters.location) {
    if (filters.location.formatted) {
      params.location = filters.location.formatted;
    } else {
      const locationParts = [];
      if (filters.location.state) locationParts.push(filters.location.state);
      if (filters.location.country)
        locationParts.push(filters.location.country);
      if (locationParts.length > 0) {
        params.location = locationParts.join(", ");
      }
    }
  }

  if (filters.minPrice) params.minPrice = filters.minPrice.toString();
  if (filters.maxPrice) params.maxPrice = filters.maxPrice.toString();
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  return params;
};

export const useListingsStore = create<ListingsState>((set, get) => ({
  listings: [],
  isLoading: false,
  hasMore: true,
  filters: {
    sortBy: "date",
    sortOrder: "desc",
  },

  // New method to initialize listings with server-fetched data
  initializeListings: (initialListings) => {
    set({
      listings: initialListings,
      hasMore: initialListings.length >= 10,
      isLoading: false,
    });
  },

  setListings: (listings) => set({ listings }),

  setLoading: (isLoading) => set({ isLoading }),

  // Updated to handle filter changes
  updateFilters: async (newFilters) => {
    set({ filters: newFilters, isLoading: true });
    try {
      const params = createSearchParams(newFilters);
      const response = await fetch(
        "/api/listings?" + new URLSearchParams(params)
      );
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }
      const filteredListings = await response.json();

      set({
        listings: filteredListings,
        hasMore: filteredListings.length >= 10,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error applying filters:", error);
      set({ isLoading: false });
    }
  },

  loadMore: async () => {
    const { isLoading, filters, listings } = get();
    if (isLoading) return;

    set({ isLoading: true });
    try {
      const params = {
        ...createSearchParams(filters),
        skip: listings.length.toString(),
        limit: "10",
      };

      const response = await fetch(
        "/api/listings?" + new URLSearchParams(params)
      );
      if (!response.ok) {
        throw new Error("Failed to load more listings");
      }
      const newListings = await response.json();

      set((state) => ({
        listings: [...state.listings, ...newListings],
        hasMore: newListings.length >= 10,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error loading more listings:", error);
      set({ isLoading: false });
    }
  },

  refreshListings: async () => {
    const { filters } = get();
    set({ isLoading: true });
    try {
      const params = createSearchParams(filters);
      const response = await fetch(
        "/api/listings?" + new URLSearchParams(params)
      );
      if (!response.ok) {
        throw new Error("Failed to refresh listings");
      }
      const refreshedListings = await response.json();

      set({
        listings: refreshedListings,
        hasMore: refreshedListings.length >= 10,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error refreshing listings:", error);
      set({ isLoading: false });
    }
  },
}));
