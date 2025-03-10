// app/listings/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { ClientSideListings } from "./components/ClientSideListings";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getListings } from "@/db/queries/listings";
import { auth } from "@clerk/nextjs/server";
import Icon from "@/components/Icon";
import { Plus, Loader2 } from "lucide-react";
import prompts from "@/prompts/prompts";

// Use metadata from prompts file
export const metadata: Metadata = {
  title: prompts.listings.metadata.title,
  description: prompts.listings.metadata.description,
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Convert searchParams to your filter type
  const filters = await searchParams;

  console.log(filters);

  // Get listings with filters
  const initialListings = await getListings();
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-b from-white to-green-100">
        {/* Hero Section */}
        <div className="container mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center text-center space-y-6 mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Icon name="tennisball" size={48} className="text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              {prompts.listings.title}
            </h1>
            <p className="text-xl max-w-3xl">{prompts.listings.description}</p>
            {userId && (
              <Link href="/listings/create">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus size={16} className="mr-2" />
                  {prompts.listings.myListings.createButton}
                </Button>
              </Link>
            )}
          </div>

          {/* Listings Content */}
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-32">
                <div className="animate-pulse text-gray-500 flex flex-col items-center">
                  <Loader2
                    size={32}
                    className="text-green-600 animate-spin mb-4"
                  />
                  <span>Loading listings...</span>
                </div>
              </div>
            }
          >
            <ClientSideListings initialListings={initialListings} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
