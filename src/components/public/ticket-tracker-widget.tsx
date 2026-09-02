"use client";

import { useState, type FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Module-level "pending ticket" pass-through.
 * The compact TicketTrackerWidget writes a ticket ID here on submit,
 * and the full TrackSection reads + clears it on mount.
 *
 * This avoids touching the global Zustand store (which we cannot modify)
 * while still letting the widget pre-fill the full track page input.
 */
let pendingTicketId: string | null = null;

export function setPendingTicketId(id: string | null) {
  pendingTicketId = id;
}

export function consumePendingTicketId(): string | null {
  const v = pendingTicketId;
  pendingTicketId = null;
  return v;
}

interface TicketTrackerWidgetProps {
  /** Visual style: "compact" (single inline row) or "ghost" (subtle, no border). */
  variant?: "compact" | "ghost";
  className?: string;
  /** Hide the label/icon prefix to save space (e.g. inside the footer). */
  bare?: boolean;
  /** Optional placeholder override. */
  placeholder?: string;
}

/**
 * Compact ticket-tracker input — used in header / footer / home sidebar.
 * On submit, navigates to the track page (track-section has its own input +
 * result view). If the user typed a ticket ID, it is pre-filled via the
 * pending-ticket pass-through above.
 */
export function TicketTrackerWidget({
  variant = "compact",
  className,
  bare = false,
  placeholder = "Track ticket (GD-XXXX)",
}: TicketTrackerWidgetProps) {
  const setPublicPage = useAppStore((s) => s.setPublicPage);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) setPendingTicketId(trimmed);
    setLoading(true);
    // tiny delay so the user perceives the click; nav happens immediately
    setTimeout(() => {
      setPublicPage("track");
      setLoading(false);
      setValue("");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 120);
  };

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="Track your repair ticket"
      className={cn(
        "group flex items-center gap-1.5",
        variant === "compact" &&
          "rounded-lg border border-border bg-background/60 p-1 focus-within:border-primary/60",
        variant === "ghost" && "rounded-lg bg-transparent",
        className
      )}
    >
      {!bare && (
        <Search className="ml-1.5 size-3.5 shrink-0 text-muted-foreground group-focus-within:text-primary" />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Ticket ID"
        className={cn(
          "min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none",
          bare ? "px-2 py-1.5" : "px-1 py-1"
        )}
      />
      <button
        type="submit"
        aria-label="Track repair"
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
          loading && "opacity-70"
        )}
      >
        {loading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Search className="size-3.5" />
        )}
        <span className="hidden sm:inline">Track</span>
      </button>
    </form>
  );
}

export default TicketTrackerWidget;
