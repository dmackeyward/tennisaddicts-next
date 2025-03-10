// components/NewsCard.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { NewsItem } from "@/types/news"; // Import the NewsItem type
import Image from "next/image";
import Link from "next/link";
import { handleModalNavigation } from "@/utils/device";

interface NewsCardProps {
  item: NewsItem; // Define the prop type
}

export default function NewsCard({ item }: NewsCardProps) {
  const newsUrl = `/news/view/${item.id}`;

  const handleLinkClick = () => {
    handleModalNavigation(newsUrl);
  };

  return (
    <Link
      href={newsUrl}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
      aria-label={`Read full article about ${item.title}`}
      onClick={handleLinkClick}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="flex flex-col md:flex-row md:h-64">
          <div className="md:w-1/3 h-48 md:h-full relative bg-gray-200">
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={400}
                height={256}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ objectPosition: "center" }}
              />
            </div>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </div>
              <CardDescription className="text-sm">
                {formatDate(item.date)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{item.summary}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-auto">
              <p className="text-sm text-gray-500">By {item.author}</p>
              <span className="text-sm text-blue-600 group-hover:underline">
                Read more
              </span>
            </CardFooter>
          </div>
        </div>
      </Card>
    </Link>
  );
}
