import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

// Create matchers from your routeAccessMap
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

// Public routes that should never trigger redirects
const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/forgot-password", "/", "/pending", "/api/auto-approve"];

// Middleware
export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  let publicMetadata = sessionClaims?.publicMetadata as { role?: string; approved?: boolean };

  // If sessionClaims doesn't have metadata, fetch it from the user object (fallback)
  if (userId && (!publicMetadata || !publicMetadata.role)) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      publicMetadata = user.publicMetadata as { role?: string; approved?: boolean };
      console.log(`[Middleware] Metadata fallback fetch for ${userId}:`, publicMetadata);
    } catch (err) {
      console.error("[Middleware] Failed to fetch user metadata:", err);
    }
  }

  const role = publicMetadata?.role;
  const approved = publicMetadata?.approved;

  if (req.nextUrl.pathname.startsWith("/api/auto-approve")) {
    console.log("[Middleware] API Request:", req.nextUrl.pathname);
    console.log("[Middleware] UserId:", userId);
  }

  // Debug Log for Admin/Student routes
  if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/student")) {
    console.log(`[Middleware Check] Path: ${req.nextUrl.pathname}`);
    console.log(`[Middleware Check] UserId: ${userId}`);
    console.log(`[Middleware Check] Role: ${role}`);
    console.log(`[Middleware Check] Public Metadata:`, publicMetadata);
  }

  // Skip public routes
  const isPublicPath = PUBLIC_PATHS.some((path) => {
    if (path === "/") {
      return req.nextUrl.pathname === "/";
    }
    return req.nextUrl.pathname.startsWith(path);
  });

  if (isPublicPath) {
    return;
  }

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      // If user has no role or role is not allowed, redirect safely
      if (!role || !allowedRoles.includes(role)) {
        console.log(`Middleware blocking access to ${req.nextUrl.pathname} for role ${role}. Allowed: ${allowedRoles}`);
        const redirectTo = role ? `/${role}` : "/sign-in";
        return NextResponse.redirect(new URL(redirectTo, req.url));
      }

      // If registered user but not approved yet, redirect to /pending
      // Admins are exempt
      if (role !== "admin" && !approved) {
        return NextResponse.redirect(new URL("/pending", req.url));
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
