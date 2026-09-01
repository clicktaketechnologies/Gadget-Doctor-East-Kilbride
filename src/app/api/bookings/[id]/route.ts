import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import type { UpdateBookingInput } from "@/lib/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await req.json()) as UpdateBookingInput;

  const data: Record<string, unknown> = {};
  if (body.status !== undefined) data.status = body.status;
  if (body.technicianNotes !== undefined) data.technicianNotes = body.technicianNotes;
  if (body.quotedPrice !== undefined) data.quotedPrice = body.quotedPrice;
  if (body.finalPrice !== undefined) data.finalPrice = body.finalPrice;

  const updated = await db.booking.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await db.booking.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
