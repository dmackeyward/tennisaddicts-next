import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Import JSON data directly
import city from "@/data/city.json";
import area from "@/data/area.json";

type CityProps = {
  id: number;
  name: string;
  region: string;
  country: string;
};

type AreaProps = {
  id: number;
  city_id: number;
  name: string;
};

interface LocationSelectorProps {
  disabled?: boolean;
  onCountryChange?: (country: CityProps | null) => void;
  onStateChange?: (state: AreaProps | null) => void;
}

const LocationSelector = ({
  disabled,
  onCountryChange,
  onStateChange,
}: LocationSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CityProps | null>(
    null
  );
  const [selectedState, setSelectedState] = useState<AreaProps | null>(null);
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);

  // Cast imported JSON data to their respective types
  const cityData = city.cities as CityProps[];
  const areaData = area.areas as AreaProps[];

  // Filter states for selected country
  const availableAreas = areaData.filter(
    (area) => area.city_id === selectedCountry?.id
  );

  const handleCountrySelect = (country: CityProps | null) => {
    setSelectedCountry(country);
    setSelectedState(null); // Reset state when country changes
    onCountryChange?.(country);
    onStateChange?.(null);
  };

  const handleStateSelect = (state: AreaProps | null) => {
    setSelectedState(state);
    onStateChange?.(state);
  };

  return (
    <div className="flex gap-4">
      {/* Country Selector */}
      <Popover open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCountryDropdown}
            disabled={disabled}
            className="w-full justify-between"
          >
            {selectedCountry ? (
              <div className="flex items-center gap-2">
                <span>{selectedCountry.name}</span>
              </div>
            ) : (
              <span>Select Country...</span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[300px]">
                  {cityData.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={city.name}
                      onSelect={() => {
                        handleCountrySelect(city);
                        setOpenCountryDropdown(false);
                      }}
                      className="flex cursor-pointer items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{city.name}</span>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedCountry?.id === city.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* State Selector - Only shown if selected country has states */}
      {availableAreas.length > 0 && (
        <Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStateDropdown}
              disabled={!selectedCountry}
              className="w-full justify-between"
            >
              {selectedState ? (
                <span>{selectedState.name}</span>
              ) : (
                <span>Select State...</span>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search state..." />
              <CommandList>
                <CommandEmpty>No state found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {availableAreas.map((area) => (
                      <CommandItem
                        key={area.id}
                        value={area.name}
                        onSelect={() => {
                          handleStateSelect(area);
                          setOpenStateDropdown(false);
                        }}
                        className="flex cursor-pointer items-center justify-between text-sm"
                      >
                        <span>{area.name}</span>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedState?.id === area.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default LocationSelector;
