import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Wrench, Search, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found — Gadget Doctor East Kilbride",
  description:
    "The page you're looking for doesn't exist or has been moved. Go back to the home page, browse our repair services, track your repair, or contact us.",
  robots: { index: false, follow: true },
};

/**
 * Custom 404 page — shown when a broken/unknown link is visited.
 *
 * Features:
 *   - Branded (Gadget Doctor logo + business name)
 *   - Large "404" + "Not Found" heading
 *   - Prominent "Go to Home" button (real shadcn <Button> asChild anchor)
 *   - Quick links to the most popular pages (Services, Track, Contact)
 *   - noindex, follow (so Google de-indexes the 404 but still follows links)
 *
 * NOTE: known old paths (e.g. /about-us, /locations) are 301-redirected at the
 * Firebase Hosting level (see firebase.json) — they never reach this page.
 * This page only renders for genuinely unknown paths.
 */
export default function NotFound() {
  const quickLinks = [
    {
      href: "/services",
      label: "Browse Services",
      desc: "Phone, laptop, MacBook, console & watch repairs",
      icon: Wrench,
    },
    {
      href: "/track",
      label: "Track Your Repair",
      desc: "Enter your ticket ID (GD-XXXX)",
      icon: Search,
    },
    {
      href: "/contact",
      label: "Contact Us",
      desc: "Call, email or visit the East Kilbride workshop",
      icon: Phone,
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Decorative background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--primary, #E31E24) 0%, transparent 70%)",
        }}
      />

      <main className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2.5"
          aria-label="Gadget Doctor East Kilbride — Home"
        >
          <img
            src="/gadget-doctor-logo.jpg"
            alt="Gadget Doctor East Kilbride logo"
            className="h-12 w-12 rounded-lg object-contain shadow-lg"
            width={48}
            height={48}
          />
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-foreground">
              Gadget Doctor
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
              East Kilbride
            </span>
          </span>
        </Link>

        {/* 404 + heading */}
        <p className="text-8xl font-black tracking-tighter text-primary sm:text-9xl">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
          Not Found
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or may have
          been moved. The link might be broken or the page may have been
          renamed.
        </p>

        {/* Primary CTA — prominent "Go to Home" button */}
        <Button
          asChild
          size="lg"
          className="mt-8 h-12 gap-2 bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
        >
          <Link href="/">
            <Home className="size-5" />
            Go to Home
            <ArrowRight className="size-4" />
          </Link>
        </Button>

        {/* Secondary quick links */}
        <div className="mt-12 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col items-start gap-1 rounded-xl border border-border bg-card/50 p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="mb-1 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {link.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {link.desc}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Footer help line */}
        <p className="mt-10 text-xs text-muted-foreground">
          Still stuck? Call us on{" "}
          <a
            href="tel:+441355458135"
            className="font-medium text-primary hover:underline"
          >
            +44 1355 458135
          </a>{" "}
          during opening hours.
        </p>
      </main>
    </div>
  );
}
