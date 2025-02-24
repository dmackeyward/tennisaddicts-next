// app/listings/page.tsx
import { Suspense } from "react";
import { ClientSideListings } from "../components/listings/ClientSideListings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getListings } from "@/db/queries/listings";

export default async function ListingsPage() {
  // Fetch initial listings on the server
  const initialListings = await getListings();

  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-3xl font-bold">Listings</CardTitle>
          <Link href="/listings/create">
            <Button>Create New Listing</Button>
          </Link>
        </CardHeader>

        <CardContent>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-gray-500">Loading...</div>
              </div>
            }
          >
            <ClientSideListings initialListings={initialListings} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
