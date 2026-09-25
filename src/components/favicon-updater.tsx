"use client";

import { useBranding } from "@/lib/api-hooks";

/**
 * Dynamically sets the favicon from the Branding DB record.
 * This runs client-side and updates the <link rel="icon"> tag.
 */
export function FaviconUpdater() {
  const { data: branding } = useBranding();

  // Update the favicon when branding data loads/changes
  if (typeof window !== "undefined" && branding?.faviconUrl) {
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    if (link.href !== branding.faviconUrl) {
      link.href = branding.faviconUrl;
    }
  }

  return null;
}
