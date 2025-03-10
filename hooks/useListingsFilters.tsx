"use client";
// hooks/useListingsFilters.ts
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { ListingFilters } from "@/types/listings";

export function useListingsFilters(
  onFiltersApplied?: (filters: ListingFilters) => Promise<void>
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State management
  const [isFilterOperationInProgress, setIsFilterOperationInProgress] =
    useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [resetFilterTrigger, setResetFilterTrigger] = useState(0);
  const latestFilterRef = useRef<ListingFilters | null>(null);

  // Function to create query string with updated parameters
  const createQueryString = useCallback(
    (params: Record<string, string | undefined>) => {
      const urlParams = new URLSearchParams(searchParams.toString());

      // Update or remove parameters
      Object.entries(params).forEach(([name, value]) => {
        if (value === undefined) {
          urlParams.delete(name);
        } else {
          urlParams.set(name, value);
        }
      });

      return urlParams.toString();
    },
    [searchParams]
  );

  // Get initial filters from URL
  const getInitialFilters = useCallback((): ListingFilters => {
    const sortBy = (searchParams.get("sortBy") as "date" | "price") || "date";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const tag = searchParams.get("tag") || undefined;
    const city = searchParams.get("city") || undefined;

    // Create location object if city is present
    const location = city ? { city } : undefined;

    return {
      sortBy,
      sortOrder,
      tag,
      location,
    };
  }, [searchParams]);

  // Initialize UI states based on filters
  const initializeUIState = useCallback((filters: ListingFilters) => {
    if (filters.sortBy === "date") {
      setSelectedSort(filters.sortOrder === "desc" ? "newest" : "oldest");
    } else if (filters.sortBy === "price") {
      setSelectedSort(filters.sortOrder === "desc" ? "highest" : "lowest");
    }

    setSelectedTag(filters.tag || "all");
    setSelectedCity(filters.location?.city || "all");
  }, []);

  // Initialize from URL params on mount
  useEffect(() => {
    const initialFilters = getInitialFilters();
    latestFilterRef.current = initialFilters;
    initializeUIState(initialFilters);
  }, [getInitialFilters, initializeUIState]);

  // Apply filters with loading state management
  const applyFilters = useCallback(
    async (filters: ListingFilters) => {
      // Save the latest filters requested
      latestFilterRef.current = filters;

      // If a filter operation is already in progress, don't start another one
      if (isFilterOperationInProgress) {
        return;
      }

      setIsFilterOperationInProgress(true);

      try {
        // Update URL with new filter parameters
        const queryParams: Record<string, string | undefined> = {
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          tag: filters.tag,
          city: filters.location?.city,
        };

        // Update URL without full page reload
        router.push(`${pathname}?${createQueryString(queryParams)}`, {
          scroll: false,
        });

        // Pass filters to parent if callback exists
        if (onFiltersApplied) {
          await onFiltersApplied(filters);
        }
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        setIsFilterOperationInProgress(false);
      }
    },
    [
      isFilterOperationInProgress,
      router,
      pathname,
      createQueryString,
      onFiltersApplied,
    ]
  );

  // Map the user-friendly sort options to the actual filter values
  const handleSortChange = useCallback(
    (value: string) => {
      setSelectedSort(value);

      let sortBy: ListingFilters["sortBy"] = "date";
      let sortOrder: ListingFilters["sortOrder"] = "desc";

      switch (value) {
        case "newest":
          sortBy = "date";
          sortOrder = "desc";
          break;
        case "oldest":
          sortBy = "date";
          sortOrder = "asc";
          break;
        case "highest":
          sortBy = "price";
          sortOrder = "desc";
          break;
        case "lowest":
          sortBy = "price";
          sortOrder = "asc";
          break;
      }

      const currentFilters = latestFilterRef.current || getInitialFilters();
      applyFilters({ ...currentFilters, sortBy, sortOrder });
    },
    [applyFilters, getInitialFilters]
  );

  const handleTagChange = useCallback(
    (tag: string) => {
      setSelectedTag(tag);

      // Handle tag filtering
      const tagFilter = tag === "all" ? undefined : tag;
      const currentFilters = latestFilterRef.current || getInitialFilters();
      applyFilters({ ...currentFilters, tag: tagFilter });
    },
    [applyFilters, getInitialFilters]
  );

  const handleCityChange = useCallback(
    (city: string) => {
      setSelectedCity(city);

      const currentFilters = latestFilterRef.current || getInitialFilters();
      // Create updated location object for the new city
      if (city === "all") {
        // If city is "all", remove location filter entirely
        applyFilters({ ...currentFilters, location: undefined });
      } else {
        // Otherwise set the city filter
        applyFilters({
          ...currentFilters,
          location: { city },
        });
      }
    },
    [applyFilters, getInitialFilters]
  );

  const clearFilters = useCallback(async () => {
    if (isFilterOperationInProgress) {
      return;
    }

    // Create default filters
    const defaultFilters: ListingFilters = {
      sortBy: "date",
      sortOrder: "desc",
    };

    // Reset UI states
    setSelectedSort("newest");
    setSelectedTag("all");
    setSelectedCity("all");

    // Increment the reset trigger
    setResetFilterTrigger((prev) => prev + 1);

    // Apply the default filters
    await applyFilters(defaultFilters);
  }, [isFilterOperationInProgress, applyFilters]);

  // Check if any filters are active
  const areFiltersActive = useCallback(() => {
    const currentFilters = latestFilterRef.current;
    if (!currentFilters) return false;

    // Check if any filter is active besides the default sort
    return !!(
      currentFilters.tag ||
      currentFilters.location?.city ||
      currentFilters.sortBy !== "date" ||
      currentFilters.sortOrder !== "desc"
    );
  }, []);

  return {
    // State
    filters: latestFilterRef.current || getInitialFilters(),
    isFilterOperationInProgress,
    selectedTag,
    selectedSort,
    selectedCity,
    resetFilterTrigger,

    // Actions
    handleSortChange,
    handleTagChange,
    handleCityChange,
    clearFilters,

    // Helpers
    getInitialFilters,
    areFiltersActive,
  };
}
