// app/news/page.js (remains a server component)
import { Metadata } from "next";
import newsData from "@/assets/data/news-items.json";
import { NewsItem } from "@/types/news";
import Icon from "@/components/Icon";
import NewsCard from "@/components/news/NewsCard";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news and updates",
};

export default function News() {
  const { newsItems }: { newsItems: NewsItem[] } = newsData;

  return (
    <div className="min-h-screen">
      <div
        className="absolute inset-0 bg-gradient-to-b from-white to-green-100 w-full h-full"
        style={{ position: "fixed", zIndex: -1 }}
      ></div>

      {/* Hero Section */}
      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <Icon name="tennisball" size={48} className="text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">News</h1>
          <p className="text-xl max-w-3xl">
            Find and book the perfect tennis court in your area. Browse our
            listings to discover top-rated courts, availability, and special
            offers.
          </p>
        </div>
        <div className="space-y-6">
          {newsItems.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
