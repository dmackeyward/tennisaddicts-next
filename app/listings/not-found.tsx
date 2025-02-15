// app/listings/not-found.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, Search } from "lucide-react";

export default function ListingsNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <CardTitle>No Listings Found</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              We couldn&apos;t find any listings matching your criteria. Try
              adjusting your filters or creating a new listing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link
                  href="/listings/create"
                  className="flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Create New Listing</span>
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Return Home</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Metadata for the not-found page
export const metadata = {
  title: "No Listings Found | Your Platform Name",
  description: "No listings were found matching your criteria.",
};
