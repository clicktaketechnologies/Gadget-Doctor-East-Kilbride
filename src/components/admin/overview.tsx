"use client";

import {
  Wrench,
  Truck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Clock,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useStats, useBookings } from "@/lib/api-hooks";
import { useAppStore } from "@/lib/store";
import { formatPrice, relativeTime, STATUS_COLORS, deviceLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CHART = {
  cyan: "oklch(0.62 0.24 27)",
  amber: "oklch(0.82 0.16 80)",
  emerald: "oklch(0.7 0.19 150)",
  violet: "oklch(0.65 0.22 300)",
  rose: "oklch(0.7 0.2 20)",
};

const PIE_COLORS = [CHART.cyan, CHART.amber, CHART.violet, CHART.emerald, CHART.rose];

const TOOLTIP_STYLE = {
  background: "oklch(0.21 0.025 250)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 8,
  color: "oklch(0.97 0.01 240)",
  fontSize: 12,
} as const;

const AXIS_TICK = { fill: "oklch(0.7 0.02 250)", fontSize: 12 } as const;
const AXIS_STROKE = "oklch(1 0 0 / 0.1)";
const GRID_STROKE = "oklch(1 0 0 / 0.06)";

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export function Overview() {
  const statsQ = useStats();
  const bookingsQ = useBookings();
  const setAdminModule = useAppStore((s) => s.setAdminModule);

  const stats = statsQ.data;
  const recent = (bookingsQ.data ?? [])
    .slice()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          onClick={() => setAdminModule("bookings")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Wrench className="size-4" />
          Add New Repair Ticket
        </Button>
        <Button variant="outline" onClick={() => setAdminModule("services")}>
          <DollarSign className="size-4" />
          Update Pricing
        </Button>
        <Button variant="outline" onClick={() => setAdminModule("content")}>
          <ArrowRight className="size-4" />
          Post Announcement Banner
        </Button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Repair Requests"
          value={statsQ.isLoading ? null : stats?.total ?? 0}
          icon={Wrench}
          tint="cyan"
        />
        <MetricCard
          label="Pending Collections"
          value={statsQ.isLoading ? null : stats?.collectionPending ?? 0}
          icon={Truck}
          tint="amber"
        />
        <MetricCard
          label="Completed Jobs"
          value={statsQ.isLoading ? null : stats?.completed ?? 0}
          icon={CheckCircle2}
          tint="emerald"
        />
        <MetricCard
          label="Monthly Revenue"
          value={statsQ.isLoading ? null : formatPrice(stats?.revenue ?? 0)}
          icon={DollarSign}
          tint="cyan"
          isString
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Trend chart */}
        <Card className="glass p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Repair Requests
              </h3>
              <p className="text-xs text-muted-foreground">Last 14 days</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary">
              <span className="size-2 rounded-full bg-primary" />
              Requests
            </div>
          </div>
          <div className="h-[260px] w-full">
            {statsQ.isLoading || !stats ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.statusTrend}
                  margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART.cyan} stopOpacity={0.45} />
                      <stop offset="95%" stopColor={CHART.cyan} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    tick={AXIS_TICK}
                    stroke={AXIS_STROKE}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                  />
                  <YAxis
                    tick={AXIS_TICK}
                    stroke={AXIS_STROKE}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    width={36}
                  />
                  <RTooltip
                    contentStyle={TOOLTIP_STYLE}
                    labelFormatter={(l) => formatShortDate(String(l))}
                    formatter={(v: number) => [`${v} requests`, "Requests"]}
                    cursor={{ stroke: CHART.cyan, strokeOpacity: 0.3 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={CHART.cyan}
                    strokeWidth={2.5}
                    fill="url(#trendFill)"
                    activeDot={{ r: 4, fill: CHART.cyan, stroke: "oklch(0.16 0.02 250)", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Device breakdown pie */}
        <Card className="glass p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Jobs by Device Type</h3>
            <p className="text-xs text-muted-foreground">All-time distribution</p>
          </div>
          <div className="h-[260px] w-full">
            {statsQ.isLoading || !stats ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : stats.deviceBreakdown.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.deviceBreakdown.map((d) => ({
                      ...d,
                      label: deviceLabel(d.deviceType),
                    }))}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={84}
                    paddingAngle={2}
                    stroke="oklch(0.16 0.02 250)"
                    strokeWidth={2}
                  >
                    {stats.deviceBreakdown.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RTooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number, n: string) => [`${v} jobs`, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {stats && stats.deviceBreakdown.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {stats.deviceBreakdown.slice(0, 6).map((d, i) => (
                <div key={d.deviceType} className="flex items-center gap-2 text-xs">
                  <span
                    className="size-2.5 shrink-0 rounded-sm"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="truncate text-muted-foreground">
                    {deviceLabel(d.deviceType)}
                  </span>
                  <span className="ml-auto font-medium text-foreground">{d.count}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Status breakdown + recent bookings */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Status breakdown */}
        <Card className="glass p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Status Breakdown</h3>
          {statsQ.isLoading || !stats ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <StatusRow
                label="Pending"
                count={stats.pending}
                total={stats.total}
                color={CHART.amber}
              />
              <StatusRow
                label="In Progress"
                count={stats.inProgress}
                total={stats.total}
                color={CHART.cyan}
              />
              <StatusRow
                label="Ready"
                count={stats.ready}
                total={stats.total}
                color={CHART.violet}
              />
              <StatusRow
                label="Completed"
                count={stats.completed}
                total={stats.total}
                color={CHART.emerald}
              />
            </div>
          )}
          <div className="mt-4 rounded-lg border border-border/60 bg-secondary/20 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Completed revenue</span>
              <span className="font-semibold text-emerald-300">
                {formatPrice(stats?.revenueCompleted ?? 0)}
              </span>
            </div>
          </div>
        </Card>

        {/* Recent bookings */}
        <Card className="glass p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Recent Bookings</h3>
              <p className="text-xs text-muted-foreground">Latest repair requests</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAdminModule("bookings")}
              className="gap-1.5 text-primary hover:text-primary"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          {bookingsQ.isLoading ? (
            <div className="space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No bookings yet
            </div>
          ) : (
            <div className="space-y-1">
              {recent.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setAdminModule("bookings")}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-secondary/40"
                >
                  <div className="shrink-0 font-mono text-xs font-medium text-primary">
                    {b.ticketId}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">
                      {b.customerName}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {deviceLabel(b.deviceType)} · {b.deviceModel}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("hidden border sm:inline-flex", STATUS_COLORS[b.status])}
                  >
                    {b.status}
                  </Badge>
                  <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {relativeTime(b.createdAt)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

const TINTS: Record<string, { bg: string; text: string; ring: string }> = {
  cyan: { bg: "bg-primary/10", text: "text-primary", ring: "ring-primary/30" },
  amber: { bg: "bg-amber-400/10", text: "text-amber-300", ring: "ring-amber-400/30" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-300", ring: "ring-emerald-500/30" },
};

function MetricCard({
  label,
  value,
  icon: Icon,
  tint,
  isString,
}: {
  label: string;
  value: number | string | null;
  icon: LucideIcon;
  tint: keyof typeof TINTS | string;
  isString?: boolean;
}) {
  const t = TINTS[tint] ?? TINTS.cyan;
  return (
    <Card className="glass relative overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          {value === null ? (
            <Skeleton className="mt-2 h-8 w-20 rounded-md" />
          ) : (
            <div className="mt-2 truncate text-2xl font-bold text-foreground sm:text-3xl">
              {isString ? value : (value as number).toLocaleString("en-GB")}
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1",
            t.bg,
            t.text,
            t.ring
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}

function StatusRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ background: color }} />
          <span className="text-muted-foreground">{label}</span>
        </div>
        <span className="font-semibold text-foreground">{count}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default Overview;
