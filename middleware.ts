// middleware.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define the route pattern for protection
const isProtectedRoute = createRouteMatcher([
  "/test",
  "/test/(.*)",
  "/listings/create",
  "/listings/create/(.*)",
]);

// Use async/await with auth.protect()
export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);

  if (isProtectedRoute(request)) {
    try {
      // This will throw an error if the user is not authenticated
      await auth.protect();
    } catch (error) {
      // User is not authenticated, redirect to sign-in page
      // Add a query parameter to indicate auth was required
      return NextResponse.redirect(
        new URL(
          `/sign-in?redirect=${encodeURIComponent(
            url.pathname
          )}&authRequired=true`,
          request.url
        )
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|_vercel|public/|favicon.ico).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
