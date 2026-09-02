"use client";

import { useState } from "react";
import {
  Truck,
  Megaphone,
  Save,
  Loader2,
  Check,
  ExternalLink,
  Power,
} from "lucide-react";
import { useSettings, useUpdateSettings } from "@/lib/api-hooks";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export function ContentManager() {
  const settingsQ = useSettings();

  if (settingsQ.isLoading || !settingsQ.data) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    );
  }

  const settings = settingsQ.data;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Site Content</h2>
        <p className="text-sm text-muted-foreground">
          Control banners and highlights shown on the public website.
        </p>
      </div>

      {/* Collection service master toggle (site-wide) */}
      <CollectionMasterToggle settings={settings} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Collection banner */}
        <CollectionBannerCard settings={settings} />

        {/* Announcement banner — remounts when server data changes */}
        <AnnouncementBannerCard
          key={`ann-${settings.announcementEnabled}-${settings.announcementText ?? ""}`}
          settings={settings}
        />
      </div>
    </div>
  );
}

function CollectionMasterToggle({ settings }: { settings: SiteSettings }) {
  const updateMutation = useUpdateSettings();
  const enabled = settings.collectionEnabled;

  return (
    <Card
      className={cn(
        "glass relative overflow-hidden p-5 transition-colors",
        enabled
          ? "border-primary/40"
          : "border-rose-500/30"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity",
          enabled ? "opacity-100" : "opacity-60"
        )}
        style={{
          background: enabled
            ? "radial-gradient(circle at top right, oklch(0.62 0.24 27 / 0.08), transparent 60%)"
            : "radial-gradient(circle at top right, oklch(0.65 0.2 15 / 0.08), transparent 60%)",
        }}
      />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1",
              enabled
                ? "bg-primary/10 text-primary ring-primary/30"
                : "bg-rose-500/10 text-rose-300 ring-rose-500/30"
            )}
          >
            {enabled ? <Truck className="size-5" /> : <Power className="size-5" />}
          </div>
          <div className="max-w-2xl">
            <h3 className="text-sm font-semibold text-foreground">
              Collection Service — Site-wide Toggle
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              When enabled, the collection service (doorstep pickup &amp; return)
              is shown across the public website. When disabled, ALL collection
              options are hidden — the nav link, the collection page, collection
              sections on home, and the collection option in the booking form.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "text-xs font-medium uppercase tracking-wider",
              enabled ? "text-primary" : "text-rose-300"
            )}
          >
            {enabled ? "Live" : "Hidden site-wide"}
          </span>
          <Switch
            checked={enabled}
            disabled={updateMutation.isPending}
            onCheckedChange={(v) =>
              updateMutation.mutate({ collectionEnabled: v })
            }
            aria-label="Toggle collection service site-wide"
          />
        </div>
      </div>
    </Card>
  );
}

function CollectionBannerCard({ settings }: { settings: SiteSettings }) {
  const updateMutation = useUpdateSettings();
  const router = useRouter();
  const enabled = settings.collectionBannerEnabled;

  return (
    <Card className="glass flex flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30">
            <Truck className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Collection Service Banner
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Highlight the collection section on the home page.
            </p>
          </div>
        </div>
        <Switch
          checked={enabled}
          disabled={updateMutation.isPending}
          onCheckedChange={(v) =>
            updateMutation.mutate({ collectionBannerEnabled: v })
          }
          aria-label="Toggle collection banner"
        />
      </div>

      <div
        className={cn(
          "rounded-lg border p-3 transition-colors",
          enabled
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-border/60 bg-secondary/20"
        )}
      >
        <div className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              "size-2 rounded-full",
              enabled ? "bg-emerald-400" : "bg-muted-foreground"
            )}
          />
          <span className="font-medium text-foreground">
            {enabled ? "Live on website" : "Hidden"}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          When enabled, the collection service section is highlighted on the home
          page with a prominent call-to-action.
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/")}
        className="mt-4 w-fit gap-1.5"
      >
        Preview on site
        <ExternalLink className="size-3.5" />
      </Button>
    </Card>
  );
}

function AnnouncementBannerCard({ settings }: { settings: SiteSettings }) {
  const updateMutation = useUpdateSettings();
  const router = useRouter();

  const [enabled, setEnabled] = useState(settings.announcementEnabled);
  const [text, setText] = useState(settings.announcementText ?? "");

  const dirty =
    enabled !== settings.announcementEnabled ||
    text !== (settings.announcementText ?? "");

  const handleSave = () => {
    updateMutation.mutate({
      announcementEnabled: enabled,
      announcementText: text,
    });
  };

  return (
    <Card className="glass flex flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
            <Megaphone className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Announcement Banner
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Show a dismissible banner at the top of the public site.
            </p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-label="Toggle announcement banner"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ann-text">Banner text</Label>
        <Textarea
          id="ann-text"
          rows={2}
          placeholder="e.g. 🎁 20% off all screen repairs this week!"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!enabled}
        />
      </div>

      {/* Live preview */}
      <div className="mt-3">
        <div className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
          Live preview
        </div>
        <div
          className={cn(
            "rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity",
            enabled && text.trim()
              ? "opacity-100"
              : "pointer-events-none opacity-40"
          )}
          style={{
            background:
              "linear-gradient(90deg, oklch(0.72 0.15 200 / 0.18), oklch(0.82 0.16 80 / 0.18))",
            border: "1px solid oklch(0.72 0.15 200 / 0.3)",
          }}
        >
          <span className="text-foreground">
            {text.trim() || "Your announcement will appear here…"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button
          onClick={handleSave}
          disabled={!dirty || updateMutation.isPending}
          className="gap-1.5"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : updateMutation.isSuccess && !dirty ? (
            <>
              <Check className="size-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save announcement
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/")}
          className="gap-1.5"
        >
          Preview on site
          <ExternalLink className="size-3.5" />
        </Button>
      </div>
    </Card>
  );
}

export default ContentManager;
