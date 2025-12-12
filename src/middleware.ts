import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

// Create matchers from your routeAccessMap
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

console.log("Route matchers:", matchers);

// Public routes that should never trigger redirects
const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/forgot-password", "/"];

// Middleware
export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth(); // <-- await here
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

  // Skip public routes
  if (PUBLIC_PATHS.includes(req.nextUrl.pathname)) {
    return;
  }

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      // If user has no role or role is not allowed, redirect safely
      if (!role || !allowedRoles.includes(role)) {
        const redirectTo = role ? `/${role}` : "/sign-in";
        return NextResponse.redirect(new URL(redirectTo, req.url));
      }
    }
  }
});

// Apply middleware to all routes except Next.js internals and static files
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
