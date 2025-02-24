// app/listings/page.tsx
import { Suspense } from "react";
import { ClientSideListings } from "../components/listings/ClientSideListings";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getListings } from "@/db/queries/listings";

export default async function ListingsPage() {
  // Fetch initial listings on the server
  const initialListings = await getListings();

  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Listings</h1>
        <Link href="/listings/create">
          <Button>Create New Listing</Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ClientSideListings initialListings={initialListings} />
      </Suspense>
    </div>
  );
}
