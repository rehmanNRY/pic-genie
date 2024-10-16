import { clerkMiddleware } from '@clerk/nextjs/server';

// Skip protection for the webhook route
export default clerkMiddleware()
export const config = {
    matcher: [
        // Add the path to allow the webhook
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/api/webhooks/clerk', // Add this line
        '/(api|trpc)(.*)',
    ],
}
