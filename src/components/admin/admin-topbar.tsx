"use client";

import { useState } from "react";
import { Menu, Bell, Search, Globe, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore, type AdminModule } from "@/lib/store";
import { ADMIN_DEMO } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminTopbarProps {
  onMenuClick: () => void;
  search: string;
  onSearchChange: (v: string) => void;
}

const MODULE_META: Record<AdminModule, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Dashboard analytics & activity" },
  bookings: { title: "Bookings", subtitle: "Manage repair tickets" },
  services: { title: "Services & Pricing", subtitle: "Catalog & price management" },
  reviews: { title: "Reviews", subtitle: "Moderate customer testimonials" },
  content: { title: "Content", subtitle: "Banners & site messaging" },
  branding: { title: "Branding", subtitle: "Business identity, contact & hours" },
  blog: { title: "Blog", subtitle: "Write & manage articles" },
  pages: { title: "Pages", subtitle: "Edit text & images on public pages" },
  email: { title: "Email", subtitle: "SMTP config & sent email log" },
  settings: { title: "Settings", subtitle: "Password & account settings" },
};

export function AdminTopbar({ onMenuClick, search, onSearchChange }: AdminTopbarProps) {
  const router = useRouter();
  const adminModule = useAppStore((s) => s.adminModule);
  const setAdminModule = useAppStore((s) => s.setAdminModule);
  const adminName = useAppStore((s) => s.adminName);
  const meta = MODULE_META[adminModule];

  // Reload-on-click refresh: simplest way to pull fresh data from every
  // API route at once. Spinner shows while the page tears down.
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // Defer the reload a tick so the spinner state can flush to the DOM.
    window.setTimeout(() => window.location.reload(), 120);
  };

  const initials =
    (adminName ?? ADMIN_DEMO.name)
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "A";

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 px-4 md:px-6">
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </Button>

      {/* Title */}
      <div className="min-w-0 flex-1 lg:flex-none">
        <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
          {meta.title}
        </h1>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          {meta.subtitle}
        </p>
      </div>

      {/* Refresh */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="hidden shrink-0 gap-2 sm:inline-flex"
        aria-label="Refresh data"
      >
        <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
        <span className="hidden md:inline">
          {isRefreshing ? "Refreshing…" : "Refresh"}
        </span>
      </Button>

      {/* Search */}
      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tickets, customers…"
          value={search}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setAdminModule("bookings");
          }}
          className="pl-9"
          aria-label="Search bookings"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Public site switch */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/")}
          className="hidden gap-2 sm:inline-flex"
        >
          <Globe className="size-4" />
          <span className="hidden md:inline">View Public Site</span>
          <span className="md:hidden">Site</span>
        </Button>

        {/* Bell */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="size-5" />
          <span
            className={cn(
              "absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background"
            )}
          />
        </Button>

        {/* Avatar */}
        <div className="ml-1 flex items-center gap-2.5 rounded-full border border-border/60 bg-secondary/30 py-1 pl-1 pr-3">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary ring-1 ring-primary/30">
            {initials}
          </div>
          <span className="hidden text-sm font-medium text-foreground sm:block">
            {adminName ?? ADMIN_DEMO.name}
          </span>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
