"use client";

import { useState } from "react";
import { UserPlus, Loader2, Check, ChevronRight } from "lucide-react";
import { useCreateBooking } from "@/lib/api-hooks";
import { SERVICE_CATEGORIES, DEVICE_MODELS, COMMON_ISSUES } from "@/lib/brand";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function WalkInCustomer() {
  const createBooking = useCreateBooking();
  const { toast } = useToast();

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [issue, setIssue] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [needsCollection, setNeedsCollection] = useState(false);
  const [collectionAddr, setCollectionAddr] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const toggleIssue = (i: string) => {
    setSelectedIssues((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const models = deviceType ? DEVICE_MODELS[deviceType] ?? [] : [];

  const canSubmit =
    customerName.trim() &&
    email.trim() &&
    phone.trim().length >= 7 &&
    deviceType &&
    deviceModel &&
    (selectedIssues.length > 0 || issue.trim());

  const handleSubmit = () => {
    if (!canSubmit) return;
    const issueText = [
      selectedIssues.length > 0 ? `Issues: ${selectedIssues.join(", ")}` : null,
      issue.trim() ? `Details: ${issue.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    createBooking.mutate(
      {
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        deviceType,
        deviceModel,
        issue: issueText || "Walk-in customer — no specific issue described",
        needsCollection,
        collectionAddr: needsCollection ? collectionAddr.trim() : undefined,
        bookingDate: bookingDate || undefined,
        bookingTime: bookingTime || undefined,
      },
      {
        onSuccess: (b) => {
          setSuccess(b.ticketId);
          toast({
            title: "Walk-in booking created!",
            description: `Ticket ${b.ticketId} for ${customerName} has been created.`,
          });
          // Reset form
          setCustomerName("");
          setEmail("");
          setPhone("");
          setDeviceType("");
          setDeviceModel("");
          setSelectedIssues([]);
          setIssue("");
          setNeedsCollection(false);
          setCollectionAddr("");
          setBookingDate("");
          setBookingTime("");
        },
      }
    );
  };

  if (success) {
    return (
      <Card className="glass flex flex-col items-center gap-4 p-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
          <Check className="size-8" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Walk-in booking created!
        </h3>
        <p className="text-sm text-muted-foreground">
          Ticket ID: <span className="font-mono font-bold text-primary">{success}</span>
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSuccess(null)}
        >
          Create another walk-in booking
        </Button>
      </Card>
    );
  }

  return (
    <Card className="glass flex flex-col gap-5 p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
          <UserPlus className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Walk-in Customer
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Create a booking for a customer who walked into the shop. Same
            fields as the public booking form.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Customer info */}
        <div className="space-y-1.5">
          <Label htmlFor="wi-name">Customer name *</Label>
          <Input
            id="wi-name"
            placeholder="John Smith"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wi-phone">Phone *</Label>
          <Input
            id="wi-phone"
            placeholder="07700 123456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wi-email">Email *</Label>
          <Input
            id="wi-email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wi-date">Preferred date</Label>
          <Input
            id="wi-date"
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="[color-scheme:dark]"
          />
        </div>
      </div>

      {/* Device selection */}
      <div className="space-y-2">
        <Label>Device type *</Label>
        <div className="flex flex-wrap gap-1.5">
          {SERVICE_CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => {
                setDeviceType(c.value);
                setDeviceModel("");
              }}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                deviceType === c.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {deviceType && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="wi-model">Device model *</Label>
            <Select value={deviceModel} onValueChange={setDeviceModel}>
              <SelectTrigger id="wi-model">
                <SelectValue placeholder="Pick model…" />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wi-time">Preferred time</Label>
            <Select value={bookingTime} onValueChange={setBookingTime}>
              <SelectTrigger id="wi-time">
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent>
                {["09:30 AM", "10:30 AM", "11:30 AM", "12:30 PM", "01:30 PM", "02:30 PM"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Issues */}
      <div className="space-y-2">
        <Label>Common issues (select any that apply)</Label>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_ISSUES.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleIssue(i)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                selectedIssues.includes(i)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card/40 text-muted-foreground hover:border-primary/40"
              )}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="wi-issue">Additional details</Label>
        <Textarea
          id="wi-issue"
          placeholder="Describe the problem in more detail…"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          rows={3}
        />
      </div>

      {/* Collection */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-secondary/20 p-3">
        <div>
          <Label htmlFor="wi-collection" className="text-sm font-medium">
            Doorstep collection
          </Label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Customer wants pickup & return service
          </p>
        </div>
        <Switch
          id="wi-collection"
          checked={needsCollection}
          onCheckedChange={setNeedsCollection}
        />
      </div>

      {needsCollection && (
        <div className="space-y-1.5">
          <Label htmlFor="wi-addr">Collection address</Label>
          <Textarea
            id="wi-addr"
            placeholder="Full address for pickup…"
            value={collectionAddr}
            onChange={(e) => setCollectionAddr(e.target.value)}
            rows={2}
          />
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <div className="text-xs text-muted-foreground">
          {canSubmit ? (
            <span className="text-emerald-400">✓ Ready to create booking</span>
          ) : (
            <span>Fill required fields (*) to continue</span>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || createBooking.isPending}
          className="gap-2"
        >
          {createBooking.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating…
            </>
          ) : (
            <>
              <UserPlus className="size-4" />
              Create Walk-in Booking
            </>
          )}
        </Button>
      </div>

      {createBooking.isError && (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          Error: {createBooking.error?.message}
        </div>
      )}
    </Card>
  );
}

export default WalkInCustomer;
