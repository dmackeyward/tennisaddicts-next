import { Metadata } from "next";
import newsData from "@/data/news-items.json";
import { formatDate } from "@/lib/format";
import { NewsItem } from "@/types/news";
import Image from "next/image";
import Link from "next/link";
import NewsViewClient from "./client";
import { ArrowLeft } from "lucide-react";
import { use } from "react";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news and updates",
};

export default function NewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { newsItems }: { newsItems: NewsItem[] } = newsData;
  const newsItem = newsItems.find((item) => item.id.toString() === id);

  if (!newsItem) {
    return (
      <div className="container mx-auto px-6 py-12">News item not found</div>
    );
  }

  return (
    <div className="min-h-screen">
      <div
        className="absolute inset-0 bg-gradient-to-b from-white to-green-100 w-full h-full"
        style={{ position: "fixed", zIndex: -1 }}
      ></div>

      {/* Hero Section */}
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-64 md:h-96 bg-gray-200">
            <Image
              src={newsItem.imageUrl}
              alt={newsItem.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {newsItem.title}
              </h1>
              <div className="flex items-center text-gray-500">
                <p>{formatDate(newsItem.date)}</p>
                <span className="mx-2">•</span>
                <p>By {newsItem.author}</p>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg mb-4">{newsItem.summary}</p>
              <div
                dangerouslySetInnerHTML={{ __html: newsItem.content || "" }}
              />
            </div>

            <NewsViewClient />

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/news"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to News
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
