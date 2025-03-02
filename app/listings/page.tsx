import { Metadata } from "next";
import { Suspense } from "react";
import { ClientSideListings } from "../components/listings/ClientSideListings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getListings } from "@/db/queries/listings";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Listings",
  description: "View available listings",
};

export default async function ListingsPage() {
  // Fetch initial listings on the server
  const initialListings = await getListings();
  const { userId } = await auth();

  return (
    <>
      {/* Full-height background that will expand with content */}
      <div className="fixed inset-0 bg-gradient-to-b from-white to-green-100 -z-10" />

      {/* Content container */}
      <div className="container mx-auto max-w-6xl px-6 py-8 relative">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-bold">Listings</CardTitle>
            {userId && (
              <Link href="/listings/create">
                <Button>Create New Listing</Button>
              </Link>
            )}
          </CardHeader>

          <CardContent>
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-32">
                  <div className="animate-pulse text-gray-500">Loading...</div>
                </div>
              }
            >
              <ClientSideListings initialListings={initialListings} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
