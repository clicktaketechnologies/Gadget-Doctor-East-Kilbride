"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Search,
  Loader2,
  Phone,
  CalendarCheck,
  Truck,
  Store,
  Wrench,
  Check,
  Clock,
  User,
  Tag,
  ClipboardList,
  CircleAlert,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useBranding, useSettings, useTrackTicket } from "@/lib/api-hooks";
import { BRAND } from "@/lib/brand";
import {
  formatPrice,
  formatDate,
  relativeTime,
  STATUS_COLORS,
  deviceLabel,
} from "@/lib/format";
import type { BookingStatus, TrackResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  consumePendingTicketId,
  setPendingTicketId,
} from "./ticket-tracker-widget";
import { CtaBand } from "./cta-band";

const EXAMPLE_TICKETS = ["GD-1000", "GD-1003", "GD-1006"];

const TIMELINE: { status: BookingStatus; label: string; desc: string }[] = [
  { status: "Pending", label: "Pending", desc: "Booking received" },
  { status: "In Progress", label: "In Progress", desc: "Technician working" },
  { status: "Ready", label: "Ready", desc: "Ready for pickup" },
  { status: "Completed", label: "Completed", desc: "Repair finished" },
];

function statusIndex(status: BookingStatus): number {
  const i = TIMELINE.findIndex((t) => t.status === status);
  return i === -1 ? 0 : i;
}

