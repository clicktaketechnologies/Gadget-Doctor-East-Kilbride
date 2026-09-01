"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  Search,
  Star,
  Phone,
  CalendarCheck,
  Truck,
  ShieldCheck,
  Award,
  Zap,
  Wrench,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/icon";
import { useAppStore } from "@/lib/store";
import { useBranding, useServices } from "@/lib/api-hooks";
import { BRAND, SERVICE_CATEGORIES } from "@/lib/brand";
import { formatPriceRange } from "@/lib/format";

export function Hero() {
  const openBooking = useAppStore((s) => s.openBooking);
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const openServiceDetail = useAppStore((s) => s.openServiceDetail);
  const { data: services, isLoading } = useServices(true);
  const { data: branding } = useBranding();

  const phone = branding?.phone ?? BRAND.phones[0];
  const phoneDigits = phone.replace(/\s+/g, "");
  const rating = branding?.rating ?? BRAND.rating;
  const reviewCount = branding?.reviewCount ?? BRAND.reviewCount;
  const businessName = branding?.businessName ?? BRAND.fullName;

  // Build category quick-links from branding categories
  const categoryLinks = SERVICE_CATEGORIES;

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    if (!services) return [];
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return services
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, services]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-40 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: copy + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Open now · East Kilbride
            </div>

            <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="text-gradient-cyan">Fast &amp; Reliable</span>{" "}
              Electronics Repair in East Kilbride
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Phones, tablets, laptops, MacBooks, computers, custom PCs,
              consoles &amp; Apple Watch — fixed by certified technicians with
              honest pricing and a{" "}
              <span className="font-semibold text-foreground">
                12-month warranty
              </span>{" "}
              on every repair.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => openBooking()}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25"
              >
                <CalendarCheck className="size-5" />
                Book Your Repair
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
              >
                <a href={`tel:${phoneDigits}`}>
                  <Phone className="size-5 text-primary" />
                  Call Now
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Star, label: `${rating}★ Rating`, sub: "Verified" },
                { icon: ShieldCheck, label: `${reviewCount}+ Reviews`, sub: "On Google" },
                { icon: Award, label: "12+ Years", sub: "Experience" },
                { icon: Truck, label: "Free Collection", sub: "Doorstep" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2.5 rounded-lg border border-border bg-card/40 p-2.5"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    <b.icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {b.label}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {b.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: quick repair search */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="glass-strong glow-cyan relative rounded-2xl p-6 shadow-2xl shadow-black/40">
              {/* Floating badge */}
              <div className="absolute -top-3 right-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground shadow-lg shadow-primary/30">
                <Zap className="size-3" />
                60-sec quote
              </div>

              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Search className="size-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Find your repair
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Search by device or issue
                  </p>
                </div>
              </div>

              {/* Search box */}
              <div ref={wrapRef} className="relative mt-4">
                <Input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  placeholder="e.g. iPhone screen, PS5 HDMI, MacBook battery…"
                  className="h-11 border-primary/30 bg-background/60 text-sm placeholder:text-muted-foreground"
                  aria-label="Search repairs"
                />
                {open && matches.length > 0 && (
                  <div className="custom-scroll absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl">
                    {matches.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setOpen(false);
                          setQuery("");
                          openServiceDetail(s.category);
                          if (typeof window !== "undefined") {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-primary/10"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
                          <Icon name={s.icon} className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {s.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {s.turnaround}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-primary">
                          {formatPriceRange(s.priceFrom, s.priceTo)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {open && query.trim() && matches.length === 0 && !isLoading && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-border bg-card/95 p-4 text-center text-sm text-muted-foreground shadow-2xl backdrop-blur-xl">
                    No matches —{" "}
                    <button
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                        openBooking();
                      }}
                      className="font-semibold text-primary hover:underline"
                    >
                      book a custom repair →
                    </button>
                  </div>
                )}
              </div>

              {/* Stats grid */}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                {[
                  { icon: Wrench, value: "10,000+", label: "Devices Repaired" },
                  { icon: Star, value: `${rating}★`, label: "Average Rating" },
                  { icon: Zap, value: "30 min", label: "Avg. Turnaround" },
                  { icon: TrendingUp, value: `${reviewCount}+`, label: "Google Reviews" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-border bg-background/40 p-3"
                  >
                    <s.icon className="size-4 text-primary" />
                    <p className="mt-1.5 text-lg font-bold text-foreground">
                      {s.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Category quick-links */}
              <div className="mt-5">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Popular categories
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {categoryLinks.slice(0, 6).map((c) => (
                    <button
                      key={c.value}
                      onClick={() => {
                        openServiceDetail(c.value);
                        if (typeof window !== "undefined") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                    >
                      <Icon name={c.icon} className="size-3" />
                      {c.shortLabel}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setPublicPage("services")}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                Browse all services
                <ChevronRight className="size-4" />
              </button>
              {/* Hidden helper: businessName is rendered in the page title elsewhere; keep reference for SEO/screen readers */}
              <span className="sr-only">{businessName}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
