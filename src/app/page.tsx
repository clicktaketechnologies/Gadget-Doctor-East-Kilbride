"use client";

import { useAppStore } from "@/lib/store";
import PublicSite from "@/components/public/public-site";
import AdminPanel from "@/components/admin/admin-panel";
import { LayoutDashboard, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  return (
    <>
      {view === "public" ? <PublicSite /> : <AdminPanel />}

      {/* Floating tab switcher — easy preview between Public Website & Admin Dashboard */}
      <div className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2">
        <div className="glass-strong flex items-center gap-1 rounded-full p-1 shadow-2xl shadow-black/40">
          <button
            onClick={() => setView("public")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
              view === "public"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="View public website"
          >
            <Globe className="size-4" />
            <span className="hidden sm:inline">Public Website</span>
          </button>
          <button
            onClick={() => setView("admin")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
              view === "admin"
                ? "bg-accent text-accent-foreground shadow-md shadow-accent/30"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="View admin dashboard"
          >
            <LayoutDashboard className="size-4" />
            <span className="hidden sm:inline">Admin Dashboard</span>
          </button>
        </div>
      </div>
    </>
  );
}
