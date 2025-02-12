// app/listings/[id]/page.tsx
import ListingDetail from "@/components/listings/ListingDetail";

export default function ListingPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <ListingDetail />
    </main>
  );
}
