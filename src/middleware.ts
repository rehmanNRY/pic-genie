import { clerkMiddleware } from '@clerk/nextjs/server'

// Make sure that the `/api/webhooks(.*)` route is not protected here
export default clerkMiddleware()
console.log("reach middlware")
export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}
