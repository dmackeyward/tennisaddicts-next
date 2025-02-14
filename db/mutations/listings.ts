"use server";

import { db } from "@/db";
import { listings } from "@/db/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import {
  ListingFormState,
  ListingInput,
  DeleteListingResponse,
} from "~/types/listing";

export async function createListing(
  prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const user = await auth();

  if (!user.userId) {
    return {
      message: "Unauthorized",
      errors: {
        title: ["You must be logged in to create a listing"],
      },
    };
  }

  // Extract and validate form data
  const title = formData.get("title");
  const description = formData.get("description");
  const priceRaw = formData.get("price");
  const location = formData.getAll("location");
  const tags = formData.getAll("tags");
  const files = formData.getAll("image_upload_input");

  // ... rest of your validation logic

  try {
    const listingInput: ListingInput = {
      title: title as string,
      description: description as string,
      price: Number(priceRaw),
      location: location as string[],
      tags: tags as string[],
      imageUrl: [], // You'll need to handle file uploads and get URLs
    };

    await db.insert(listings).values({
      ...listingInput,
      userId: user.userId,
    });

    revalidatePath("/listings");

    return {
      message: "Listing created successfully!",
    };
  } catch (error) {
    console.error("Failed to create listing:", error);
    return {
      message: "Failed to create listing.",
      errors: {
        title: ["An unexpected error occurred while creating the listing"],
      },
    };
  }
}

export async function deleteListing(
  id: number
): Promise<DeleteListingResponse> {
  const user = await auth();

  if (!user.userId) {
    return {
      success: false,
      message: "You must be logged in to delete a listing",
      error: {
        code: "UNAUTHORIZED",
        details: "No user session found",
      },
    };
  }

  try {
    // First check if the listing exists and belongs to the user
    const existingListing = await db
      .select()
      .from(listings)
      .where(and(eq(listings.id, id), eq(listings.userId, user.userId)))
      .limit(1);

    if (!existingListing.length) {
      return {
        success: false,
        message: "Listing not found or you don't have permission to delete it",
        error: {
          code: "NOT_FOUND",
          details: "Listing not found or unauthorized to delete",
        },
      };
    }

    // Proceed with deletion
    const result = await db
      .delete(listings)
      .where(and(eq(listings.id, id), eq(listings.userId, user.userId)));

    //   analyticsServerClient.capture({
    //     distinctId: user.userId,
    //     event: "delete image",
    //     properties: {
    //       imageId: id,
    //     },
    //   });

    revalidatePath("/listings");

    return {
      success: true,
      message: "Listing deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting listing:", error);

    return {
      success: false,
      message: "Failed to delete listing",
      error: {
        code: "DELETE_FAILED",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
}
