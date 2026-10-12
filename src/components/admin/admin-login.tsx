"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useAdminLogin } from "@/lib/api-hooks";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LOGO_URL = "/gadget-doctor-logo.jpg";

export function AdminLogin() {
  const router = useRouter();
  const login = useAdminLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login.mutate({ email, password });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Background layers */}
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, oklch(0.62 0.24 27 / 0.20), transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "oklch(0.62 0.24 27 / 0.28)" }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to website
        </button>

        <div className="glass-strong rounded-2xl p-7 shadow-2xl shadow-black/40 sm:p-8">
          {/* Brand */}
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg shadow-primary/30 ring-1 ring-border/60">
              <img
                src={LOGO_URL}
                alt="Gadget Doctor East Kilbride logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  const t = e.currentTarget as HTMLImageElement;
                  t.style.display = "none";
                  const parent = t.parentElement;
                  if (parent) {
                    parent.classList.remove("bg-white");
                    parent.classList.add("bg-primary", "text-primary-foreground");
                  }
                }}
              />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Gadget Doctor <span className="text-gradient-cyan">Admin</span>
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {BRAND.fullName} · Control Center
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@gadgetdoctor.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  disabled={login.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  disabled={login.isPending}
                />
              </div>
            </div>

            {login.isError && (
              <div
                role="alert"
                className="flex flex-col gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>
                    {login.error?.message ?? "Invalid credentials. Please try again."}
                  </span>
                </div>
                {"Failed to fetch" === login.error?.message && (
                  <a
                    href="https://gadget-doctor-east-kilbride.onrender.com/admin"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    → Click here to access the admin dashboard directly
                  </a>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={login.isPending || !email || !password}
              className="w-full"
            >
              {login.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Authorized personnel only · {BRAND.fullName}
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
