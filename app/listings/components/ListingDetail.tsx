"use client";

import React, { useState, useCallback, memo, startTransition } from "react";
import Image from "next/image";
import {
  DeleteIcon,
  Loader2,
  PencilIcon,
  Share2,
  AlertTriangle,
  Heart,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PLACEHOLDER_LISTING,
  type Listing,
  type ListingDetailProps,
} from "@/types/listings";
import { formatDate } from "@/utils/format-date";
import { deleteListingAction } from "@/app/actions/listings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import prompts from "@/prompts/prompts";

// Define seller info interface for the component
interface SellerInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

// Memoized loading skeleton component
const LoadingSkeleton = memo(() => (
  <Card className="overflow-hidden">
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
      <div className="flex items-center space-x-4 mt-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-96 w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </div>
          <Skeleton className="h-10 w-32 mt-4" />
        </div>
      </div>
    </CardContent>
  </Card>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

// Memoized image carousel navigation button
const CarouselButton = memo(
  ({
    direction,
    onClick,
    disabled,
  }: {
    direction: "left" | "right";
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <Button
      variant="ghost"
      size="icon"
      className={`absolute ${
        direction === "left" ? "left-2" : "right-2"
      } top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 disabled:opacity-50`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`View ${direction === "left" ? "previous" : "next"} image`}
    >
      {direction === "left" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  )
);

CarouselButton.displayName = "CarouselButton";

// Memoized image component
const ListingImage = memo(
  ({ image, title }: { image: Listing["images"][0]; title: string }) => {
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    return (
      <div className="relative w-full h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
          </div>
        )}
        <Image
          src={isError ? "/images/placeholder.svg" : image.url}
          alt={image.alt || title}
          fill
          className="rounded-lg object-cover"
          onError={() => setIsError(true)}
          onLoad={() => setIsLoading(false)}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    );
  }
);

ListingImage.displayName = "ListingImage";

const ListingDetail = ({
  listing: propListing,
  isLoading = false,
  isAuthor = false,
}: ListingDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const listing = propListing || PLACEHOLDER_LISTING;
  const router = useRouter();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Mock seller info - in a real app, this would come from your API
  // This avoids TypeScript errors since your Listing type doesn't have a user property
  const sellerInfo: SellerInfo = {
    id: "seller-1",
    name: "Tennis Seller",
    email: "seller@example.com",
    phone: "(555) 123-4567",
  };

  // Get prompts for listing detail page
  const listingDetailPrompts = prompts.listings.listingDetail;

  // Navigate to edit page
  const handleEdit = useCallback(() => {
    router.push(`/listings/edit/${listing.id}`);
  }, [listing.id, router]);

  // Client Component Delete Handler
  const handleDelete = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await deleteListingAction(listing.id);

        if (result.success) {
          // Handle the redirect on the client side

          toast.success(prompts.toast.listingDeleted);
          router.push("/listings");
        } else {
          // Handle the error with the specific message from the server
          console.error("Delete error:", result.error);
          toast.error(result.error || prompts.error.errorLoadingListing);
        }
      } catch (error) {
        console.error("Client-side delete error:", error);
        toast.error(prompts.error.errorLoadingListing);
      }
    });
  }, [listing.id, router]);

  const handleKeyNavigation = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedImage((prev) =>
          prev === 0 ? listing.images.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setSelectedImage((prev) =>
          prev === listing.images.length - 1 ? 0 : prev + 1
        );
      }
    },
    [listing.images.length]
  );

  const toggleSaved = useCallback(() => {
    setIsSaved((prev) => !prev);
    toast.success(
      isSaved ? "Listing removed from favorites" : "Listing saved to favorites"
    );
  }, [isSaved]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: listing.title,
          text: listing.description.substring(0, 100) + "...",
          url: window.location.href,
        })
        .catch((error) => toast.error("Error sharing", error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast.success(prompts.toast.linkCopied);
    }
  }, [listing.title, listing.description]);

  const handleReport = useCallback(() => {
    toast.info(prompts.toast.reportSuccess);
  }, []);

  const handleContactMethod = useCallback(
    (method: string) => {
      setActiveContact(activeContact === method ? null : method);
    },
    [activeContact]
  );

  const handleAskQuestion = useCallback(() => {
    // This would open a message form in a real implementation
    toast.info("Message form would open here");
  }, []);

  const handleSeeMoreListings = useCallback(() => {
    // Navigate to seller's other listings
    router.push(`/listings?seller=${sellerInfo.id}`);
  }, [sellerInfo.id, router]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">
              {listing.title}
            </CardTitle>
            <div className="text-sm text-gray-500 mt-1">
              {listingDetailPrompts.listedOn} {formatDate(listing.createdAt)}{" "}
              {listingDetailPrompts.by} {sellerInfo.name}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            {/* Edit and Delete buttons - only shown if isAuthor is true */}
            {isAuthor ? (
              <>
                {/* Edit button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEdit}
                  aria-label={prompts.common.buttons.edit}
                >
                  <PencilIcon className="h-5 w-5" />
                </Button>

                {/* Delete button */}
                {!isConfirmingDelete ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsConfirmingDelete(true)}
                    aria-label={prompts.common.buttons.delete}
                  >
                    <DeleteIcon className="h-5 w-5" />
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
                    <span className="text-sm">Are you sure?</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setIsConfirmingDelete(false);
                        startTransition(async () => {
                          handleDelete();
                        });
                      }}
                    >
                      {prompts.common.buttons.submit}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsConfirmingDelete(false)}
                    >
                      {prompts.common.buttons.cancel}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Save button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSaved}
                  aria-label={
                    isSaved
                      ? listingDetailPrompts.saved
                      : listingDetailPrompts.save
                  }
                  className={isSaved ? "text-red-500" : ""}
                >
                  <Heart
                    className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`}
                  />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{listing.location.formatted}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(listing.createdAt)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className="relative"
            role="region"
            aria-label="Image gallery"
            onKeyDown={handleKeyNavigation}
            tabIndex={0}
          >
            <ListingImage
              image={listing.images[selectedImage]}
              title={listing.title}
            />

            {listing.images.length > 1 && (
              <>
                <CarouselButton
                  direction="left"
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === 0 ? listing.images.length - 1 : prev - 1
                    )
                  }
                />
                <CarouselButton
                  direction="right"
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === listing.images.length - 1 ? 0 : prev + 1
                    )
                  }
                />
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2"
                  role="tablist"
                  aria-label="Image navigation"
                >
                  {listing.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === selectedImage
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      role="tab"
                      aria-selected={idx === selectedImage}
                      aria-label={`${listingDetailPrompts.viewTitle} ${
                        idx + 1
                      } of ${listing.images.length}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div
              className="flex items-center text-2xl font-bold text-green-600"
              aria-label={`Price: $${Number(listing.price).toFixed(2)}`}
            >
              <DollarSign className="w-6 h-6" />
              {Number(listing.price).toFixed(2)}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {listing.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div
                  className="flex flex-wrap gap-2"
                  role="list"
                  aria-label="Listing tags"
                >
                  {listing.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 px-2 py-1 rounded text-sm"
                      role="listitem"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact section */}
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-semibold mb-3">
                {listingDetailPrompts.contactSeller}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={activeContact === "message" ? "bg-blue-50" : ""}
                  onClick={() => handleContactMethod("message")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {listingDetailPrompts.message}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className={activeContact === "call" ? "bg-blue-50" : ""}
                  onClick={() => handleContactMethod("call")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {listingDetailPrompts.call}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className={activeContact === "email" ? "bg-blue-50" : ""}
                  onClick={() => handleContactMethod("email")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {listingDetailPrompts.email}
                </Button>
              </div>

              {activeContact && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  {activeContact === "message" && (
                    <div>
                      <textarea
                        className="w-full p-2 border rounded"
                        rows={3}
                        placeholder="Hi, I'm interested in your listing..."
                      ></textarea>
                      <Button size="sm" className="mt-2">
                        {listingDetailPrompts.message}
                      </Button>
                    </div>
                  )}
                  {activeContact === "call" && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-green-600" />
                      <span>{sellerInfo.phone}</span>
                    </div>
                  )}
                  {activeContact === "email" && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{sellerInfo.email}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleAskQuestion}>
                {listingDetailPrompts.askQuestion}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSeeMoreListings}
              >
                {listingDetailPrompts.seeMoreListings}
              </Button>

              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                {listingDetailPrompts.share}
              </Button>

              <Button variant="ghost" size="sm" onClick={handleReport}>
                <AlertTriangle className="w-4 h-4 mr-2" />
                {listingDetailPrompts.report}
              </Button>
            </div>
          </div>
        </div>

        {/* Similar listings section */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">
            {listingDetailPrompts.similarListings}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* This would be populated with actual similar listings */}
            <Card className="h-64 flex items-center justify-center bg-gray-50">
              <p className="text-gray-400">Similar listing 1</p>
            </Card>
            <Card className="h-64 flex items-center justify-center bg-gray-50">
              <p className="text-gray-400">Similar listing 2</p>
            </Card>
            <Card className="h-64 flex items-center justify-center bg-gray-50">
              <p className="text-gray-400">Similar listing 3</p>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(ListingDetail);
