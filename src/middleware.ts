import { clerkMiddleware } from "@clerk/nextjs/server";

// Apply Clerk middleware only to routes except /api/webhooks/clerk
export default clerkMiddleware();

export const config = {
  matcher: [
    // Apply Clerk middleware to all routes except webhook route
    '/((?!api/webhooks/clerk).*)',
  ],
};
