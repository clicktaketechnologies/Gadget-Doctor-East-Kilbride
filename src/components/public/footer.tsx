"use client";

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Navigation,
} from "lucide-react";
import { useAppStore, type PublicPage } from "@/lib/store";
import { useBranding } from "@/lib/api-hooks";
import { BRAND, SERVICE_CATEGORIES, SOCIAL_LINKS } from "@/lib/brand";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const NAV: { label: string; page: PublicPage }[] = [
  { label: "Home", page: "home" },
  { label: "Services", page: "services" },
  { label: "Collection Service", page: "collection" },
  { label: "Reviews", page: "reviews" },
  { label: "Contact", page: "contact" },
];

export function Footer() {
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const openBooking = useAppStore((s) => s.openBooking);
  const openServiceDetail = useAppStore((s) => s.openServiceDetail);
  const { data: branding } = useBranding();

  const businessName = branding?.businessName ?? BRAND.fullName;
  const shortName = branding?.businessName ?? BRAND.name;
  const logoUrl = branding?.logoUrl ?? BRAND.logoUrl;
  const phone = branding?.phone ?? BRAND.phones[0];
  const whatsapp = branding?.whatsapp ?? BRAND.whatsapp;
  const email = branding?.email ?? BRAND.email;
  const address = branding?.address ?? BRAND.address;
  const hours = branding?.hours ?? BRAND.hours;
  const socials = branding?.socials ?? BRAND.socials;
  const targetAreas = branding?.targetAreas ?? BRAND.targetAreas;
  const tagline = branding?.tagline ?? BRAND.tagline;
  const mapLink = branding?.mapLink ?? BRAND.mapLink;
  const website = branding?.website ?? BRAND.website;

  const go = (p: PublicPage) => {
    setPublicPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const whatsappDigits = whatsapp.replace(/[^\d+]/g, "");
  const phoneDigits = phone.replace(/\s+/g, "");

  // Build list of active social links
  const activeSocials = SOCIAL_LINKS.filter((s) => {
    const url = socials?.[s.key];
    return !!url && url !== "#";
  });

  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white p-1 shadow-lg shadow-primary/30">
                <img
                  src={logoUrl}
                  alt="Gadget Doctor East Kilbride logo"
                  className="h-full w-full rounded-md object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility =
                      "hidden";
                  }}
                />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold text-foreground">
                  {shortName}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
                  East Kilbride
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {tagline}. Your trusted local specialist for phone, tablet,
              laptop, MacBook, computer, custom PC, console and Apple Watch
              repairs. Fast turnaround, honest pricing and free doorstep
              collection across East Kilbride.
            </p>

            {/* Social links */}
            {activeSocials.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
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
            )}
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => go(item.page)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
              Repairs We Offer
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {SERVICE_CATEGORIES.map((c) => (
                <li key={c.value}>
                  <button
                    onClick={() => {
                      openServiceDetail(c.value);
                      if (typeof window !== "undefined") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className="flex items-center gap-2 text-left text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Icon
                      name={c.icon}
                      className="size-3.5 text-primary"
                    />
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
              Get In Touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-muted-foreground transition-colors hover:text-primary"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{address}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phoneDigits}`}
                  className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="size-4 shrink-0 text-primary" />
                  {phone}
                </a>
              </li>
              {whatsapp && whatsapp !== phone && (
                <li>
                  <a
                    href={`https://wa.me/${whatsappDigits.replace(/^\+/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="size-4 shrink-0 text-primary" />
                    WhatsApp · {whatsapp}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="size-4 shrink-0 text-primary" />
                  {email}
                </a>
              </li>
            </ul>

            <h3 className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
              <Clock className="size-3.5 text-primary" />
              Opening Hours
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {hours.map((h) => (
                <li
                  key={h.day}
                  className="flex justify-between gap-2 text-muted-foreground"
                >
                  <span>{h.day}</span>
                  <span
                    className={cn(
                      "font-medium",
                      h.time === "Closed" ? "text-rose-400" : "text-foreground"
                    )}
                  >
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>

            {/* Target areas */}
            {targetAreas.length > 0 && (
              <div className="mt-6">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                  <Navigation className="size-3.5 text-primary" />
                  Areas We Cover
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
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
          </div>
        </div>

        {/* CTA bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-background/40 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Got a gadget that needs fixing?
            </p>
            <p className="text-xs text-muted-foreground">
              Book your repair in under 60 seconds — we&apos;ll handle the rest.
            </p>
          </div>
          <button
            onClick={() => openBooking()}
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
          >
            Book a Repair
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                {website.replace(/^https?:\/\//, "")}
              </a>
            )}
            <span className="hidden sm:inline">Registered in Scotland</span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
