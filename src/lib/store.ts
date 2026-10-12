"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { pathnameToPage, type PublicPage } from "@/lib/seo-routes";

export type { PublicPage } from "@/lib/seo-routes";

export type AppView = "public" | "admin";

export type AdminModule =
  | "overview"
  | "bookings"
  | "walk-in"
  | "services"
  | "reviews"
  | "content"
  | "branding"
  | "blog"
  | "pages"
  | "email"
  | "custom-code"
  | "settings";

interface AppState {
  view: AppView;
  setView: (v: AppView) => void;

  publicPage: PublicPage;
  setPublicPage: (p: PublicPage) => void;

  // active service category for the service-detail page
  activeServiceCategory: string | null;
  openServiceDetail: (category: string) => void;

  // active blog post slug for the blog-detail page
  activeBlogSlug: string | null;
  openBlogDetail: (slug: string) => void;

  adminToken: string | null;
  adminName: string | null;
  setAdminAuth: (token: string, name: string) => void;
  clearAdminAuth: () => void;

  adminModule: AdminModule;
  setAdminModule: (m: AdminModule) => void;

  bookingPreset: { deviceType?: string; serviceSlug?: string } | null;
  openBooking: (preset?: { deviceType?: string; serviceSlug?: string }) => void;
  closeBooking: () => void;

  bookingOpen: boolean;
  setBookingOpen: (o: boolean) => void;

  /** Read window.location.pathname on first client render and sync state. */
  syncFromUrl: () => void;
}

/** Inverse of pathnameToPage — build a URL path for a given page. */
function pageToPathname(
  page: PublicPage,
  category: string | null,
  blogSlug: string | null
): string {
  switch (page) {
    case "home":
      return "/";
    case "services":
      return "/services";
    case "service-detail":
      return category ? `/services/${category}` : "/services";
    case "collection":
      return "/collection";
    case "reviews":
      return "/reviews";
    case "contact":
      return "/contact";
    case "track":
      return "/track";
    case "blog":
      return "/blog";
    case "blog-detail":
      return blogSlug ? `/blog/${blogSlug}` : "/blog";
    default:
      return "/";
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "public",
      setView: (view) => set({ view }),

      // Default to home; installUrlSync() sets the correct page from the URL
      // on first client mount (so direct links like /services work).
      publicPage: "home",
      setPublicPage: (publicPage) => {
        set({ publicPage });
        // Keep the browser URL in sync so deep links + back/forward work.
        const st = get();
        const path = pageToPathname(
          publicPage,
          st.activeServiceCategory,
          st.activeBlogSlug
        );
        if (typeof window !== "undefined" && window.location.pathname !== path) {
          window.history.pushState({ page: publicPage }, "", path);
        }
      },

      activeServiceCategory: null,
      openServiceDetail: (category) => {
        set({ publicPage: "service-detail", activeServiceCategory: category });
        if (typeof window !== "undefined") {
          window.history.pushState(
            { page: "service-detail", category },
            "",
            `/services/${category}`
          );
        }
      },

      activeBlogSlug: null,
      openBlogDetail: (slug) => {
        set({ publicPage: "blog-detail", activeBlogSlug: slug });
        if (typeof window !== "undefined") {
          window.history.pushState(
            { page: "blog-detail", slug },
            "",
            `/blog/${slug}`
          );
        }
      },

      adminToken: null,
      adminName: null,
      setAdminAuth: (adminToken, adminName) => set({ adminToken, adminName }),
      clearAdminAuth: () =>
        set({ adminToken: null, adminName: null, adminModule: "overview" }),

      adminModule: "overview",
      setAdminModule: (adminModule) => set({ adminModule }),

      bookingPreset: null,
      bookingOpen: false,
      openBooking: (preset) => set({ bookingOpen: true, bookingPreset: preset ?? null }),
      closeBooking: () => set({ bookingOpen: false, bookingPreset: null }),
      setBookingOpen: (bookingOpen) => set({ bookingOpen }),

      syncFromUrl: () => {
        if (typeof window === "undefined") return;
        const { page, category, blogSlug } = pathnameToPage(
          window.location.pathname
        );
        set({
          publicPage: page,
          activeServiceCategory: category ?? null,
          activeBlogSlug: blogSlug ?? null,
        });
      },
    }),
    {
      name: "gd-app-store",
      partialize: (s) => ({
        view: s.view,
        // Don't persist publicPage — we detect it from the URL on each load
        // so direct links like /services work correctly
        activeServiceCategory: s.activeServiceCategory,
        activeBlogSlug: s.activeBlogSlug,
        adminToken: s.adminToken,
        adminName: s.adminName,
        adminModule: s.adminModule,
      }),
    }
  )
);

/**
 * Install a one-time popstate listener + initial sync so that back/forward
 * navigation and direct deep links land on the right page. Safe to call once
 * from a top-level client component.
 */
export function installUrlSync(): () => void {
  if (typeof window === "undefined") return () => {};

  // Sync state from the URL on first load (handles direct deep links + refresh)
  useAppStore.getState().syncFromUrl();

  const onPop = () => useAppStore.getState().syncFromUrl();
  window.addEventListener("popstate", onPop);

  return () => window.removeEventListener("popstate", onPop);
}
