import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import type { UpdateServiceInput } from "@/lib/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await req.json()) as UpdateServiceInput;

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.category !== undefined) data.category = body.category;
  if (body.description !== undefined) data.description = body.description;
  if (body.icon !== undefined) data.icon = body.icon;
  if (body.priceFrom !== undefined) data.priceFrom = body.priceFrom;
  if (body.priceTo !== undefined) data.priceTo = body.priceTo;
  if (body.turnaround !== undefined) data.turnaround = body.turnaround;
  if (body.popular !== undefined) data.popular = body.popular;
  if (body.active !== undefined) data.active = body.active;

  const updated = await db.service.update({ where: { id }, data });
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
  await db.service.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
