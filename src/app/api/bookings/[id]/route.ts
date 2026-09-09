import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import type { UpdateBookingInput } from "@/lib/types";

export const dynamic = "force-dynamic";

// Required for static export (Firebase) — API routes run on Render only.
export function generateStaticParams() {
  return [];
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = (await req.json()) as UpdateBookingInput;

    const data: Record<string, unknown> = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.technicianNotes !== undefined) data.technicianNotes = body.technicianNotes;
    if (body.quotedPrice !== undefined) data.quotedPrice = body.quotedPrice;
    if (body.finalPrice !== undefined) data.finalPrice = body.finalPrice;
    // Only set bookingDate/bookingTime if they're explicitly provided
    // (avoids errors if the columns don't exist yet on older deployments)
    if (body.bookingDate !== undefined) {
      try {
        data.bookingDate = body.bookingDate ? new Date(body.bookingDate) : null;
      } catch {
        // ignore date parse errors
      }
    }
    if (body.bookingTime !== undefined) data.bookingTime = body.bookingTime;

    const updated = await db.booking.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await db.booking.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
