"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  Search,
  Star,
  Phone,
  CalendarCheck,
  Truck,
  ShieldCheck,
  Clock,
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
import { useServices } from "@/lib/api-hooks";
import { BRAND } from "@/lib/brand";
import { formatPriceRange } from "@/lib/format";
import { cn } from "@/lib/utils";

function StarRating({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-slate-600"
          )}
        />
      ))}
    </div>
  );
}

const TRUST_BADGES = [
  { icon: Star, label: `${BRAND.rating}★ Rating`, sub: "Verified" },
  { icon: ShieldCheck, label: `${BRAND.reviewCount}+ Reviews`, sub: "On Google" },
  { icon: Award, label: "12+ Years", sub: "Experience" },
  { icon: Truck, label: "Free Collection", sub: "Doorstep" },
];

const STATS = [
  { icon: Wrench, value: "10,000+", label: "Devices Repaired" },
  { icon: Star, value: `${BRAND.rating}★`, label: "Average Rating" },
  { icon: Zap, value: "30 min", label: "Avg. Turnaround" },
  { icon: TrendingUp, value: `${BRAND.reviewCount}+`, label: "Google Reviews" },
];

export function Hero() {
  const openBooking = useAppStore((s) => s.openBooking);
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const { data: services, isLoading } = useServices(true);

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
      <div className="pointer-events-none absolute -right-32 top-40 h-72 w-72 rounded-full bg-amber-500/10 blur-[100px]" />

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
              Phones, laptops, MacBooks, consoles, GHDs &amp; data recovery —
              fixed by certified technicians with honest pricing and a{" "}
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
                className="bg-amber-400 text-slate-950 hover:bg-amber-300 font-semibold shadow-lg shadow-amber-500/25"
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
                <a href={`tel:${BRAND.phones[1].replace(/\s+/g, "")}`}>
                  <Phone className="size-5 text-primary" />
                  Call Now
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TRUST_BADGES.map((b) => (
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
              <div className="absolute -top-3 right-5 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-950 shadow-lg">
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
                          openBooking({ serviceSlug: s.slug });
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
                {STATS.map((s) => (
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

              <button
                onClick={() => setPublicPage("services")}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                Browse all services
                <ChevronRight className="size-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
