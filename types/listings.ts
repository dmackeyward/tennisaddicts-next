import { sanitizeInput } from "@/utils/validation";

export type ListingId = string;
export type UserId = string;

// Base interfaces
export interface Location {
  city: string;
  club: string; // Keep as string since we're using empty string as default
  formatted: string; // For display purposes (e.g., "Portland, OR")
}

export interface ListingImage {
  url: string;
  alt: string;
  id: string;
}

export type LocationErrorType = {
  city?: string[];
  club?: string[];
};

export type ListingStatus = "active" | "sold" | "archived";

// Core listing interfaces
export interface BaseListing {
  title: string;
  description: string;
  price: number;
  location: Location;
  tags: string[];
  images: ListingImage[];
  status: ListingStatus;
}

export interface Listing extends BaseListing {
  id: ListingId;
  userId: UserId;
  createdAt: string;
  updatedAt: string;
}

// Form-related interfaces
export interface ListingFormValues
  extends Omit<BaseListing, "location" | "price" | "images" | "status"> {
  price?: number;
  location: {
    city: string;
    club: string;
  };
  images: string[];
  status?: ListingStatus;
}

export interface UploadThingResponse {
  uploadedBy: string;
  url: string;
}

export interface ListingFormState {
  message: string; // Note: this is required, not optional
  errors?: {
    title?: string[];
    description?: string[];
    price?: string[];
    location?: string[];
    _form?: string[];
    [key: string]: string[] | undefined;
  };
  data?: {
    id: string;
  };
}

export interface ListingInput extends Omit<BaseListing, "images"> {
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
  location?: {
    city?: string;
    club?: string;
  };
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
    title: sanitizeInput(formValues.title),
    description: sanitizeInput(formValues.description),
    price: formValues.price || 0,
    status: formValues.status || "active",
    location: {
      city: formValues.location.city,
      club: formValues.location.club,
      formatted: `${
        formValues.location.club ? formValues.location.club + ", " : ""
      }${formValues.location.city}`,
    },
    images: imageUrls.map((url, index) => ({
      url,
      alt: sanitizeInput(`${formValues.title} image ${index + 1}`),
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
  status: "active",
  location: {
    city: "United States",
    club: "California",
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
