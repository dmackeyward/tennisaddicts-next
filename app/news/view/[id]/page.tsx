import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";
import newsData from "@/data/news-items.json";
import { formatDate } from "@/lib/format";
import { NewsItem } from "@/types/news";
import Image from "next/image";

export const dynamic = "force-dynamic";

// Loading component for the news article
function NewsItemLoading() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-8 min-h-screen">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-64 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

// Get news item by id
function getNewsItem(id: string): NewsItem | undefined {
  const { newsItems } = newsData;
  return newsItems.find((item) => item.id.toString() === id);
}

// Main news content component
async function NewsContent({ id }: { id: string }) {
  const newsItem = getNewsItem(id);

  if (!newsItem) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div
        className="absolute inset-0 bg-gradient-to-b from-white to-green-100 w-full h-full"
        style={{ position: "fixed", zIndex: -1 }}
      ></div>

      <div className="container mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link href="/news">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={16} /> Back to News
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden">
          <div className="h-80 relative bg-gray-200">
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={newsItem.imageUrl}
                alt={newsItem.title}
                width={1200} // A larger width for full-width article images
                height={320} // Matching your h-80 container height
                className="w-full h-full object-cover"
                priority // Add priority since this is likely above the fold
              />
            </div>
          </div>

          <CardHeader>
            <CardTitle className="text-3xl">{newsItem.title}</CardTitle>
            <CardDescription className="flex justify-between mt-2">
              <span className="text-sm">{formatDate(newsItem.date)}</span>
              <span className="text-sm">By {newsItem.author}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="prose max-w-none">
              <p className="text-lg font-medium text-gray-700 mb-6">
                {newsItem.summary}
              </p>
              <p className="text-gray-700">{newsItem.content}</p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-500">
                Published {formatDate(newsItem.date)}
              </span>
            </div>
            <Link href="/news">
              <Button variant="outline">All News</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Main page component
export default function NewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense fallback={<NewsItemLoading />}>
      <NewsContent id={id} />
    </Suspense>
  );
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const newsItem = getNewsItem(id);

    if (!newsItem) {
      return {
        title: "News Item Not Found",
        description: "The requested news article could not be found.",
      };
    }

    return {
      title: `${newsItem.title} | Your Platform Name`,
      description: newsItem.summary,
      openGraph: {
        title: newsItem.title,
        description: newsItem.summary,
        images: [
          {
            url: newsItem.imageUrl,
            alt: newsItem.title,
          },
        ],
      },
    };
  } catch {
    return {
      title: "News Article",
      description: "View news article details on our platform.",
    };
  }
}
