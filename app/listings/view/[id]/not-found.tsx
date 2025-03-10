// app/listings/[id]/not-found.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ListingNotFound() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <CardTitle>Listing Not Found</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              We couldn&apos;t find the listing you&apos;re looking for. It
              might have been removed or the link might be incorrect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/listings">Browse All Listings</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Return Home</Link>
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
  title: "Listing Not Found | Your Platform Name",
  description: "The requested listing could not be found.",
};
