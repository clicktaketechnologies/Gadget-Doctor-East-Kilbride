import { NextRequest, NextResponse } from "next/server";

/**
 * Sets CORS headers on a NextResponse — allows ALL origins.
 * This is the most permissive CORS policy (needed for Firebase → Render).
 */
export function setCorsHeaders(req: NextRequest, res: Response): NextResponse {
  const origin = req.headers.get("origin") || "*";

  // Set CORS headers on EVERY response — no origin checking
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Max-Age", "86400");

  // Return as NextResponse (the Response headers are already set)
  return res as NextResponse;
}

/**
 * Handles CORS preflight (OPTIONS) requests.
 */
export function handlePreflight(req: NextRequest): NextResponse | null {
  if (req.method !== "OPTIONS") return null;

  const origin = req.headers.get("origin") || "*";
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}
