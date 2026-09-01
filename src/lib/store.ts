"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppView = "public" | "admin";

export type PublicPage =
  | "home"
  | "services"
  | "collection"
  | "reviews"
  | "contact";

export type AdminModule =
  | "overview"
  | "bookings"
  | "services"
  | "reviews"
  | "content";

interface AppState {
  view: AppView;
  setView: (v: AppView) => void;

  publicPage: PublicPage;
  setPublicPage: (p: PublicPage) => void;

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
        adminToken: s.adminToken,
        adminName: s.adminName,
        adminModule: s.adminModule,
      }),
    }
  )
);
