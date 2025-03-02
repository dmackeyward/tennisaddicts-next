// app/listings/view/[id]/success/page.tsx
"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SuccessPage() {
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    // Force a full page navigation by using window.location
    // This bypasses Next.js routing and will avoid the modal interception
    window.location.href = `/listings/view/${id}`;
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <h1 className="mt-6 text-2xl font-semibold">
        Listing Updated Successfully!
      </h1>
      <p className="mt-2 text-gray-600">Redirecting to your listing...</p>
    </div>
  );
}
