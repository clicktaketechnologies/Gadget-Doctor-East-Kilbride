// Formatting helpers

/** pence -> "£49" */
export function formatPrice(pence: number | null | undefined): string {
  if (pence == null) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: pence % 100 === 0 ? 0 : 2,
  }).format(pence / 100);
}

/** pence range -> "£49 - £89" */
export function formatPriceRange(from: number, to: number): string {
  if (from === to) return formatPrice(from);
  return `${formatPrice(from)} – ${formatPrice(to)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export function genTicketId(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `GD-${n}`;
}

export const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "In Progress": "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  Ready: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  Completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Cancelled: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};
