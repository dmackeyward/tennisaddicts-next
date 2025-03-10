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
import city from "@/assets/data/city.json";
import club from "@/assets/data/club.json";

type CityProps = {
  id: number;
  name: string;
  region: string;
  city: string;
};

type ClubProps = {
  id: number;
  city_id: number;
  name: string;
};

interface LocationValue {
  city: string;
  club: string;
}

interface LocationSelectorProps {
  disabled?: boolean;
  value: LocationValue;
  onCityChange: (location: LocationValue) => void;
  onClubChange: (location: LocationValue) => void;
}

const LocationSelector = ({
  disabled,
  onCityChange,
  onClubChange,
  value,
}: LocationSelectorProps) => {
  const [selectedCity, setSelectedCity] = useState<CityProps | null>(null);
  const [selectedClub, setSelectedClub] = useState<ClubProps | null>(null);
  const [openCityDropdown, setOpenCityDropdown] = useState(false);
  const [openClubDropdown, setOpenClubDropdown] = useState(false);

  // Cast imported JSON data to their respective types
  const cityData = city.cities as CityProps[];
  const clubData = club.clubs as ClubProps[];

  // Effect to handle external value changes (including reset)
  useEffect(() => {
    // Reset internal state when value is empty
    if (!value?.city) {
      setSelectedCity(null);
      setSelectedClub(null);
      return;
    }

    // Update internal state based on new value
    const foundCity = cityData.find((city) => city.name === value.city);
    if (foundCity) {
      setSelectedCity(foundCity);

      if (value.club) {
        const foundClub = clubData.find(
          (club) => club.city_id === foundCity.id && club.name === value.club
        );
        setSelectedClub(foundClub || null);
      } else {
        setSelectedClub(null);
      }
    } else {
      setSelectedCity(null);
      setSelectedClub(null);
    }
  }, [value, cityData, clubData]);

  // Filter clubs for selected city
  const availableClubs = selectedCity
    ? clubData.filter((club) => club.city_id === selectedCity.id)
    : [];

  const handleCitySelect = (city: CityProps) => {
    setSelectedCity(city);
    setSelectedClub(null);
    onCityChange({
      city: city.name,
      club: "",
    });
  };

  const handleClubSelect = (club: ClubProps) => {
    setSelectedClub(club);
    if (selectedCity) {
      onClubChange({
        city: selectedCity.name,
        club: club.name,
      });
    }
  };

  return (
    <div className="flex gap-4">
      <Popover open={openCityDropdown} onOpenChange={setOpenCityDropdown}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCityDropdown}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              !selectedCity && "text-muted-foreground"
            )}
          >
            {selectedCity ? (
              <span>{selectedCity.name}</span>
            ) : (
              <span>Select City...</span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search city..." />
            <CommandList>
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-72">
                  {cityData.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={city.name}
                      onSelect={() => {
                        handleCitySelect(city);
                        setOpenCityDropdown(false);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{city.name}</span>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedCity?.id === city.id
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

      {availableClubs.length > 0 && (
        <Popover open={openClubDropdown} onOpenChange={setOpenClubDropdown}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openClubDropdown}
              disabled={!selectedCity || disabled}
              className="w-full justify-between"
            >
              {selectedClub ? (
                <span>{selectedClub.name}</span>
              ) : (
                <span>Select Club (Optional)...</span>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search club..." />
              <CommandList>
                <CommandEmpty>No club found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-72">
                    {availableClubs.map((club) => (
                      <CommandItem
                        key={club.id}
                        value={club.name}
                        onSelect={() => {
                          handleClubSelect(club);
                          setOpenClubDropdown(false);
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{club.name}</span>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              selectedClub?.id === club.id
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
