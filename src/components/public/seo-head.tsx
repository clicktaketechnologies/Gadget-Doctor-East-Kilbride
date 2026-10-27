"use client";

import { useEffect } from "react";
import { useAppStore, type PublicPage } from "@/lib/store";
import { useBlogPosts } from "@/lib/api-hooks";
import { BRAND, SERVICE_CATEGORIES } from "@/lib/brand";

/**
 * <SeoHead> — client-side per-page SEO metadata.
 *
 * Fixes Ahrefs Site Audit CRITICAL issues C1 + C2 (project 5991516):
 *   C1 — duplicate canonical: every page previously canonicalized to the
 *        homepage because layout.tsx sets `alternates.canonical = SITE_URL`
 *        (a static value) and the SPA serves the same <head> for every URL.
 *   C2 — duplicate <title> + meta description: same root cause.
 *
 * This component reads the store's `publicPage` (+ activeServiceCategory /
 * activeBlogSlug) and dynamically updates document.title, the meta
 * description, OpenGraph title/description/url/image, and — critically —
 * sets the canonical link to the CURRENT url (self-referential), so each
 * page tells crawlers "I am my own canonical page", not a duplicate of /.
 *
 * JS-enabled crawlers (Googlebot) execute this after hydration, so the
 * per-page metadata is picked up. The server-rendered <head> still carries
 * the home metadata as a fallback (better than nothing for no-JS clients).
 */

const SITE_URL = BRAND.website;
const DEFAULT_IMAGE = `${SITE_URL}/gadget-doctor-logo.jpg`;

interface PageSeo {
  title: string;
  description: string;
  image?: string;
}

/** Build per-page SEO metadata from the current SPA state. */
function getSeoForPage(
  page: PublicPage,
  category: string | null,
  blogSlug: string | null,
  blogPosts: { slug: string; title: string; excerpt: string; coverImage: string | null }[] | undefined
): PageSeo {
  const cat = category ? SERVICE_CATEGORIES.find((c) => c.value === category) : null;

  switch (page) {
    case "home":
      return {
        title: `${BRAND.fullName} | ${BRAND.tagline}`,
        description:
          "Gadget Doctor East Kilbride repairs phones, tablets, laptops, MacBooks, computers, custom PCs, games consoles and Apple Watches. Same-day repairs, doorstep collection across East Kilbride & surrounding areas. Call +44 1355 458135.",
        image: DEFAULT_IMAGE,
      };

    case "services":
      return {
        title: `Repair Services in East Kilbride | ${BRAND.fullName}`,
        description:
          "Browse all electronics repair services at Gadget Doctor East Kilbride — phone, tablet, laptop, MacBook, computer, custom PC, games console and Apple Watch repairs. Same-day service, genuine-grade parts. Call +44 1355 458135.",
        image: `${SITE_URL}/images/services-grid.jpg`,
      };

    case "service-detail":
      if (cat) {
        return {
          title: `${cat.label} in East Kilbride | ${BRAND.fullName}`,
          description: `${cat.description} Same-day service and genuine-grade parts from Gadget Doctor East Kilbride. Book online or call +44 1355 458135.`,
          image: `${SITE_URL}/images/services-grid.jpg`,
        };
      }
      return {
        title: `Repair Services in East Kilbride | ${BRAND.fullName}`,
        description:
          "Electronics repair services at Gadget Doctor East Kilbride. Same-day service, certified technicians.",
        image: `${SITE_URL}/images/services-grid.jpg`,
      };

    case "collection":
      return {
        title: `Doorstep Collection Service | ${BRAND.fullName}`,
        description: `Doorstep collection and return across ${BRAND.targetAreas.join(
          ", "
        )}. Book your repair online and we'll pick up your device, fix it, and drop it back. Call +44 1355 458135.`,
        image: `${SITE_URL}/images/collection-van.jpg`,
      };

    case "reviews":
      return {
        title: `Customer Reviews | ${BRAND.fullName}`,
        description: `Read ${BRAND.rating}★ reviews from happy Gadget Doctor East Kilbride customers — cracked iPhone screens, PS5 HDMI repairs, MacBook logic-board fixes, custom gaming PC builds and more. ${BRAND.reviewCount}+ verified reviews.`,
        image: DEFAULT_IMAGE,
      };

    case "contact":
      return {
        title: `Contact Us | ${BRAND.fullName}`,
        description: `Visit Gadget Doctor East Kilbride at ${BRAND.addressShort}. Call ${BRAND.phones[0]}. Mon–Thu 09:30–15:00, Fri 09:30–14:30, Sat 10:00–14:00, Sun closed. Doorstep collection available across East Kilbride & surrounding areas.`,
        image: `${SITE_URL}/images/contact-shop.jpg`,
      };

    case "track":
      return {
        title: `Track Your Repair | ${BRAND.fullName}`,
        description:
          "Track your Gadget Doctor repair by ticket ID (GD-XXXX). Real-time status, technician notes and pricing. Book online or call +44 1355 458135.",
        image: DEFAULT_IMAGE,
      };

    case "blog":
      return {
        title: `Repair Tips, Guides & News | ${BRAND.fullName}`,
        description:
          "Practical repair advice, step-by-step guides and workshop news from Gadget Doctor East Kilbride technicians. iPhone screens, PS5 HDMI, MacBook water damage, custom PC builds and more.",
        image: DEFAULT_IMAGE,
      };

    case "blog-detail": {
      const post = blogPosts?.find((p) => p.slug === blogSlug);
      if (post) {
        return {
          title: `${post.title} | ${BRAND.fullName}`,
          description: post.excerpt,
          image: post.coverImage
            ? post.coverImage.startsWith("http")
              ? post.coverImage
              : `${SITE_URL}${post.coverImage}`
            : DEFAULT_IMAGE,
        };
      }
      return {
        title: `Blog | ${BRAND.fullName}`,
        description:
          "Repair tips, guides and workshop news from Gadget Doctor East Kilbride.",
        image: DEFAULT_IMAGE,
      };
    }

    default:
      return {
        title: `${BRAND.fullName} | ${BRAND.tagline}`,
        description:
          "Fast & reliable electronics repair in East Kilbride. Same-day service, certified technicians.",
        image: DEFAULT_IMAGE,
      };
  }
}

