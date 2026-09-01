"use client";

import { useEffect, useMemo } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Phone,
  CalendarCheck,
  Clock,
  ShieldCheck,
  Truck,
  Wrench,
  Check,
  ChevronRight,
  Home,
  Star,
  Sparkles,
  Zap,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { useAppStore } from "@/lib/store";
import { useBranding, useServices } from "@/lib/api-hooks";
import { BRAND, SERVICE_CATEGORIES } from "@/lib/brand";
import { formatPriceRange } from "@/lib/format";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ----------------------------- Why Choose cards ------------------------- */

const WHY_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Genuine-grade parts",
    desc: "We use OEM-equivalent components, rigorously tested — never cheap knock-offs that fail in a month.",
  },
  {
    icon: Award,
    title: "12-month warranty",
    desc: "Every repair is backed by a full year's warranty on parts and labour. No quibbles, no fine print.",
  },
  {
    icon: Zap,
    title: "Fast turnaround",
    desc: "Most fixes completed same-day. We respect your time and your device — you'll be back up and running fast.",
  },
  {
    icon: Truck,
    title: "Free collection",
    desc: "Too busy to drop off? We'll collect and return your device for free across East Kilbride & nearby.",
  },
];

/* ----------------------------- Process steps ---------------------------- */

const PROCESS_STEPS = [
  {
    n: 1,
    icon: Phone,
    title: "Book online or call",
    desc: "Pick your device, describe the issue, and choose drop-off or free collection — under 60 seconds.",
  },
  {
    n: 2,
    icon: Truck,
    title: "Drop off or collection",
    desc: "Bring it to our East Kilbride workshop, or our driver comes to you. Free pickup across the local area.",
  },
  {
    n: 3,
    icon: Wrench,
    title: "We diagnose & fix",
    desc: "Certified technicians diagnose the fault, fix it with genuine-grade parts, and run full quality tests.",
  },
  {
    n: 4,
    icon: Check,
    title: "Collect or return",
    desc: "We'll call when it's ready. Pick it up at the shop or we'll deliver it back — pay only if you're happy.",
  },
];

/* --------------------------- Sub-service card --------------------------- */

function SubServiceCard({ service, index }: { service: Service; index: number }) {
  const openBooking = useAppStore((s) => s.openBooking);
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
          <Icon name={service.icon} className="size-5" />
        </span>
        {service.popular && (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-amber-300"
          >
            <Star className="size-3 fill-amber-400 text-amber-400" />
            Popular
          </Badge>
        )}
      </div>
      <h3 className="mt-4 text-base font-bold text-foreground">
        {service.name}
      </h3>
      <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {service.description}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-foreground">
          {formatPriceRange(service.priceFrom, service.priceTo)}
        </span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Clock className="size-3.5 text-primary" />
          {service.turnaround}
        </span>
      </div>
      <Button
        onClick={() => openBooking({ serviceSlug: service.slug })}
        size="sm"
        className="mt-4 w-full justify-center bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/15"
      >
        <CalendarCheck className="size-4" />
        Book Fix
      </Button>
    </motion.article>
  );
}

function SubServiceSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="animate-shimmer size-11 rounded-xl bg-muted" />
      <div className="animate-shimmer mt-4 h-4 w-3/4 rounded bg-muted" />
      <div className="animate-shimmer mt-2 h-3 w-full rounded bg-muted" />
      <div className="animate-shimmer mt-1.5 h-3 w-5/6 rounded bg-muted" />
      <div className="animate-shimmer mt-4 h-3 w-1/2 rounded bg-muted" />
      <div className="animate-shimmer mt-4 h-8 w-full rounded bg-muted" />
    </div>
  );
}

/* ------------------------------ Other Services ------------------------- */

function OtherServiceCard({
  value,
  label,
  icon,
  tagline,
  index,
}: {
  value: string;
  label: string;
  icon: string;
  tagline: string;
  index: number;
}) {
  const openServiceDetail = useAppStore((s) => s.openServiceDetail);
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.25) }}
      onClick={() => {
        openServiceDetail(value);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className="group flex flex-col items-start gap-2.5 rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-card/60"
    >
      <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
        <Icon name={icon} className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{tagline}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary">
        View
        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </motion.button>
  );
}

