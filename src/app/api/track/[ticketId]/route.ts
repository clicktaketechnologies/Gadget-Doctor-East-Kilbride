import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { deviceLabel } from "@/lib/format";
import type { TrackResult } from "@/lib/types";

// GET /api/track/GD-8561 (public)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;
  const cleanId = ticketId.trim().toUpperCase();

  const booking = await db.booking.findUnique({
    where: { ticketId: cleanId },
  });

  if (!booking) {
    const empty: TrackResult = {
      ticketId: cleanId,
      customerName: "",
      deviceType: "",
      deviceModel: "",
      issue: "",
      status: "Pending",
      needsCollection: false,
      quotedPrice: null,
      finalPrice: null,
      technicianNotes: null,
      createdAt: "",
      updatedAt: "",
      found: false,
    };
    return NextResponse.json(empty);
  }

  const result: TrackResult = {
    ticketId: booking.ticketId,
    customerName: booking.customerName,
    deviceType: deviceLabel(booking.deviceType),
    deviceModel: booking.deviceModel,
    issue: booking.issue,
    status: booking.status as TrackResult["status"],
    needsCollection: booking.needsCollection,
    quotedPrice: booking.quotedPrice,
    finalPrice: booking.finalPrice,
    technicianNotes: booking.technicianNotes,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    found: true,
  };
  return NextResponse.json(result);
}
