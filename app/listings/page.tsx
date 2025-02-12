import { ListingGrid } from "@/components/listings/ListingGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getListings() {
  // This is a placeholder function - replace with your actual API call
  const data = [
    {
      id: "1",
      title: "Modern Apartment in Downtown",
      description: "Beautiful 2-bedroom apartment with city views",
      price: 2500,
      imageUrl: "/api/placeholder/400/300",
      location: "Downtown",
      createdAt: new Date().toISOString(),
    },
    // Add more sample listings as needed
  ];

  return data;
}

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Listings</h1>
        <Link href="/listings/create">
          <Button>Create New Listing</Button>
        </Link>
      </div>
      <ListingGrid listings={listings} />
    </div>
  );
}
