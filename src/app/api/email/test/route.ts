import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/email/test (admin) — tests the SMTP connection + sends a test email
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { toEmail: string };
  const testEmail = body.toEmail;

  if (!testEmail) {
    return NextResponse.json({ error: "Missing toEmail" }, { status: 400 });
  }

  const settings = await db.emailSettings.findUnique({ where: { id: "singleton" } });

  // Check if SMTP is configured
  if (!settings) {
    return NextResponse.json({
      ok: false,
      configured: false,
      error: "Email settings not found. Save your SMTP settings first.",
    }, { status: 400 });
  }

  if (!settings.enabled) {
    return NextResponse.json({
      ok: false,
      configured: false,
      enabled: false,
      error: "Email sending is DISABLED. Toggle 'Enable email sending' ON in Email Settings.",
    }, { status: 400 });
  }

  const missing: string[] = [];
  if (!settings.host) missing.push("SMTP Host");
  if (!settings.user) missing.push("SMTP Username");
  if (!settings.password) missing.push("SMTP Password");
  if (!settings.fromEmail) missing.push("From Email");
  if (missing.length > 0) {
    return NextResponse.json({
      ok: false,
      configured: false,
      error: `SMTP not fully configured. Missing: ${missing.join(", ")}.`,
    }, { status: 400 });
  }

  // Try to connect + send a test email
  try {
    const nodemailer = (await import("nodemailer")).default;

    // For port 465, force secure=true (SSL). For 587, use STARTTLS.
    const useSecure = settings.port === 465 ? true : settings.secure;

    const transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: useSecure,
      auth: { user: settings.user, pass: settings.password },
      // Don't fail on self-signed certs (common with cPanel hosts)
      tls: { rejectUnauthorized: false },
      // Timeout so it doesn't hang forever
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    // Verify the connection
    await transporter.verify();

    // Send the test email
    const info = await transporter.sendMail({
      from: `"${settings.fromName}" <${settings.fromEmail}>`,
      to: testEmail,
      subject: "✅ Gadget Doctor — Test Email (SMTP Working)",
      text: `This is a test email from Gadget Doctor East Kilbride admin panel.

If you received this email, your SMTP settings are configured correctly!

Settings used:
- Host: ${settings.host}
- Port: ${settings.port}
- Secure: ${settings.secure}
- User: ${settings.user}
- From: ${settings.fromName} <${settings.fromEmail}>

Sent at: ${new Date().toISOString()}`,
      html: `<div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
<h2 style="color: #E31E24;">✅ Test Email Successful</h2>
<p>This is a test email from <strong>Gadget Doctor East Kilbride</strong> admin panel.</p>
<p>If you received this email, your SMTP settings are configured correctly!</p>
<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
<h3>Settings used:</h3>
<ul>
<li><strong>Host:</strong> ${settings.host}</li>
<li><strong>Port:</strong> ${settings.port}</li>
<li><strong>Secure:</strong> ${settings.secure ? "Yes (SSL/TLS)" : "No (STARTTLS)"}</li>
<li><strong>User:</strong> ${settings.user}</li>
<li><strong>From:</strong> ${settings.fromName} &lt;${settings.fromEmail}&gt;</li>
</ul>
<p style="color: #888; font-size: 12px; margin-top: 20px;">Sent at: ${new Date().toISOString()}</p>
</div>`,
    });

    // Log the test email
    await db.sentEmail.create({
      data: {
        toEmail: testEmail,
        subject: "✅ Gadget Doctor — Test Email (SMTP Working)",
        body: "Test email — SMTP connection verified successfully.",
        status: "sent",
      },
    });

    return NextResponse.json({
      ok: true,
      messageId: info.messageId,
      message: `Test email sent to ${testEmail}! Check your inbox (and spam folder).`,
    });
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Unknown SMTP error";
    return NextResponse.json({
      ok: false,
      configured: true,
      enabled: true,
      error: errorMsg,
      hint: getSmtpErrorHint(errorMsg, settings.host),
    }, { status: 502 });
  }
}

function getSmtpErrorHint(error: string, host: string): string {
  const e = error.toLowerCase();
  if (e.includes("ea01") || e.includes("invalid login") || e.includes("535") || e.includes("authentication") || e.includes("username and password not accepted")) {
    if (host.includes("gmail") || host.includes("google")) {
      return "Gmail authentication failed. You need an App Password (not your regular password). Enable 2-Step Verification → generate an App Password at https://myaccount.google.com/apppasswords";
    }
    return "Authentication failed. Check the username and password are correct. For cPanel email, use the FULL email address as the username (e.g. info@gadgetdoctorls.co.uk) and the exact email account password.";
  }
  if (e.includes("connect etimedout") || e.includes("connection timeout") || e.includes("etimedout")) {
    return `Connection timed out to ${host}. The SMTP server may be blocking Render's IP, or the host/port is wrong. For cPanel: host=mail.gadgetdoctorls.co.uk, port=465, Secure=ON. If it still times out, your host may be blocking outbound SMTP — ask your hosting provider to allow outbound connections on port 465.`;
  }
  if (e.includes("econnrefused")) {
    return `Connection refused to ${host}:${e}. The SMTP server rejected the connection. Check the port (465 for SSL, 587 for STARTTLS) and that the server accepts external connections.`;
  }
  if (e.includes("self signed") || e.includes("certificate") || e.includes("tls") || e.includes("ssl")) {
    return "SSL/TLS issue. For port 465, set Secure=ON (SSL). For port 587, set Secure=OFF (STARTTLS). The code now automatically handles this, but if it persists, try the other port.";
  }
  if (e.includes("enotfound") || e.includes("getaddrinfo")) {
    return `Cannot resolve host "${host}". Check the SMTP host spelling. For cPanel email, the host is usually mail.yourdomain.com (e.g. mail.gadgetdoctorls.co.uk).`;
  }
  if (e.includes("eai_again") || e.includes("temporary failure")) {
    return `Temporary DNS failure resolving "${host}". Try again in a moment. If it persists, the host may be wrong.`;
  }
  return "Check your SMTP settings. For cPanel email: Host=mail.gadgetdoctorls.co.uk, Port=465, Secure=ON, User=full email address, Password=email account password. See the full error above for details.";
}
