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
  CalendarDays,
  CalendarRange,
  AlertCircle,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useBookings, useDeleteBooking } from "@/lib/api-hooks";
import { SERVICE_CATEGORIES } from "@/lib/brand";
import {
  STATUS_COLORS,
  formatDate,
  relativeTime,
  deviceLabel,
} from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BookingDetailModal } from "./booking-detail-modal";

const STATUS_FILTERS: (BookingStatus | "All")[] = [
  "All",
  "Pending",
  "In Progress",
  "Ready",
  "Completed",
  "Cancelled",
];

const TABLE_COLUMN_COUNT = 9;

/** Returns `yyyy-mm-dd` for the given Date in local time. */
function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Monday of the current week (Sun → previous Monday). */
function startOfWeek(d: Date): Date {
  const monday = new Date(d);
  const day = monday.getDay(); // 0 = Sun, 1 = Mon, ...
  const offset = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + offset);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

interface BookingsManagerProps {
  search: string;
  onSearchChange: (v: string) => void;
}

export function BookingsManager({
  search,
  onSearchChange,
}: BookingsManagerProps) {
  const bookingsQ = useBookings();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "All">(
    "All"
  );
  const [deviceFilter, setDeviceFilter] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const deleteMutation = useDeleteBooking();

  // ---- Pagination ----
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  // Tracks the last seen filter combo so we can reset to page 1 whenever
  // any filter changes. Stored as a string signature for cheap comparison.
  const filterSignature = `${search}|${statusFilter}|${deviceFilter}|${dateFrom}|${dateTo}`;
  const [prevFilterSignature, setPrevFilterSignature] = useState(filterSignature);

  const dateFilterActive = !!dateFrom || !!dateTo;

  const filtered = useMemo(() => {
    const list = bookingsQ.data ?? [];
    const q = search.trim().toLowerCase();
    return list
      .filter((b) => statusFilter === "All" || b.status === statusFilter)
      .filter((b) => deviceFilter === "All" || b.deviceType === deviceFilter)
      .filter((b) => {
        if (!dateFrom && !dateTo) return true;
        if (!b.bookingDate) return false;
        const bd = b.bookingDate.slice(0, 10);
        if (dateFrom && bd < dateFrom) return false;
        if (dateTo && bd > dateTo) return false;
        return true;
      })
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
  }, [bookingsQ.data, search, statusFilter, deviceFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Auto-advance: if the current page is past the last valid page (e.g. a
  // booking was deleted or filter shrank the list), jump back to the last
  // valid page so the user never lands on an empty page. We adjust state
  // during render (self-correcting pattern recommended by React docs)
  // instead of using an effect, which avoids cascading renders.
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
  // Reset to page 1 whenever the active filters change.
  if (filterSignature !== prevFilterSignature) {
    setPrevFilterSignature(filterSignature);
    setCurrentPage(1);
  }

  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(
    () =>
      filtered.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
      ),
    [filtered, safePage, pageSize]
  );

  const rangeStart =
    paginated.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, filtered.length);

  const hasActiveFilters =
    statusFilter !== "All" ||
    deviceFilter !== "All" ||
    search.trim() !== "" ||
    dateFilterActive;

  const resetFilters = () => {
    setStatusFilter("All");
    setDeviceFilter("All");
    setDateFrom("");
    setDateTo("");
    onSearchChange("");
  };

  const setToday = () => {
    const iso = toISODate(new Date());
    setDateFrom(iso);
    setDateTo(iso);
  };

  const setThisWeek = () => {
    const monday = startOfWeek(new Date());
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    setDateFrom(toISODate(monday));
    setDateTo(toISODate(sunday));
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
                onValueChange={(v) =>
                  setStatusFilter(v as BookingStatus | "All")
                }
              >
                <SelectTrigger
                  className="w-[150px]"
                  aria-label="Filter by status"
                >
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
              <SelectTrigger
                className="w-[150px]"
                aria-label="Filter by device type"
              >
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
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="gap-1.5"
              >
                <X className="size-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Date filter row */}
        <div className="mt-3 flex flex-col gap-3 border-t border-border/60 pt-3 sm:flex-row sm:items-end sm:flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <CalendarRange className="size-3.5" />
            Booking date
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="space-y-1">
              <Label
                htmlFor="bk-filter-from"
                className="text-[10px] uppercase tracking-wider text-muted-foreground"
              >
                From
              </Label>
              <Input
                id="bk-filter-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 w-[160px] [color-scheme:dark]"
                aria-label="Filter from date"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="bk-filter-to"
                className="text-[10px] uppercase tracking-wider text-muted-foreground"
              >
                To
              </Label>
              <Input
                id="bk-filter-to"
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 w-[160px] [color-scheme:dark]"
                aria-label="Filter to date"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={setToday}
              className="h-9 gap-1.5"
            >
              <CalendarDays className="size-3.5" />
              Today
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={setThisWeek}
              className="h-9 gap-1.5"
            >
              <CalendarRange className="size-3.5" />
              This Week
            </Button>
            {dateFilterActive && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
                className="h-9 gap-1.5 text-muted-foreground"
              >
                <X className="size-3.5" />
                Clear dates
              </Button>
            )}
          </div>
        </div>

        {/* Summary line */}
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span>
            {bookingsQ.isLoading
              ? "Loading…"
              : `${filtered.length} of ${bookingsQ.data?.length ?? 0} tickets`}
          </span>
          {dateFilterActive && (
            <>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-foreground/80">
                {filtered.length} booking{filtered.length === 1 ? "" : "s"}{" "}
                between{" "}
                <span className="font-medium text-foreground">
                  {dateFrom ? formatDate(dateFrom) : "any time"}
                </span>{" "}
                and{" "}
                <span className="font-medium text-foreground">
                  {dateTo ? formatDate(dateTo) : "any time"}
                </span>
              </span>
            </>
          )}
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
                <TableHead>Booking Date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingsQ.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-border/60">
                    {Array.from({ length: TABLE_COLUMN_COUNT }).map((__, j) => (
                      <TableCell
                        key={j}
                        className={j === 0 ? "pl-4" : j === 8 ? "pr-4" : ""}
                      >
                        <Skeleton className="h-5 w-full max-w-[120px] rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : bookingsQ.isError ? (
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableCell colSpan={TABLE_COLUMN_COUNT} className="h-48">
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-rose-500/10">
                        <AlertCircle className="size-6 text-rose-400" />
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        Failed to load bookings
                      </div>
                      <div className="max-w-md text-xs text-muted-foreground">
                        {bookingsQ.error?.message || "Your session may have expired. Please sign out and sign in again."}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => bookingsQ.refetch()}
                        className="mt-1 gap-1.5"
                      >
                        <RotateCcw className="size-3.5" />
                        Retry
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableCell colSpan={TABLE_COLUMN_COUNT} className="h-48">
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
                paginated.map((b) => (
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
                          {deviceLabel(b.deviceType)}
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
                      {b.bookingDate ? (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1 text-sm text-foreground">
                            <CalendarDays className="size-3 text-primary" />
                            {formatDate(b.bookingDate)}
                          </span>
                          {b.bookingTime && (
                            <span className="inline-flex items-center gap-1 pl-4 text-xs text-muted-foreground">
                              <Clock className="size-3" />
                              {b.bookingTime}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {relativeTime(b.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(b);
                          }}
                          aria-label={`Delete ticket ${b.ticketId}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer */}
        <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {bookingsQ.isLoading || bookingsQ.isError
              ? "\u00A0"
              : filtered.length === 0
              ? `0 of ${filtered.length} tickets`
              : `Showing ${rangeStart} to ${rangeEnd} of ${filtered.length} tickets`}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) => Math.max(1, Math.min(p, totalPages) - 1))
              }
              disabled={safePage <= 1 || bookingsQ.isLoading}
              className="gap-1.5"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <span className="px-1 text-xs text-muted-foreground">
              Page{" "}
              <span className="font-semibold text-foreground">
                {safePage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {totalPages}
              </span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, Math.min(p, totalPages) + 1)
                )
              }
              disabled={
                safePage >= totalPages || bookingsQ.isLoading
              }
              className="gap-1.5"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </Card>

      <BookingDetailModal
        booking={selected}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete ticket {deleteTarget?.ticketId}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the booking for{" "}
              <strong>{deleteTarget?.customerName}</strong> ({deleteTarget?.deviceModel}).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate(deleteTarget.id, {
                    onSuccess: () => setDeleteTarget(null),
                  });
                }
              }}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete ticket"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default BookingsManager;
