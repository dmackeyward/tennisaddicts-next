"use client";
// hooks/useListingsFilters.ts
import { useState, useCallback, useEffect } from "react";
import type { ListingFilters } from "@/types/listings";

export function useListingsFilters(
  onFiltersChange: (filters: ListingFilters) => Promise<void>
) {
  // State for filter values
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [isFilterOperationInProgress, setIsFilterOperationInProgress] =
    useState(false);
  const [resetFilterTrigger, setResetFilterTrigger] = useState(0);

  // Function to apply filters
  const applyFilters = useCallback(async () => {
    setIsFilterOperationInProgress(true);

    try {
      // Construct filter object based on current state
      const filters: ListingFilters = {
        tag: selectedTag !== "all" ? selectedTag : undefined,
        sortBy:
          selectedSort.includes("newest") || selectedSort.includes("oldest")
            ? "date"
            : "price",
        sortOrder:
          selectedSort.includes("newest") || selectedSort.includes("highest")
            ? "desc"
            : "asc",
        location: selectedCity !== "all" ? { city: selectedCity } : undefined,
      };

      // Call the provided callback with the filter object
      await onFiltersChange(filters);
    } finally {
      setIsFilterOperationInProgress(false);
    }
  }, [selectedTag, selectedSort, selectedCity, onFiltersChange]);

  // Apply filters whenever any filter value changes
  useEffect(() => {
    applyFilters();
  }, [selectedTag, selectedSort, selectedCity, applyFilters]);

  // Handle filter changes
  const handleTagChange = useCallback((value: string) => {
    setSelectedTag(value);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSelectedSort(value);
  }, []);

  const handleCityChange = useCallback((value: string) => {
    setSelectedCity(value);
  }, []);

  // Check if any filters are active
  const areFiltersActive = useCallback(() => {
    return (
      selectedTag !== "all" ||
      selectedSort !== "newest" ||
      selectedCity !== "all"
    );
  }, [selectedTag, selectedSort, selectedCity]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedTag("all");
    setSelectedSort("newest");
    setSelectedCity("all");
    setResetFilterTrigger((prev) => prev + 1);
  }, []);

  return {
    selectedTag,
    selectedSort,
    selectedCity,
    isFilterOperationInProgress,
    resetFilterTrigger,
    handleTagChange,
    handleSortChange,
    handleCityChange,
    areFiltersActive,
    clearFilters,
  };
}
