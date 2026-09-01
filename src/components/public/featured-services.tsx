"use client";

import {
  Clock,
  ArrowRight,
  Star,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { useAppStore } from "@/lib/store";
import { useServices } from "@/lib/api-hooks";
import { formatPriceRange } from "@/lib/format";
import type { Service } from "@/lib/types";

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const openBooking = useAppStore((s) => s.openBooking);
  const openServiceDetail = useAppStore((s) => s.openServiceDetail);
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
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
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            Popular
          </span>
        )}
      </div>

      <h3 className="mt-4 text-base font-bold text-foreground">
        {service.name}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
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

export function FeaturedServices() {
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const openBooking = useAppStore((s) => s.openBooking);
  const { data: services, isLoading } = useServices(true);

  const featured = (services ?? []).filter((s) => s.popular).slice(0, 6);
  // Fallback: if no popular flags yet, show first 6
  const shown = featured.length > 0 ? featured : (services ?? []).slice(0, 6);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              Most Booked
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Repairs
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              Our most-requested fixes — book in seconds with transparent
              pricing and a guaranteed turnaround.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setPublicPage("services")}
            className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
          >
            View all services
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : shown.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
        </div>

        {!isLoading && shown.length === 0 && (
          <div className="mt-10 rounded-xl border border-dashed border-border bg-card/40 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No services available right now.
            </p>
            <Button
              onClick={() => openBooking()}
              className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              Book a custom repair
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedServices;
