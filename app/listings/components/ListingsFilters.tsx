"use client";

import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ListingFilters } from "@/types/listings";
import { AVAILABLE_TAGS } from "@/types/listings";
import citiesData from "@/assets/data/city.json";
import prompts from "@/prompts/prompts";
import { useListingsFilters } from "@/hooks/useListingsFilters";

interface ListingsFiltersProps {
  onFiltersChange: (filters: ListingFilters) => Promise<void>;
  disabled?: boolean;
  category?: string; // Optional category to customize filter options
}

export const ListingsFilters = memo(function ListingsFilters({
  onFiltersChange,
  disabled = false,
  category,
}: ListingsFiltersProps) {
  // Get prompts
  const filtersPrompts = prompts.common.filters;
  const listingsPrompts = prompts.listings;

  // Use our custom hook for filter state management
  const {
    selectedTag,
    selectedSort,
    selectedCity,
    isFilterOperationInProgress,
    handleSortChange,
    handleTagChange,
    handleCityChange,
    clearFilters,
  } = useListingsFilters(onFiltersChange);

  const actuallyDisabled = disabled || isFilterOperationInProgress;

  // Get category-specific filter options if applicable
  const getCategorySpecificFilterOptions = () => {
    if (
      category === "equipment" &&
      listingsPrompts.equipment?.filters?.condition
    ) {
      return {
        title: listingsPrompts.equipment.filters.condition.title,
        options: [
          { value: "all", label: "All Conditions" },
          {
            value: "new",
            label: listingsPrompts.equipment.filters.condition.new,
          },
          {
            value: "likeNew",
            label: listingsPrompts.equipment.filters.condition.likeNew,
          },
          {
            value: "good",
            label: listingsPrompts.equipment.filters.condition.good,
          },
          {
            value: "fair",
            label: listingsPrompts.equipment.filters.condition.fair,
          },
        ],
      };
    }

    if (category === "courts" && listingsPrompts.courts?.filters?.surface) {
      return {
        title: listingsPrompts.courts.filters.surface,
        options: [
          { value: "all", label: "All Surfaces" },
          { value: "hard", label: listingsPrompts.courts.subcategories.hard },
          { value: "clay", label: listingsPrompts.courts.subcategories.clay },
          { value: "grass", label: listingsPrompts.courts.subcategories.grass },
        ],
      };
    }

    return null;
  };

  const categoryFilters = getCategorySpecificFilterOptions();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-screen-lg mx-auto py-4">
      {/* Sort Dropdown */}
      <Select
        value={selectedSort}
        onValueChange={handleSortChange}
        disabled={actuallyDisabled}
      >
        <SelectTrigger
          className={`w-full sm:w-48 ${
            actuallyDisabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <SelectValue placeholder={filtersPrompts.sortBy} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">{filtersPrompts.date} (Newest)</SelectItem>
          <SelectItem value="oldest">{filtersPrompts.date} (Oldest)</SelectItem>
          <SelectItem value="highest">
            {filtersPrompts.price} (Highest)
          </SelectItem>
          <SelectItem value="lowest">
            {filtersPrompts.price} (Lowest)
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Tags Filter Dropdown */}
      <Select
        value={selectedTag}
        onValueChange={handleTagChange}
        disabled={actuallyDisabled}
      >
        <SelectTrigger
          className={`w-full sm:w-48 ${
            actuallyDisabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <SelectValue placeholder={filtersPrompts.filterBy} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{listingsPrompts.categories.all}</SelectItem>
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
        disabled={actuallyDisabled}
      >
        <SelectTrigger
          className={`w-full sm:w-48 ${
            actuallyDisabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <SelectValue
            placeholder={`${filtersPrompts.filterBy} ${filtersPrompts.distance}`}
          />
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

      {/* Category-specific filter, conditionally rendered */}
      {categoryFilters && (
        <Select
          value="all"
          onValueChange={() => {}}
          disabled={actuallyDisabled}
        >
          <SelectTrigger
            className={`w-full sm:w-48 ${
              actuallyDisabled ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <SelectValue placeholder={categoryFilters.title} />
          </SelectTrigger>
          <SelectContent>
            {categoryFilters.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Clear filters button */}
      <button
        onClick={clearFilters}
        className="text-sm text-blue-600 hover:underline disabled:opacity-50"
        disabled={actuallyDisabled}
      >
        {filtersPrompts.clearFilters}
      </button>
    </div>
  );
});

export default ListingsFilters;
