// @/types/listings.ts

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

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: Location;
  images: ListingImage[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Form-specific type that maps to Listing
export interface ListingFormValues {
  title: string;
  description: string;
  price?: number;
  location: {
    country: string;
    state: string;
  };
  tags: string[];
  image_upload_input?: File[];
}

// Utility function to convert form values to Listing type
export function convertFormValuesToListing(
  formValues: ListingFormValues,
  id: string,
  imageUrls: string[]
): Listing {
  return {
    id,
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
