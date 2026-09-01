"use client";

import { useState } from "react";
import { Wrench, Phone, Menu, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppStore, type PublicPage } from "@/lib/store";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const NAV: { label: string; page: PublicPage }[] = [
  { label: "Home", page: "home" },
  { label: "Services", page: "services" },
  { label: "Collection Service", page: "collection" },
  { label: "Reviews", page: "reviews" },
  { label: "Contact", page: "contact" },
];

export function Header() {
  const publicPage = useAppStore((s) => s.publicPage);
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const openBooking = useAppStore((s) => s.openBooking);
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (p: PublicPage) => {
    setPublicPage(p);
    setMobileOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => go("home")}
          className="group flex items-center gap-2.5 outline-none"
          aria-label={`${BRAND.fullName} — Home`}
        >
          <span className="relative grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
            <Wrench className="size-5" />
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-amber-400 ring-2 ring-background" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-foreground">
              {BRAND.name}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
              East Kilbride
            </span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = publicPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => go(item.page)}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <a href={`tel:${BRAND.phones[1].replace(/\s+/g, "")}`} aria-label="Call the shop">
              <Phone className="size-4 text-primary" />
              <span className="hidden lg:inline">{BRAND.phones[1]}</span>
              <span className="lg:hidden">Call</span>
            </a>
          </Button>
          <Button
            onClick={() => openBooking()}
            size="sm"
            className="bg-amber-400 text-slate-950 hover:bg-amber-300 font-semibold shadow-lg shadow-amber-500/20"
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
            <a href={`tel:${BRAND.phones[1].replace(/\s+/g, "")}`}>
              <Phone className="size-5" />
            </a>
          </Button>
          <Button
            onClick={() => openBooking()}
            size="sm"
            className="bg-amber-400 text-slate-950 hover:bg-amber-300 font-semibold shadow-lg shadow-amber-500/20"
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
                  <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <Wrench className="size-4" />
                  </span>
                  {BRAND.name}
                </span>
              </SheetTitle>
              <nav className="flex flex-col gap-1 px-2 pt-4">
                {NAV.map((item) => {
                  const active = publicPage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => go(item.page)}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-foreground ring-1 ring-primary/30"
                          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                      )}
                    >
                      {item.label}
                      {active && <span className="size-1.5 rounded-full bg-primary" />}
                    </button>
                  );
                })}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-center"
                >
                  <a href={`tel:${BRAND.phones[1].replace(/\s+/g, "")}`}>
                    <Phone className="size-4 text-primary" />
                    {BRAND.phones[1]}
                  </a>
                </Button>
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    openBooking();
                  }}
                  className="w-full justify-center bg-amber-400 text-slate-950 hover:bg-amber-300 font-semibold shadow-lg shadow-amber-500/20"
                >
                  <CalendarCheck className="size-4" />
                  Book a Repair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
