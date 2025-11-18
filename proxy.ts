import { clerkMiddleware } from "@clerk/nextjs/server";

// The exported function remains the same. It is now automatically
// treated as the default 'proxy' handler by Next.js.
export default clerkMiddleware();

// The 'config' object and its 'matcher' property are still used
// by Next.js to determine which paths the proxy should run on.
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
