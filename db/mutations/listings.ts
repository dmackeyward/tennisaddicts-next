"use server";

import { db } from "@/db";
import { listings, type NewListing } from "@/db/schema";
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

export async function createListing(
  prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  try {
    // Extract and validate form data
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const priceRaw = formData.get("price")?.toString() || "0";
    const city = formData.get("location.city")?.toString();
    const club = formData.get("location.club")?.toString() || ""; // Provide default empty string
    const tags = formData.getAll("tags").map((tag) => tag.toString());
    const imageUrls = formData
      .getAll("images")
      .map((image) => image.toString());

    // Validate required fields
    if (!title || !description || !city) {
      return {
        message: "Missing required fields",
        errors: {
          title: !title ? ["Title is required"] : undefined,
          description: !description ? ["Description is required"] : undefined,
          price: !priceRaw ? ["Price is required"] : undefined,
          location: !city ? ["City is required"] : undefined,
        },
      };
    }

    const price = Number(priceRaw);
    if (isNaN(price) || price < 0) {
      // Changed from price <= 0 to price < 0
      return {
        message: "Invalid price",
        errors: {
          price: ["Price must be zero or a positive number"],
        },
      };
    }

    // Create location object with correct type
    const locationData: Location = {
      city: city,
      club: club || "", // Ensure empty string if club is undefined
      formatted: club ? `${club}, ${city}` : city, // Format differently if no club
    };

    // Convert image URLs to ListingImage objects
    const images: ListingImage[] = imageUrls.map((url, index) => ({
      url,
      alt: title, // Use the listing title as the alt text
      id: `${Date.now()}-${index}`, // Generate a unique ID using timestamp and index
    }));

    // Prepare listing input with correct types
    const listingData: NewListing = {
      title,
      description,
      price,
      location: locationData,
      tags,
      images,
      userId: "temp-user-id", // This is now required and not optional
    };

    // Insert new listing using the query builder
    const [newListing] = await db
      .insert(listings)
      .values(listingData)
      .returning();

    if (!newListing) {
      throw new Error("Failed to create listing - no record returned");
    }

    revalidatePath("/listings");

    return {
      message: "Listing created successfully!",
      data: {
        id: String(newListing.id), // Convert the ID to string
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
