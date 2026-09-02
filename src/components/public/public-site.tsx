"use client";

import { useMemo, useEffect } from "react";
import {
  ArrowRight,
  Truck,
  Wrench,
  ShieldCheck,
  Clock,
  Star,
  Award,
  Zap,
  Phone,
  MapPin,
  MessageSquarePlus,
  ChevronRight,
  Sparkles,
  Cpu,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { useAppStore, type PublicPage } from "@/lib/store";
import { useSettings, useReviews, useBranding } from "@/lib/api-hooks";
import { BRAND, SERVICE_CATEGORIES } from "@/lib/brand";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

import { Header } from "./header";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { FeaturedServices } from "./featured-services";
import { ServicesSection } from "./services-section";
import { ServiceDetail } from "./service-detail";
import { CollectionSection } from "./collection-section";
import { ReviewsSection } from "./reviews-section";
import { ContactSection } from "./contact-section";
import { BookingModal } from "./booking-modal";
import { TrackSection } from "./track-section";
import { BlogSection } from "./blog-section";
import { BlogDetail } from "./blog-detail";

/* ----------------------------- Announcement ----------------------------- */

function AnnouncementBanner() {
  const { data: settings, isLoading } = useSettings();
  if (isLoading || !settings) return null;
  if (!settings.announcementEnabled || !settings.announcementText?.trim()) {
    return null;
  }
  // Hide announcement if it mentions "collection" but the service is disabled
  const mentionsCollection = /collection/i.test(settings.announcementText);
  if (mentionsCollection && settings.collectionEnabled === false) {
    return null;
  }
  return (
    <div className="relative z-50 bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold sm:text-sm">
        <Sparkles className="hidden size-3.5 shrink-0 sm:inline" />
        <span className="line-clamp-1">{settings.announcementText}</span>
      </div>
    </div>
  );
}

/* ------------------------------ Category Strip ------------------------- */

function CategoryStrip() {
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const openServiceDetail = useAppStore((s) => s.openServiceDetail);
  const go = (p: PublicPage) => {
    setPublicPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {SERVICE_CATEGORIES.map((c, i) => (
            <motion.button
              key={c.value}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => {
                openServiceDetail(c.value);
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card/40 p-4 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-card"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
                <Icon name={c.icon} className="size-5" />
              </span>
              <span className="text-xs font-semibold text-foreground sm:text-sm">
                {c.shortLabel}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Why Choose Us -------------------------- */

function WhyChooseUs() {
  const items = [
    {
      icon: ShieldCheck,
      title: "12-Month Warranty",
      desc: "Every repair is backed by a full year's warranty on parts and labour — no quibbles.",
      color: "from-cyan-500/20 to-cyan-500/5",
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      desc: "Most repairs done same-day. We respect your time and your device.",
      color: "from-amber-500/20 to-amber-500/5",
    },
    {
      icon: Award,
      title: "Certified Technicians",
      desc: "12+ years of experience across phones, laptops, consoles & more.",
      color: "from-violet-500/20 to-violet-500/5",
    },
    {
      icon: Zap,
      title: "Honest Pricing",
      desc: "Transparent quotes upfront. No hidden fees, no surprise charges.",
      color: "from-emerald-500/20 to-emerald-500/5",
    },
  ];
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="size-3.5" />
            Why Choose Us
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The Gadget Doctor Difference
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            We&apos;ve earned our 4.6★ reputation by treating every device like
            it&apos;s our own.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <div
                className={cn(
                  "pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br blur-2xl",
                  it.color
                )}
              />
              <span className="relative grid size-12 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <it.icon className="size-6" />
              </span>
              <h3 className="relative mt-4 text-base font-bold text-foreground">
                {it.title}
              </h3>
              <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {it.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Collection Preview --------------------- */

function CollectionPreview() {
  const openBooking = useAppStore((s) => s.openBooking);
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const { data: settings } = useSettings();
  // Master toggle: hide the entire CollectionPreview when disabled
  if (settings?.collectionEnabled === false) return null;
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/15 blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-12 -top-12 size-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Truck className="size-3.5" />
                Doorstep Collection Service
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Too busy to drop off?{" "}
                <span className="text-gradient-cyan">We come to you.</span>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Book a pickup anywhere in East Kilbride. Our driver collects,
                our technicians repair, and we return your device — usually
                within 24 hours.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => openBooking()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25"
                >
                  <Truck className="size-4" />
                  Book Collection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPublicPage("collection")}
                  className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60"
                >
                  Learn More
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { n: "01", label: "Book online", icon: Wrench },
                { n: "02", label: "We collect", icon: Truck },
                { n: "03", label: "We repair", icon: Cpu },
                { n: "04", label: "We return", icon: ShieldCheck },
              ].map((s) => (
                <div
                  key={s.n}
                  className="relative overflow-hidden rounded-xl border border-border bg-background/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <s.icon className="size-5 text-primary" />
                    <span className="font-mono text-xs font-bold text-foreground/20">
                      {s.n}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Reviews Preview ------------------------ */

function ReviewsPreview() {
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const { data: reviews } = useReviews(true);
  const { data: branding } = useBranding();
  const rating = branding?.rating ?? BRAND.rating;
  const reviewCount = branding?.reviewCount ?? BRAND.reviewCount;
  const list = (reviews ?? []).slice(0, 3);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {rating}★ from {reviewCount}+ reviews
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Loved by East Kilbride
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={() => setPublicPage("reviews")}
            className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
          >
            Read all reviews
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {list.length === 0
            ? // Fallback static reviews
              [
                {
                  author: "Sarah M.",
                  rating: 5,
                  device: "iPhone 13",
                  comment:
                    "Cracked screen fixed in under an hour. Friendly service and a fair price. Highly recommend!",
                },
                {
                  author: "James T.",
                  rating: 5,
                  device: "PS5",
                  comment:
                    "HDMI port repair — saved my console! Gadget Doctor really knows their stuff.",
                },
                {
                  author: "Linda K.",
                  rating: 4,
                  device: "MacBook Air",
                  comment:
                    "Battery replacement done same day. Working perfectly. Will use again.",
                },
              ].map((r, i) => (
                <ReviewPreviewCard key={i} {...r} />
              ))
            : list.map((r, i) => (
                <ReviewPreviewCard
                  key={r.id}
                  author={r.author}
                  rating={r.rating}
                  device={r.device ?? undefined}
                  comment={r.comment}
                  relative={relativeTime(r.createdAt)}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

function ReviewPreviewCard({
  author,
  rating,
  device,
  comment,
  relative,
}: {
  author: string;
  rating: number;
  device?: string;
  comment: string;
  relative?: string;
}) {
  const initial = author.charAt(0).toUpperCase();
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 font-bold text-cyan-200 ring-1 ring-border">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {author}
          </p>
          <div className="mt-0.5 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3.5",
                  i < Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-slate-700"
                )}
              />
            ))}
          </div>
        </div>
        <Badge variant="outline" className="border-primary/30 bg-primary/5 text-[10px] text-primary">
          Google
        </Badge>
      </div>
      {device && (
        <Badge variant="secondary" className="mt-3 w-fit text-[11px]">
          {device}
        </Badge>
      )}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
        &ldquo;{comment}&rdquo;
      </p>
      {relative && (
        <p className="mt-3 text-xs text-muted-foreground">{relative}</p>
      )}
    </article>
  );
}

/* ------------------------------ Contact CTA ---------------------------- */

function ContactCTA() {
  const openBooking = useAppStore((s) => s.openBooking);
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const { data: branding } = useBranding();
  const { data: settings } = useSettings();
  const collectionEnabled = settings?.collectionEnabled ?? true;
  const phone = branding?.phone ?? BRAND.phones[0];
  const address = branding?.address ?? BRAND.addressShort;
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-8 sm:p-12">
          <div className="pointer-events-none absolute -left-16 -top-16 size-72 rounded-full bg-primary/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 size-72 rounded-full bg-accent/10 blur-[100px]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to get your{" "}
                <span className="text-gradient-cyan">gadget fixed?</span>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Book a repair in under 60 seconds, give us a call, or drop by
                our East Kilbride workshop. We&apos;ll have you back up and
                running in no time.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => openBooking()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25"
                >
                  <Wrench className="size-4" />
                  Book Your Repair
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60"
                >
                  <a href={`tel:${phone.replace(/\s+/g, "")}`}>
                    <Phone className="size-4 text-primary" />
                    {phone}
                  </a>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ContactInfoItem
                icon={MapPin}
                label="Visit our workshop"
                value={address}
                onClick={() => setPublicPage("contact")}
              />
              <ContactInfoItem
                icon={Clock}
                label="Opening hours"
                value="Mon–Sat · Open now"
                onClick={() => setPublicPage("contact")}
              />
              <ContactInfoItem
                icon={MessageSquarePlus}
                label="Leave a review"
                value="Share your experience"
                onClick={() => setPublicPage("reviews")}
              />
              {collectionEnabled && (
                <ContactInfoItem
                  icon={Truck}
                  label="Doorstep collection"
                  value="Across East Kilbride"
                  onClick={() => setPublicPage("collection")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfoItem({
  icon: IconCmp,
  label,
  value,
  onClick,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-start gap-3 rounded-xl border border-border bg-background/40 p-4 text-left transition-colors hover:border-primary/40 hover:bg-background/60"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <IconCmp className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/* --------------------------------- Home -------------------------------- */

function HomePage() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <FeaturedServices />
      <WhyChooseUs />
      <CollectionPreview />
      <ReviewsPreview />
      <ContactCTA />
    </>
  );
}

/* ------------------------------ Root View ------------------------------ */

export function PublicSite() {
  const publicPage = useAppStore((s) => s.publicPage);
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const { data: settings } = useSettings();
  // Smooth scroll to top on page change
  const page = useMemo(() => publicPage, [publicPage]);

  // Defensive: if user lands on the collection page while the service is
  // disabled, redirect home (the nav link is hidden too).
  const effectivePage: PublicPage =
    publicPage === "collection" && settings?.collectionEnabled === false
      ? "home"
      : publicPage;

  // Side-effect: sync the store so the URL state stays consistent
  useEffect(() => {
    if (publicPage === "collection" && settings?.collectionEnabled === false) {
      setPublicPage("home");
    }
  }, [publicPage, settings, setPublicPage]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBanner />
      <Header />
      <main className="flex-1" key={page}>
        {effectivePage === "home" && <HomePage />}
        {effectivePage === "services" && <ServicesSection />}
        {effectivePage === "service-detail" && <ServiceDetail />}
        {effectivePage === "collection" && <CollectionSection />}
        {effectivePage === "reviews" && <ReviewsSection />}
        {effectivePage === "contact" && <ContactSection />}
        {effectivePage === "track" && <TrackSection />}
        {effectivePage === "blog" && <BlogSection />}
        {effectivePage === "blog-detail" && <BlogDetail />}
      </main>
      <Footer />
      <BookingModal />
    </div>
  );
}

export default PublicSite;
