"use client";

import {
  Wrench,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
} from "lucide-react";
import { useAppStore, type PublicPage } from "@/lib/store";
import { BRAND, SERVICE_CATEGORIES } from "@/lib/brand";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const NAV: { label: string; page: PublicPage }[] = [
  { label: "Home", page: "home" },
  { label: "Services", page: "services" },
  { label: "Collection Service", page: "collection" },
  { label: "Reviews", page: "reviews" },
  { label: "Contact", page: "contact" },
];

export function Footer() {
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const openBooking = useAppStore((s) => s.openBooking);
  const go = (p: PublicPage) => {
    setPublicPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Wrench className="size-5" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold text-foreground">
                  {BRAND.name}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
                  East Kilbride
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {BRAND.fullName} — your trusted local specialist for phone,
              laptop, console, MacBook, GHD and data recovery repairs. Fast
              turnaround, honest pricing and free doorstep collection across
              East Kilbride.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Facebook, Instagram, Twitter].map((IconCmp, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social media"
                  className="grid size-9 place-items-center rounded-lg border border-border bg-background/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <IconCmp className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => go(item.page)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
              Repairs We Offer
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {SERVICE_CATEGORIES.map((c) => (
                <li key={c.value}>
                  <button
                    onClick={() => go("services")}
                    className="flex items-center gap-2 text-left text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Icon
                      name={c.icon}
                      className="size-3.5 text-primary"
                    />
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
              Get In Touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{BRAND.address}</span>
              </li>
              {BRAND.phones.map((p) => (
                <li key={p}>
                  <a
                    href={`tel:${p.replace(/\s+/g, "")}`}
                    className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="size-4 shrink-0 text-primary" />
                    {p}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="size-4 shrink-0 text-primary" />
                  {BRAND.email}
                </a>
              </li>
            </ul>

            <h3 className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
              <Clock className="size-3.5 text-primary" />
              Opening Hours
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {BRAND.hours.map((h) => (
                <li
                  key={h.day}
                  className="flex justify-between gap-2 text-muted-foreground"
                >
                  <span>{h.day}</span>
                  <span
                    className={cn(
                      "font-medium",
                      h.time === "Closed" ? "text-rose-400" : "text-foreground"
                    )}
                  >
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-background/40 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Got a gadget that needs fixing?
            </p>
            <p className="text-xs text-muted-foreground">
              Book your repair in under 60 seconds — we&apos;ll handle the rest.
            </p>
          </div>
          <button
            onClick={() => openBooking()}
            className="group inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-colors hover:bg-amber-300"
          >
            Book a Repair
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Registered in Scotland</span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
