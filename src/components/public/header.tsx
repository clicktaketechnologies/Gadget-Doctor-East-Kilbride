"use client";

import { useState, useEffect, useRef } from "react";
import {
  Phone,
  Menu,
  CalendarCheck,
  ChevronDown,
  Search,
  Wrench,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAppStore, type PublicPage } from "@/lib/store";
import { useBranding, useSettings } from "@/lib/api-hooks";
import { BRAND, SERVICE_CATEGORIES } from "@/lib/brand";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { TicketTrackerWidget } from "./ticket-tracker-widget";

const NAV: { label: string; page: PublicPage }[] = [
  { label: "Home", page: "home" },
  { label: "Services", page: "services" },
  { label: "Blog", page: "blog" },
  { label: "Reviews", page: "reviews" },
  { label: "Track Repair", page: "track" },
  { label: "Contact", page: "contact" },
];

export function Header() {
  const publicPage = useAppStore((s) => s.publicPage);
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const openBooking = useAppStore((s) => s.openBooking);
  const openServiceDetail = useAppStore((s) => s.openServiceDetail);
  const { data: branding } = useBranding();
  const { data: settings } = useSettings();
  const collectionEnabled = settings?.collectionEnabled ?? true;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const businessName = branding?.businessName ?? BRAND.fullName;
  const shortName = branding?.businessName ?? BRAND.name;
  const logoUrl = branding?.logoUrl ?? BRAND.logoUrl;
  const phone = branding?.phone ?? BRAND.phones[0];
  const phoneDigits = phone.replace(/\s+/g, "");

  const go = (p: PublicPage) => {
    setPublicPage(p);
    setMobileOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToCategory = (value: string) => {
    setServicesOpen(false);
    setMobileServicesOpen(false);
    setMobileOpen(false);
    openServiceDetail(value);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Close desktop dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Keyboard: Escape closes the dropdown
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const onDropdownEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const onDropdownLeave = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 150);
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => go("home")}
          className="group flex items-center gap-2.5 outline-none"
          aria-label={`${businessName} — Home`}
        >
          <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-white p-1 shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
            <img
              src={logoUrl}
              alt="Gadget Doctor East Kilbride logo"
              className="h-full w-full rounded-md object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector(".logo-fallback")) {
                  const fb = document.createElement("span");
                  fb.className =
                    "logo-fallback grid place-items-center text-primary font-bold";
                  fb.innerHTML = "GD";
                  parent.appendChild(fb);
                }
              }}
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-foreground">
              {shortName}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
              East Kilbride
            </span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {/* Home */}
          <NavButton
            label="Home"
            active={publicPage === "home"}
            onClick={() => go("home")}
          />

          {/* Services dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={onDropdownEnter}
            onMouseLeave={onDropdownLeave}
          >
            <button
              onClick={() => setServicesOpen((o) => !o)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              className={cn(
                "relative flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                publicPage === "services" || publicPage === "service-detail"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Services
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform",
                  servicesOpen && "rotate-180"
                )}
              />
              {(publicPage === "services" || publicPage === "service-detail") && (
                <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
              )}
            </button>

            {servicesOpen && (
              <div
                role="menu"
                className="custom-scroll absolute left-0 top-full z-50 mt-1 w-80 overflow-y-auto rounded-xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl"
              >
                <button
                  onClick={() => {
                    setServicesOpen(false);
                    go("services");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-primary/10"
                  role="menuitem"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
                    <Wrench className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      All Services
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Browse the full repair menu
                    </p>
                  </div>
                </button>
                <div className="my-1 h-px bg-border" />
                {SERVICE_CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => goToCategory(c.value)}
                    className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-primary/10"
                    role="menuitem"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon name={c.icon} className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {c.label}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.tagline}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {collectionEnabled && (
            <NavButton
              label="Collection"
              active={publicPage === "collection"}
              onClick={() => go("collection")}
            />
          )}
          <NavButton
            label="Blog"
            active={publicPage === "blog" || publicPage === "blog-detail"}
            onClick={() => go("blog")}
          />
          <NavButton
            label="Reviews"
            active={publicPage === "reviews"}
            onClick={() => go("reviews")}
          />
          <NavButton
            label="Track Repair"
            active={publicPage === "track"}
            onClick={() => go("track")}
          />
          <NavButton
            label="Contact"
            active={publicPage === "contact"}
            onClick={() => go("contact")}
          />
        </nav>

        {/* Desktop actions: tracker + phone + book */}
        <div className="hidden items-center gap-2 xl:flex">
          <div className="w-44">
            <TicketTrackerWidget bare />
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <a href={`tel:${phoneDigits}`} aria-label="Call the shop">
              <Phone className="size-4 text-primary" />
              <span className="hidden lg:inline">{phone}</span>
              <span className="lg:hidden">Call</span>
            </a>
          </Button>
          <Button
            onClick={() => openBooking()}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
          >
            <CalendarCheck className="size-4" />
            Book Repair
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1.5 md:hidden">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            aria-label="Call the shop"
          >
            <a href={`tel:${phoneDigits}`}>
              <Phone className="size-5" />
            </a>
          </Button>
          <Button
            onClick={() => openBooking()}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
          >
            Book
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-strong w-80 border-l-border">
              <SheetTitle className="px-4 pt-4 text-left text-base font-bold">
                <span className="flex items-center gap-2.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white p-1">
                    <img
                      src={logoUrl}
                      alt="Gadget Doctor East Kilbride logo"
                      className="h-full w-full rounded-sm object-contain"
                    />
                  </span>
                  {shortName}
                </span>
              </SheetTitle>

              {/* Mobile tracker */}
              <div className="px-4 pt-4">
                <TicketTrackerWidget />
              </div>

              <nav className="custom-scroll flex flex-col gap-1 overflow-y-auto px-2 py-3" aria-label="Mobile">
                {/* Top-level pages */}
                <MobileNavButton
                  label="Home"
                  active={publicPage === "home"}
                  onClick={() => go("home")}
                />

                {/* Services collapsible */}
                <Collapsible
                  open={mobileServicesOpen}
                  onOpenChange={setMobileServicesOpen}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors",
                        publicPage === "services" || publicPage === "service-detail"
                          ? "bg-primary/10 text-foreground ring-1 ring-primary/30"
                          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Wrench className="size-4 text-primary" />
                        Services
                      </span>
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
                          mobileServicesOpen && "rotate-180"
                        )}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-1 flex flex-col gap-0.5 pl-3">
                      <button
                        onClick={() => go("services")}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <ChevronDown className="size-3 rotate-[-90deg] text-primary" />
                        All Services
                      </button>
                      {SERVICE_CATEGORIES.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => goToCategory(c.value)}
                          className="flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          <Icon
                            name={c.icon}
                            className="size-3.5 text-primary"
                          />
                          {c.shortLabel}
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {collectionEnabled && (
                  <MobileNavButton
                    label="Collection"
                    active={publicPage === "collection"}
                    onClick={() => go("collection")}
                  />
                )}
                <MobileNavButton
                  label="Blog"
                  active={publicPage === "blog" || publicPage === "blog-detail"}
                  onClick={() => go("blog")}
                />
                <MobileNavButton
                  label="Reviews"
                  active={publicPage === "reviews"}
                  onClick={() => go("reviews")}
                />
                <MobileNavButton
                  label="Track Repair"
                  active={publicPage === "track"}
                  onClick={() => go("track")}
                />
                <MobileNavButton
                  label="Contact"
                  active={publicPage === "contact"}
                  onClick={() => go("contact")}
                />
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-center"
                >
                  <a href={`tel:${phoneDigits}`}>
                    <Phone className="size-4 text-primary" />
                    {phone}
                  </a>
                </Button>
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    openBooking();
                  }}
                  className="w-full justify-center bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
                >
                  <CalendarCheck className="size-4" />
                  Book a Repair
                </Button>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
                  <MapPin className="size-3 text-primary" />
                  14 Stroud Rd, East Kilbride
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NavButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      {active && (
        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
      )}
    </button>
  );
}

function MobileNavButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-foreground ring-1 ring-primary/30"
          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
      )}
    >
      {label}
      {active && <span className="size-1.5 rounded-full bg-primary" />}
    </button>
  );
}

export default Header;
