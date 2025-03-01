// =======================================
// PRIMITIVE TYPES
// =======================================
export type ListingId = string;
export type UserId = string;
export type ListingStatus = "active" | "sold" | "archived";

// =======================================
// BASE INTERFACES
// =======================================
export interface Location {
  city: string;
  club: string;
  formatted: string; // For display purposes (e.g., "Portland, OR")
}

export interface ListingImage {
  url: string;
  alt: string;
  id: string;
}

// =======================================
// API RESPONSE PATTERNS
// =======================================
export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface ApiDataResponse<T> extends ApiResponse {
  data?: T;
}

export interface FormResponse extends ApiResponse {
  errors?: {
    [key: string]: string[] | undefined;
  };
  data?: {
    id?: string;
    [key: string]: any;
  };
}

// =======================================
// LISTING CORE MODELS
// =======================================
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

// =======================================
// FORM & INPUT INTERFACES
// =======================================
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

export interface ListingInput extends Omit<BaseListing, "images"> {
  images: ListingImage[];
  userId?: UserId;
}

export interface ListingFormState extends FormResponse {
  // Specific validation error fields
  errors?: {
    title?: string[];
    description?: string[];
    price?: string[];
    location?: string[];
    _form?: string[];
    [key: string]: string[] | undefined;
  };
}

// =======================================
// API RESPONSE INTERFACES
// =======================================
export interface DeleteListingResponse extends ApiResponse {
  // No additional properties needed
}

export interface UpdateListingResponse extends FormResponse {
  // No additional properties needed
}

// =======================================
// COMPONENT PROP INTERFACES
// =======================================
export interface ListingDetailProps {
  listing: Listing;
  isLoading?: boolean;
  isAuthor?: boolean;
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

// =======================================
// FILTERING & SEARCH INTERFACES
// =======================================
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

export type LocationErrorType = {
  city?: string[];
  club?: string[];
};

export interface UploadThingResponse {
  uploadedBy: string;
  url: string;
}

// =======================================
// CONSTANTS
// =======================================
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

// =======================================
// FRAMEWORKS
// =======================================
export const AVAILABLE_FRAMEWORKS = [
  "React",
  "Vue",
  "Svelte",
  "Angular",
  "Next.js",
] as const;

export type AvailableFramework = (typeof AVAILABLE_FRAMEWORKS)[number];