function TrackResultCard({ result }: { result: TrackResult }) {
  const statusColor =
    STATUS_COLORS[result.status] ?? "bg-muted text-muted-foreground border-border";
  const currentIdx = statusIndex(result.status);
  const cancelled = result.status === "Cancelled";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/20"
    >
      {/* Header */}
      <div className="relative border-b border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ticket ID
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-primary sm:text-3xl">
              {result.ticketId}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Booked {relativeTime(result.createdAt)} · Updated{" "}
              {relativeTime(result.updatedAt)}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Badge
              variant="outline"
              className={cn("border px-3 py-1 text-sm font-semibold", statusColor)}
            >
              {result.status}
            </Badge>
            {result.needsCollection ? (
              <Badge
                variant="outline"
                className="border-accent/40 bg-accent/10 text-accent-foreground"
              >
                <Truck className="size-3" />
                Collection
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary"
              >
                <Store className="size-3" />
                Drop off
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="border-b border-border px-6 py-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Repair Progress
        </p>
        {!cancelled ? (
          <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TIMELINE.map((step, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              return (
                <li
                  key={step.status}
                  className={cn(
                    "relative rounded-xl border p-3 transition-all",
                    active &&
                      "border-primary/60 bg-primary/10 shadow-md shadow-primary/20",
                    done && "border-emerald-500/40 bg-emerald-500/5",
                    !active && !done && "border-border bg-background/40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                        active && "bg-primary text-primary-foreground",
                        done && "bg-emerald-500 text-white",
                        !active && !done && "bg-muted text-muted-foreground"
                      )}
                    >
                      {done ? <Check className="size-3.5" /> : i + 1}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold sm:text-sm",
                        active
                          ? "text-primary"
                          : done
                          ? "text-emerald-300"
                          : "text-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {step.desc}
                  </p>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
            <CircleAlert className="size-4 shrink-0" />
            This ticket was cancelled. Please call us if you&apos;d like to
            rebook.
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <User className="size-4 text-primary" />
            Customer &amp; Device
          </h3>
          <dl className="mt-3 space-y-2.5 text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Customer</dt>
              <dd className="text-right font-medium text-foreground">
                {result.customerName}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Device type</dt>
              <dd className="text-right font-medium text-foreground">
                {deviceLabel(result.deviceType)}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Model</dt>
              <dd className="text-right font-medium text-foreground">
                {result.deviceModel || "—"}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <Wrench className="size-3.5" />
                Issue
              </dt>
              <dd className="max-w-[60%] text-right text-foreground">
                {result.issue}
              </dd>
            </div>
            {result.needsCollection && (
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Collection</dt>
                <dd className="inline-flex items-center gap-1 text-right font-medium text-accent-foreground">
                  <Truck className="size-3.5 text-accent" />
                  Doorstep pickup
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Tag className="size-4 text-primary" />
            Quote &amp; Notes
          </h3>
          <dl className="mt-3 space-y-2.5 text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Quoted price</dt>
              <dd className="text-right font-bold text-foreground">
                {formatPrice(result.quotedPrice)}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Final price</dt>
              <dd className="text-right font-bold text-emerald-300">
                {formatPrice(result.finalPrice)}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <Clock className="size-3.5" />
                Created
              </dt>
              <dd className="text-right text-foreground">
                {formatDate(result.createdAt)}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Last update</dt>
              <dd className="text-right text-foreground">
                {formatDate(result.updatedAt)}
              </dd>
            </div>
          </dl>

          {result.technicianNotes && (
            <div className="mt-4 rounded-xl border border-border bg-background/40 p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <ClipboardList className="size-3.5 text-primary" />
                Technician notes
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                {result.technicianNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function NotFoundCard({ ticketId }: { ticketId: string }) {
  const { data: branding } = useBranding();
  const phone = branding?.phone ?? BRAND.phones[0];
  const phoneDigits = phone.replace(/\s+/g, "");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-8 text-center"
    >
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-rose-500/15 text-rose-300">
        <CircleAlert className="size-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-foreground">
        We couldn&apos;t find ticket{" "}
        <span className="font-mono text-rose-300">{ticketId}</span>
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Check your ticket ID and try again, or call us on{" "}
        <a
          href={`tel:${phoneDigits}`}
          className="font-semibold text-primary hover:underline"
        >
          {phone}
        </a>{" "}
        and we&apos;ll look it up for you.
      </p>
      <Button
        asChild
        variant="outline"
        className="mt-5 border-primary/30 bg-background/60 text-foreground hover:border-primary/60 hover:bg-primary/10"
      >
        <a href={`tel:${phoneDigits}`}>
          <Phone className="size-4 text-primary" />
          Call {phone}
        </a>
      </Button>
    </motion.div>
  );
}

function TrackSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-6 sm:p-8">
        <div className="animate-shimmer h-3 w-20 rounded bg-muted" />
        <div className="animate-shimmer mt-2 h-7 w-40 rounded bg-muted" />
        <div className="animate-shimmer mt-2 h-3 w-60 rounded bg-muted" />
      </div>
      <div className="p-6 sm:p-8">
        <div className="animate-shimmer h-3 w-32 rounded bg-muted" />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-shimmer h-16 rounded-xl bg-muted"
            />
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="animate-shimmer h-32 rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TrackSection() {
  const openBooking = useAppStore((s) => s.openBooking);
  const { data: branding } = useBranding();
  const { data: settings } = useSettings();
  const phone = branding?.phone ?? BRAND.phones[0];
  const phoneDigits = phone.replace(/\s+/g, "");

  // Ticket tracking is gated on the site-wide `ticketIdVisible` setting.
  // When disabled, customers see a friendly message instead of the
  // tracker form. Admins still see ticket IDs in the admin panel.
  const ticketIdVisible = settings?.ticketIdVisible ?? true;

  // Pending ticket ID (e.g. set by the compact widget in header/footer).
  const [initialPended] = useState<string | null>(() =>
    consumePendingTicketId()
  );

  const [ticketId, setTicketId] = useState<string>(initialPended ?? "");
  const [submittedId, setSubmittedId] = useState<string | null>(
    initialPended && initialPended.trim().length >= 4 ? initialPended.trim() : null
  );

  // If the widget supplied a value, kick off the query automatically.
  const { data, isLoading, error } = useTrackTicket(submittedId);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = ticketId.trim();
    if (trimmed.length < 4) return;
    setSubmittedId(trimmed);
  };

  const onTicketChange = (val: string) => {
    setTicketId(val);
    // If the user edits the input, clear the previous result so they
    // press Track again to re-query (no stale results).
    if (submittedId && val.trim() !== submittedId) setSubmittedId(null);
  };

  const onExample = (ex: string) => {
    setTicketId(ex);
    setSubmittedId(ex);
    setPendingTicketId(null);
  };

  const notFound = !!submittedId && !isLoading && (!!error || (data && !data.found));
  const found = !!data && data.found;

  if (!ticketIdVisible) {
    return (
      <section className="relative py-12 sm:py-16">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Search className="size-3.5" />
              Repair Tracker
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Track Your <span className="text-gradient-cyan">Repair</span>
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center"
          >
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-amber-500/15 text-amber-300">
              <CircleAlert className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">
              Tracker unavailable
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Ticket tracking is currently disabled. Please call us to check
              your repair status.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Button
                asChild
                variant="outline"
                className="border-primary/30 bg-background/60 text-foreground hover:border-primary/60 hover:bg-primary/10"
              >
                <a href={`tel:${phoneDigits}`}>
                  <Phone className="size-4 text-primary" />
                  Call {phone}
                </a>
              </Button>
              <Button
                onClick={() => openBooking()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20"
              >
                <CalendarCheck className="size-4" />
                Book a Repair
              </Button>
            </div>
          </motion.div>
        </div>

        <CtaBand
          title="Questions about your repair?"
          subtitle="Call us for a status update, or book a new repair in under a minute — same-day service and a 12-month warranty on every fix."
          bookLabel="Book a Repair"
        />
      </section>
    );
  }

  return (
    <section className="relative py-12 sm:py-16">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Search className="size-3.5" />
            Repair Tracker
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Track Your <span className="text-gradient-cyan">Repair</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Enter your ticket ID (e.g. GD-8561) to see your repair status in
            real time — current step, technician notes and pricing.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={onSubmit}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-2 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={ticketId}
              onChange={(e) => onTicketChange(e.target.value)}
              placeholder="e.g. GD-8561"
              aria-label="Ticket ID"
              className="h-12 pl-10 font-mono text-base"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <Button
            type="submit"
            disabled={ticketId.trim().length < 4 || isLoading}
            className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25 sm:px-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Tracking…
              </>
            ) : (
              <>
                <Search className="size-4" />
                Track
              </>
            )}
          </Button>
        </form>

        {/* Example chips */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-muted-foreground">Try an example:</span>
          {EXAMPLE_TICKETS.map((ex) => (
            <button
              key={ex}
              onClick={() => onExample(ex)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-2.5 py-1 font-mono text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
            >
              {ex}
              <ArrowRight className="size-3" />
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-10">
          {!submittedId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center"
            >
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                <Search className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                Enter a ticket ID to begin
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Your ticket ID was given to you when you booked — it looks like
                <span className="mx-1 font-mono text-primary">GD-XXXX</span>.
                Lost it? Give us a call.
              </p>
            </motion.div>
          )}

          {submittedId && isLoading && <TrackSkeleton />}

          {found && <TrackResultCard result={data!} />}

          {notFound && <NotFoundCard ticketId={submittedId!} />}
        </div>

        {/* Inline help */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-xl border border-border bg-background/40 p-4 text-sm sm:flex-row">
          <p className="text-muted-foreground">
            Need help with your repair? Our team is just a call away.
          </p>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
            >
              <a href={`tel:${phoneDigits}`}>
                <Phone className="size-4 text-primary" />
                Call Now
              </a>
            </Button>
            <Button
              onClick={() => openBooking()}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20"
            >
              <CalendarCheck className="size-4" />
              Book Repair
            </Button>
          </div>
        </div>
      </div>

      <CtaBand
        title="Questions about your repair?"
        subtitle="Call us for a status update, or book a new repair in under a minute — same-day service and a 12-month warranty on every fix."
        bookLabel="Book a Repair"
      />
    </section>
  );
}

export default TrackSection;
