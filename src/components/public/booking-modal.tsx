"use client";

import { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Truck,
  Store,
  Loader2,
  Sparkles,
  CalendarCheck,
  Mail,
  Phone,
  User,
  MapPin,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@/components/icon";
import { useAppStore } from "@/lib/store";
import { useServices, useCreateBooking, useSettings } from "@/lib/api-hooks";
import {
  BRAND,
  SERVICE_CATEGORIES,
  DEVICE_MODELS,
  COMMON_ISSUES,
} from "@/lib/brand";
import type { ServiceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 4;

const TIME_SLOTS = [
  "09:30 AM",
  "10:30 AM",
  "11:30 AM",
  "12:30 PM",
  "01:30 PM",
  "02:30 PM",
] as const;

/** Today's date as yyyy-mm-dd, used as the min for the preferred date input. */
function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function StepDots({
  step,
  total = TOTAL_STEPS,
}: {
  step: number;
  total?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div
            key={n}
            className={cn(
              "h-1.5 rounded-full transition-all",
              done
                ? "w-6 bg-primary"
                : active
                ? "w-8 bg-primary"
                : "w-6 bg-muted"
            )}
          />
        );
      })}
    </div>
  );
}

interface BookingFormProps {
  initialCategory: string | null;
  onClose: () => void;
}

