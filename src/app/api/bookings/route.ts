import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import { genTicketId } from "@/lib/format";
import type { CreateBookingInput } from "@/lib/types";

export const dynamic = "force-dynamic";

// GET /api/bookings  (admin)
export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings);
}

// POST /api/bookings  (public)
export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateBookingInput;

  if (!body.customerName || !body.email || !body.phone || !body.deviceType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
  return NextResponse.json(booking, { status: 201 });
}
