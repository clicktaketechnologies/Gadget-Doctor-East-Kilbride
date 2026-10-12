"use client";

import { useState } from "react";
import {
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Check,
  Palette,
  Building2,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useChangePassword, useBranding } from "@/lib/api-hooks";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminSettings() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account credentials and access branding configuration.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChangePasswordCard />
        <BrandingQuickAccessCard />
      </div>
    </div>
  );
}

function ChangePasswordCard() {
  const mutation = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setValidationError(null);
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!currentPassword) {
      setValidationError("Enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setValidationError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("New password and confirmation do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setValidationError(
        "New password must be different from your current password."
      );
      return;
    }

    mutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  const apiError = mutation.isError
    ? mutation.error?.message ?? "Could not change password."
    : null;
  const errorText = validationError ?? apiError;
  const showSuccess = mutation.isSuccess && !errorText && !validationError;

  const canSubmit =
    !!currentPassword &&
    !!newPassword &&
    !!confirmPassword &&
    !mutation.isPending;

  return (
    <Card className="glass flex flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
          <KeyRound className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Change Password
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Update your admin credentials. You&apos;ll stay signed in with the
            new token.
          </p>
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          id="pw-current"
          label="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
          show={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
          autoComplete="current-password"
          placeholder="Enter current password"
        />
        <PasswordInput
          id="pw-new"
          label="New password"
          value={newPassword}
          onChange={setNewPassword}
          show={showNew}
          onToggle={() => setShowNew((v) => !v)}
          autoComplete="new-password"
          placeholder="At least 6 characters"
          hint="Minimum 6 characters."
        />
        <PasswordInput
          id="pw-confirm"
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
          autoComplete="new-password"
          placeholder="Re-enter new password"
        />

        {errorText && (
          <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{errorText}</span>
          </div>
        )}

        {showSuccess && (
          <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            <Check className="size-4 shrink-0" />
            <span>Password updated successfully.</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
          <Button
            type="submit"
            disabled={!canSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Updating…
              </>
            ) : (
              <>
                <ShieldCheck className="size-4" />
                Update Password
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={mutation.isPending}
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}

function PasswordInput({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="pr-10"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function BrandingQuickAccessCard() {
  const brandingQ = useBranding();
  const setAdminModule = useAppStore((s) => s.setAdminModule);

  if (brandingQ.isLoading) {
    return (
      <Card className="glass p-5">
        <div className="flex items-start gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-48 rounded" />
          </div>
        </div>
        <Separator className="my-4" />
        <Skeleton className="h-20 rounded-lg" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Skeleton className="h-14 rounded-lg" />
          <Skeleton className="h-14 rounded-lg" />
        </div>
      </Card>
    );
  }

  if (brandingQ.isError || !brandingQ.data) {
    return (
      <Card className="glass flex flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
            <Palette className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Branding</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Couldn&apos;t load branding. Open the Branding module to manage
              your business identity.
            </p>
          </div>
        </div>
        <Button
          onClick={() => setAdminModule("branding")}
          className="self-start bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Go to Branding
          <ChevronRight className="size-4" />
        </Button>
      </Card>
    );
  }

  const b = brandingQ.data;

  return (
    <Card className="glass flex flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
          <Palette className="size-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">
            Branding Quick Access
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Snapshot of your live business identity. Edit in the Branding
            module.
          </p>
        </div>
      </div>

      <Separator />

      {/* Logo + business name + colors */}
      <div className="flex items-center gap-4 rounded-lg border border-border/60 bg-secondary/20 p-3">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1 ring-1 ring-border/60">
          {b.logoUrl ? (
            <img
              src={b.logoUrl}
              alt={`${b.businessName || "Business"} logo`}
              className="h-full w-full object-contain"
            />
          ) : (
            <Building2 className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-foreground">
            {b.businessName || "—"}
          </div>
          {b.tagline && (
            <div className="truncate text-xs text-muted-foreground">
              {b.tagline}
            </div>
          )}
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-0.5 ring-1 ring-border/60"
              title="Primary colour"
            >
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: b.primaryColor }}
                aria-hidden
              />
              <span className="font-mono text-[10px] text-muted-foreground">
                {b.primaryColor}
              </span>
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-0.5 ring-1 ring-border/60"
              title="Secondary colour"
            >
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: b.secondaryColor }}
                aria-hidden
              />
              <span className="font-mono text-[10px] text-muted-foreground">
                {b.secondaryColor}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Contact details */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2">
          <Phone className="size-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Phone
            </div>
            <div className="truncate text-sm text-foreground">
              {b.phone || "—"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2">
          <Mail className="size-4 shrink-0 text-accent" />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Email
            </div>
            <div className="truncate text-sm text-foreground">
              {b.email || "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4">
        <span className="text-xs text-muted-foreground">
          Manage identity, contact, hours &amp; socials in the Branding module.
        </span>
        <Button
          onClick={() => setAdminModule("branding")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Edit Branding
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </Card>
  );
}

export default AdminSettings;
