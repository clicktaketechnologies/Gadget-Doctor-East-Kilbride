"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import type {
  Service,
  Booking,
  Review,
  SiteSettings,
  DashboardStats,
  Branding,
  UpdateBrandingInput,
  CreateBookingInput,
  ChangePasswordInput,
  CreateServiceInput,
  UpdateServiceInput,
  UpdateBookingInput,
  CreateReviewInput,
  AdminLoginInput,
  AuthResponse,
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  PageContentMap,
  UpdatePageContentInput,
  EmailSettings,
  UpdateEmailSettingsInput,
  SendEmailInput,
  SentEmail,
  TrackResult,
} from "@/lib/types";

// When the public frontend is statically hosted on Firebase, all API calls
// go to the Render backend. When running on the same origin (Render dev/prod),
// API_BASE is empty so calls use relative URLs.
// Hardcoded fallback ensures it works even if the env var isn't baked in
// during the static export build.
const RENDER_API_URL = "https://gadget-doctor-east-kilbride.onrender.com";

// Called PER REQUEST (not at module load) so it works correctly on both
// server-side (static export) and client-side (browser).
function getApiBase(): string {
  // If the env var is baked in at build time, use it
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // Server-side (SSR / static export): no window — use empty (relative)
  if (typeof window === "undefined") {
    return "";
  }
  // Client-side: check the hostname
  const host = window.location.hostname;
  if (host.includes("onrender.com")) {
    return ""; // same origin — relative URLs
  }
  // We're on Firebase (*.web.app) or a custom domain — use the Render API
  return RENDER_API_URL;
}

async function api<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const token = useAppStore.getState().adminToken;
  const baseUrl = getApiBase();
  const res = await fetch(baseUrl + path, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
  });
  if (!res.ok) {
    // If 401 Unauthorized, the token is expired/invalid — auto-logout
    if (res.status === 401) {
      useAppStore.getState().clearAdminAuth();
    }
    const msg = await res.json().catch(() => ({}));
    throw new Error((msg as { error?: string }).error || res.statusText);
  }
  return res.json() as Promise<T>;
}

// ---------- Services ----------
export function useServices(activeOnly = false) {
  return useQuery<Service[]>({
    queryKey: ["services", activeOnly],
    queryFn: () => api(`/api/services${activeOnly ? "?active=true" : ""}`),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateServiceInput) =>
      api<Service>("/api/services", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateServiceInput) =>
      api<Service>(`/api/services/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<{ ok: true }>(`/api/services/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

// ---------- Bookings ----------
export function useBookings() {
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: () => api("/api/bookings"),
    retry: 2,
    refetchOnMount: true,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (input: CreateBookingInput): Promise<Booking> => {
      // Use a PLAIN fetch (no Authorization header) — this is a public endpoint.
      // Sending the Authorization header (from a stale admin token in localStorage)
      // triggers a CORS preflight that fails on Firebase → "Failed to fetch".
      const baseUrl = getApiBase();
      const res = await fetch(baseUrl + "/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error((msg as { error?: string }).error || res.statusText);
      }
      return res.json() as Promise<Booking>;
    },
    onSuccess: (b) => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Repair request submitted!",
        description: `Your ticket ${b.ticketId} has been received. We'll be in touch shortly.`,
      });
    },
  });
}

export function useUpdateBooking(id: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: UpdateBookingInput) =>
      api<Booking>(`/api/bookings/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      toast({ title: "Ticket updated", description: "Changes saved successfully." });
    },
  });
}

export function useDeleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<{ ok: true }>(`/api/bookings/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// ---------- Reviews ----------
export function useReviews(approvedOnly = false) {
  return useQuery<Review[]>({
    queryKey: ["reviews", approvedOnly],
    queryFn: () => api(`/api/reviews${approvedOnly ? "?approved=true" : ""}`),
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (input: CreateReviewInput): Promise<Review> => {
      // Plain fetch (no Authorization header) — public endpoint
      const baseUrl = getApiBase();
      const res = await fetch(baseUrl + "/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error((msg as { error?: string }).error || res.statusText);
      }
      return res.json() as Promise<Review>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      toast({ title: "Thanks for your review!", description: "It's now live on our page." });
    },
  });
}

export function useUpdateReview(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { approved?: boolean; rating?: number; comment?: string; author?: string; device?: string }) =>
      api<Review>(`/api/reviews/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<{ ok: true }>(`/api/reviews/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

// ---------- Settings ----------
export function useSettings() {
  return useQuery<SiteSettings>({
    queryKey: ["settings"],
    queryFn: () => api("/api/settings"),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: Partial<SiteSettings>) =>
      api<SiteSettings>("/api/settings", { method: "PATCH", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      toast({ title: "Settings saved" });
    },
  });
}

// ---------- Stats ----------
export function useStats() {
  return useQuery<DashboardStats>({
    queryKey: ["stats"],
    queryFn: () => api("/api/stats"),
  });
}

// ---------- Auth ----------
export function useAdminLogin() {
  const setAdminAuth = useAppStore((s) => s.setAdminAuth);
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: AdminLoginInput) =>
      api<AuthResponse>("/api/admin/login", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: (res) => {
      setAdminAuth(res.token, res.user.name);
      toast({ title: `Welcome back, ${res.user.name}`, description: "Logged in successfully." });
    },
  });
}

