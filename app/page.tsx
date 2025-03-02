// app/page.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "Tennis Addicts",
  description: "Your community for everything tennis",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-100">
      {/* Hero Section */}
      <div className="container mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <Icon name="tennisball" size={48} className="text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Tennis Addicts</h1>
          <p className="text-xl max-w-2xl">
            Your community for local matches, courts, and tennis enthusiasts
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/news">
              <Button className="bg-green-600 hover:bg-green-700 text-black font-medium text-lg px-6 py-6 h-auto">
                Latest News
              </Button>
            </Link>
            <Link href="/listings">
              <Button className="bg-white hover:bg-gray-100 text-green-600 font-medium text-lg px-6 py-6 h-auto">
                Court Listings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="container mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Signup Card */}
          <Link href="/sign-in">
            <Card className="shadow-md hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Icon
                      name="tennisball"
                      size={28}
                      className="text-green-600"
                    />
                  </div>
                </div>
                <CardTitle className="text-xl text-center">
                  Join Our Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Sign up to connect with local players, find courts, and join
                  events.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* News Card */}
          <Link href="/news">
            <Card className="shadow-md hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Icon
                      name="tennisball"
                      size={28}
                      className="text-green-600"
                    />
                  </div>
                </div>
                <CardTitle className="text-xl text-center">News</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Keep up to date with the latest local and international tennis
                  news.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Listings Card */}
          <Link href="/listings">
            <Card className="shadow-md hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Icon
                      name="tennisball"
                      size={28}
                      className="text-green-600"
                    />
                  </div>
                </div>
                <CardTitle className="text-xl text-center">Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Find equipment, coaching, and other tennis-related listings.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
