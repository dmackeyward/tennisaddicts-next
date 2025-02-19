// app/actions/listings.ts
"use server";

import { z } from "zod";
import { createListing } from "@/db/mutations/listings";
import { revalidatePath } from "next/cache";
import type { ListingFormState, ListingStatus } from "@/types/listings";
import { sanitizeInput, validatePrice } from "@/utils/validation";

const AVAILABLE_FRAMEWORKS = [
  "React",
  "Vue",
  "Svelte",
  "Angular",
  "Next.js",
] as const;

const serverListingSchema = z.object({
  title: z.string().min(3).max(100).transform(sanitizeInput),
  description: z.string().min(10).max(1000).transform(sanitizeInput),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)), "Must be a valid number")
    .refine(
      (val) => Number(val) >= 0,
      "Price must be greater than or equal to 0"
    ),
  status: z.enum(["active", "sold", "archived"] as const).default("active"),
  location: z.object({
    country: z.string().min(1).transform(sanitizeInput),
    state: z.string().min(1).transform(sanitizeInput),
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

    // Sanitize and validate the input data
    const validatedData = {
      title: sanitizeInput(formData.get("title")?.toString()),
      description: sanitizeInput(formData.get("description")?.toString()),
      price: validatePrice(formData.get("price")?.toString()),
      status: (formData.get("status")?.toString() || "active") as ListingStatus,
      location: {
        country: sanitizeInput(formData.get("location.country")?.toString()),
        state: sanitizeInput(formData.get("location.state")?.toString()),
      },
      tags: formData.getAll("tags").map((tag) => tag.toString()),
      images: formData.getAll("images").map((image) => image.toString()),
    };

    // Validate using Zod schema
    const parsed = serverListingSchema.safeParse(validatedData);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.formErrors.fieldErrors,
      };
    }

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
