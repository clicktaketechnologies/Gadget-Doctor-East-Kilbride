"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Truck,
  X,
  Inbox,
  Clock,
} from "lucide-react";
import { useBookings } from "@/lib/api-hooks";
import { SERVICE_CATEGORIES } from "@/lib/brand";
import { STATUS_COLORS, relativeTime } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingDetailModal } from "./booking-detail-modal";

const DEVICE_LABELS: Record<string, string> = {
  phone: "Phones",
  laptop: "Laptops",
  macbook: "MacBooks",
  console: "Consoles",
  ghd: "GHDs",
  "data-recovery": "Data Recovery",
};

const STATUS_FILTERS: (BookingStatus | "All")[] = [
  "All",
  "Pending",
  "In Progress",
  "Ready",
  "Completed",
  "Cancelled",
];

interface BookingsManagerProps {
  search: string;
  onSearchChange: (v: string) => void;
}

export function BookingsManager({ search, onSearchChange }: BookingsManagerProps) {
  const bookingsQ = useBookings();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "All">("All");
  const [deviceFilter, setDeviceFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const list = bookingsQ.data ?? [];
    const q = search.trim().toLowerCase();
    return list
      .filter((b) => statusFilter === "All" || b.status === statusFilter)
      .filter((b) => deviceFilter === "All" || b.deviceType === deviceFilter)
      .filter((b) => {
        if (!q) return true;
        return (
          b.customerName.toLowerCase().includes(q) ||
          b.ticketId.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [bookingsQ.data, search, statusFilter, deviceFilter]);

  const hasActiveFilters =
    statusFilter !== "All" || deviceFilter !== "All" || search.trim() !== "";

  const resetFilters = () => {
    setStatusFilter("All");
    setDeviceFilter("All");
    onSearchChange("");
  };

  const openBooking = (b: Booking) => {
    setSelected(b);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <Card className="glass p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, ticket ID, phone or email…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
              aria-label="Search bookings"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Filter className="size-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as BookingStatus | "All")}
              >
                <SelectTrigger className="w-[150px]" aria-label="Filter by status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "All" ? "All statuses" : s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
              <SelectTrigger className="w-[150px]" aria-label="Filter by device type">
                <SelectValue placeholder="Device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All devices</SelectItem>
                {SERVICE_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5">
                <X className="size-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {bookingsQ.isLoading
              ? "Loading…"
              : `${filtered.length} of ${bookingsQ.data?.length ?? 0} tickets`}
          </span>
        </div>
      </Card>

      {/* Table */}
      <Card className="glass p-0">
        <div className="overflow-x-auto custom-scroll">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="pl-4">Ticket</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Device</TableHead>
                <TableHead className="max-w-[220px]">Issue</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingsQ.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-border/60">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <TableCell key={j} className={j === 0 ? "pl-4" : ""}>
                        <Skeleton className="h-5 w-full max-w-[120px] rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableCell colSpan={8} className="h-48">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-secondary/40">
                        <Inbox className="size-6 text-muted-foreground" />
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        No tickets found
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {hasActiveFilters
                          ? "Try adjusting your filters."
                          : "New repair requests will appear here."}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((b) => (
                  <TableRow
                    key={b.id}
                    className="cursor-pointer border-border/60"
                    onClick={() => openBooking(b)}
                  >
                    <TableCell className="pl-4">
                      <span className="font-mono text-xs font-medium text-primary">
                        {b.ticketId}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {b.customerName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {b.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                          {DEVICE_LABELS[b.deviceType] ?? b.deviceType}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {b.deviceModel}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <span className="line-clamp-1 text-sm text-muted-foreground">
                        {b.issue}
                      </span>
                    </TableCell>
                    <TableCell>
                      {b.needsCollection ? (
                        <Badge
                          variant="outline"
                          className="border-amber-500/30 bg-amber-500/10 text-amber-300"
                        >
                          <Truck className="size-3" />
                          Yes
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("border", STATUS_COLORS[b.status])}
                      >
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {relativeTime(b.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          openBooking(b);
                        }}
                        aria-label={`View ticket ${b.ticketId}`}
                      >
                        <Eye className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <BookingDetailModal
        booking={selected}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

export default BookingsManager;
