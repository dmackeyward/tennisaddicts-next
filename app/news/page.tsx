import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description: "X",
};

export default function News() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>News</h1>
    </div>
  );
}
