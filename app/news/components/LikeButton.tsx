"use client";

// app/news/view/[id]/client.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import prompts from "@/prompts/prompts";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <div className="mt-8 flex items-center">
      <Button
        variant="outline"
        className="flex items-center space-x-2"
        onClick={() => setLikes(likes + 1)}
      >
        <ThumbsUp size={18} />
        <span>{prompts.news.likeThisArticle}</span>
        {likes > 0 && (
          <span className="ml-2 bg-blue-100 px-2 py-1 rounded-full text-xs">
            {likes}
          </span>
        )}
      </Button>
    </div>
  );
}
