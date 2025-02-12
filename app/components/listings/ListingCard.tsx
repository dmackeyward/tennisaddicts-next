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

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <CardTitle className="text-xl mt-4">{listing.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 line-clamp-2">{listing.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-lg font-semibold">${listing.price}</div>
          <div className="text-gray-500">{listing.location}</div>
        </CardFooter>
      </Card>
    </Link>
  );
}
