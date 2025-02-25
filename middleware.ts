import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define the route pattern for protection
const isProtectedRoute = createRouteMatcher(["/test", "/test/(.*)"]);

// Use async/await with auth.protect()
export default clerkMiddleware(
  async (auth, request) => {
    if (isProtectedRoute(request)) {
      await auth.protect();
    }
  },
  { debug: true } // Add this to see detailed logs
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|_vercel|public/|favicon.ico).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
