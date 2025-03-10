"use client";

import { Button } from "@/components/ui/button";
import prompts from "@/prompts/prompts";

export default function ViewFullArticleButton() {
  return (
    <Button variant="outline" onClick={() => window.location.reload()}>
      {prompts.news.viewFullArticle}
    </Button>
  );
}
