import { NextRequest, NextResponse } from "next/server";

// CORS middleware — allows the Firebase-hosted frontend to call the Render API.
// When the public site is on gadgetdoctorls.web.app and the API is on Render,
// cross-origin requests need these headers.
export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");

  // Allow the Firebase hosting domain + same-origin (Render)
  const allowedOrigins = [
    "https://gadgetdoctorls.web.app",
    "https://gadget-doctor-east-kilbride.onrender.com",
  ];

  const isAllowed =
    !origin || // same-origin / curl / no origin
    allowedOrigins.includes(origin) ||
    origin.includes("localhost") ||
    origin.includes("web.app");

  // Handle preflight (OPTIONS) requests
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    if (isAllowed && origin) {
      res.headers.set("Access-Control-Allow-Origin", origin);
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
