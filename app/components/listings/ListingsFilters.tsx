"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ListingFilters, Location } from "@/types/listings";

interface ListingsFiltersProps {
  onFiltersChange: (filters: ListingFilters) => void;
}

export function ListingsFilters({ onFiltersChange }: ListingsFiltersProps) {
  const [filters, setFilters] = useState<ListingFilters>({
    sortBy: "date",
    sortOrder: "desc",
  });

  const [locationInput, setLocationInput] = useState("");

  const handleFilterChange = (newFilters: Partial<ListingFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleLocationChange = (value: string) => {
    setLocationInput(value);

    // Simple logic to determine if input looks like a state or country
    // You might want to enhance this logic based on your needs
    const locationObject: Partial<Location> = {
      state: value,
      country: value,
      formatted: value,
    };

    handleFilterChange({ location: locationObject });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Location (State or Country)"
          onChange={(e) => handleLocationChange(e.target.value)}
          value={locationInput}
        />
        <Input
          type="number"
          placeholder="Min Price"
          onChange={(e) =>
            handleFilterChange({ minPrice: Number(e.target.value) })
          }
          value={filters.minPrice || ""}
        />
        <Input
          type="number"
          placeholder="Max Price"
          onChange={(e) =>
            handleFilterChange({ maxPrice: Number(e.target.value) })
          }
          value={filters.maxPrice || ""}
        />
        <Select
          value={filters.sortBy || "date"}
          onValueChange={(value) =>
            handleFilterChange({ sortBy: value as ListingFilters["sortBy"] })
          }
        >
          <option value="date">Date</option>
          <option value="price">Price</option>
          <option value="location">Location</option>
        </Select>
        <Button
          variant="outline"
          onClick={() =>
            handleFilterChange({
              sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
            })
          }
        >
          {filters.sortOrder === "asc" ? "↑" : "↓"}
        </Button>
      </div>
    </div>
  );
}
