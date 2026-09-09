"use client";

import { useState } from "react";
import {
  Mail,
  Server,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Inbox,
  ShieldCheck,
  Send,
} from "lucide-react";
import {
  useEmailSettings,
  useUpdateEmailSettings,
  useEmailLog,
  useTestEmail,
} from "@/lib/api-hooks";
import type { EmailSettings, UpdateEmailSettingsInput } from "@/lib/types";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PASSWORD_MASK = "••••••••";

const STATUS_BADGE: Record<string, string> = {
  sent: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  failed: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  queued: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  simulated: "bg-blue-500/15 text-blue-300 border-blue-500/30",
};

export function EmailSettings() {
  const settingsQ = useEmailSettings();
  const logQ = useEmailLog();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Email Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure SMTP to send status updates and replies to customers.
        </p>
      </div>

      {/* SMTP card */}
      {settingsQ.isLoading || !settingsQ.data ? (
        <Card className="glass p-5">
          <Skeleton className="h-6 w-40 rounded" />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded" />
            ))}
          </div>
        </Card>
      ) : (
        // Key by full server data so the form remounts (and local state resets)
        // whenever settings are saved + refetched.
        <SmtpCard
          key={`smtp-${JSON.stringify(settingsQ.data)}`}
          settings={settingsQ.data}
        />
      )}

      {/* Test email card */}
      {settingsQ.data && <TestEmailCard settings={settingsQ.data} />}

      {/* Log card */}
      <EmailLogCard />
    </div>
  );
}

