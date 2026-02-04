import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes - accessible without authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/landing-mockup",
  "/onboarding(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/sso-callback(.*)",
  "/api/auth(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.pathname;

  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    console.log(`[Middleware] Public route allowed: ${url}`);
    return;
  }

  // Get auth state for debugging
  const { userId, orgId } = await auth();
  console.log(`[Middleware] Protected route: ${url}, userId: ${userId || 'none'}, orgId: ${orgId || 'none'}`);

  // Protect all other routes - redirect to sign-in if not authenticated
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
