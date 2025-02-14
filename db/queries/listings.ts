import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { listings } from "./db/schema";
import { redirect } from "next/navigation";
import { Listing, ListingFilters } from "@/app/types/listings";
// import analyticsServerClient from "./analytics";

export async function getListings(
  filters?: ListingFilters
): Promise<Listing[]> {
  const listings = await db.query.listings.findMany({
    orderBy: (model, { desc }) => desc(model.id), // Order by id in descending order
  });

  return listings;
}

export async function getMyListings() {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  const listings = await db.query.listings.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });

  return listings;
}

export async function getListing(id: string) {
  const user = await auth();

  // if (!user.userId) throw new Error("Unauthorized");

  const listing = await db.query.listings.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!listing) throw new Error("Image not found");

  // if (listing.userId !== Number(user.userId)) throw new Error("Unauthorized");

  console.log("listing:", listing);

  return listing;
}
