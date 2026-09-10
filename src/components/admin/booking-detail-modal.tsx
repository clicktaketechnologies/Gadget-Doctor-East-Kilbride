"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Truck,
  Clock,
  Save,
  Loader2,
  Trash2,
  AlertCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { useUpdateBooking, useDeleteBooking, useSendEmail } from "@/lib/api-hooks";
import { useToast } from "@/hooks/use-toast";
import type { Booking, BookingStatus } from "@/lib/types";
import { STATUS_COLORS, formatDateTime, formatPrice, deviceLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_STATUSES: BookingStatus[] = [
  "Pending",
  "In Progress",
  "Ready",
  "Completed",
  "Cancelled",
];

interface BookingDetailModalProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailModal({
  booking,
  open,
  onOpenChange,
}: BookingDetailModalProps) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // Key remount ensures fresh local state whenever a different booking is opened
        key={booking.id}
        className="glass-strong max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <BookingDetailBody booking={booking} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function BookingDetailBody({
  booking,
  onDone,
}: {
  booking: Booking;
  onDone: () => void;
}) {
  const updateMutation = useUpdateBooking(booking.id);
  const deleteMutation = useDeleteBooking();
  const { toast } = useToast();

  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [quotedPrice, setQuotedPrice] = useState<string>(
    booking.quotedPrice != null ? String(booking.quotedPrice / 100) : ""
  );
  const [finalPrice, setFinalPrice] = useState<string>(
    booking.finalPrice != null ? String(booking.finalPrice / 100) : ""
  );
  const [notes, setNotes] = useState<string>(booking.technicianNotes ?? "");
  const [notify, setNotify] = useState(false);

  const handleSave = () => {
    const payload: {
      status?: BookingStatus;
      technicianNotes?: string;
      quotedPrice?: number | null;
      finalPrice?: number | null;
    } = {
      status,
      technicianNotes: notes,
      quotedPrice: quotedPrice === "" ? null : Math.round(Number(quotedPrice) * 100),
      finalPrice: finalPrice === "" ? null : Math.round(Number(finalPrice) * 100),
    };
    updateMutation.mutate(payload, {
      onSuccess: () => {
        if (notify) {
          toast({
            title: "Customer notified",
            description: "Update sent via SMS & email.",
          });
        }
        onDone();
      },
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(booking.id, { onSuccess: onDone });
  };

  return (
    <>
      <DialogHeader className="border-b border-border/60 p-5 pr-12">
        <div className="flex flex-wrap items-center gap-2.5">
          <DialogTitle className="font-mono text-base text-primary">
            {booking.ticketId}
          </DialogTitle>
          <Badge
            variant="outline"
            className={cn("border", STATUS_COLORS[booking.status])}
          >
            {booking.status}
          </Badge>
        </div>
        <DialogDescription className="text-sm">
          <span className="font-medium text-foreground">{booking.customerName}</span>{" "}
          · {deviceLabel(booking.deviceType)} ·{" "}
          {booking.deviceModel}
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-[calc(92vh-180px)] overflow-y-auto custom-scroll p-5">
        {/* Customer info */}
        <Section title="Customer">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <InfoRow label="Name" value={booking.customerName} />
            <InfoRow
              label="Contact"
              value={
                <div className="flex flex-col gap-1">
                  <a
                    href={`mailto:${booking.email}`}
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <Mail className="size-3.5" />
                    {booking.email}
                  </a>
                  <a
                    href={`tel:${booking.phone}`}
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <Phone className="size-3.5" />
                    {booking.phone}
                  </a>
                </div>
              }
            />
          </div>
        </Section>

        <Separator className="my-4" />

        {/* Device & issue */}
        <Section title="Device & Issue">
          <div className="space-y-2.5">
            <InfoRow
              label="Device"
              value={`${deviceLabel(booking.deviceType)} · ${booking.deviceModel}`}
            />
            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                Issue
              </div>
              <p className="rounded-md bg-secondary/30 p-2.5 text-sm text-foreground">
                {booking.issue}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <InfoRow
                label="Collection"
                value={
                  booking.needsCollection ? (
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-300"
                      >
                        <Truck className="size-3" />
                        Yes
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No</span>
                  )
                }
              />
              {booking.needsCollection && booking.collectionAddr && (
                <InfoRow label="Collection address" value={booking.collectionAddr} />
              )}
            </div>
            <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              Created {formatDateTime(booking.createdAt)} · Updated{" "}
              {formatDateTime(booking.updatedAt)}
            </div>
          </div>
        </Section>

        <Separator className="my-4" />

        {/* Edit controls */}
        <Section title="Update Ticket">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bd-status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as BookingStatus)}>
                <SelectTrigger id="bd-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bd-quoted">Quoted price (£)</Label>
                <Input
                  id="bd-quoted"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 49.00"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bd-final">Final price (£)</Label>
                <Input
                  id="bd-final"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 55.00"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bd-notes">Technician notes</Label>
              <Textarea
                id="bd-notes"
                rows={4}
                placeholder="Internal notes, diagnosis, parts ordered…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <label
              htmlFor="bd-notify"
              className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/20 p-3"
            >
              <Checkbox
                id="bd-notify"
                checked={notify}
                onCheckedChange={(v) => setNotify(v === true)}
                className="mt-0.5"
              />
              <span className="text-sm">
                <span className="font-medium text-foreground">
                  Send SMS / email update to customer
                </span>
                <span className="block text-xs text-muted-foreground">
                  Notifies {booking.customerName} that their ticket status changed.
                </span>
              </span>
            </label>

            {(booking.quotedPrice != null || booking.finalPrice != null) && (
              <div className="flex gap-4 text-xs text-muted-foreground">
                {booking.quotedPrice != null && (
                  <span>Quoted: {formatPrice(booking.quotedPrice)}</span>
                )}
                {booking.finalPrice != null && (
                  <span>Paid: {formatPrice(booking.finalPrice)}</span>
                )}
              </div>
            )}
          </div>
        </Section>

        <Separator className="my-4" />

        {/* Reply to customer */}
        <ReplyToCustomer booking={booking} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-secondary/20 p-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="size-4" />
              Delete ticket
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this repair ticket?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove <strong>{booking.ticketId}</strong> for{" "}
                {booking.customerName}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete ticket"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex items-center gap-2">
          {updateMutation.isError && (
            <span className="hidden items-center gap-1.5 text-xs text-rose-300 sm:flex">
              <AlertCircle className="size-3.5" />
              {updateMutation.error?.message ?? "Save failed"}
            </span>
          )}
          <Button variant="outline" onClick={onDone} disabled={updateMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

function ReplyToCustomer({ booking }: { booking: Booking }) {
  const sendMutation = useSendEmail();
  const [expanded, setExpanded] = useState(false);

  const buildDefaultSubject = () => `Update on your repair ${booking.ticketId}`;
  const buildDefaultBody = () =>
    `Hi ${booking.customerName},\n\n` +
    `Your repair (${booking.ticketId}) status is now: ${booking.status}.\n\n` +
    `Device: ${deviceLabel(booking.deviceType)} · ${booking.deviceModel}\n` +
    `Issue: ${booking.issue}\n\n` +
    `[Add your message here]\n\n` +
    `Best regards,\n` +
    `Gadget Doctor East Kilbride\n` +
    `+44 7777 200175`;

  const [subject, setSubject] = useState(buildDefaultSubject);
  const [body, setBody] = useState(buildDefaultBody);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    sendMutation.mutate(
      {
        toEmail: booking.email,
        subject: subject.trim() || buildDefaultSubject(),
        body,
        relatedBookingId: booking.id,
      },
      {
        onSuccess: () => {
          setSent(true);
          setExpanded(false);
        },
      }
    );
  };

  const handleReset = () => {
    setSubject(buildDefaultSubject());
    setBody(buildDefaultBody());
    setSent(false);
  };

  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Reply to Customer
      </h3>

      {sent ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
          <div className="flex items-center gap-2 text-sm text-emerald-300">
            <Check className="size-4" />
            <span>Email sent to {booking.email}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            Compose another
          </Button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-border/60 bg-secondary/20 px-3 py-2.5 text-left transition-colors hover:bg-secondary/40"
            aria-expanded={expanded}
          >
            <span className="flex items-center gap-2.5 text-sm">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Mail className="size-4" />
              </span>
              <span className="font-medium text-foreground">
                Email {booking.customerName}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {booking.email}
              </span>
            </span>
            {expanded ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 rounded-lg border border-border/60 bg-secondary/20 p-3">
              <div className="space-y-1.5">
                <Label htmlFor="rpl-to">To</Label>
                <Input
                  id="rpl-to"
                  value={booking.email}
                  readOnly
                  className="bg-background/40 text-muted-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rpl-subject">Subject</Label>
                <Input
                  id="rpl-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rpl-body">Message</Label>
                <Textarea
                  id="rpl-body"
                  rows={10}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              <p className="text-[11px] text-muted-foreground">
                Sends an email to the customer. Requires SMTP to be configured
                in Email Settings; otherwise the email is logged but not
                actually delivered.
              </p>

              {sendMutation.isError && (
                <div className="flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{sendMutation.error?.message ?? "Email failed"}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={handleSend}
                  disabled={sendMutation.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {sendMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send Email
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={sendMutation.isPending}
                >
                  Reset template
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(false)}
                  disabled={sendMutation.isPending}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default BookingDetailModal;
