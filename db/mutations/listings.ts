"use server";

import { db } from "@/db";
import { listings } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import type {
  ListingFormState,
  ListingInput,
  DeleteListingResponse,
  Location,
  ListingImage,
} from "@/types/listings";

// Error handling utilities
const createError = (
  code: string,
  message: string,
  details?: string
): DeleteListingResponse => ({
  success: false,
  message,
  error: {
    code,
    details: details || message,
  },
});

const createSuccess = (message: string): DeleteListingResponse => ({
  success: true,
  message,
});

export async function createListing(
  prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const { userId } = await auth();

  if (!userId) {
    return {
      message: "Unauthorized",
      errors: {
        title: ["You must be logged in to create a listing"],
      },
    };
  }

  try {
    // Extract and validate form data
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const priceRaw = formData.get("price")?.toString();
    const country = formData.get("location.country")?.toString();
    const state = formData.get("location.state")?.toString();
    const tags = formData.getAll("tags").map((tag) => tag.toString());
    const files = formData.getAll("image_upload_input");

    // Validate required fields
    if (!title || !description || !priceRaw || !country) {
      return {
        message: "Missing required fields",
        errors: {
          title: !title ? ["Title is required"] : undefined,
          description: !description ? ["Description is required"] : undefined,
          price: !priceRaw ? ["Price is required"] : undefined,
          location: !country ? ["Country is required"] : undefined,
        },
      };
    }

    const price = Number(priceRaw);
    if (isNaN(price) || price <= 0) {
      return {
        message: "Invalid price",
        errors: {
          price: ["Price must be a positive number"],
        },
      };
    }

    // Create location object with correct type
    const locationData: Location = {
      country: country,
      state: state || "",
      formatted: `${state ? state + ", " : ""}${country}`,
    };

    // Create empty images array with correct type
    const images: ListingImage[] = [];

    // Prepare listing input with correct types
    const listingInput: ListingInput = {
      title,
      description,
      price,
      location: locationData,
      tags,
      images,
    };

    // Insert new listing using the query builder
    const [newListing] = await db
      .insert(listings)
      .values({
        ...listingInput,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!newListing) {
      throw new Error("Failed to create listing - no record returned");
    }

    revalidatePath("/listings");

    return {
      message: "Listing created successfully!",
      data: {
        id: newListing.id,
      },
    };
  } catch (error) {
    console.error("Failed to create listing:", error);
    return {
      message: "Failed to create listing",
      errors: {
        _form: ["An unexpected error occurred while creating the listing"],
      },
    };
  }
}

export async function deleteListing(
  id: number
): Promise<DeleteListingResponse> {
  const { userId } = await auth();

  if (!userId) {
    return createError(
      "UNAUTHORIZED",
      "You must be logged in to delete a listing",
      "No user session found"
    );
  }

  try {
    // Check if listing exists and belongs to user
    const existingListing = await db.query.listings.findFirst({
      where: (fields, { and, eq }) =>
        and(eq(fields.id, id), eq(fields.userId, userId)),
    });

    if (!existingListing) {
      return createError(
        "NOT_FOUND",
        "Listing not found or you don't have permission to delete it",
        "Listing not found or unauthorized to delete"
      );
    }

    // Delete the listing
    const [deletedListing] = await db
      .delete(listings)
      .where(eq(listings.id, id))
      .returning();

    if (!deletedListing) {
      throw new Error("Failed to delete listing - no record returned");
    }

    revalidatePath("/listings");

    return createSuccess("Listing deleted successfully");
  } catch (error) {
    console.error("Error deleting listing:", error);

    return createError(
      "DELETE_FAILED",
      "Failed to delete listing",
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}

export async function updateListing(
  id: number,
  input: Partial<ListingInput>
): Promise<ListingFormState> {
  const { userId } = await auth();

  if (!userId) {
    return {
      message: "Unauthorized",
      errors: {
        _form: ["You must be logged in to update a listing"],
      },
    };
  }

  try {
    // Check if listing exists and belongs to user
    const existingListing = await db.query.listings.findFirst({
      where: (fields, { and, eq }) =>
        and(eq(fields.id, id), eq(fields.userId, userId)),
    });

    if (!existingListing) {
      return {
        message: "Listing not found or you don't have permission to update it",
        errors: {
          _form: ["Listing not found or unauthorized to update"],
        },
      };
    }

    // Update the listing
    const [updatedListing] = await db
      .update(listings)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(listings.id, id))
      .returning();

    if (!updatedListing) {
      throw new Error("Failed to update listing - no record returned");
    }

    revalidatePath("/listings");

    return {
      message: "Listing updated successfully!",
      data: {
        id: updatedListing.id,
      },
    };
  } catch (error) {
    console.error("Failed to update listing:", error);
    return {
      message: "Failed to update listing",
      errors: {
        _form: ["An unexpected error occurred while updating the listing"],
      },
    };
  }
}
