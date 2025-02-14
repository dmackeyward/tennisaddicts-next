import React, { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/types/listings";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate } from "@/lib/format"; // Assuming you'll create these utilities

interface ListingCardProps {
  listing?: Listing;
  isLoading?: boolean;
  onError?: (error: Error) => void;
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
      url: "/images/placeholder.svg",
      alt: "Placeholder listing image",
    },
  ],
  tags: ["placeholder", "sample"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const LoadingSkeleton = memo(() => (
  <div role="status" aria-label="Loading listing card">
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="w-full h-48 rounded-t-lg" />
        <Skeleton className="h-6 w-3/4 mt-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-32" />
      </CardFooter>
    </Card>
  </div>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

const ListingImage = memo(
  ({ image, title }: { image?: Listing["images"][0]; title: string }) => {
    const [isImageError, setIsImageError] = useState(false);
    const imageUrl =
      !isImageError && image?.url ? image.url : "/images/placeholder.svg";

    return (
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
        <Image
          src={imageUrl}
          alt={image?.alt || title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setIsImageError(true)}
          priority={false}
          loading="lazy"
        />
      </div>
    );
  }
);

ListingImage.displayName = "ListingImage";

const ListingCard: React.FC<ListingCardProps> = memo(
  ({ listing, isLoading = false, onError }) => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    const displayData = listing || PLACEHOLDER_LISTING;
    const mainImage = displayData.images?.[0];
    const isPlaceholder = !listing;

    // Format the listing date for screen readers
    const formattedDate = formatDate(displayData.updatedAt);

    return (
      <Link
        href={`/listings/${displayData.id}`}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
        aria-label={`View details for ${displayData.title}`}
        tabIndex={isPlaceholder ? -1 : 0}
      >
        <Card className="h-full hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <ListingImage image={mainImage} title={displayData.title} />
            <CardTitle className="text-xl mt-4 line-clamp-1">
              {displayData.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 line-clamp-2">
              {displayData.description}
            </p>
            {displayData.tags && displayData.tags.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap" aria-label="Tags">
                {displayData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div
              className="text-lg font-semibold"
              aria-label={`Price: ${formatPrice(displayData.price)}`}
            >
              ${displayData.price.toFixed(2)}
            </div>
            <div
              className="text-gray-500 text-sm truncate max-w-[150px]"
              aria-label={`Location: ${displayData.location?.formatted}`}
            >
              {displayData.location?.formatted}
            </div>
          </CardFooter>
          <div className="sr-only">Last updated {formattedDate}</div>
        </Card>
      </Link>
    );
  }
);

ListingCard.displayName = "ListingCard";

export default ListingCard;
