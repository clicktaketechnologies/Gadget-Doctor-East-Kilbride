import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import { setCorsHeaders, handlePreflight } from "@/lib/cors";

export const dynamic = "force-dynamic";

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req) ?? new NextResponse(null, { status: 204 });
}

// GET is public (public site reads announcement + collection toggle status)
export async function GET(req: NextRequest) {
  let s = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!s) {
    s = await db.siteSettings.create({
      data: {
        id: "singleton",
        collectionEnabled: true,
        collectionBannerEnabled: true,
        announcementEnabled: false,
        announcementText: null,
        ticketIdVisible: true,
      },
    });
  }
  return setCorsHeaders(req, NextResponse.json(s));
}

// PATCH admin only
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return setCorsHeaders(req, NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  const body = (await req.json()) as {
    collectionEnabled?: boolean;
    collectionBannerEnabled?: boolean;
    announcementEnabled?: boolean;
    announcementText?: string | null;
    ticketIdVisible?: boolean;
  };

  const data: Record<string, unknown> = {};
  if (body.collectionEnabled !== undefined)
    data.collectionEnabled = body.collectionEnabled;
  if (body.collectionBannerEnabled !== undefined)
    data.collectionBannerEnabled = body.collectionBannerEnabled;
  if (body.announcementEnabled !== undefined)
    data.announcementEnabled = body.announcementEnabled;
  if (body.announcementText !== undefined)
    data.announcementText = body.announcementText;
  if (body.ticketIdVisible !== undefined)
    data.ticketIdVisible = body.ticketIdVisible;

  let s = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!s) {
    s = await db.siteSettings.create({
      data: {
        id: "singleton",
        collectionEnabled: true,
        collectionBannerEnabled: true,
        announcementEnabled: false,
        announcementText: null,
        ticketIdVisible: true,
        ...data,
      } as never,
    });
  } else {
    s = await db.siteSettings.update({ where: { id: "singleton" }, data });
  }
  return setCorsHeaders(req, NextResponse.json(s));
}
