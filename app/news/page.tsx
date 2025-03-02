import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News",
  description: "X",
};

export default function News() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-100">
      <div className="container mx-auto max-w-6xl px-6 py-8 ">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-bold">News</CardTitle>
            <Link href="/listings/create">
              <Button>Create New&apos;s Item</Button>
            </Link>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
