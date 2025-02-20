import React, { useState, useEffect } from "react";
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

interface LocationValue {
  country: string;
  state: string;
}

interface LocationSelectorProps {
  disabled?: boolean;
  value: LocationValue;
  onCountryChange: (location: LocationValue) => void;
  onStateChange: (location: LocationValue) => void;
}

const LocationSelector = ({
  disabled,
  onCountryChange,
  onStateChange,
  value,
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

  // Effect to handle external value changes (including reset)
  useEffect(() => {
    // Reset internal state when value is empty
    if (!value?.country) {
      setSelectedCountry(null);
      setSelectedState(null);
      return;
    }

    // Update internal state based on new value
    const foundCity = cityData.find((city) => city.name === value.country);
    if (foundCity) {
      setSelectedCountry(foundCity);

      if (value.state) {
        const foundArea = areaData.find(
          (area) => area.city_id === foundCity.id && area.name === value.state
        );
        setSelectedState(foundArea || null);
      } else {
        setSelectedState(null);
      }
    } else {
      setSelectedCountry(null);
      setSelectedState(null);
    }
  }, [value, cityData, areaData]);

  // Filter states for selected country
  const availableAreas = selectedCountry
    ? areaData.filter((area) => area.city_id === selectedCountry.id)
    : [];

  const handleCountrySelect = (country: CityProps) => {
    setSelectedCountry(country);
    setSelectedState(null);
    onCountryChange({
      country: country.name,
      state: "",
    });
  };

  const handleStateSelect = (state: AreaProps) => {
    setSelectedState(state);
    if (selectedCountry) {
      onStateChange({
        country: selectedCountry.name,
        state: state.name,
      });
    }
  };

  return (
    <div className="flex gap-4">
      <Popover open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCountryDropdown}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              !selectedCountry && "text-muted-foreground"
            )}
          >
            {selectedCountry ? (
              <span>{selectedCountry.name}</span>
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
                <ScrollArea className="h-72">
                  {cityData.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={city.name}
                      onSelect={() => {
                        handleCountrySelect(city);
                        setOpenCountryDropdown(false);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{city.name}</span>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedCountry?.id === city.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
                  <ScrollBar />
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {availableAreas.length > 0 && (
        <Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStateDropdown}
              disabled={!selectedCountry || disabled}
              className="w-full justify-between"
            >
              {selectedState ? (
                <span>{selectedState.name}</span>
              ) : (
                <span>Select State (Optional)...</span>
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
                  <ScrollArea className="h-72">
                    {availableAreas.map((area) => (
                      <CommandItem
                        key={area.id}
                        value={area.name}
                        onSelect={() => {
                          handleStateSelect(area);
                          setOpenStateDropdown(false);
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{area.name}</span>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              selectedState?.id === area.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </div>
                      </CommandItem>
                    ))}
                    <ScrollBar />
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
