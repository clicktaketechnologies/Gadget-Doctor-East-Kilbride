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
  CreateBookingInput,
  CreateServiceInput,
  UpdateServiceInput,
  UpdateBookingInput,
  CreateReviewInput,
  AdminLoginInput,
  AuthResponse,
} from "@/lib/types";

async function api<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const token = useAppStore.getState().adminToken;
  const res = await fetch(path, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
  });
  if (!res.ok) {
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
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: CreateBookingInput) =>
      api<Booking>("/api/bookings", { method: "POST", body: JSON.stringify(input) }),
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
    mutationFn: (input: CreateReviewInput) =>
      api<Review>("/api/reviews", { method: "POST", body: JSON.stringify(input) }),
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
