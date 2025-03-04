import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Modal } from "./modal";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import newsData from "@/data/news-items.json";
import { NewsItem } from "@/types/news";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import ViewFullArticleButton from "./ViewFullArticleButton";

export const dynamic = "force-dynamic";

// Placeholder for loading state
function NewsItemLoading() {
  return (
    <div className="p-6 bg-white rounded-lg animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
      <div className="h-48 bg-gray-200 rounded mb-8"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

// Get news item by id
function getNewsItem(id: string): NewsItem | undefined {
  const { newsItems } = newsData;
  return newsItems.find((item) => item.id.toString() === id);
}

// News content component
async function NewsContent({ id }: { id: string }) {
  const newsItem = getNewsItem(id);

  if (!newsItem) {
    notFound();
  }

  return (
    <div className="relative rounded-lg bg-white shadow-xl overflow-hidden">
      <Card className="border-0 shadow-none">
        <div className="h-64 relative bg-gray-200">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={newsItem.imageUrl}
              alt={newsItem.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-2xl">{newsItem.title}</CardTitle>
          <CardDescription className="flex justify-between mt-2">
            <span className="text-sm">{formatDate(newsItem.date)}</span>
            <span className="text-sm">By {newsItem.author}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="prose max-w-none">
            <p className="text-lg font-medium text-gray-700 mb-4">
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
          {/* <Link href={`/news/view/${newsItem.id}`}>
            <Button variant="outline">View Full Article</Button>
          </Link> */}
          <ViewFullArticleButton />
        </CardFooter>
      </Card>
    </div>
  );
}

export default async function NewsModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Modal>
      <ErrorBoundary
        fallback={
          <div className="p-6 bg-white rounded-lg">
            <h2 className="text-xl font-semibold text-red-600">
              Error Loading News
            </h2>
            <p className="mt-2 text-gray-600">
              There was a problem loading this news article.
            </p>
          </div>
        }
      >
        <Suspense fallback={<NewsItemLoading />}>
          <NewsContent id={id} />
        </Suspense>
      </ErrorBoundary>
    </Modal>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params object to get the id
  const { id } = await params;
  const newsItem = getNewsItem(id);

  if (!newsItem) {
    return {
      title: "News Not Found",
    };
  }

  return {
    title: newsItem.title,
  };
}
