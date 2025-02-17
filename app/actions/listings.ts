// app/actions/listings.ts
"use server";

import { z } from "zod";
import { createListing } from "@/db/mutations/listings";
import { revalidatePath } from "next/cache";
import type { ListingFormState } from "@/types/listings";

const AVAILABLE_FRAMEWORKS = [
  "React",
  "Vue",
  "Svelte",
  "Angular",
  "Next.js",
] as const;

const serverListingSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.string().transform((val) => Number(val) || 0),
  location: z.object({
    country: z.string().min(1),
    state: z.string().min(1),
  }),
  tags: z.array(z.enum(AVAILABLE_FRAMEWORKS)).min(1).max(3),
  images: z.array(z.string()).min(1).max(6),
});

export type ServerActionResponse = {
  success: boolean;
  error?:
    | string
    | {
        title?: string[];
        description?: string[];
        price?: string[];
        location?: string[];
        _form?: string[];
      };
  data?: {
    id: string;
  };
};

export async function createListingAction(
  formData: FormData
): Promise<ServerActionResponse> {
  try {
    // Initialize the previous state
    const prevState: ListingFormState = {
      message: "Creating listing...",
      errors: {},
    };

    // Call the createListing mutation with both required arguments
    const result = await createListing(prevState, formData);

    // Handle the result
    if (result.data) {
      revalidatePath("/listings");
      return { success: true, data: result.data };
    } else {
      // If we have errors, make sure they're in the correct format
      if (result.errors) {
        return {
          success: false,
          error: result.errors,
        };
      }
      // If we only have a message, return it as a string error
      return {
        success: false,
        error: result.message,
      };
    }
  } catch (error) {
    console.error("Error in createListingAction:", error);
    return {
      success: false,
      error: "Something went wrong while creating the listing",
    };
  }
}
