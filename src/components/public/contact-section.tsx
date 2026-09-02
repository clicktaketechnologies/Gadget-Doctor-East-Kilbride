"use client";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CalendarCheck,
  Navigation,
  MessageCircle,
  Globe,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useBranding } from "@/lib/api-hooks";
import { BRAND, SOCIAL_LINKS } from "@/lib/brand";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const openBooking = useAppStore((s) => s.openBooking);
  const { data: branding } = useBranding();

  const businessName = branding?.businessName ?? BRAND.fullName;
  const shortName = branding?.businessName ?? BRAND.name;
  const logoUrl = branding?.logoUrl ?? BRAND.logoUrl;
  const phone = branding?.phone ?? BRAND.phones[0];
  const whatsapp = branding?.whatsapp ?? BRAND.whatsapp;
  const email = branding?.email ?? BRAND.email;
  const website = branding?.website ?? BRAND.website;
  const gmbProfile = branding?.gmbProfile ?? BRAND.gmbProfile;
  const address = branding?.address ?? BRAND.address;
  const addressShort = branding?.address ?? BRAND.addressShort;
  const hours = branding?.hours ?? BRAND.hours;
  const socials = branding?.socials ?? BRAND.socials;
  const targetAreas = branding?.targetAreas ?? BRAND.targetAreas;
  const mapLink = branding?.mapLink ?? BRAND.mapLink;
  const mapEmbed = branding?.mapEmbed ?? BRAND.mapEmbed;
  const rating = branding?.rating ?? BRAND.rating;
  const reviewCount = branding?.reviewCount ?? BRAND.reviewCount;

  const phoneDigits = phone.replace(/\s+/g, "");
  const whatsappDigits = whatsapp.replace(/[^\d+]/g, "");
  const activeSocials = SOCIAL_LINKS.filter((s) => {
    const url = socials?.[s.key];
    return !!url && url !== "#";
  });

  return (
    <section className="relative py-12 sm:py-16">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with shop image */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-border">
          <img
            src="/images/contact-shop.jpg"
            alt="Gadget Doctor East Kilbride workshop front"
            loading="lazy"
            className="h-44 w-full object-cover sm:h-56 lg:h-64"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 flex items-end p-6 sm:p-10">
            <div className="mx-auto w-full max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
                <MessageCircle className="size-3.5" />
                Get In Touch
              </span>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Visit or <span className="text-gradient-cyan">Contact Us</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Drop by our East Kilbride workshop, give us a call, or send a
                message — we&apos;re here to help with any gadget problem.
              </p>
            </div>
          </div>
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
                    {address}
                  </p>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <Navigation className="size-3" />
                    Get directions
                  </a>
                </div>
              </li>

              {/* Phone */}
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Call Us
                  </p>
                  <a
                    href={`tel:${phoneDigits}`}
                    className="mt-0.5 block text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {phone}
                  </a>
                  {whatsapp && whatsapp !== phone && (
                    <a
                      href={`https://wa.me/${whatsappDigits.replace(/^\+/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <MessageCircle className="size-3" />
                      WhatsApp · {whatsapp}
                    </a>
                  )}
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
                    href={`mailto:${email}`}
                    className="mt-0.5 block text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {email}
                  </a>
                </div>
              </li>

              {/* Website + GMB */}
              {(website || gmbProfile) && (
                <li className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Globe className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Online
                    </p>
                    <div className="mt-0.5 flex flex-col gap-1 text-sm">
                      {website && (
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
                        >
                          {website.replace(/^https?:\/\//, "")}
                          <ExternalLink className="size-3" />
                        </a>
                      )}
                      {gmbProfile && (
                        <a
                          href={gmbProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          View on Google Business Profile
                          <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              )}

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
                    {hours.map((h) => (
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
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
              >
                <CalendarCheck className="size-4" />
                Book a Repair
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
              >
                <a href={`tel:${phoneDigits}`}>
                  <Phone className="size-4 text-primary" />
                  Call Now
                </a>
              </Button>
            </div>

            {/* Socials */}
            {activeSocials.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Follow us
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {activeSocials.map((s) => {
                    const url = socials?.[s.key] ?? "";
                    return (
                      <a
                        key={s.key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${businessName} on ${s.label}`}
                        className="grid size-9 place-items-center rounded-lg border border-border bg-background/50 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                      >
                        <Icon name={s.icon} className="size-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Target areas */}
            {targetAreas.length > 0 && (
              <div className="mt-6">
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Navigation className="size-3.5 text-primary" />
                  Areas We Cover
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {targetAreas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center rounded-full border border-border bg-background/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-white p-1">
                  <img
                    src={logoUrl}
                    alt="Gadget Doctor East Kilbride logo"
                    className="h-full w-full rounded-sm object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility =
                        "hidden";
                    }}
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {shortName} — East Kilbride
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {addressShort}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-300">
                  ★ {rating} ({reviewCount}+)
                </span>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Navigation className="size-3" />
                  Open in Maps
                </a>
              </div>
            </div>
            <iframe
              src={mapEmbed}
              title={`Map showing ${businessName} location`}
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