function TestEmailCard({ settings }: { settings: EmailSettings }) {
  const testMutation = useTestEmail();
  const [testEmail, setTestEmail] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message?: string; error?: string; hint?: string } | null>(null);

  const handleTest = () => {
    if (!testEmail) return;
    setResult(null);
    testMutation.mutate(testEmail, {
      onSuccess: (data) => {
        setResult({ ok: true, message: data.message });
      },
      onError: (err: Error & { hint?: string }) => {
        setResult({ ok: false, error: err.message, hint: err.hint });
      },
    });
  };

  const isConfigured =
    settings.enabled &&
    settings.host &&
    settings.user &&
    settings.password &&
    settings.fromEmail;

  return (
    <Card className="glass flex flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
          <Send className="size-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Test Email</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Send a test email to verify your SMTP settings are working.
          </p>
        </div>
        {isConfigured ? (
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Check className="mr-1 size-3" /> Configured
          </Badge>
        ) : (
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400">
            <AlertCircle className="mr-1 size-3" /> Not configured
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="test-email" className="text-xs">Send test email to</Label>
          <Input
            id="test-email"
            type="email"
            placeholder="your-email@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            disabled={testMutation.isPending}
          />
        </div>
        <Button
          onClick={handleTest}
          disabled={!testEmail || testMutation.isPending}
          className="gap-2"
        >
          {testMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending test…
            </>
          ) : (
            <>
              <Send className="size-4" />
              Send Test Email
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className={cn(
          "rounded-lg border p-3 text-sm",
          result.ok
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            : "border-rose-500/30 bg-rose-500/10 text-rose-300"
        )}>
          <div className="flex items-start gap-2">
            {result.ok ? (
              <Check className="size-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-medium">{result.ok ? "Success!" : "Failed"}</p>
              {result.message && <p className="mt-1 text-xs">{result.message}</p>}
              {result.error && <p className="mt-1 text-xs font-mono">{result.error}</p>}
              {result.hint && <p className="mt-2 text-xs text-amber-300">💡 {result.hint}</p>}
            </div>
          </div>
        </div>
      )}

      {!isConfigured && (
        <p className="text-xs text-muted-foreground">
          ⚠️ SMTP is not fully configured or is disabled. Save your settings above
          (with the Enable toggle ON) before testing.
        </p>
      )}
    </Card>
  );
}

function SmtpCard({ settings }: { settings: EmailSettings }) {
  const updateMutation = useUpdateEmailSettings();

  const [enabled, setEnabled] = useState(settings.enabled);
  const [host, setHost] = useState(settings.host);
  const [port, setPort] = useState<string>(String(settings.port));
  const [secure, setSecure] = useState(settings.secure);
  const [user, setUser] = useState(settings.user);
  // Password starts as the mask; only sent if user replaces it.
  const [password, setPassword] = useState(
    settings.password ? PASSWORD_MASK : ""
  );
  const [fromEmail, setFromEmail] = useState(settings.fromEmail);
  const [fromName, setFromName] = useState(settings.fromName);

  const dirty =
    enabled !== settings.enabled ||
    host !== settings.host ||
    port !== String(settings.port) ||
    secure !== settings.secure ||
    user !== settings.user ||
    (settings.password ? password !== PASSWORD_MASK : password !== "") ||
    fromEmail !== settings.fromEmail ||
    fromName !== settings.fromName;

  const handleSave = () => {
    const payload: UpdateEmailSettingsInput = {
      enabled,
      host: host.trim(),
      port: Number(port) || 587,
      secure,
      user: user.trim(),
      fromEmail: fromEmail.trim(),
      fromName: fromName.trim(),
    };
    // Only send password if the user actually changed it away from the mask.
    if (password && password !== PASSWORD_MASK) {
      payload.password = password;
    }
    updateMutation.mutate(payload);
  };

  const handleReset = () => {
    setEnabled(settings.enabled);
    setHost(settings.host);
    setPort(String(settings.port));
    setSecure(settings.secure);
    setUser(settings.user);
    setPassword(settings.password ? PASSWORD_MASK : "");
    setFromEmail(settings.fromEmail);
    setFromName(settings.fromName);
  };

  return (
    <Card className="glass flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
            <Server className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              SMTP Configuration
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              When disabled, emails are simulated and logged but not actually
              sent.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            aria-label="Enable email sending"
          />
          <span className="text-sm font-medium text-foreground">
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="smtp-host">SMTP host</Label>
          <Input
            id="smtp-host"
            placeholder="smtp.gmail.com"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="smtp-port">Port</Label>
          <Input
            id="smtp-port"
            type="number"
            min={1}
            max={65535}
            placeholder="587"
            value={port}
            onChange={(e) => setPort(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="smtp-user">Username</Label>
          <Input
            id="smtp-user"
            placeholder="you@example.com"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="smtp-pass">Password</Label>
          <Input
            id="smtp-pass"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <p className="text-[11px] text-muted-foreground">
            Saved password is masked. Type a new value to replace it.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="smtp-from-email">From email</Label>
          <Input
            id="smtp-from-email"
            type="email"
            placeholder="no-reply@gadgetdoctoreastkilbride.co.uk"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="smtp-from-name">From name</Label>
          <Input
            id="smtp-from-name"
            placeholder="Gadget Doctor East Kilbride"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/20 p-3">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 size-4 text-primary" />
          <div>
            <div className="text-sm font-medium text-foreground">
              Use SSL/TLS
            </div>
            <div className="text-xs text-muted-foreground">
              Enable for port 465 (SSL). For port 587 (STARTTLS), this is
              typically off.
            </div>
          </div>
        </div>
        <Switch
          checked={secure}
          onCheckedChange={setSecure}
          aria-label="Toggle SSL/TLS"
        />
      </div>

      {/* Provider hints */}
      <div className="rounded-lg border border-border/60 bg-secondary/20 p-3 text-xs text-muted-foreground">
        <div className="mb-1 font-medium text-foreground">
          Common providers
        </div>
        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          <li>
            <span className="font-medium">Gmail:</span> smtp.gmail.com:587
            (STARTTLS)
          </li>
          <li>
            <span className="font-medium">Outlook / 365:</span>{" "}
            smtp.office365.com:587
          </li>
          <li>
            <span className="font-medium">Yahoo:</span> smtp.mail.yahoo.com:587
          </li>
          <li>
            <span className="font-medium">Zoho:</span> smtp.zoho.com:465 (SSL)
          </li>
        </ul>
      </div>

      {updateMutation.isError && (
        <div className="flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          <AlertCircle className="size-4 shrink-0" />
          <span>{updateMutation.error?.message ?? "Save failed"}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
        <Button
          onClick={handleSave}
          disabled={!dirty || updateMutation.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : updateMutation.isSuccess && !dirty ? (
            <>
              <Check className="size-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Settings
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={!dirty || updateMutation.isPending}
        >
          Reset
        </Button>
      </div>
    </Card>
  );
}

function EmailLogCard() {
  const logQ = useEmailLog();
  const emails = logQ.data ?? [];

  return (
    <Card className="glass p-0">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
            <Inbox className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Sent Email Log
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Last 50 emails sent from this admin (including simulated sends).
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-border/60">
          {emails.length} entr{emails.length === 1 ? "y" : "ies"}
        </Badge>
      </div>

      <div className="overflow-x-auto custom-scroll">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="pl-4">To</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ticket</TableHead>
              <TableHead className="pr-4 text-right">Sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logQ.isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-border/60">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j} className={j === 0 ? "pl-4" : j === 4 ? "pr-4" : ""}>
                      <Skeleton className="h-4 w-full max-w-[140px] rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : emails.length === 0 ? (
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableCell colSpan={5} className="h-32 text-center text-sm text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Mail className="size-7 text-muted-foreground/50" />
                    <div>No emails sent yet.</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              emails.map((e) => (
                <TableRow key={e.id} className="border-border/60">
                  <TableCell className="pl-4">
                    <div className="truncate text-sm text-foreground">
                      {e.toEmail}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[280px] truncate text-sm text-foreground">
                      {e.subject}
                    </div>
                    <div className="max-w-[280px] truncate text-xs text-muted-foreground">
                      {e.body.slice(0, 80)}
                      {e.body.length > 80 ? "…" : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border capitalize",
                        STATUS_BADGE[e.status] ??
                          "bg-slate-500/15 text-slate-300 border-slate-500/30"
                      )}
                    >
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {e.relatedBookingId ? (
                      <span className="font-mono">
                        {e.relatedBookingId.slice(0, 8)}
                      </span>
                    ) : (
                      <span>—</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-4 text-right text-xs text-muted-foreground">
                    {relativeTime(e.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default EmailSettings;
