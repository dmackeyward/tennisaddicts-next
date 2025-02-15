// @/types/listings.ts

export type ListingId = string;
export type UserId = string;

// Base interfaces
export interface Location {
  country: string;
  state: string;
  formatted: string; // For display purposes (e.g., "Portland, OR")
}

export interface ListingImage {
  url: string;
  alt: string;
  id: string;
}

// Core listing interfaces
export interface BaseListing {
  title: string;
  description: string;
  price: number;
  location: Location;
  tags: string[];
}

export interface Listing extends BaseListing {
  id: ListingId;
  userId: UserId;
  images: ListingImage[];
  createdAt: string;
  updatedAt: string;
}

// Form-related interfaces
export interface ListingFormValues
  extends Omit<BaseListing, "location" | "price"> {
  price?: number;
  location: Omit<Location, "formatted">;
  image_upload_input?: File[];
}

export interface ListingFormState {
  message: string;
  errors?: {
    _form?: string[];
    title?: string[];
    description?: string[];
    price?: string[];
    location?: string[];
    [key: string]: string[] | undefined;
  };
  data?: {
    id: number;
  };
}

export interface ListingInput extends BaseListing {
  images: ListingImage[];
  userId?: UserId;
}

// Response interfaces
export interface DeleteListingResponse {
  success: boolean;
  message: string;
  error?: {
    code: string;
    details: string;
  };
}

// Component prop interfaces
export interface ListingDetailProps {
  listing: Listing;
  onContactSeller: () => void;
  isLoading?: boolean;
}

export interface ListingGridProps {
  listings: Listing[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface ListingPageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Filter interfaces
export interface ListingFilters {
  location?: Partial<Location>;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "date" | "location";
  sortOrder?: "asc" | "desc";
}

// Utility function
export function convertFormValuesToListing(
  formValues: ListingFormValues,
  id: ListingId,
  userId: UserId,
  imageUrls: string[]
): Listing {
  return {
    id,
    userId,
    title: formValues.title,
    description: formValues.description,
    price: formValues.price || 0,
    location: {
      country: formValues.location.country,
      state: formValues.location.state,
      formatted: `${
        formValues.location.state ? formValues.location.state + ", " : ""
      }${formValues.location.country}`,
    },
    images: imageUrls.map((url, index) => ({
      url,
      alt: `${formValues.title} image ${index + 1}`,
      id: `${id}-image-${index}`,
    })),
    tags: formValues.tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Constants
export const PLACEHOLDER_LISTING: Listing = {
  id: "placeholder",
  userId: "placeholder-user",
  title: "Sample Listing Title",
  description:
    "This is a placeholder description for the listing. It provides a brief overview of what the listing is about.",
  price: 199.99,
  location: {
    country: "United States",
    state: "California",
    formatted: "San Francisco, CA",
  },
  images: [
    {
      id: "placeholder-image-1",
      url: "/images/placeholder.svg",
      alt: "Placeholder listing image",
    },
  ],
  tags: ["placeholder", "sample"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
