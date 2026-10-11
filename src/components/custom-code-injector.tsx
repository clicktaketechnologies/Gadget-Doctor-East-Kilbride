"use client";

import { useSettings } from "@/lib/api-hooks";
import { useEffect, useRef } from "react";

/**
 * Injects custom header code into <head> and footer code before </body>.
 * Reads from the SiteSettings DB record (customHeaderCode / customFooterCode).
 *
 * Common use cases: Google Analytics, Facebook Pixel, custom CSS,
 * Google Search Console verification, Schema markup, etc.
 */
export function CustomCodeInjector() {
  const { data: settings } = useSettings();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  // Inject header code
  useEffect(() => {
    if (!settings?.customHeaderCode) return;

    // Parse the custom code and inject scripts/styles into <head>
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = settings.customHeaderCode;

    // Move script and style/link tags to <head>
    const scripts = tempDiv.querySelectorAll("script");
    const styles = tempDiv.querySelectorAll("style, link[rel='stylesheet']");

    [...styles].forEach((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      document.head.appendChild(clone);
    });

    [...scripts].forEach((el) => {
      const clone = document.createElement("script");
      // Copy attributes
      for (const attr of el.attributes) {
        clone.setAttribute(attr.name, attr.value);
      }
      // If it has inline content, set it as text
      if (el.textContent) {
        clone.textContent = el.textContent;
      }
      document.head.appendChild(clone);
    });

    return () => {
      // Clean up on unmount (when code changes)
      // Scripts are hard to remove once executed, but we can remove new ones
    };
  }, [settings?.customHeaderCode]);

  // Inject footer code
  useEffect(() => {
    if (!settings?.customFooterCode) return;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = settings.customFooterCode;

    const scripts = tempDiv.querySelectorAll("script");
    const styles = tempDiv.querySelectorAll("style, link[rel='stylesheet']");
    const html = tempDiv.querySelectorAll("div, span, img, iframe, noscript, p, a");

    [...styles].forEach((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      document.head.appendChild(clone);
    });

    [...html].forEach((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      document.body.appendChild(clone);
    });

    [...scripts].forEach((el) => {
      const clone = document.createElement("script");
      for (const attr of el.attributes) {
        clone.setAttribute(attr.name, attr.value);
      }
      if (el.textContent) {
        clone.textContent = el.textContent;
      }
      document.body.appendChild(clone);
    });
  }, [settings?.customFooterCode]);

  return null;
}
