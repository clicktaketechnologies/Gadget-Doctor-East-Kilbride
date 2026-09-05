import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import type { UpdatePageContentInput, PageContentMap } from "@/lib/types";

export const dynamic = "force-dynamic";

// GET /api/pages?page=home (public) | default (admin: all pages)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  const rows = await db.pageContent.findMany({
    where: page ? { page } : undefined,
  });

  const map: PageContentMap = {};
  for (const r of rows) {
    if (!map[r.page]) map[r.page] = {};
    if (!map[r.page][r.section]) map[r.page][r.section] = {};
    map[r.page][r.section][r.key] = r.value;
  }
  return NextResponse.json(map);
}

// POST /api/pages (admin) — upsert a single field
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as UpdatePageContentInput;
  const { page, section, key, value } = body;

  const updated = await db.pageContent.upsert({
    where: { page_section_key: { page, section, key } },
    create: { page, section, key, value },
    update: { value },
  });
  return NextResponse.json(updated);
}

// PATCH /api/pages (admin) — bulk upsert many fields
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as UpdatePageContentInput[];

  for (const item of body) {
    await db.pageContent.upsert({
      where: { page_section_key: { page: item.page, section: item.section, key: item.key } },
      create: { page: item.page, section: item.section, key: item.key, value: item.value },
      update: { value: item.value },
    });
  }
  return NextResponse.json({ ok: true, count: body.length });
}
