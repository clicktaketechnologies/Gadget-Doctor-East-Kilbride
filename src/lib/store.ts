"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppView = "public" | "admin";

export type PublicPage =
  | "home"
  | "services"
  | "service-detail"
  | "collection"
  | "reviews"
  | "contact"
  | "blog"
  | "blog-detail"
  | "track";

export type AdminModule =
  | "overview"
  | "bookings"
  | "services"
  | "reviews"
  | "content"
  | "branding"
  | "blog"
  | "pages"
  | "email"
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
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: "public",
      setView: (view) => set({ view }),

      publicPage: "home",
      setPublicPage: (publicPage) => set({ publicPage }),

      activeServiceCategory: null,
      openServiceDetail: (category) =>
        set({ publicPage: "service-detail", activeServiceCategory: category }),

      activeBlogSlug: null,
      openBlogDetail: (slug) =>
        set({ publicPage: "blog-detail", activeBlogSlug: slug }),

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
    }),
    {
      name: "gd-app-store",
      partialize: (s) => ({
        view: s.view,
        publicPage: s.publicPage,
        activeServiceCategory: s.activeServiceCategory,
        activeBlogSlug: s.activeBlogSlug,
        adminToken: s.adminToken,
        adminName: s.adminName,
        adminModule: s.adminModule,
      }),
    }
  )
);
