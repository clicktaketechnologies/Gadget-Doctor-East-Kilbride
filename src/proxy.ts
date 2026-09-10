import { NextRequest, NextResponse } from "next/server";

// CORS proxy (formerly middleware.ts — renamed for Next.js 16 which
// deprecated 'middleware' in favor of 'proxy').
// Allows the Firebase-hosted frontend to call the Render API cross-origin.
export function proxy(req: NextRequest) {
  const origin = req.headers.get("origin");

  // Allow ALL origins that end in web.app (covers gadgetdoctorls.web.app
  // and any Firebase preview channels) + the Render domain + localhost.
  const isAllowed =
    !origin || // same-origin / curl / no origin
    origin.includes("onrender.com") ||
    origin.includes("web.app") ||
    origin.includes("firebaseapp.com") ||
    origin.includes("localhost") ||
    origin.includes("gadgetdoctorls.co.uk");

  // Handle preflight (OPTIONS) requests
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    if (isAllowed && origin) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Access-Control-Allow-Credentials", "true");
    }
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Max-Age", "86400");
    return res;
  }

  // For actual requests, add CORS header and continue
  const res = NextResponse.next();
  if (isAllowed && origin) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
