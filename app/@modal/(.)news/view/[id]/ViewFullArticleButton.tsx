"use client";

import { Button } from "@/components/ui/button";

export default function ViewFullArticleButton() {
  return (
    <Button variant="outline" onClick={() => window.location.reload()}>
      View Full Article
    </Button>
  );
}