// ---------- Seed (dev convenience) ----------
export function useSeed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<{ ok: true }>("/api/seed", { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
}

// ---------- Branding ----------
export function useBranding() {
  return useQuery<Branding>({
    queryKey: ["branding"],
    queryFn: () => api("/api/branding"),
    staleTime: 60_000,
  });
}

export function useUpdateBranding() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: UpdateBrandingInput) =>
      api<Branding>("/api/branding", { method: "PATCH", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branding"] });
      toast({ title: "Branding saved", description: "Your changes are now live on the website." });
    },
  });
}

// ---------- Blog ----------
export function useBlogPosts(publishedOnly = false) {
  return useQuery<BlogPost[]>({
    queryKey: ["blog", publishedOnly],
    queryFn: () => api(`/api/blog${publishedOnly ? "?published=true" : ""}`),
  });
}

export function useCreateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBlogPostInput) =>
      api<BlogPost>("/api/blog", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}

export function useUpdateBlogPost(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBlogPostInput) =>
      api<BlogPost>(`/api/blog/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<{ ok: true }>(`/api/blog/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}

// ---------- Page Content (CMS) ----------
export function usePageContent(page?: string) {
  return useQuery<PageContentMap>({
    queryKey: ["pages", page],
    queryFn: () => api(`/api/pages${page ? `?page=${page}` : ""}`),
    staleTime: 60_000,
  });
}

export function useSavePageContent() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (items: UpdatePageContentInput[]) =>
      api<{ ok: true }>("/api/pages", { method: "PATCH", body: JSON.stringify(items) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"] });
      toast({ title: "Page content saved", description: "Changes are now live." });
    },
  });
}

// ---------- Ticket Tracking ----------
export function useTrackTicket(ticketId: string | null) {
  return useQuery<TrackResult>({
    queryKey: ["track", ticketId],
    queryFn: () => api(`/api/track/${encodeURIComponent(ticketId || "")}`),
    enabled: !!ticketId && ticketId.trim().length >= 4,
    retry: false,
  });
}

// ---------- Email Settings ----------
export function useEmailSettings() {
  return useQuery<EmailSettings>({
    queryKey: ["email-settings"],
    queryFn: () => api("/api/email/settings"),
  });
}

export function useUpdateEmailSettings() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: UpdateEmailSettingsInput) =>
      api<EmailSettings>("/api/email/settings", { method: "PATCH", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["email-settings"] });
      toast({ title: "Email settings saved" });
    },
  });
}

export function useSendEmail() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: SendEmailInput) =>
      api<{ ok: boolean; log: SentEmail }>("/api/email/send", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["email-log"] });
      if (res.ok) {
        toast({ title: "Email sent", description: `Message delivered to ${res.log.toEmail}.` });
      }
    },
    onError: (e) => {
      toast({ title: "Email failed", description: e.message, variant: "destructive" });
    },
  });
}

export function useEmailLog() {
  return useQuery<SentEmail[]>({
    queryKey: ["email-log"],
    queryFn: () => api("/api/email/log"),
  });
}

// ---------- Test Email ----------
export function useTestEmail() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (toEmail: string): Promise<{ ok: boolean; message?: string; error?: string; hint?: string; configured?: boolean; enabled?: boolean }> => {
      // Custom fetch so we can read the error body even on 502
      const token = useAppStore.getState().adminToken;
      const res = await fetch(getApiBase() + "/api/email/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ toEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok && !data.ok) {
        // Attach the error details to the Error so onError can read them
        const err = new Error(data.error || data.message || `HTTP ${res.status}`);
        (err as Error & { hint?: string; configured?: boolean }).hint = data.hint;
        (err as Error & { hint?: string; configured?: boolean }).configured = data.configured;
        throw err;
      }
      return data;
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["email-log"] });
      if (res.ok) {
        toast({ title: "✅ Test email sent!", description: res.message });
      }
    },
    onError: (e: Error & { hint?: string }) => {
      toast({
        title: "❌ Test email failed",
        description: e.message,
        variant: "destructive",
      });
    },
  });
}

// ---------- Change Password ----------
export function useChangePassword() {
  const setAdminAuth = useAppStore((s) => s.setAdminAuth);
  const adminName = useAppStore((s) => s.adminName);
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      api<{ ok: boolean; token: string }>("/api/admin/change-password", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (res) => {
      setAdminAuth(res.token, adminName ?? "Admin");
      toast({ title: "Password changed", description: "Your password has been updated successfully." });
    },
  });
}