function BookingForm({ initialCategory, onClose }: BookingFormProps) {
  const mutation = useCreateBooking();
  const { data: settings } = useSettings();
  const collectionEnabled = settings?.collectionEnabled ?? true;

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<string>(initialCategory ?? "");
  const [deviceModel, setDeviceModel] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  // Force dropoff when collection is disabled
  const [collection, setCollection] = useState<"dropoff" | "collection">(
    collectionEnabled ? "dropoff" : "dropoff"
  );
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>("");

  const submitted = mutation.isSuccess;
  const ticketId = mutation.data?.ticketId;

  // Total steps adapt to collection availability (skip the collection
  // step entirely when the master toggle is off).
  const totalSteps = collectionEnabled ? 4 : 3;

  const toggleIssue = (issue: string) => {
    setIssues((prev) =>
      prev.includes(issue)
        ? prev.filter((i) => i !== issue)
        : [...prev, issue]
    );
  };

  const canNext = useMemo(() => {
    if (step === 1) return !!category;
    if (step === 2) return !!deviceModel && (issues.length > 0 || description.trim().length > 0);
    // Step 3 is only the collection page when enabled; otherwise step 3 IS the contact page.
    if (collectionEnabled && step === 3)
      return collection === "dropoff" || (collection === "collection" && address.trim().length > 4);
    const contactStep = collectionEnabled ? 4 : 3;
    if (step === contactStep)
      return (
        name.trim().length > 1 &&
        /.+@.+\..+/.test(email) &&
        phone.replace(/\s+/g, "").length >= 7
      );
    return false;
  }, [step, category, deviceModel, issues, description, collection, address, name, email, phone, collectionEnabled]);

  const handleSubmit = () => {
    if (!canNext || mutation.isPending) return;
    const issueText = [
      issues.length > 0 ? `Issues: ${issues.join(", ")}` : null,
      description.trim() ? `Details: ${description.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    mutation.mutate({
      customerName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      deviceType: category,
      deviceModel,
      issue: issueText || "No specific issue described",
      needsCollection: collectionEnabled && collection === "collection",
      collectionAddr:
        collectionEnabled && collection === "collection"
          ? address.trim()
          : undefined,
      bookingDate: bookingDate || undefined,
      bookingTime: bookingTime || undefined,
    });
  };

  if (submitted && ticketId) {
    return (
      <SuccessView
        ticketId={ticketId}
        name={name}
        collection={collection}
        ticketIdVisible={settings?.ticketIdVisible ?? true}
        onClose={onClose}
      />
    );
  }

  const next = () => setStep((s) => Math.min(totalSteps, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="flex flex-col">
      {/* Stepper header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div>
          <DialogTitle className="text-base font-bold">
            Book a Repair
          </DialogTitle>
          <DialogDescription className="text-xs">
            Step {step} of {totalSteps} ·{" "}
            {step === 1
              ? "Choose device type"
              : step === 2
              ? "Describe the problem"
              : step === 3 && collectionEnabled
              ? "Collection preference"
              : "Your contact details"}
          </DialogDescription>
        </div>
        <StepDots step={step} total={totalSteps} />
      </div>

      {/* Body */}
      <div className="custom-scroll max-h-[60vh] overflow-y-auto px-5 py-5 sm:px-6">
        {/* Step 1: Device type */}
        {step === 1 && (
          <div>
            <p className="text-sm text-muted-foreground">
              What kind of device needs fixing? Pick a category to begin.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {SERVICE_CATEGORIES.map((c) => {
                const active = category === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={cn(
                      "group flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all",
                      active
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                        : "border-border bg-card hover:border-primary/40 hover:bg-card/60"
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-10 place-items-center rounded-lg transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon name={c.icon} className="size-5" />
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {c.label}
                    </span>
                    {active && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary">
                        <Check className="size-3" />
                        Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Problem description */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <Label className="mb-1.5">Device Model</Label>
              <Select value={deviceModel} onValueChange={setDeviceModel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick your model…" />
                </SelectTrigger>
                <SelectContent>
                  {(DEVICE_MODELS[category as ServiceCategory] ?? []).map(
                    (m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2">What&apos;s wrong with it?</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_ISSUES.map((issue) => {
                  const active = issues.includes(issue);
                  return (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => toggleIssue(issue)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                        active
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      )}
                    >
                      {active && <Check className="size-3" />}
                      {issue}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Select all that apply — you can add more detail below.
              </p>
            </div>

            <div>
              <Label htmlFor="bk-desc" className="mb-1.5">
                Anything else we should know?{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="bk-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Dropped it yesterday, screen went black, makes a faint buzzing sound…"
                maxLength={600}
                className="min-h-24"
              />
              <p className="mt-1 text-right text-[11px] text-muted-foreground">
                {description.length}/600
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Collection preference (skipped when collection disabled) */}
        {step === 3 && collectionEnabled && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              How would you like to get your device to us?
            </p>
            <RadioGroup
              value={collection}
              onValueChange={(v) => setCollection(v as "dropoff" | "collection")}
              className="grid gap-2.5 sm:grid-cols-2"
            >
              <label
                htmlFor="r-dropoff"
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all",
                  collection === "dropoff"
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <RadioGroupItem
                  id="r-dropoff"
                  value="dropoff"
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Store className="size-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      Drop off at shop
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bring it to our East Kilbride workshop. Ready same-day in
                    most cases.
                  </p>
                </div>
              </label>
              <label
                htmlFor="r-collection"
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all",
                  collection === "collection"
                    ? "border-accent/60 bg-accent/10 shadow-md shadow-accent/20"
                    : "border-border bg-card hover:border-accent/30"
                )}
              >
                <RadioGroupItem
                  id="r-collection"
                  value="collection"
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Truck className="size-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">
                      Doorstep collection
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We pick it up, fix it, and return it — across East
                    Kilbride.
                  </p>
                </div>
              </label>
            </RadioGroup>

            {collection === "collection" && (
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                <Label
                  htmlFor="bk-addr"
                  className="mb-1.5 flex items-center gap-1.5"
                >
                  <MapPin className="size-3.5 text-accent" />
                  Collection Address
                </Label>
                <Textarea
                  id="bk-addr"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full address including postcode — e.g. 14 Stroud Rd, East Kilbride, G75 0YA"
                  maxLength={300}
                  className="min-h-20"
                />
                <p className="mt-1.5 text-[11px] text-accent-foreground/80">
                  We&apos;ll call to confirm a pickup time within the hour.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Contact step (step 4 when collection enabled, step 3 when disabled) */}
        {((collectionEnabled && step === 4) || (!collectionEnabled && step === 3)) && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Booking Summary
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Device type</dt>
                  <dd className="font-medium text-foreground">
                    {SERVICE_CATEGORIES.find((c) => c.value === category)?.label}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Model</dt>
                  <dd className="text-right font-medium text-foreground">
                    {deviceModel}
                  </dd>
                </div>
                {issues.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <dt className="text-muted-foreground">Issues</dt>
                    <dd className="flex flex-wrap gap-1">
                      {issues.map((i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[10px] font-normal text-foreground"
                        >
                          {i}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="font-medium text-foreground">
                    {collectionEnabled && collection === "collection" ? (
                      <span className="inline-flex items-center gap-1">
                        <Truck className="size-3.5 text-accent" />
                        Doorstep pickup
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Store className="size-3.5 text-primary" />
                        Drop off at shop
                      </span>
                    )}
                  </dd>
                </div>
                {(bookingDate || bookingTime) && (
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Preferred slot</dt>
                    <dd className="font-medium text-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarCheck className="size-3.5 text-primary" />
                        {bookingDate
                          ? new Date(bookingDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })
                          : "Any date"}
                        {bookingTime && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <Clock className="size-3.5 text-accent" />
                            {bookingTime}
                          </>
                        )}
                      </span>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Contact fields */}
            <div className="grid gap-4">
              <div>
                <Label htmlFor="bk-name" className="mb-1.5">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="bk-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    className="pl-9"
                    autoComplete="name"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="bk-email" className="mb-1.5">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="bk-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-9"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bk-phone" className="mb-1.5">
                    Phone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="bk-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07777 200175"
                      className="pl-9"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred date & time (optional) */}
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <div className="flex items-center justify-between gap-2">
                  <Label className="flex items-center gap-1.5 text-foreground">
                    <CalendarCheck className="size-3.5 text-primary" />
                    Preferred date &amp; time
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Optional — we&apos;ll do our best to accommodate.
                  </span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label
                      htmlFor="bk-date"
                      className="mb-1.5 text-xs text-muted-foreground"
                    >
                      Date
                    </Label>
                    <Input
                      id="bk-date"
                      type="date"
                      value={bookingDate}
                      min={todayISO()}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="[color-scheme:dark]"
                      aria-label="Preferred booking date"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="bk-time"
                      className="mb-1.5 text-xs text-muted-foreground"
                    >
                      Time slot
                    </Label>
                    <Select value={bookingTime} onValueChange={setBookingTime}>
                      <SelectTrigger
                        id="bk-time"
                        className="w-full"
                        aria-label="Preferred booking time"
                      >
                        <SelectValue placeholder="Any time" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {mutation.isError && (
              <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                <p className="font-medium">
                  Something went wrong submitting your booking.
                </p>
                <p className="mt-1 text-xs text-rose-300/80">
                  Error: {mutation.error?.message || "Unknown error"}
                </p>
                <p className="mt-1 text-xs text-rose-300/60">
                  Please try again or call us on +44 7777 200175.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-4 sm:px-6">
        <Button
          type="button"
          variant="ghost"
          onClick={back}
          disabled={step === 1 || mutation.isPending}
          className="text-muted-foreground"
        >
          <ChevronLeft className="size-4" />
          Back
        </Button>
        {step < totalSteps ? (
          <Button
            type="button"
            onClick={next}
            disabled={!canNext}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
          >
            Continue
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canNext || mutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <CalendarCheck className="size-4" />
                Submit Booking
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function SuccessView({
  ticketId,
  name,
  collection,
  ticketIdVisible,
  onClose,
}: {
  ticketId: string;
  name: string;
  collection: "dropoff" | "collection";
  ticketIdVisible: boolean;
  onClose: () => void;
}) {
  return (
    <div className="px-6 py-8 text-center sm:px-10">
      <div className="relative mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
        <CheckCircle2 className="size-8" />
        <span className="absolute inset-0 animate-ping rounded-full border border-emerald-500/40" />
      </div>
      <DialogTitle className="mt-5 text-xl font-bold text-foreground">
        Booking confirmed, {name.split(" ")[0] || "there"}!
      </DialogTitle>
      <DialogDescription className="mt-2 text-sm text-muted-foreground">
        {ticketIdVisible ? (
          <>
            We&apos;ve received your repair request and our team will be in
            touch shortly to confirm your{" "}
            {collection === "collection" ? "pickup time" : "drop-off time"}.
          </>
        ) : (
          <>
            Your repair request has been received. We&apos;ll contact you
            shortly.
          </>
        )}
      </DialogDescription>

      {ticketIdVisible && (
        <div className="mx-auto mt-6 max-w-xs rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your Ticket ID
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-primary">
            {ticketId}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Save this — quote it when you visit or call us.
          </p>
        </div>
      )}

      <div className="mx-auto mt-5 flex max-w-sm items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-xs text-muted-foreground">
        <Sparkles className="size-3.5 text-primary" />
        Average response time: under 1 hour during opening hours
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button
          asChild
          variant="outline"
          className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60"
        >
          <a href={`tel:${BRAND.phones[0].replace(/\s+/g, "")}`}>
            <Phone className="size-4 text-primary" />
            Call the shop
          </a>
        </Button>
        <Button
          onClick={onClose}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
        >
          Done
        </Button>
      </div>
    </div>
  );
}

export function BookingModal() {
  const bookingOpen = useAppStore((s) => s.bookingOpen);
  const bookingPreset = useAppStore((s) => s.bookingPreset);
  const closeBooking = useAppStore((s) => s.closeBooking);
  const { data: services } = useServices(true);

  // Look up the service by preset slug to derive the category
  const initialCategory = useMemo(() => {
    if (!bookingPreset?.serviceSlug || !services) return null;
    const svc = services.find((s) => s.slug === bookingPreset.serviceSlug);
    if (svc) return svc.category;
    // Allow direct deviceType override
    if (bookingPreset.deviceType) return bookingPreset.deviceType;
    return null;
  }, [bookingPreset, services]);

  return (
    <Dialog
      open={bookingOpen}
      onOpenChange={(o) => {
        if (!o) closeBooking();
      }}
    >
      <DialogContent className="glass-strong max-h-[90vh] gap-0 overflow-hidden border-border p-0 sm:max-w-lg">
        {/* key-remount: fresh local state every time preset changes / modal reopens */}
        <BookingForm
          key={bookingPreset?.serviceSlug ?? bookingPreset?.deviceType ?? "none"}
          initialCategory={initialCategory}
          onClose={closeBooking}
        />
      </DialogContent>
    </Dialog>
  );
}

export default BookingModal;
