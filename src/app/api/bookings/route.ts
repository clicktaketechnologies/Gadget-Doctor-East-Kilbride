import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import { genTicketId } from "@/lib/format";
import { setCorsHeaders, handlePreflight } from "@/lib/cors";
import type { CreateBookingInput } from "@/lib/types";

export const dynamic = "force-dynamic";

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req) ?? new NextResponse(null, { status: 204 });
}

// GET /api/bookings  (admin)
export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return setCorsHeaders(req, NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
  });
  return setCorsHeaders(req, NextResponse.json(bookings));
}

// POST /api/bookings  (public)
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateBookingInput;

    if (!body.customerName || !body.email || !body.phone || !body.deviceType) {
      return setCorsHeaders(req, NextResponse.json({ error: "Missing required fields" }, { status: 400 }));
    }

    let ticketId = genTicketId();
    let exists = await db.booking.findUnique({ where: { ticketId } });
    while (exists) {
      ticketId = genTicketId();
      exists = await db.booking.findUnique({ where: { ticketId } });
    }

    const booking = await db.booking.create({
      data: {
        ticketId,
        customerName: body.customerName,
        email: body.email,
        phone: body.phone,
        deviceType: body.deviceType,
        deviceModel: body.deviceModel || "Not specified",
        issue: body.issue || "No description provided",
        needsCollection: body.needsCollection,
        collectionAddr: body.collectionAddr || null,
        status: "Pending",
        bookingDate: body.bookingDate ? new Date(body.bookingDate) : null,
        bookingTime: body.bookingTime || null,
      },
    });
    return setCorsHeaders(req, NextResponse.json(booking, { status: 201 }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return setCorsHeaders(req, NextResponse.json({ error: message }, { status: 500 }));
  }
}
