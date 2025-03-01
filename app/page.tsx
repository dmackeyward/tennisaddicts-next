// app/listings/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tennis Addicts",
  description: "Welcome to Tennis Addicts",
};

export default async function Home() {
  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">
            Welcome to Tennis Addicts
          </CardTitle>
          <Link href="/listings/create">
            <Button>Create New Listing</Button>
          </Link>
        </CardHeader>
      </Card>
    </div>
  );
}
