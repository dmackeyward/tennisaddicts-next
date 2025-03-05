// app/about/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "About Tennis Addicts",
  description: "Learn about our tennis community",
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white to-green-100">
      {/* Hero Section */}
      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <Icon name="tennisball" size={48} className="text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
          <p className="text-xl max-w-3xl">
            We&apos;re passionate about building a community of tennis
            enthusiasts who share a love for the game.
          </p>
        </div>

        {/* Our Story */}
        <Card className="shadow-md mb-12">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Tennis Addicts began in 2024 when a group of passionate players
                wanted to create a better way to connect with fellow tennis
                enthusiasts in their local area. What started as a simple meetup
                group has evolved into a thriving community platform.
              </p>
              <p>
                Our mission is to make tennis more accessible and enjoyable for
                players of all skill levels by providing a central hub for court
                listings, local news, equipment exchanges, and community events.
              </p>
              <p>
                Whether you&apos;re a beginner looking for lessons, a
                competitive player searching for worthy opponents, or simply a
                fan of the sport, Tennis Addicts is your home for everything
                tennis.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What We Offer */}
        <Card className="shadow-md mb-12">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">What We Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-green-100 rounded-full p-3 mb-4">
                  <Icon
                    name="tennisball"
                    size={28}
                    className="text-green-600"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p>
                  Connect with local players, join groups, and participate in
                  community events and tournaments.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-green-100 rounded-full p-3 mb-4">
                  <Icon
                    name="tennisball"
                    size={28}
                    className="text-green-600"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Listings</h3>
                <p>
                  Find and review local tennis courts, check availability, and
                  book court time directly through our platform.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-green-100 rounded-full p-3 mb-4">
                  <Icon
                    name="tennisball"
                    size={28}
                    className="text-green-600"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tennis News</h3>
                <p>
                  Stay updated with local and international tennis news,
                  tournament results, and player profiles.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-green-100 rounded-full p-3 mb-4">
                  <Icon
                    name="tennisball"
                    size={28}
                    className="text-green-600"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
                <p>
                  Buy, sell, or trade tennis equipment, find coaches, and
                  discover other tennis-related services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact and Join Us */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">
              Join Our Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <p>
                  Ready to take your tennis experience to the next level? Join
                  Tennis Addicts today and become part of our growing community
                  of tennis lovers.
                </p>
                <p>Have questions? Get in touch with us to learn more.</p>
              </div>
              <div className="flex flex-col gap-4">
                <Link href="/sign-up">
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 h-auto w-full">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="bg-white hover:bg-gray-100 text-green-600 border border-green-600 font-medium px-6 py-3 h-auto w-full">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
