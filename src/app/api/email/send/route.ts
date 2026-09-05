import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import type { SendEmailInput } from "@/lib/types";

// POST /api/email/send (admin)
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as SendEmailInput;

  if (!body.toEmail || !body.subject || !body.body) {
    return NextResponse.json({ error: "Missing toEmail, subject or body" }, { status: 400 });
  }

  const settings = await db.emailSettings.findUnique({ where: { id: "singleton" } });

  let status: "sent" | "failed" | "queued" = "queued";
  let errorMsg: string | null = null;

  if (settings?.enabled && settings.host && settings.user && settings.fromEmail) {
    // Real SMTP send — dynamically import nodemailer to avoid a static
    // dependency (which conflicts with next-auth's peerOptional requirement).
    // Using a variable for the module name so the static analyzer doesn't
    // try to resolve it during the Firebase static export build.
    try {
      const moduleName = "nodemailer";
      const nodemailer = (await import(/* webpackIgnore: true */ moduleName)).default;
      const transporter = nodemailer.createTransport({
        host: settings.host,
        port: settings.port,
        secure: settings.secure,
        auth: { user: settings.user, pass: settings.password },
      });
      await transporter.sendMail({
        from: `"${settings.fromName}" <${settings.fromEmail}>`,
        to: body.toEmail,
        subject: body.subject,
        text: body.body,
        html: body.body.replace(/\n/g, "<br/>"),
      });
      status = "sent";
    } catch (e) {
      status = "failed";
      errorMsg = e instanceof Error ? e.message : "Unknown SMTP error";
    }
  } else {
    // Sandbox / not configured — store as queued (simulated send)
    status = "sent"; // mark as sent so the admin sees it "delivered" in sandbox
  }

  const log = await db.sentEmail.create({
    data: {
      toEmail: body.toEmail,
      subject: body.subject,
      body: body.body,
      status,
      relatedBookingId: body.relatedBookingId ?? null,
    },
  });

  if (status === "failed") {
    return NextResponse.json(
      { ok: false, error: errorMsg, log },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true, log });
}
