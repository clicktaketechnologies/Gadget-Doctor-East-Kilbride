// Shared domain types for Gadget Doctor

export type ServiceCategory =
  | "mobile"
  | "tablet"
  | "laptop"
  | "macbook"
  | "computer"
  | "custom-computer"
  | "console"
  | "apple-watch";

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
  bookingDate: string | null;
  bookingTime: string | null;
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
  collectionEnabled: boolean;
  collectionBannerEnabled: boolean;
  announcementEnabled: boolean;
  announcementText: string | null;
  ticketIdVisible: boolean;
}

export interface BusinessHours {
  day: string;
  time: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  pinterest?: string;
  linkedin?: string;
  blog?: string;
  [k: string]: string | undefined;
}

export interface Branding {
  id: string;
  businessName: string;
  tagline: string;
  about: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  gmbProfile: string;
  mapLink: string;
  mapEmbed: string;
  address: string;
  hours: BusinessHours[];
  socials: SocialLinks;
  targetAreas: string[];
  rating: number;
  reviewCount: number;
  yearsExperience: number;
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
  bookingDate?: string;
  bookingTime?: string;
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
  bookingDate?: string | null;
  bookingTime?: string | null;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface CreateReviewInput {
  author: string;
  rating: number;
  comment: string;
  device?: string;
}

export interface UpdateBrandingInput {
  businessName?: string;
  tagline?: string;
  about?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  gmbProfile?: string;
  mapLink?: string;
  mapEmbed?: string;
  address?: string;
  hours?: BusinessHours[];
  socials?: SocialLinks;
  targetAreas?: string[];
  rating?: number;
  reviewCount?: number;
  yearsExperience?: number;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}

// ---- Blog ----
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string;
  author: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostInput {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string;
  author?: string;
  published?: boolean;
  featured?: boolean;
}

export type UpdateBlogPostInput = Partial<CreateBlogPostInput>;

// ---- Page content (CMS) ----
export interface PageContent {
  id: string;
  page: string;
  section: string;
  key: string;
  value: string;
  updatedAt: string;
}

export interface PageContentMap {
  // page -> section -> key -> value
  [page: string]: { [section: string]: { [key: string]: string } };
}

export interface UpdatePageContentInput {
  page: string;
  section: string;
  key: string;
  value: string;
}

// ---- Email ----
export interface EmailSettings {
  id: string;
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface UpdateEmailSettingsInput {
  enabled?: boolean;
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  password?: string;
  fromEmail?: string;
  fromName?: string;
}

export interface SendEmailInput {
  toEmail: string;
  subject: string;
  body: string;
  relatedBookingId?: string;
}

export interface SentEmail {
  id: string;
  toEmail: string;
  subject: string;
  body: string;
  status: string;
  relatedBookingId: string | null;
  createdAt: string;
}

// ---- Ticket tracking ----
export interface TrackResult {
  ticketId: string;
  customerName: string;
  deviceType: string;
  deviceModel: string;
  issue: string;
  status: BookingStatus;
  needsCollection: boolean;
  quotedPrice: number | null;
  finalPrice: number | null;
  technicianNotes: string | null;
  createdAt: string;
  updatedAt: string;
  found: boolean;
}

