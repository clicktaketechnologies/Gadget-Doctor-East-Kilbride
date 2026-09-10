import { NextRequest, NextResponse } from "next/server";

/**
 * Sets CORS headers on a NextResponse, allowing cross-origin requests from
 * Firebase Hosting and any other allowed origins.
 *
 * Usage:
 *   const res = NextResponse.json(data);
 *   return setCorsHeaders(req, res);
 */
export function setCorsHeaders(req: NextRequest, res: NextResponse): NextResponse {
  const origin = req.headers.get("origin");

  // Allow all Firebase + Render + localhost origins
  const isAllowed =
    !origin ||
    origin.includes("onrender.com") ||
    origin.includes("web.app") ||
    origin.includes("firebaseapp.com") ||
    origin.includes("localhost") ||
    origin.includes("gadgetdoctorls.co.uk");

  if (isAllowed && origin) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  return res;
}

/**
 * Handles CORS preflight (OPTIONS) requests.
 * Returns a 204 response with CORS headers, or null if not a preflight.
 */
export function handlePreflight(req: NextRequest): NextResponse | null {
  if (req.method !== "OPTIONS") return null;

  const origin = req.headers.get("origin");
  const isAllowed =
    !origin ||
    origin.includes("onrender.com") ||
    origin.includes("web.app") ||
    origin.includes("firebaseapp.com") ||
    origin.includes("localhost") ||
    origin.includes("gadgetdoctorls.co.uk");

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
