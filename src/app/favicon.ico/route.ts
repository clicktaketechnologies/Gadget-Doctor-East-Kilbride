import { NextRequest, NextResponse } from "next/server";

/**
 * /favicon.ico — browsers auto-request this path; previously returned 404
 * (the site uses /gadget-doctor-logo.jpg as its icon). This route handler
 * redirects to the logo so the 404 is eliminated (Ahrefs Notice N1).
 *
 * Uses the request URL as the base so it works in both dev (localhost) and
 * production (gadgetdoctorls.co.uk). 302 (not 301) because the destination
 * is an implementation detail that may change.
 */
export function GET(req: NextRequest) {
  const target = new URL("/gadget-doctor-logo.jpg", req.url);
  return NextResponse.redirect(target, 302);
}
