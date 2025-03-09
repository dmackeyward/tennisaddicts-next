"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { PLACEHOLDER_LISTING, type Listing } from "@/types/listings";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate } from "@/lib/format";
import { handleModalNavigation } from "@/utils/device";

interface ListingCardProps {
  listing?: Listing;
  isLoading?: boolean;
  onError?: (error: Error) => void;
}

// LoadingSkeleton component unchanged...
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

// ListingImage component unchanged...
const ListingImage = memo(
  ({ image, title }: { image?: Listing["images"][0]; title: string }) => {
    const [isImageError, setIsImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const imageUrl =
      !isImageError && image?.url ? image.url : "/images/placeholder.svg";

    return (
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}
        <Image
          src={imageUrl}
          alt={image?.alt || title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setIsImageError(true)}
          onLoad={() => setIsLoading(false)}
          priority={false}
          loading="lazy"
        />
      </div>
    );
  }
);

ListingImage.displayName = "ListingImage";

const ListingCard: React.FC<ListingCardProps> = memo(
  ({ listing, isLoading = false }) => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    const displayData = listing || PLACEHOLDER_LISTING;
    const mainImage = displayData.images?.[0];
    const isPlaceholder = !listing;

    // Format the listing date for screen readers
    const formattedDate = formatDate(displayData.updatedAt);

    // Get the listing URL
    const listingUrl = `/listings/view/${displayData.id}`;

    // Handle link click - set skipModal flag if on mobile
    const handleLinkClick = () => {
      handleModalNavigation(listingUrl);
    };

    return (
      <Link
        href={listingUrl}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
        aria-label={`View details for ${displayData.title}`}
        tabIndex={isPlaceholder ? -1 : 0}
        onClick={handleLinkClick}
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
              ${Number(displayData.price).toFixed(2)}
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
