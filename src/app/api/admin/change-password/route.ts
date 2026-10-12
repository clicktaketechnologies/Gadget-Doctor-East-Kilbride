import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized, makeToken } from "@/lib/auth";
import type { ChangePasswordInput } from "@/lib/types";

export const dynamic = "force-dynamic";

// POST /api/admin/change-password (admin — must be logged in)
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as ChangePasswordInput;
  if (!body.currentPassword || !body.newPassword) {
    return NextResponse.json({ error: "Current and new password required" }, { status: 400 });
  }
  if (body.newPassword.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
  }

  // Get the admin user from the token
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : "";
  const tokenData = JSON.parse(Buffer.from(token, "base64").toString());
  const adminName = tokenData.name;

  const user = await db.adminUser.findFirst({ where: { name: adminName } });
  if (!user) {
    return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
  }

  // Verify current password
  if (user.password !== body.currentPassword) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });
  }

  // Update password
  await db.adminUser.update({
    where: { id: user.id },
    data: { password: body.newPassword },
  });

  // Issue a fresh token (keeps the session alive)
  const newToken = makeToken(user.name);
  return NextResponse.json({ ok: true, token: newToken });
}
