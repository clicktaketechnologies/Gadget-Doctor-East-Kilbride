// Shared domain types for Gadget Doctor

export type ServiceCategory =
  | "phone"
  | "laptop"
  | "macbook"
  | "console"
  | "ghd"
  | "data-recovery";

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  description: string;
  icon: string;
  priceFrom: number; // pence
  priceTo: number; // pence
  turnaround: string;
  popular: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | "Pending"
  | "In Progress"
  | "Ready"
  | "Completed"
  | "Cancelled";

export interface Booking {
  id: string;
  ticketId: string;
  customerName: string;
  email: string;
  phone: string;
  deviceType: string;
  deviceModel: string;
  issue: string;
  needsCollection: boolean;
  collectionAddr: string | null;
  status: BookingStatus;
  technicianNotes: string | null;
  quotedPrice: number | null;
  finalPrice: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  device: string | null;
  source: string;
  approved: boolean;
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  collectionBannerEnabled: boolean;
  announcementEnabled: boolean;
  announcementText: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  ready: number;
  completed: number;
  collectionPending: number;
  revenue: number; // pence
  revenueCompleted: number; // pence
  statusTrend: { date: string; count: number }[];
  deviceBreakdown: { deviceType: string; count: number }[];
}

export interface CreateBookingInput {
  customerName: string;
  email: string;
  phone: string;
  deviceType: string;
  deviceModel: string;
  issue: string;
  needsCollection: boolean;
  collectionAddr?: string;
}

export interface CreateServiceInput {
  name: string;
  category: ServiceCategory;
  description: string;
  icon: string;
  priceFrom: number;
  priceTo: number;
  turnaround: string;
  popular?: boolean;
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  active?: boolean;
}

export interface UpdateBookingInput {
  status?: BookingStatus;
  technicianNotes?: string;
  quotedPrice?: number | null;
  finalPrice?: number | null;
}

export interface CreateReviewInput {
  author: string;
  rating: number;
  comment: string;
  device?: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}
