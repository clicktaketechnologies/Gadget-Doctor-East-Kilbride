import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import type { SendEmailInput } from "@/lib/types";

export const dynamic = "force-dynamic";

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

  // If SMTP is not enabled or not fully configured, log as simulated
  if (!settings?.enabled || !settings.host || !settings.user || !settings.fromEmail || !settings.password) {
    const log = await db.sentEmail.create({
      data: {
        toEmail: body.toEmail,
        subject: body.subject,
        body: body.body,
        status: "sent",
        relatedBookingId: body.relatedBookingId ?? null,
      },
    });
    return NextResponse.json({
      ok: true,
      simulated: true,
      message: "Email logged (simulated) — SMTP not enabled/configured. Configure SMTP in Email Settings to send real emails.",
      log,
    });
  }

  // Real SMTP send
  try {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      auth: { user: settings.user, pass: settings.password },
    });

    // Verify the connection first (gives a clearer error)
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"${settings.fromName}" <${settings.fromEmail}>`,
      to: body.toEmail,
      subject: body.subject,
      text: body.body,
      html: body.body.replace(/\n/g, "<br/>"),
    });

    const log = await db.sentEmail.create({
      data: {
        toEmail: body.toEmail,
        subject: body.subject,
        body: body.body,
        status: "sent",
        relatedBookingId: body.relatedBookingId ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      simulated: false,
      messageId: info.messageId,
      log,
    });
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Unknown SMTP error";
    const log = await db.sentEmail.create({
      data: {
        toEmail: body.toEmail,
        subject: body.subject,
        body: body.body,
        status: "failed",
        relatedBookingId: body.relatedBookingId ?? null,
      },
    });
    return NextResponse.json(
      { ok: false, error: errorMsg, log },
      { status: 502 }
    );
  }
}
