// app/actions/listings.ts
"use server";

import { z } from "zod";
import {
  createListing,
  deleteListing,
  updateListing,
} from "@/db/mutations/listings";
import { revalidatePath } from "next/cache";
import {
  AVAILABLE_FRAMEWORKS,
  type ListingFormState,
  type ListingStatus,
  type LocationErrorType,
} from "@/types/listings";
import { sanitizeInput } from "@/utils/validation";

const serverListingSchema = z.object({
  title: z.string().min(3).max(100).transform(sanitizeInput),
  description: z.string().min(10).max(1000).transform(sanitizeInput),
  price: z
    .string()
    .optional()
    .transform((val) => (!val ? "0" : val)) // Transform empty/undefined to "0"
    .refine((val) => !isNaN(Number(val)), "Must be a valid number")
    .refine(
      (val) => Number(val) >= 0,
      "Price must be greater than or equal to 0"
    ),
  status: z.enum(["active", "sold", "archived"] as const).default("active"),
  location: z.object({
    city: z
      .string({
        required_error: "City must be selected",
        invalid_type_error: "City must be selected",
      })
      .min(1, "City must be selected")
      .transform(sanitizeInput),
    club: z.string().optional().default("").transform(sanitizeInput),
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
        location?: string[] | LocationErrorType;
        tags?: string[];
        images?: string[];
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
    console.log("Server action started");

    // Log incoming FormData
    console.log("Received FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const prevState: ListingFormState = {
      success: false,
      message: "Creating listing...",
      errors: {},
    };

    // Log the validated data before Zod processing
    const validatedData = {
      title: sanitizeInput(formData.get("title")?.toString()),
      description: sanitizeInput(formData.get("description")?.toString()),
      price: formData.get("price")?.toString() || "0",
      status: (formData.get("status")?.toString() || "active") as ListingStatus,
      location: {
        city: sanitizeInput(formData.get("location.city")?.toString() || ""),
        club: sanitizeInput(formData.get("location.club")?.toString() || ""),
      },
      tags: formData.getAll("tags").map((tag) => tag.toString()),
      images: formData.getAll("images").map((image) => image.toString()),
    };

    console.log("Validated data before Zod:", validatedData);

    // Validate using Zod schema
    const parsed = serverListingSchema.safeParse(validatedData);

    if (!parsed.success) {
      console.log("Zod validation failed");
      console.log("Raw Zod error:", parsed.error);
      console.log("Formatted Zod error:", parsed.error.format());

      const errors = parsed.error.formErrors.fieldErrors;
      console.log("Field errors:", errors);

      const response = {
        success: false,
        error: {
          ...errors,
          location: {
            city: ["City must be selected"],
          },
        },
      };

      console.log("Sending error response:", response);
      return response;
    }

    console.log("Zod validation passed");

    // Log the parsed data
    console.log("Parsed data:", parsed.data);

    // Call the createListing mutation
    const result = await createListing(prevState, formData);
    console.log("Database mutation result:", result);

    if (result.data && result.data.id) {
      console.log("Listing updated successfully:", result.data);
      revalidatePath("/listings");
      revalidatePath(`/listings/${result.data.id}`);
      return { success: true, data: { id: result.data.id } };
    } else {
      console.log("Listing update failed:", result);
      if (result.errors) {
        return {
          success: false,
          error: result.errors,
        };
      }
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

export async function updateListingAction(
  id: string,
  formData: FormData
): Promise<ServerActionResponse> {
  try {
    console.log("Update server action started for listing:", id);

    // Log incoming FormData
    console.log("Received FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const prevState: ListingFormState = {
      success: false,
      message: "Updating listing...",
      errors: {},
    };

    // Log the validated data before Zod processing
    const validatedData = {
      title: sanitizeInput(formData.get("title")?.toString()),
      description: sanitizeInput(formData.get("description")?.toString()),
      price: formData.get("price")?.toString() || "0",
      status: (formData.get("status")?.toString() || "active") as ListingStatus,
      location: {
        city: sanitizeInput(formData.get("location.city")?.toString() || ""),
        club: sanitizeInput(formData.get("location.club")?.toString() || ""),
      },
      tags: formData.getAll("tags").map((tag) => tag.toString()),
      images: formData.getAll("images").map((image) => image.toString()),
    };

    console.log("Validated data before Zod:", validatedData);

    // Validate using Zod schema
    const parsed = serverListingSchema.safeParse(validatedData);

    if (!parsed.success) {
      console.log("Zod validation failed");
      console.log("Raw Zod error:", parsed.error);
      console.log("Formatted Zod error:", parsed.error.format());

      const errors = parsed.error.formErrors.fieldErrors;
      console.log("Field errors:", errors);

      const response = {
        success: false,
        error: {
          ...errors,
          location: errors.location || {
            city: ["City must be selected"],
          },
        },
      };

      console.log("Sending error response:", response);
      return response;
    }

    console.log("Zod validation passed");

    // Log the parsed data
    console.log("Parsed data:", parsed.data);

    // Call the updateListing mutation
    const result = await updateListing(id, prevState, formData);
    console.log("Database mutation result:", result);

    if (result.data && result.data.id) {
      console.log("Listing updated successfully:", result.data);
      revalidatePath("/listings");
      revalidatePath(`/listings/${id}`);
      return { success: true, data: { id: result.data.id } };
    } else {
      console.log("Listing update failed:", result);
      if (result.errors) {
        return {
          success: false,
          error: result.errors,
        };
      }
      return {
        success: false,
        error: result.message,
      };
    }
  } catch (error) {
    console.error("Error in updateListingAction:", error);
    return {
      success: false,
      error: "Something went wrong while updating the listing",
    };
  }
}

// Server Action
export async function deleteListingAction(id: string) {
  try {
    const response = await deleteListing(id);

    if (!response.success) {
      // If the DB function returned failure, pass that along
      console.error("DB deletion failed:", response.message);
      return {
        success: false,
        error: response.message,
      };
    }

    // Only revalidate if the DB deletion was successful
    revalidatePath("/listings");
    revalidatePath(`/listings/view/${id}`);

    // Return success response
    console.log("Listing deleted successfully from server action");
    return { success: true };
  } catch (error) {
    // Return error information that the client can use
    console.error("Error in deleteListingAction:", error);
    return {
      success: false,
      error: "Failed to delete listing",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
