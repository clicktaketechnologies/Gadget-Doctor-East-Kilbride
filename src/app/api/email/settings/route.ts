import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import type { UpdateEmailSettingsInput } from "@/lib/types";

export const dynamic = "force-dynamic";

// GET (admin) — returns current SMTP settings (password masked)
export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let s = await db.emailSettings.findUnique({ where: { id: "singleton" } });
  if (!s) {
    s = await db.emailSettings.create({
      data: {
        id: "singleton",
        enabled: false,
        host: "",
        port: 587,
        secure: false,
        user: "",
        password: "",
        fromEmail: "",
        fromName: "Gadget Doctor East Kilbride",
      },
    });
  }
  return NextResponse.json({ ...s, password: s.password ? "••••••••" : "" });
}

// PATCH (admin) — update SMTP settings
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as UpdateEmailSettingsInput & { password?: string };

  const data: Record<string, unknown> = {};
  if (body.enabled !== undefined) data.enabled = body.enabled;
  if (body.host !== undefined) data.host = body.host;
  if (body.port !== undefined) data.port = body.port;
  if (body.secure !== undefined) data.secure = body.secure;
  if (body.user !== undefined) data.user = body.user;
  // only update password if a real value is sent (not the mask)
  if (body.password !== undefined && body.password !== "" && body.password !== "••••••••") {
    data.password = body.password;
  }
  if (body.fromEmail !== undefined) data.fromEmail = body.fromEmail;
  if (body.fromName !== undefined) data.fromName = body.fromName;

  let s = await db.emailSettings.findUnique({ where: { id: "singleton" } });
  if (!s) {
    s = await db.emailSettings.create({
      data: {
        id: "singleton",
        enabled: false,
        host: "",
        port: 587,
        secure: false,
        user: "",
        password: "",
        fromEmail: "",
        fromName: "Gadget Doctor East Kilbride",
        ...data,
      } as never,
    });
  } else {
    s = await db.emailSettings.update({ where: { id: "singleton" }, data });
  }
  return NextResponse.json({ ...s, password: s.password ? "••••••••" : "" });
}
