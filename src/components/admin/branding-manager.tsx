"use client";

import { useState } from "react";
import {
  Save,
  Loader2,
  RotateCcw,
  Plus,
  Trash2,
  AlertCircle,
  Building2,
  Palette,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Share2,
  MapPinned,
  Star,
  Check,
  ExternalLink,
  X,
} from "lucide-react";
import { useBranding, useUpdateBranding } from "@/lib/api-hooks";
import { SOCIAL_LINKS } from "@/lib/brand";
import { Icon } from "@/components/icon";
import type { Branding, BusinessHours, SocialLinks, UpdateBrandingInput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function BrandingManager() {
  const brandingQ = useBranding();
  const updateMutation = useUpdateBranding();

  if (brandingQ.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (brandingQ.isError || !brandingQ.data) {
    return (
      <Card className="glass flex flex-col items-center justify-center gap-3 p-12 text-center">
        <AlertCircle className="size-8 text-rose-400" />
        <div>
          <div className="text-sm font-semibold text-foreground">
            Couldn&apos;t load branding
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {brandingQ.error?.message ?? "Please try again in a moment."}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => brandingQ.refetch()}>
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <BrandingForm
      key={brandingQ.data.id ?? "none"}
      branding={brandingQ.data}
      updateMutation={updateMutation}
    />
  );
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function BrandingForm({
  branding,
  updateMutation,
}: {
  branding: Branding;
  updateMutation: ReturnType<typeof useUpdateBranding>;
}) {
  // ----- Local form state, initialized once per mount (key-remount on branding.id) -----
  const [businessName, setBusinessName] = useState(branding.businessName);
  const [tagline, setTagline] = useState(branding.tagline);
  const [about, setAbout] = useState(branding.about);
  const [logoUrl, setLogoUrl] = useState(branding.logoUrl);
  const [faviconUrl, setFaviconUrl] = useState(branding.faviconUrl);
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(branding.secondaryColor);
  const [phone, setPhone] = useState(branding.phone);
  const [whatsapp, setWhatsapp] = useState(branding.whatsapp);
  const [email, setEmail] = useState(branding.email);
  const [website, setWebsite] = useState(branding.website);
  const [gmbProfile, setGmbProfile] = useState(branding.gmbProfile);
  const [address, setAddress] = useState(branding.address);
  const [mapLink, setMapLink] = useState(branding.mapLink);
  const [mapEmbed, setMapEmbed] = useState(branding.mapEmbed);
  const [hours, setHours] = useState<BusinessHours[]>(
    branding.hours.map((h) => ({ ...h }))
  );
  const [socials, setSocials] = useState<SocialLinks>({ ...branding.socials });
  const [targetAreas, setTargetAreas] = useState<string[]>([...branding.targetAreas]);
  const [rating, setRating] = useState<string>(String(branding.rating));
  const [reviewCount, setReviewCount] = useState<string>(String(branding.reviewCount));
  const [yearsExperience, setYearsExperience] = useState<string>(
    String(branding.yearsExperience)
  );
  const [savedFlash, setSavedFlash] = useState(false);

  // ----- Build current snapshot + dirty check -----
  const currentSnapshot: UpdateBrandingInput = {
    businessName,
    tagline,
    about,
    logoUrl,
    faviconUrl,
    primaryColor,
    secondaryColor,
    phone,
    whatsapp,
    email,
    website,
    gmbProfile,
    mapLink,
    mapEmbed,
    address,
    hours,
    socials,
    targetAreas,
    rating: Number(rating) || 0,
    reviewCount: Number(reviewCount) || 0,
    yearsExperience: Number(yearsExperience) || 0,
  };

  const originalSnapshot: UpdateBrandingInput = {
    businessName: branding.businessName,
    tagline: branding.tagline,
    about: branding.about,
    logoUrl: branding.logoUrl,
    faviconUrl: branding.faviconUrl,
    primaryColor: branding.primaryColor,
    secondaryColor: branding.secondaryColor,
    phone: branding.phone,
    whatsapp: branding.whatsapp,
    email: branding.email,
    website: branding.website,
    gmbProfile: branding.gmbProfile,
    mapLink: branding.mapLink,
    mapEmbed: branding.mapEmbed,
    address: branding.address,
    hours: branding.hours,
    socials: branding.socials,
    targetAreas: branding.targetAreas,
    rating: branding.rating,
    reviewCount: branding.reviewCount,
    yearsExperience: branding.yearsExperience,
  };

  const isDirty = !deepEqual(currentSnapshot, originalSnapshot);

  const handleSave = () => {
    if (!isDirty || updateMutation.isPending) return;
    updateMutation.mutate(currentSnapshot, {
      onSuccess: () => {
        setSavedFlash(true);
        window.setTimeout(() => setSavedFlash(false), 1800);
      },
    });
  };

  const handleReset = () => {
    setBusinessName(branding.businessName);
    setTagline(branding.tagline);
    setAbout(branding.about);
    setLogoUrl(branding.logoUrl);
    setFaviconUrl(branding.faviconUrl);
    setPrimaryColor(branding.primaryColor);
    setSecondaryColor(branding.secondaryColor);
    setPhone(branding.phone);
    setWhatsapp(branding.whatsapp);
    setEmail(branding.email);
    setWebsite(branding.website);
    setGmbProfile(branding.gmbProfile);
    setAddress(branding.address);
    setMapLink(branding.mapLink);
    setMapEmbed(branding.mapEmbed);
    setHours(branding.hours.map((h) => ({ ...h })));
    setSocials({ ...branding.socials });
    setTargetAreas([...branding.targetAreas]);
    setRating(String(branding.rating));
    setReviewCount(String(branding.reviewCount));
    setYearsExperience(String(branding.yearsExperience));
  };

  // ----- Hours helpers -----
  const updateHour = (i: number, field: keyof BusinessHours, value: string) => {
    setHours((prev) =>
      prev.map((h, idx) => (idx === i ? { ...h, [field]: value } : h))
    );
  };
  const addHour = () =>
    setHours((prev) => [...prev, { day: "", time: "" }]);
  const removeHour = (i: number) =>
    setHours((prev) => prev.filter((_, idx) => idx !== i));

  // ----- Socials helpers -----
  const updateSocial = (key: string, value: string) => {
    setSocials((prev) => ({ ...prev, [key]: value }));
  };

  // ----- Target areas helpers -----
  const updateArea = (i: number, value: string) => {
    setTargetAreas((prev) => prev.map((a, idx) => (idx === i ? value : a)));
  };
  const addArea = () => setTargetAreas((prev) => [...prev, ""]);
  const removeArea = (i: number) =>
    setTargetAreas((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-5 pb-24">
      {/* Header bar */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Branding</h2>
          <p className="text-sm text-muted-foreground">
            Manage your business identity, contact details, hours and service
            areas — all live on the public site.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!isDirty || updateMutation.isPending}
            className="gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
            className="gap-1.5"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : savedFlash ? (
              <>
                <Check className="size-4" />
                Saved
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

      {/* Error banner */}
      {updateMutation.isError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300"
        >
          <AlertCircle className="size-4 shrink-0" />
          <span>
            {updateMutation.error?.message ?? "Failed to save branding."}
          </span>
        </div>
      )}

      {/* Live preview card */}
      <Card className="glass overflow-hidden p-0">
        <div className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-md shadow-primary/20 ring-1 ring-border/60">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${businessName || "Business"} logo`}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <Building2 className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h3 className="text-xl font-bold text-foreground">
                {businessName || "Your business name"}
              </h3>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{
                  background: `${primaryColor}22`,
                  color: primaryColor,
                  border: `1px solid ${primaryColor}55`,
                }}
              >
                <Star className="size-3 fill-current" />
                {rating || "0.0"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {tagline || "Your tagline will appear here"}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:justify-start">
              {phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="size-3" />
                  {phone}
                </span>
              )}
              {email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="size-3" />
                  {email}
                </span>
              )}
              {website && (
                <span className="inline-flex items-center gap-1">
                  <Globe className="size-3" />
                  {website.replace(/^https?:\/\//, "")}
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <span
              className="size-9 rounded-lg ring-1 ring-border/60"
              style={{ background: primaryColor }}
              title={`Primary: ${primaryColor}`}
            />
            <span
              className="size-9 rounded-lg ring-1 ring-border/60"
              style={{ background: secondaryColor }}
              title={`Accent: ${secondaryColor}`}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* 1. Identity */}
        <SectionCard
          icon={Building2}
          title="Identity"
          subtitle="The core of your brand"
        >
          <div className="space-y-4">
            <Field label="Business name" htmlFor="br-name">
              <Input
                id="br-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Gadget Doctor East Kilbride"
              />
            </Field>
            <Field label="Tagline" htmlFor="br-tagline">
              <Input
                id="br-tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Fast & Reliable Electronics Repair"
              />
            </Field>
            <Field
              label="About"
              htmlFor="br-about"
              hint="Shown on the home page hero and about sections."
            >
              <Textarea
                id="br-about"
                rows={5}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="A short paragraph about your business, expertise and what makes you different."
              />
            </Field>
            <Field
              label="Logo URL"
              htmlFor="br-logo"
              hint="Use a square image. Shown in a white rounded container."
            >
              <div className="flex items-center gap-3">
                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-border/60">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <Building2 className="size-6 text-muted-foreground" />
                  )}
                </div>
                <Input
                  id="br-logo"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/gadget-doctor-logo.jpg"
                  className="flex-1"
                />
              </div>
            </Field>
            <Field
              label="Favicon URL"
              htmlFor="br-favicon"
              hint="Small icon shown in browser tabs (16x16 or 32x32 recommended)."
            >
              <div className="flex items-center gap-3">
                {/* Browser-tab mockup preview */}
                <div className="flex shrink-0 items-center gap-2 rounded-t-lg border border-b-0 border-border/60 bg-secondary/40 px-2.5 py-1.5">
                  <span className="flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-background ring-1 ring-border/60">
                    {faviconUrl ? (
                      <img
                        src={faviconUrl}
                        alt="Favicon preview"
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <Globe className="size-3 text-muted-foreground" />
                    )}
                  </span>
                  <span className="max-w-[80px] truncate text-[11px] font-medium text-foreground">
                    {(businessName || "Your Site").slice(0, 18)}
                  </span>
                  <X
                    className="size-3 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <Input
                  id="br-favicon"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="/favicon.ico"
                  className="flex-1"
                />
              </div>
            </Field>
          </div>
        </SectionCard>

        {/* 2. Brand Colors */}
        <SectionCard
          icon={Palette}
          title="Brand Colors"
          subtitle="Stored for reference and future use"
        >
          <div className="space-y-4">
            <ColorField
              label="Primary color"
              hint="Used for primary CTAs and accents across the site."
              value={primaryColor}
              onChange={setPrimaryColor}
              id="br-primary-color"
            />
            <ColorField
              label="Secondary / accent color"
              hint="Used for highlights, links and secondary accents."
              value={secondaryColor}
              onChange={setSecondaryColor}
              id="br-secondary-color"
            />
            <div className="rounded-lg border border-border/60 bg-secondary/20 p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Changing these
              here stores them in the database for reference. The active theme
              colors are baked into the design system and apply on the next
              deploy.
            </div>
            <div className="flex items-center gap-2">
              <span
                className="h-10 flex-1 rounded-lg ring-1 ring-border/60"
                style={{ background: primaryColor }}
              />
              <span
                className="h-10 flex-1 rounded-lg ring-1 ring-border/60"
                style={{ background: secondaryColor }}
              />
            </div>
          </div>
        </SectionCard>

        {/* 3. Contact */}
        <SectionCard
          icon={Phone}
          title="Contact"
          subtitle="How customers reach you"
        >
          <div className="space-y-4">
            <Field label="Phone" htmlFor="br-phone">
              <Input
                id="br-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7777 200175"
              />
            </Field>
            <Field label="WhatsApp" htmlFor="br-whatsapp">
              <Input
                id="br-whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+44 7777 200175"
              />
            </Field>
            <Field label="Email" htmlFor="br-email">
              <Input
                id="br-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@gadgetdoctor.co.uk"
              />
            </Field>
            <Field label="Website" htmlFor="br-website">
              <Input
                id="br-website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://www.gadgetdoctoreastkilbride.co.uk"
              />
            </Field>
            <Field label="Google Business Profile URL" htmlFor="br-gmb">
              <Input
                id="br-gmb"
                value={gmbProfile}
                onChange={(e) => setGmbProfile(e.target.value)}
                placeholder="https://g.co/kgs/..."
              />
            </Field>
          </div>
        </SectionCard>

        {/* 4. Location */}
        <SectionCard
          icon={MapPin}
          title="Location"
          subtitle="Address & map embed"
        >
          <div className="space-y-4">
            <Field label="Address" htmlFor="br-address">
              <Textarea
                id="br-address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="14 Stroud Rd, East Kilbride, G75 0YA, Scotland"
              />
            </Field>
            <Field
              label="Map link (Get Directions)"
              htmlFor="br-maplink"
            >
              <Input
                id="br-maplink"
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
              />
            </Field>
            <Field
              label="Map embed URL"
              htmlFor="br-mapembed"
              hint="Used for the live iframe preview below."
            >
              <Input
                id="br-mapembed"
                value={mapEmbed}
                onChange={(e) => setMapEmbed(e.target.value)}
                placeholder="https://www.google.com/maps?q=...&output=embed"
              />
            </Field>
            {mapEmbed ? (
              <div>
                <div className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  Live map preview
                </div>
                <div className="overflow-hidden rounded-lg border border-border/60 ring-1 ring-border/60">
                  <iframe
                    title="Map preview"
                    src={mapEmbed}
                    className="h-[200px] w-full bg-secondary/20"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground">
                Add a map embed URL to see a preview.
              </div>
            )}
          </div>
        </SectionCard>

        {/* 5. Opening Hours */}
        <SectionCard
          icon={Clock}
          title="Opening Hours"
          subtitle="Weekly schedule"
          full
        >
          <div className="space-y-2.5">
            {hours.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground">
                No hours set. Add a row below.
              </div>
            ) : (
              hours.map((h, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1.5fr_auto] sm:items-center"
                >
                  <Input
                    aria-label={`Day ${i + 1}`}
                    value={h.day}
                    onChange={(e) => updateHour(i, "day", e.target.value)}
                    placeholder="Monday – Thursday"
                  />
                  <Input
                    aria-label={`Hours ${i + 1}`}
                    value={h.time}
                    onChange={(e) => updateHour(i, "time", e.target.value)}
                    placeholder="09:30 AM – 03:00 PM"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 justify-self-start text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 sm:justify-self-end"
                    onClick={() => removeHour(i)}
                    aria-label={`Remove hour row ${i + 1}`}
                    disabled={updateMutation.isPending}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addHour}
              className="mt-1 gap-1.5"
            >
              <Plus className="size-3.5" />
              Add hour row
            </Button>
          </div>
        </SectionCard>

        {/* 6. Social Media */}
        <SectionCard
          icon={Share2}
          title="Social Media"
          subtitle="Links to your profiles"
          full
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SOCIAL_LINKS.map((s) => (
              <Field
                key={s.key}
                label={s.label}
                htmlFor={`br-social-${s.key}`}
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                    <Icon name={s.icon} className="size-4" />
                  </span>
                  <Input
                    id={`br-social-${s.key}`}
                    value={socials[s.key] ?? ""}
                    onChange={(e) => updateSocial(s.key, e.target.value)}
                    placeholder={`https://${s.key}.com/your-page`}
                    className="pl-9"
                  />
                </div>
              </Field>
            ))}
          </div>
        </SectionCard>

        {/* 7. Target Areas */}
        <SectionCard
          icon={MapPinned}
          title="Target Areas"
          subtitle="Locations you serve"
          full
        >
          <div className="space-y-2.5">
            {targetAreas.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground">
                No service areas yet. Add one below.
              </div>
            ) : (
              targetAreas.map((area, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <Input
                    aria-label={`Service area ${i + 1}`}
                    value={area}
                    onChange={(e) => updateArea(i, e.target.value)}
                    placeholder="e.g. East Kilbride"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 justify-self-start text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 sm:justify-self-end"
                    onClick={() => removeArea(i)}
                    aria-label={`Remove area ${i + 1}`}
                    disabled={updateMutation.isPending}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addArea}
              className="mt-1 gap-1.5"
            >
              <Plus className="size-3.5" />
              Add area
            </Button>
          </div>
        </SectionCard>

        {/* 8. Stats */}
        <SectionCard
          icon={Star}
          title="Stats"
          subtitle="Trust signals shown across the site"
          full
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Google rating" htmlFor="br-rating" hint="0.0 – 5.0">
              <Input
                id="br-rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="4.6"
              />
            </Field>
            <Field label="Review count" htmlFor="br-reviews">
              <Input
                id="br-reviews"
                type="number"
                min="0"
                step="1"
                value={reviewCount}
                onChange={(e) => setReviewCount(e.target.value)}
                placeholder="92"
              />
            </Field>
            <Field label="Years of experience" htmlFor="br-years">
              <Input
                id="br-years"
                type="number"
                min="0"
                step="1"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="12"
              />
            </Field>
          </div>
        </SectionCard>
      </div>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:left-[260px]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <div className="flex min-w-0 items-center gap-2 text-sm">
            {isDirty ? (
              <>
                <span className="size-2 shrink-0 rounded-full bg-amber-400" />
                <span className="truncate text-muted-foreground">
                  You have unsaved changes
                </span>
              </>
            ) : savedFlash ? (
              <>
                <span className="size-2 shrink-0 rounded-full bg-emerald-400" />
                <span className="truncate text-emerald-300">
                  All changes saved
                </span>
              </>
            ) : (
              <>
                <span className="size-2 shrink-0 rounded-full bg-emerald-400" />
                <span className="truncate text-muted-foreground">
                  All changes saved
                </span>
              </>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              View live site
              <ExternalLink className="size-3" />
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!isDirty || updateMutation.isPending}
              className="gap-1.5"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isDirty || updateMutation.isPending}
              className="gap-1.5"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : savedFlash ? (
                <>
                  <Check className="size-4" />
                  Saved
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
      </div>
    </div>
  );
}

// ---------- Helper sub-components ----------

function SectionCard({
  icon: IconCmp,
  title,
  subtitle,
  children,
  full,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <Card className={cn("glass flex flex-col p-5", full && "lg:col-span-2")}>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
          <IconCmp className="size-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <Separator className="mb-4" />
      {children}
    </Card>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ColorField({
  label,
  hint,
  value,
  onChange,
  id,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/60">
          <input
            id={`${id}-picker`}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 size-[calc(100%+1rem)] cursor-pointer border-0 bg-transparent p-0"
            aria-label={`${label} color picker`}
          />
        </div>
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#E31E24"
          className="flex-1 font-mono text-sm"
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default BrandingManager;