/* ------------------------------- Main Page ------------------------------ */

export function ServiceDetail() {
  const activeServiceCategory = useAppStore((s) => s.activeServiceCategory);
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const openBooking = useAppStore((s) => s.openBooking);
  const openServiceDetail = useAppStore((s) => s.openServiceDetail);
  const { data: branding } = useBranding();
  const { data: services, isLoading } = useServices(true);

  const phone = branding?.phone ?? BRAND.phones[0];
  const businessName = branding?.businessName ?? BRAND.fullName;
  const rating = branding?.rating ?? BRAND.rating;
  const reviewCount = branding?.reviewCount ?? BRAND.reviewCount;

  // Find the active category object
  const category = useMemo(
    () => SERVICE_CATEGORIES.find((c) => c.value === activeServiceCategory),
    [activeServiceCategory]
  );

  // Redirect to services page if no category selected (defensive)
  useEffect(() => {
    if (!activeServiceCategory) {
      setPublicPage("services");
    }
  }, [activeServiceCategory, setPublicPage]);

  // Scroll to top on category change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activeServiceCategory]);

  // Filter services by category
  const subServices = useMemo(() => {
    if (!services || !category) return [];
    return services.filter((s) => s.category === category.value);
  }, [services, category]);

  // Other categories for "explore" grid
  const otherCategories = useMemo(
    () =>
      SERVICE_CATEGORIES.filter((c) => c.value !== activeServiceCategory),
    [activeServiceCategory]
  );

  if (!category) {
    // Render nothing while effect redirects; avoids flash of broken UI
    return null;
  }

  const phoneDigits = phone.replace(/[^\d+]/g, "");

  return (
    <article className="relative">
      {/* ----------------------------- Hero Section ---------------------------- */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background */}
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-accent/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-20 lg:pt-14">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
          >
            <button
              onClick={() => setPublicPage("home")}
              className="inline-flex items-center gap-1 transition-colors hover:text-primary"
            >
              <Home className="size-3.5" />
              Home
            </button>
            <ChevronRight className="size-3" />
            <button
              onClick={() => setPublicPage("services")}
              className="transition-colors hover:text-primary"
            >
              Services
            </button>
            <ChevronRight className="size-3" />
            <span className="font-medium text-foreground">
              {category.label}
            </span>
          </nav>

          {/* Hero content */}
          <div className="mt-6 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <motion.div
              key={category.value}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="lg:col-span-8"
            >
              <div className="flex items-center gap-4">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30 sm:size-20">
                  <Icon name={category.icon} className="size-8 sm:size-10" />
                </span>
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Sparkles className="size-3.5" />
                    {category.tagline}
                  </span>
                  <h1 className="mt-2 text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                    {category.label}
                  </h1>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {category.description}
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => openBooking({ deviceType: category.value })}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25"
                >
                  <CalendarCheck className="size-5" />
                  Book This Repair
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
                >
                  <a href={`tel:${phoneDigits}`} aria-label={`Call ${businessName}`}>
                    <Phone className="size-5 text-primary" />
                    Call Now · {phone}
                  </a>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">{rating}</span>
                  rating ({reviewCount}+ reviews)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-primary" />
                  12-month warranty
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="size-3.5 text-primary" />
                  Free local collection
                </span>
              </div>
            </motion.div>

            {/* Quick stats card */}
            <motion.div
              key={`stats-${category.value}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="lg:col-span-4"
            >
              <div className="glass-strong glow-cyan rounded-2xl p-5 shadow-xl shadow-black/40">
                <h2 className="text-sm font-bold text-foreground">
                  Why choose {businessName}?
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Trusted local specialists, {BRAND.yearsExperience}+ years
                  of experience.
                </p>
                <ul className="mt-4 space-y-2.5">
                  {[
                    { icon: Award, label: `${BRAND.yearsExperience}+ years in business` },
                    { icon: ShieldCheck, label: "12-month repair warranty" },
                    { icon: Clock, label: "Same-day on most repairs" },
                    { icon: Truck, label: "Free doorstep collection" },
                  ].map((it) => (
                    <li
                      key={it.label}
                      className="flex items-center gap-2.5 text-sm text-foreground"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                        <it.icon className="size-3.5" />
                      </span>
                      {it.label}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --------------------------- Sub-services grid ------------------------ */}
      <section className="relative py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Wrench className="size-3.5" />
              Repair Menu
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {category.label} <span className="text-gradient-cyan">Services</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Transparent pricing, certified technicians, and genuine-grade
              parts. Pick the fix you need and book in seconds.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SubServiceSkeleton key={i} />
                ))
              : subServices.map((s, i) => (
                  <SubServiceCard key={s.id} service={s} index={i} />
                ))}
          </div>

          {!isLoading && subServices.length === 0 && (
            <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center sm:p-14">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
                <Wrench className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">
                Pricing for this category is being updated
              </h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                We&apos;re refreshing our {category.label.toLowerCase()} price
                list. Give us a call or book a custom repair — we&apos;ll
                provide a quote within the hour.
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  onClick={() => openBooking({ deviceType: category.value })}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
                >
                  <CalendarCheck className="size-4" />
                  Book This Repair
                </Button>
                <Button asChild variant="outline" className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10">
                  <a href={`tel:${phoneDigits}`}>
                    <Phone className="size-4 text-primary" />
                    Call {phone}
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --------------------------- Why choose this -------------------------- */}
      <section className="relative border-y border-border bg-card/30 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="size-3.5" />
              Why choose us
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              The Gadget Doctor difference
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              We&apos;ve earned our reputation by treating every device like
              it&apos;s our own — and backing it up with a real warranty.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
              >
                <span className="relative grid size-12 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <f.icon className="size-6" />
                </span>
                <h3 className="relative mt-4 text-base font-bold text-foreground">
                  {f.title}
                </h3>
                <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ How it works -------------------------- */}
      <section className="relative py-14 sm:py-16">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Clock className="size-3.5" />
              How it works
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              From booking to fix in <span className="text-gradient-cyan">4 simple steps</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              No fuss, no jargon — just a fast, reliable repair from start to
              finish.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative"
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <s.icon className="size-5" />
                    </span>
                    <span className="font-mono text-4xl font-bold text-foreground/10">
                      0{s.n}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <ArrowRight className="size-5 text-primary/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------- Other Services --------------------------- */}
      <section className="relative border-t border-border bg-card/30 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Wrench className="size-3.5" />
                Other Repairs
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Need something else fixed?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Explore our other repair categories — same fast service,
                same warranty, same honest pricing.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setPublicPage("services");
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
            >
              <ArrowLeft className="size-4" />
              Back to all services
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-7">
            {otherCategories.map((c, i) => (
              <OtherServiceCard
                key={c.value}
                value={c.value}
                label={c.shortLabel}
                icon={c.icon}
                tagline={c.tagline}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ CTA Band ------------------------------ */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-8 sm:p-12">
            <div className="pointer-events-none absolute -left-16 -top-16 size-72 rounded-full bg-primary/15 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 size-72 rounded-full bg-accent/15 blur-[100px]" />
            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Ready to get your{" "}
                  <span className="text-gradient-cyan">
                    {category.shortLabel}
                  </span>{" "}
                  fixed?
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Book your {category.label.toLowerCase()} in under 60 seconds,
                  give us a call, or drop by our East Kilbride workshop.
                  We&apos;ll have you back up and running in no time.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={() => openBooking({ deviceType: category.value })}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25"
                  >
                    <Wrench className="size-4" />
                    Book This Repair
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
                  >
                    <a href={`tel:${phoneDigits}`}>
                      <Phone className="size-4 text-primary" />
                      {phone}
                    </a>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { n: `${BRAND.yearsExperience}+`, label: "Years experience" },
                  { n: "10,000+", label: "Devices repaired" },
                  { n: `${rating}★`, label: "Customer rating" },
                  { n: "12 mo", label: "Repair warranty" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-border bg-background/40 p-4"
                  >
                    <p className="text-2xl font-extrabold text-primary">
                      {s.n}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

export default ServiceDetail;
