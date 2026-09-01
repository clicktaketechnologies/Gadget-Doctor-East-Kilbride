"use client";

import {
  Truck,
  Wrench,
  Check,
  ArrowRight,
  CalendarCheck,
  MapPin,
  ShieldCheck,
  Clock,
  Phone,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { BRAND } from "@/lib/brand";

const STEPS = [
  {
    n: 1,
    icon: CalendarCheck,
    title: "Book Online",
    desc: "Pick a time slot that suits you. Tell us what needs fixing.",
    color: "from-cyan-500/20 to-cyan-500/5",
  },
  {
    n: 2,
    icon: Truck,
    title: "We Collect",
    desc: "Our driver arrives at your door — anywhere in East Kilbride — for free.",
    color: "from-amber-500/20 to-amber-500/5",
  },
  {
    n: 3,
    icon: Wrench,
    title: "We Repair",
    desc: "Certified technicians fix your device with genuine parts & 12-month warranty.",
    color: "from-violet-500/20 to-violet-500/5",
  },
  {
    n: 4,
    icon: Check,
    title: "We Return",
    desc: "We deliver it back, fully tested & ready to go. Pay only if you're happy.",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
];

const COVERAGE = [
  "East Kilbride town centre",
  "Kelvin & The Murray",
  "Westwood & St Leonards",
  "Hairmyres & Nerston",
  "Thorntonhall & Jackton",
  "Strathaven & Chapelton",
];

const TRUST = [
  { icon: ShieldCheck, label: "Fully insured collection" },
  { icon: Clock, label: "Same-day pickup available" },
  { icon: Star, label: "12-month repair warranty" },
];

export function CollectionSection() {
  const openBooking = useAppStore((s) => s.openBooking);

  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      {/* BG */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-amber-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/15 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
            <Truck className="size-3.5" />
            Free Doorstep Collection
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            We Come to <span className="text-gradient-cyan">You</span>
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Too busy to drop off your device? Our free doorstep collection
            service covers all of East Kilbride and surrounding areas. We pick
            it up, fix it, and bring it back — usually within 24 hours.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={() => openBooking()}
              size="lg"
              className="bg-amber-400 text-slate-950 hover:bg-amber-300 font-semibold shadow-lg shadow-amber-500/25"
            >
              <Truck className="size-5" />
              Book Free Collection
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
            >
              <a href={`tel:${BRAND.phones[1].replace(/\s+/g, "")}`}>
                <Phone className="size-5 text-primary" />
                {BRAND.phones[1]}
              </a>
            </Button>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6">
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br ${s.color} blur-2xl`}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid size-12 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-foreground ring-1 ring-border`}
                    >
                      <s.icon className="size-5 text-primary" />
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
              </div>
              {i < STEPS.length - 1 && (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                  <ArrowRight className="size-5 text-primary/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Coverage + trust */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Coverage Area
                </h3>
                <p className="text-xs text-muted-foreground">
                  Free pickup &amp; return across East Kilbride &amp; nearby
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {COVERAGE.map((c) => (
                <div
                  key={c}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2 text-sm text-muted-foreground"
                >
                  <Check className="size-3.5 shrink-0 text-emerald-400" />
                  {c}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Not sure if we cover your area?{" "}
              <a
                href={`tel:${BRAND.phones[1].replace(/\s+/g, "")}`}
                className="font-medium text-primary hover:underline"
              >
                Call us
              </a>{" "}
              — we&apos;ll usually sort it out.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-lg bg-amber-400/15 text-amber-300">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Why choose doorstep collection?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Same great service, zero travel time.
                </p>
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {TRUST.map((t) => (
                <li key={t.label} className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-background/60 text-primary">
                    <t.icon className="size-4" />
                  </span>
                  <span className="text-sm text-foreground">{t.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-lg border border-border bg-background/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Collection Fee
                </span>
                <span className="text-lg font-bold text-emerald-400">
                  FREE
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                No hidden charges. Pay only for the repair itself.
              </p>
            </div>
            <Button
              onClick={() => openBooking()}
              className="mt-5 w-full bg-amber-400 text-slate-950 hover:bg-amber-300 font-semibold shadow-lg shadow-amber-500/20"
            >
              <Truck className="size-4" />
              Schedule My Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CollectionSection;
