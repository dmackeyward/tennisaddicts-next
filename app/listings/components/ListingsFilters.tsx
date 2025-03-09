"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ListingFilters } from "@/types/listings";
import { AVAILABLE_TAGS } from "@/types/listings";
import citiesData from "@/assets/data/city.json"; // Import the city.json file

interface ListingsFiltersProps {
  onFiltersChange: (filters: ListingFilters) => Promise<void>;
  initialFilters?: ListingFilters;
  disabled?: boolean;
}

export function ListingsFilters({
  onFiltersChange,
  initialFilters = {
    sortBy: "date",
    sortOrder: "desc",
  },
  disabled = false,
}: ListingsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for filters
  const [filters, setFilters] = useState<ListingFilters>(initialFilters);

  // UI state for dropdowns
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  const [selectedCity, setSelectedCity] = useState<string>("all");

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

  // Initialize filters from URL parameters whenever initialFilters changes
  useEffect(() => {
    console.log(
      "ListingsFilters: Updating from initialFilters",
      initialFilters
    );

    // Update state with values from initialFilters
    setFilters(initialFilters);

    // Update UI states based on initialFilters
    if (initialFilters.sortBy === "date") {
      setSelectedSort(
        initialFilters.sortOrder === "desc" ? "newest" : "oldest"
      );
    } else if (initialFilters.sortBy === "price") {
      setSelectedSort(
        initialFilters.sortOrder === "desc" ? "highest" : "lowest"
      );
    }

    setSelectedTag(initialFilters.tag || "all");
    setSelectedCity(initialFilters.location?.city || "all");
  }, [initialFilters]);

  // Initialize filters from URL parameters on component mount - only once on initial mount
  useEffect(() => {
    console.log("ListingsFilters: Reading URL parameters once on mount");
    const sortBy = searchParams.get("sortBy") || initialFilters.sortBy;
    const sortOrder = searchParams.get("sortOrder") || initialFilters.sortOrder;
    const tag = searchParams.get("tag") || undefined;
    const city = searchParams.get("city") || undefined;

    // Create location object if city is present
    const location = city
      ? {
          city: city || undefined,
        }
      : undefined;

    // Create filters object from URL params
    const urlFilters: ListingFilters = {
      sortBy: sortBy as "date" | "price",
      sortOrder: sortOrder as "asc" | "desc",
      tag,
      location,
    };

    // Update state with URL values
    setFilters(urlFilters);

    // Update UI states based on URL
    if (sortBy === "date") {
      setSelectedSort(sortOrder === "desc" ? "newest" : "oldest");
    } else if (sortBy === "price") {
      setSelectedSort(sortOrder === "desc" ? "highest" : "lowest");
    }

    setSelectedTag(tag || "all");
    setSelectedCity(city || "all");

    // Notify parent component of the initial filter state only if different from default
    if (JSON.stringify(urlFilters) !== JSON.stringify(initialFilters)) {
      onFiltersChange(urlFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSortChange = (value: string) => {
    setSelectedSort(value);

    let sortBy: ListingFilters["sortBy"] = "date";
    let sortOrder: ListingFilters["sortOrder"] = "desc";

    // Map the user-friendly sort options to the actual filter values
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

    handleFilterChange({ sortBy, sortOrder });
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);

    // Handle tag filtering
    const tagFilter = tag === "all" ? undefined : tag;
    handleFilterChange({ tag: tagFilter });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);

    // Create updated location object for the new city
    if (city === "all") {
      // If city is "all", remove location filter entirely
      handleFilterChange({ location: undefined });
    } else {
      // Otherwise set the city filter
      handleFilterChange({
        location: { city },
      });
    }
  };

  const handleFilterChange = async (newFilters: Partial<ListingFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Update URL with new filter parameters
    const queryParams: Record<string, string | undefined> = {
      sortBy: updatedFilters.sortBy,
      sortOrder: updatedFilters.sortOrder,
      tag: updatedFilters.tag,
      city: updatedFilters.location?.city,
    };

    // Update URL without full page reload
    router.push(`${pathname}?${createQueryString(queryParams)}`, {
      scroll: false,
    });

    // Notify parent component
    await onFiltersChange(updatedFilters);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-screen-lg mx-auto py-4">
      {/* Sort Dropdown - Simplified to 4 common options */}
      <Select
        value={selectedSort}
        onValueChange={handleSortChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={`w-full sm:w-48 ${
            disabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Most Recent</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="highest">Highest Price</SelectItem>
          <SelectItem value="lowest">Lowest Price</SelectItem>
        </SelectContent>
      </Select>

      {/* Tags Filter Dropdown */}
      <Select
        value={selectedTag}
        onValueChange={handleTagChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={`w-full sm:w-48 ${
            disabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <SelectValue placeholder="Filter by tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Items</SelectItem>
          {AVAILABLE_TAGS.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* City Filter Dropdown - Using data from city.json */}
      <Select
        value={selectedCity}
        onValueChange={handleCityChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={`w-full sm:w-48 ${
            disabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <SelectValue placeholder="Filter by city" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {citiesData.cities.map((city) => (
            <SelectItem key={city.id} value={city.name}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
