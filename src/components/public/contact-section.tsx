"use client";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CalendarCheck,
  Navigation,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const openBooking = useAppStore((s) => s.openBooking);

  return (
    <section className="relative py-12 sm:py-16">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <MessageCircle className="size-3.5" />
            Get In Touch
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Visit or <span className="text-gradient-cyan">Contact Us</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Drop by our East Kilbride workshop, give us a call, or send a
            message — we&apos;re here to help with any gadget problem.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Left: details */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <h2 className="text-lg font-bold text-foreground">Contact Details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Reach us any of these ways — we usually reply within the hour
              during opening times.
            </p>

            <ul className="mt-6 space-y-5">
              {/* Address */}
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Workshop Address
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {BRAND.address}
                  </p>
                  <a
                    href={BRAND.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <Navigation className="size-3" />
                    Get directions
                  </a>
                </div>
              </li>

              {/* Phones */}
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Call Us
                  </p>
                  <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:gap-4">
                    {BRAND.phones.map((p, i) => (
                      <a
                        key={p}
                        href={`tel:${p.replace(/\s+/g, "")}`}
                        className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {p}
                        {i === 0 && (
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            (mobile)
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="mt-0.5 block text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {BRAND.email}
                  </a>
                </div>
              </li>

              {/* Hours */}
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Opening Hours
                    </p>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-300"
                    >
                      <span className="mr-1 size-1.5 rounded-full bg-emerald-400" />
                      Open now
                    </Badge>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {BRAND.hours.map((h) => (
                      <li
                        key={h.day}
                        className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/40 px-3 py-1.5 text-sm"
                      >
                        <span className="text-muted-foreground">{h.day}</span>
                        <span
                          className={cn(
                            "font-medium",
                            h.time === "Closed"
                              ? "text-rose-400"
                              : "text-foreground"
                          )}
                        >
                          {h.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => openBooking()}
                className="flex-1 bg-amber-400 text-slate-950 hover:bg-amber-300 font-semibold shadow-lg shadow-amber-500/20"
              >
                <CalendarCheck className="size-4" />
                Book a Repair
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
              >
                <a href={`tel:${BRAND.phones[1].replace(/\s+/g, "")}`}>
                  <Phone className="size-4 text-primary" />
                  Call Now
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Right: map */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden rounded-2xl border border-border bg-card p-2"
          >
            <div className="flex items-center justify-between gap-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {BRAND.name} — East Kilbride
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {BRAND.addressShort}
                  </p>
                </div>
              </div>
              <a
                href={BRAND.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Navigation className="size-3" />
                Open in Maps
              </a>
            </div>
            <iframe
              src={BRAND.mapEmbed}
              title={`Map showing ${BRAND.fullName} location`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[400px] w-full rounded-xl border border-border sm:h-[500px] lg:h-[560px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
