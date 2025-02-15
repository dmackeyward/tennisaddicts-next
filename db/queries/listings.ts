import "server-only";
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { desc, asc, sql } from "drizzle-orm";
import { listings } from "@/db/schema";
import type { Listing, ListingFilters } from "@/types/listings";

// Helper function to format listing data
function formatListing(listing: typeof listings.$inferSelect): Listing {
  return {
    ...listing,
    id: String(listing.id),
    createdAt: new Date(listing.createdAt).toISOString(),
    updatedAt: listing.updatedAt
      ? new Date(listing.updatedAt).toISOString()
      : new Date().toISOString(),
    location: {
      ...listing.location,
      formatted: `${
        listing.location.state ? listing.location.state + ", " : ""
      }${listing.location.country}`,
    },
    // Ensure tags is never null
    tags: listing.tags ?? [],
    // Ensure images is never null
    images: listing.images ?? [],
  };
}

export async function getListings(
  filters?: ListingFilters
): Promise<Listing[]> {
  let query = db.query.listings.findMany({
    where: (fields, { and, sql }) => {
      const conditions = [];

      if (filters?.location?.country) {
        conditions.push(
          sql`${fields.location}->>'country' = ${filters.location.country}`
        );
      }

      if (filters?.location?.state) {
        conditions.push(
          sql`${fields.location}->>'state' = ${filters.location.state}`
        );
      }

      if (filters?.minPrice !== undefined) {
        conditions.push(sql`${fields.price} >= ${filters.minPrice}`);
      }

      if (filters?.maxPrice !== undefined) {
        conditions.push(sql`${fields.price} <= ${filters.maxPrice}`);
      }

      return conditions.length > 0 ? and(...conditions) : undefined;
    },
    orderBy: (fields, { asc, desc }) => {
      if (filters?.sortBy) {
        const sortOrder = filters.sortOrder === "asc" ? asc : desc;
        switch (filters.sortBy) {
          case "price":
            return [sortOrder(fields.price)];
          case "date":
            return [sortOrder(fields.createdAt)];
          case "location":
            return [
              sortOrder(sql`${fields.location}->>'country'`),
              sortOrder(sql`${fields.location}->>'state'`),
            ];
          default:
            return [desc(fields.createdAt)];
        }
      }
      return [desc(fields.createdAt)];
    },
  });

  const results = await query;
  return results.map(formatListing);
}

export async function getMyListings(): Promise<Listing[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const results = await db.query.listings.findMany({
    where: (fields, { eq }) => eq(fields.userId, userId),
    orderBy: (fields, { desc }) => [desc(fields.createdAt)],
  });

  return results.map(formatListing);
}

export async function getListing(id: string): Promise<Listing> {
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    throw new Error("Invalid listing ID");
  }

  const result = await db.query.listings.findFirst({
    where: (fields, { eq }) => eq(fields.id, parsedId),
  });

  if (!result) {
    throw new Error("Listing not found");
  }

  return formatListing(result);
}
