import Link from "next/link";
import type { Listing } from "@/types/listings";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ListingCardProps {
  listing: Listing;
}

const PLACEHOLDER_LISTING: Listing = {
  id: "placeholder",
  title: "Sample Listing Title",
  description:
    "This is a placeholder description for the listing. It provides a brief overview of what the listing is about.",
  price: 199.99,
  location: {
    country: "United States",
    state: "California",
    formatted: "San Francisco, CA",
  },
  images: [
    {
      id: "placeholder-image-1",
      url: "/api/placeholder/800/600",
      alt: "Placeholder listing image",
    },
  ],
  tags: ["placeholder", "sample"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function ListingCard({
  listing = PLACEHOLDER_LISTING,
}: ListingCardProps) {
  const mainImage = listing.images?.[0];

  return (
    <Link href={`/listings/${listing.id || "placeholder"}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <img
            src={mainImage?.url || "/api/placeholder/800/600"}
            alt={mainImage?.alt || listing.title || "Listing image"}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <CardTitle className="text-xl mt-4">
            {listing.title || PLACEHOLDER_LISTING.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 line-clamp-2">
            {listing.description || PLACEHOLDER_LISTING.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-lg font-semibold">
            ${(listing.price || PLACEHOLDER_LISTING.price).toFixed(2)}
          </div>
          <div className="text-gray-500">
            {listing.location?.formatted ||
              PLACEHOLDER_LISTING.location.formatted}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
