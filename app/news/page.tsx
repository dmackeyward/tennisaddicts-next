import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import newsData from "@/data/news-items.json";
import { formatDate } from "@/lib/format";
import { NewsItem } from "@/types/news";
import Icon from "@/components/Icon";
import Image from "next/image";
import ModalLinkButton from "@/components/ModalLinkButton"; // Make sure this path is correct

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
        </div>
        <div className="space-y-6">
          {newsItems.map((item) => {
            // Get the news article URL
            const newsUrl = `/news/view/${item.id}`;

            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:h-64">
                  <div className="md:w-1/3 h-48 md:h-full relative bg-gray-200">
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={400}
                        height={256}
                        className="w-full h-full object-cover"
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
                      <ModalLinkButton href={newsUrl} variant="outline">
                        Read More
                      </ModalLinkButton>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
