"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ListingFilters } from "@/types/listings";
import { AVAILABLE_TAGS } from "@/types/listings";

interface ListingsFiltersProps {
  onFiltersChange: (filters: ListingFilters) => Promise<void>;
  initialFilters?: ListingFilters;
}

export function ListingsFilters({
  onFiltersChange,
  initialFilters = {
    sortBy: "date",
    sortOrder: "desc",
  },
}: ListingsFiltersProps) {
  const [filters, setFilters] = useState<ListingFilters>(initialFilters);

  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedClub, setSelectedClub] = useState<string>("all");

  // Initialize UI states from initialFilters
  useEffect(() => {
    // Set sort option
    if (initialFilters.sortBy === "date") {
      setSelectedSort(
        initialFilters.sortOrder === "desc" ? "newest" : "oldest"
      );
    } else if (initialFilters.sortBy === "price") {
      setSelectedSort(
        initialFilters.sortOrder === "desc" ? "highest" : "lowest"
      );
    }

    // Set tag if present
    if (initialFilters.tag) {
      setSelectedTag(initialFilters.tag);
    }

    // Set location options
    if (initialFilters.location?.city) {
      setSelectedCity(initialFilters.location.city);
    }

    if (initialFilters.location?.club) {
      setSelectedClub(initialFilters.location.club);
    }

    setFilters(initialFilters);
  }, [initialFilters]);

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

    // Create updated location object based on current club and new city
    const location = {
      ...(filters.location || {}),
      city: city === "all" ? undefined : city,
    };

    // If both city and club are "all" (undefined), set location to undefined
    if (!location.city && !location.club) {
      handleFilterChange({ location: undefined });
    } else {
      handleFilterChange({ location });
    }
  };

  const handleClubChange = (club: string) => {
    setSelectedClub(club);

    // Create updated location object based on current city and new club
    const location = {
      ...(filters.location || {}),
      club: club === "all" ? undefined : club,
    };

    // If both city and club are "all" (undefined), set location to undefined
    if (!location.city && !location.club) {
      handleFilterChange({ location: undefined });
    } else {
      handleFilterChange({ location });
    }
  };

  const handleFilterChange = async (newFilters: Partial<ListingFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    await onFiltersChange(updatedFilters);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-screen-lg mx-auto py-4">
      {/* Sort Dropdown - Simplified to 4 common options */}
      <Select value={selectedSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-full sm:w-48">
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
      <Select value={selectedTag} onValueChange={handleTagChange}>
        <SelectTrigger className="w-full sm:w-48">
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

      {/* City Filter Dropdown */}
      <Select value={selectedCity} onValueChange={handleCityChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by city" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          <SelectItem value="New York">New York</SelectItem>
          <SelectItem value="Los Angeles">Los Angeles</SelectItem>
          <SelectItem value="Chicago">Chicago</SelectItem>
          <SelectItem value="Miami">Miami</SelectItem>
          <SelectItem value="Houston">Houston</SelectItem>
          <SelectItem value="Online">Online</SelectItem>
          {/* Add more cities as needed */}
        </SelectContent>
      </Select>

      {/* Club Filter Dropdown */}
      <Select value={selectedClub} onValueChange={handleClubChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by club" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clubs</SelectItem>
          <SelectItem value="Tennis Club NYC">Tennis Club NYC</SelectItem>
          <SelectItem value="LA Tennis Center">LA Tennis Center</SelectItem>
          <SelectItem value="Chicago Tennis Academy">
            Chicago Tennis Academy
          </SelectItem>
          <SelectItem value="Miami Beach Tennis">Miami Beach Tennis</SelectItem>
          <SelectItem value="Houston Tennis League">
            Houston Tennis League
          </SelectItem>
          {/* Add more clubs as needed */}
        </SelectContent>
      </Select>
    </div>
  );
}
