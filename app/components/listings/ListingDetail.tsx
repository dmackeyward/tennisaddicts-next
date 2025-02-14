import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import type { Listing } from "@/types/listings";

// Updated mock data to match new type structure
const mockListing: Listing = {
  id: "1",
  title: "Beautiful Vintage Desk",
  description:
    "Mid-century modern desk in excellent condition. Perfect for a home office or study area. Solid wood construction with original brass hardware. Minor wear consistent with age adds to its character.",
  price: 299.99,
  location: {
    country: "United States",
    state: "Oregon",
    formatted: "Portland, OR",
  },
  images: [
    {
      url: "/api/placeholder/600/400",
      alt: "Beautiful Vintage Desk main image",
      id: "1-image-1",
    },
  ],
  tags: [],
  createdAt: "2024-02-12T08:00:00Z",
  updatedAt: "2024-02-12T08:00:00Z",
};

const ListingDetail = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {mockListing.title}
          </CardTitle>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{mockListing.location.formatted}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(mockListing.createdAt)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={mockListing.images[0]?.url}
                alt={mockListing.images[0]?.alt || mockListing.title}
                className="w-full rounded-lg object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-2xl font-bold text-green-600">
                <DollarSign className="w-6 h-6" />
                {mockListing.price.toFixed(2)}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {mockListing.description}
                </p>
              </div>

              {mockListing.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex gap-2">
                    {mockListing.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto">
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingDetail;
