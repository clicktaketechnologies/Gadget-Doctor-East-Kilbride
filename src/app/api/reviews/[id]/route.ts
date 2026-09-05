import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";

// Required for static export (Firebase) — tells Next.js not to pre-generate
// any static pages for this dynamic API route. The route runs on Render.
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
  const { id } = await params;
  const body = (await req.json()) as {
    approved?: boolean;
    rating?: number;
    comment?: string;
    author?: string;
    device?: string;
  };

  const data: Record<string, unknown> = {};
  if (body.approved !== undefined) data.approved = body.approved;
  if (body.rating !== undefined) data.rating = body.rating;
  if (body.comment !== undefined) data.comment = body.comment;
  if (body.author !== undefined) data.author = body.author;
  if (body.device !== undefined) data.device = body.device;

  const updated = await db.review.update({ where: { id }, data });
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
  await db.review.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
