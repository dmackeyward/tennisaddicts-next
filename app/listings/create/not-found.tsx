// app/listings/create/not-found.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function CreateListingNotFound() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <CardTitle>Page Not Available</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            The listing creation page is currently unavailable. This might be
            due to maintenance or you may not have the required permissions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/listings" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Listings</span>
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Metadata for the not-found page
export const metadata = {
  title: "Create Listing Unavailable | Your Platform Name",
  description: "The listing creation page is currently unavailable.",
};
