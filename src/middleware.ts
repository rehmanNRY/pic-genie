import { clerkMiddleware } from '@clerk/nextjs/server'

// Apply Clerk middleware to specific routes, but exclude `/api/webhooks/clerk`
export default clerkMiddleware()

export const config = {
  matcher: [
    // Apply Clerk middleware to the following routes (but exclude `/api/webhooks/clerk`)
    '/((?!api/webhooks/clerk).*)', // All routes except `/api/webhooks/clerk`
    '/(api|trpc)(.*)', // Ensure all API routes are included except `/api/webhooks/clerk`
  ],
}
