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

interface ListingsFiltersProps {
  onFiltersChange: (filters: ListingFilters) => Promise<void>;
  disabled?: boolean;
  category?: string; // Optional category to customize filter options
  totalItems?: number; // Pass the number of filtered items
  clearFilters?: () => void; // Function to clear all filters
  areFiltersActive?: () => boolean; // Function to check if filters are active

  // Add props for filter state controlled by parent
  selectedTag: string;
  selectedSort: string;
  selectedCity: string;
  handleTagChange: (value: string) => void;
  handleSortChange: (value: string) => void;
  handleCityChange: (value: string) => void;
  isFilterOperationInProgress: boolean;
}

export const ListingsFilters = memo(function ListingsFilters({
  disabled = false,
  category,
  totalItems,
  clearFilters,
  areFiltersActive,
  // Use these props directly from parent
  selectedTag,
  selectedSort,
  selectedCity,
  handleTagChange,
  handleSortChange,
  handleCityChange,
  isFilterOperationInProgress,
}: ListingsFiltersProps) {
  // Get prompts
  const filtersPrompts = prompts.common.filters;
  const listingsPrompts = prompts.listings;

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
    <div className="flex flex-col gap-4 max-w-screen-lg mx-auto py-4">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
            <SelectItem value="newest">
              {filtersPrompts.date} (Newest)
            </SelectItem>
            <SelectItem value="oldest">
              {filtersPrompts.date} (Oldest)
            </SelectItem>
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
            <SelectItem value="all">
              {listingsPrompts.categories.all}
            </SelectItem>
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
      </div>

      {/* Filter results info and clear button row */}
      <div className="flex justify-between items-center text-sm px-4 mt-2">
        <div className="text-gray-600">
          {totalItems !== undefined && `Showing ${totalItems} item(s)`}
        </div>
        {areFiltersActive && areFiltersActive() && clearFilters && (
          <button
            onClick={clearFilters}
            className="text-blue-500 hover:text-blue-700 font-medium transition-colors focus:outline-none"
            disabled={actuallyDisabled}
          >
            {prompts.common.filters.clearFilters || "Clear Filters"}
          </button>
        )}
      </div>
    </div>
  );
});

export default ListingsFilters;
