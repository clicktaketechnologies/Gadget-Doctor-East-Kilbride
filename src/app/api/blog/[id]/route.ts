import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import type { UpdateBlogPostInput } from "@/lib/types";

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
  const { id } = await params;
  const body = (await req.json()) as UpdateBlogPostInput;

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.excerpt !== undefined) data.excerpt = body.excerpt;
  if (body.content !== undefined) data.content = body.content;
  if (body.coverImage !== undefined) data.coverImage = body.coverImage;
  if (body.category !== undefined) data.category = body.category;
  if (body.tags !== undefined) data.tags = body.tags;
  if (body.author !== undefined) data.author = body.author;
  if (body.published !== undefined) data.published = body.published;
  if (body.featured !== undefined) data.featured = body.featured;

  const updated = await db.blogPost.update({ where: { id }, data });
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
  await db.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