/** Find an existing <meta> element by name/property, or create one if missing. */
function upsertMeta(
  attr: "name" | "property",
  key: string
): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  return el;
}

export function SeoHead() {
  const publicPage = useAppStore((s) => s.publicPage);
  const activeServiceCategory = useAppStore((s) => s.activeServiceCategory);
  const activeBlogSlug = useAppStore((s) => s.activeBlogSlug);
  const { data: blogPosts } = useBlogPosts(true);

  const seo = getSeoForPage(
    publicPage,
    activeServiceCategory,
    activeBlogSlug,
    blogPosts
  );

  useEffect(() => {
    // 1. <title> — per page
    document.title = seo.title;

    // 2. <meta name="description">
    upsertMeta("name", "description").setAttribute("content", seo.description);

    // 3. <link rel="canonical"> — SELF-REFERENTIAL (the key C1 fix).
    //    Each page's canonical = its own URL, not the homepage.
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);

    // 4. OpenGraph — per page
    const setOg = (property: string, content: string) =>
      upsertMeta("property", property).setAttribute("content", content);
    setOg("og:title", seo.title);
    setOg("og:description", seo.description);
    setOg("og:url", window.location.href);
    setOg("og:image", seo.image ?? DEFAULT_IMAGE);
    setOg("og:image:alt", seo.title);

    // 5. Twitter card — per page
    const setTw = (name: string, content: string) =>
      upsertMeta("name", name).setAttribute("content", content);
    setTw("twitter:title", seo.title);
    setTw("twitter:description", seo.description);
    setTw("twitter:image", seo.image ?? DEFAULT_IMAGE);
  }, [
    seo.title,
    seo.description,
    seo.image,
    publicPage,
    activeServiceCategory,
    activeBlogSlug,
  ]);

  return null;
}
