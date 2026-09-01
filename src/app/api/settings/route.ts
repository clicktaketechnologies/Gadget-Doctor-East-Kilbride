import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";

// GET is public (public site reads announcement + collection banner status)
export async function GET() {
  let s = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!s) {
    s = await db.siteSettings.create({
      data: {
        id: "singleton",
        collectionBannerEnabled: true,
        announcementEnabled: false,
        announcementText: null,
      },
    });
  }
  return NextResponse.json(s);
}

// PATCH admin only
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as {
    collectionBannerEnabled?: boolean;
    announcementEnabled?: boolean;
    announcementText?: string | null;
  };

  const data: Record<string, unknown> = {};
  if (body.collectionBannerEnabled !== undefined)
    data.collectionBannerEnabled = body.collectionBannerEnabled;
  if (body.announcementEnabled !== undefined)
    data.announcementEnabled = body.announcementEnabled;
  if (body.announcementText !== undefined)
    data.announcementText = body.announcementText;

  let s = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!s) {
    s = await db.siteSettings.create({
      data: {
        id: "singleton",
        collectionBannerEnabled: true,
        announcementEnabled: false,
        announcementText: null,
        ...data,
      } as never,
    });
  } else {
    s = await db.siteSettings.update({ where: { id: "singleton" }, data });
  }
  return NextResponse.json(s);
}
