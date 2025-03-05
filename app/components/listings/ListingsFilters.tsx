"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ListingFilters, Location } from "@/types/listings";

interface ListingsFiltersProps {
  onFiltersChange: (filters: ListingFilters) => void;
}

export function ListingsFilters({ onFiltersChange }: ListingsFiltersProps) {
  const [filters, setFilters] = useState<ListingFilters>({
    sortBy: "date",
    sortOrder: "desc",
  });

  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("newest");

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
    // The parent component will need to handle filtering by tag
    // since the ListingFilters interface doesn't include tags
  };

  const handleFilterChange = (newFilters: Partial<ListingFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
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
          <SelectItem value="Hitting Partner">Hitting Partner</SelectItem>
          <SelectItem value="Event">Event</SelectItem>
          <SelectItem value="Equipment">Equipment</SelectItem>
          <SelectItem value="Coaching">Coaching</SelectItem>
          <SelectItem value="Service">Service</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
