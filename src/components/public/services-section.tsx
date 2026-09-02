"use client";

import { useMemo, useState } from "react";
import { Clock, CalendarCheck, Search, Wrench, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useServices } from "@/lib/api-hooks";
import { SERVICE_CATEGORIES } from "@/lib/brand";
import { formatPriceRange } from "@/lib/format";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CtaBand } from "./cta-band";

const ALL = "all";

function ServiceCard({ service }: { service: Service }) {
  const openBooking = useAppStore((s) => s.openBooking);
  const openServiceDetail = useAppStore((s) => s.openServiceDetail);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={() => {
            openServiceDetail(service.category);
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105"
          aria-label={`View ${service.name} category details`}
        >
          <Icon name={service.icon} className="size-6" />
        </button>
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

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          onClick={() => openBooking({ serviceSlug: service.slug })}
          size="sm"
          className="justify-center bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/15"
        >
          <CalendarCheck className="size-4" />
          Book Fix
        </Button>
        <Button
          onClick={() => {
            openServiceDetail(service.category);
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          variant="outline"
          size="sm"
          className="justify-center border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
        >
          Details
        </Button>
      </div>
    </motion.article>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="animate-shimmer size-12 rounded-xl bg-muted" />
      <div className="animate-shimmer mt-4 h-4 w-3/4 rounded bg-muted" />
      <div className="animate-shimmer mt-2 h-3 w-full rounded bg-muted" />
      <div className="animate-shimmer mt-1.5 h-3 w-5/6 rounded bg-muted" />
      <div className="animate-shimmer mt-4 h-3 w-1/2 rounded bg-muted" />
      <div className="animate-shimmer mt-4 h-8 w-full rounded bg-muted" />
    </div>
  );
}

export function ServicesSection() {
  const openBooking = useAppStore((s) => s.openBooking);
  const openServiceDetail = useAppStore((s) => s.openServiceDetail);
  const { data: services, isLoading } = useServices(true);
  const [category, setCategory] = useState<string>(ALL);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!services) return [];
    const query = q.trim().toLowerCase();
    return services.filter((s) => {
      const matchCat = category === ALL || s.category === category;
      const matchQ =
        !query ||
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query);
      return matchCat && matchQ;
    });
  }, [services, category, q]);

  const tabs = [{ value: ALL, label: "All Repairs", icon: "Wrench" }, ...SERVICE_CATEGORIES];

  return (
    <>
    <section className="relative py-12 sm:py-16">
      {/* Banner image with heading overlay */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-border">
        <img
          src="/images/services-grid.jpg"
          alt="Gadget Doctor repair services — phones, laptops, consoles and more"
          loading="lazy"
          className="h-48 w-full object-cover sm:h-64 lg:h-72"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 flex items-end p-6 sm:p-10">
          <div className="mx-auto w-full max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
              <Wrench className="size-3.5" />
              Repair Menu
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Our <span className="text-gradient-cyan">Services</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Transparent pricing, certified technicians and a 12-month warranty on every repair.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mx-auto mt-8 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search repairs by name or description…"
              className="h-11 pl-10"
              aria-label="Search services"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {tabs.map((t) => {
            const active = category === t.value;
            const isAll = t.value === ALL;
            return (
              <button
                key={t.value}
                onClick={() => {
                  if (isAll) {
                    setCategory(ALL);
                  } else {
                    openServiceDetail(t.value);
                    if (typeof window !== "undefined") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                  active
                    ? "border-primary/60 bg-primary/15 text-primary shadow-sm shadow-primary/20"
                    : "border-border bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                <Icon name={t.icon} className="size-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Count */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          {isLoading
            ? "Loading repairs…"
            : `${filtered.length} repair${filtered.length === 1 ? "" : "s"} available`}
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : filtered.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>

        {!isLoading && filtered.length === 0 && (
          <div className="mt-12 rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
              <Search className="size-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No matching repairs
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different category or search term — or book a custom repair.
            </p>
            <Button
              onClick={() => openBooking()}
              className="mt-5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              Book a custom repair
            </Button>
          </div>
        )}
      </div>
    </section>
    <CtaBand
      title="Can't find what you need?"
      subtitle="We fix thousands of devices every year — if your problem isn't listed, just book a custom repair and we'll quote you within the hour."
      bookLabel="Book a Repair"
    />
    </>
  );
}

export default ServicesSection;
