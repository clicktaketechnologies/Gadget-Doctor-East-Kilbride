import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { makeToken } from "@/lib/auth";
import type { AdminLoginInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as AdminLoginInput;
  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = await db.adminUser.findFirst({
    where: { email: body.email.toLowerCase() },
  });

  if (!user || user.password !== body.password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = makeToken(user.name);
  return NextResponse.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}
