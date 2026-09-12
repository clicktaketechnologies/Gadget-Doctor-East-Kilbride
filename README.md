# 🔧 Gadget Doctor East Kilbride

> **Fast & Reliable Electronics Repair in East Kilbride**
>
> A complete, production-ready business website + admin dashboard built with Next.js 16, TypeScript, Tailwind CSS, and Prisma. Features 8 service category pages with dedicated detail pages, a blog CMS, ticket tracking, a full admin panel with 10 modules, SMTP email with test functionality, branding manager with favicon support, booking pagination, and more.

---

## 📋 Table of Contents

- [Live URLs](#live-urls)
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start (Local Development)](#quick-start-local-development)
- [Environment Variables](#environment-variables)
- [Database Setup & Seeding](#database-setup--seeding)
- [Admin Access](#admin-access)
- [Production Build](#production-build)
- [Deployment Guides](#deployment-guides)
  - [Current Live Setup (Firebase + Render)](#current-live-setup-firebase--render)
  - [Vercel](#-vercel)
  - [Render (Standalone)](#-render-standalone)
  - [Railway](#-railway)
  - [Netlify](#-netlify)
  - [cPanel / Shared Hosting](#-cpanel--shared-hosting)
  - [Docker (any VPS)](#-docker-any-vps)
  - [Manual VPS (Ubuntu/Debian)](#-manual-vps-ubuntudebian)
- [Database Migration (SQLite → PostgreSQL)](#database-migration-sqlite--postgresql)
- [Email / SMTP Setup](#email--smtp-setup)
- [Customization Guide](#customization-guide)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Live URLs

| URL | What | Platform |
|-----|------|----------|
| **https://gadgetdoctorls.web.app/** | Public website (static export) | Firebase Hosting (free) |
| **https://gadget-doctor-east-kilbride.onrender.com/** | Backend API + Admin dashboard | Render |
| **https://gadgetdoctorls.web.app/admin** | Admin (redirects to Render) | Firebase → Render |
| **Database** | PostgreSQL | Supabase |
| **Analytics** | Visitor tracking | Firebase Analytics (gadgetdoctorls project) |
| **CI/CD** | Auto-deploy on push to main | GitHub Actions → Firebase + Render auto-deploy |

---

## Overview

Gadget Doctor East Kilbride is a real electronics repair business in East Kilbride, Scotland. This project is their complete online presence:

- **Public website** (`/`): Home, 8 service category pages with dedicated detail pages, blog, ticket tracker, reviews, contact, collection service.
- **Admin dashboard** (`/admin`): 10 modules — Overview, Bookings, Services & Pricing, Reviews, Content, Branding, Blog, Pages (CMS), Email (SMTP), Settings.

The public site is statically exported and hosted on Firebase Hosting (free). The backend (API routes + admin) runs on Render. The database is PostgreSQL on Supabase.

---

## Features

### 🌐 Public Website
- **8 service category pages** — Mobile, Tablet, Laptop, MacBook, Computer, Custom PC, Console, Apple Watch — each with sub-services, pricing, booking CTA, and dedicated detail pages.
- **Blog** — full CMS-managed blog with featured posts, categories, markdown content, and share buttons.
- **Ticket tracking** — customers track repairs by ticket ID (e.g. `GD-1234`) with a live status timeline. Can be toggled on/off from admin.
- **Booking system** — 4-step quote builder (device → problem → collection → contact) with preferred date/time picker.
- **Reviews** — aggregate rating display + customer review submission.
- **Contact page** — Google Maps embed, opening hours, all social links, target areas.
- **Collection service** — master toggle hides collection site-wide when disabled.
- **Branding** — logo, favicon, colors, contact info, hours, socials all DB-driven and editable from admin.
- **Responsive** — mobile-first, works on all devices.
- **CTA on every page** — reusable CTA band (Book Repair + Call Now + WhatsApp).

### 🔐 Admin Dashboard (10 modules)
1. **Overview** — analytics: total requests, pending collections, completed jobs, revenue, 14-day trend chart, device breakdown pie chart, status breakdown.
2. **Bookings** — filterable/searchable table with date range filter, pagination (10 per page), delete button per row, status management, technician notes, quoted/final pricing, reply-to-customer email, booking date/time display.
3. **Services & Pricing** — full CRUD for the service catalogue with icon picker, pricing, turnaround.
4. **Reviews** — approve/edit/delete customer testimonials.
5. **Content** — collection master toggle, ticket ID visibility toggle, announcement banner, collection banner.
6. **Branding** — edit business name, tagline, about, logo URL, **favicon URL** (with browser-tab preview), brand colors, phone, WhatsApp, email, website, GMB profile, address, map, opening hours, 7 social links, target areas, rating.
7. **Blog** — full CRUD for blog posts with markdown content, cover images, categories, tags, publish/feature toggles.
8. **Pages (CMS)** — edit text and images on public pages (home, services, collection, reviews, contact, blog).
9. **Email (SMTP)** — SMTP configuration with provider selector (cPanel, Gmail, Outlook, Yahoo, Zoho, Mailgun, SendGrid, Brevo, Custom), test email feature with error diagnostics + hints, sent email log.
10. **Settings** — change admin password (with validation + show/hide toggle), branding quick access card.

### 🔔 Notifications
- Toast notifications for all actions (booking submitted, status updated, email sent, password changed, etc.)
- Up to 5 toasts visible simultaneously, auto-dismiss after 5 seconds.

### 🔄 Auto-Deploy (CI/CD)
- **GitHub Actions** — every push to `main` auto-builds and deploys the Firebase static site.
- **Render** — auto-rebuilds on every push to `main`.
- No manual commands needed — just push to GitHub.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS 4** + **shadcn/ui** (New York) |
| Icons | **lucide-react** |
| Database | **Prisma ORM** + **PostgreSQL** (Supabase) |
| State | **Zustand** (client) + **TanStack Query** (server) |
| Charts | **Recharts** |
| Animation | **Framer Motion** |
| Email | **Nodemailer** (dynamically imported) |
| Analytics | **Firebase Analytics** |
| Auth | Mock JWT (base64 token, 12h expiry) |
| Package Manager | **npm** |
| Frontend Hosting | **Firebase Hosting** (static export) |
| Backend Hosting | **Render** (Docker) |
| Database Hosting | **Supabase** (PostgreSQL) |
| CI/CD | **GitHub Actions** |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  FIREBASE HOSTING (free) — Public Frontend                  │
│  https://gadgetdoctorls.web.app                             │
│    ├── /          → static public website                   │
│    ├── /services  → static page                             │
│    ├── /blog      → static page                             │
│    ├── /contact   → static page                             │
│    └── /admin     → 302 redirect to Render                  │
│  Firebase Analytics → tracks visitors                       │
└─────────────────────────────────────────────────────────────┘
          │ API calls (cross-origin, CORS-enabled)
          ▼
┌─────────────────────────────────────────────────────────────┐
│  RENDER (Docker) — Backend + Admin                          │
│  https://gadget-doctor-east-kilbride.onrender.com           │
│    ├── /api/*     → all API routes (bookings, services,     │
│    │                reviews, blog, branding, email, etc.)   │
│    └── /admin     → admin dashboard (server-rendered)       │
│  CORS: 3 layers (next.config headers + route handlers +    │
│         proxy.ts)                                           │
└─────────────────────────────────────────────────────────────┘
          │ Prisma ORM
          ▼
┌─────────────────────────────────────────────────────────────┐
│  SUPABASE — PostgreSQL Database                             │
│  10 tables: Service, Booking, Review, AdminUser,            │
│  SiteSettings, Branding, BlogPost, PageContent,             │
│  EmailSettings, SentEmail                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

- **Node.js 20+** (LTS recommended) — [download here](https://nodejs.org)
- **npm** (comes with Node.js)
- **Git**

---

## Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/clicktaketechnologies/Gadget-Doctor-East-Kilbride.git
cd Gadget-Doctor-East-Kilbride

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Create your .env file
cp .env.example .env
# Edit .env with your DATABASE_URL (PostgreSQL connection string)

# 4. Generate Prisma client
npx prisma generate

# 5. Create the database tables
# Option A: npx prisma db push (needs direct DB connection)
# Option B: Run supabase-init.sql in Supabase SQL Editor

# 6. Start the dev server
npm run dev

# 7. In a second terminal, seed the database:
# PowerShell:
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/seed"
# Mac/Linux:
curl -X POST http://localhost:3000/api/seed
```

Then open **http://localhost:3000** in your browser.

- **Public site**: http://localhost:3000
- **Admin dashboard**: http://localhost:3000/admin
- **Admin login**: `admin@gadgetdoctor.co.uk` / `admin123`

---

## Environment Variables

Copy `.env.example` to `.env` and adjust:

```env
# Database — PostgreSQL (Supabase pooler URL for runtime)
# Use the POOLER connection (Session mode, port 5432)
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-X-region.pooler.supabase.com:5432/postgres

# Direct connection — used by Prisma for migrations only
DIRECT_DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres

# ── Optional: SMTP email ──
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# SMTP_FROM_EMAIL=your-email@gmail.com
# SMTP_FROM_NAME=Gadget Doctor East Kilbride

# ── Firebase Analytics (pre-configured for gadgetdoctorls project) ──
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# (already hardcoded with defaults in src/lib/firebase.ts)

# ── Firebase static export build ──
# NEXT_PUBLIC_API_BASE_URL=https://gadget-doctor-east-kilbride.onrender.com
# (set automatically by the build:firebase script)
```

---

## Database Setup & Seeding

The project uses **Prisma ORM** with **PostgreSQL** (Supabase).

### Creating tables

**Option A: Prisma db push** (needs direct DB connection):
```bash
DIRECT_DATABASE_URL="postgresql://postgres:PASS@db.XXX.supabase.co:5432/postgres" npx prisma db push
```

**Option B: Supabase SQL Editor** (if direct connection is blocked):
1. Go to Supabase → SQL Editor → New query
2. Paste the contents of `supabase-init.sql` → Run

**Option C: Add new columns via SQL** (for schema updates):
```sql
ALTER TABLE "Branding" ADD COLUMN IF NOT EXISTS "faviconUrl" TEXT NOT NULL DEFAULT '/gadget-doctor-logo.jpg';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "ticketIdVisible" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "bookingDate" TIMESTAMP(3);
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "bookingTime" TEXT;
```

### Seeding

```bash
# After the dev server is running:
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/seed"
# or
curl -X POST http://localhost:3000/api/seed
```

The seed creates:
- 1 admin user (`admin@gadgetdoctor.co.uk` / `admin123`)
- 38 services across 8 categories
- 14 reviews
- 12 sample bookings (GD-1000 through GD-1011)
- 4 blog posts
- Branding, settings, email config records

---

## Admin Access

- **URL**: `http://localhost:3000/admin` (or `https://gadget-doctor-east-kilbride.onrender.com/admin` in production)
- **Email**: `admin@gadgetdoctor.co.uk`
- **Password**: `admin123`

> ⚠️ **Change the admin password** after first login: Admin → Settings → Change Password.

---

## Production Build

### For Render (backend + admin):
```bash
npm run build
npm start
```

### For Firebase (static public site):
```bash
npm run build:firebase
firebase deploy --only hosting --project gadgetdoctorls
```

The `build:firebase` script:
1. Temporarily moves `src/app/api/` and `src/proxy.ts` out of the build
2. Runs `next build` with `output: export` + `NEXT_PUBLIC_API_BASE_URL`
3. Removes `out/admin/` and `out/superadmin/` (redirects to Render)
4. Restores the moved files

---

## Deployment Guides

### Current Live Setup (Firebase + Render)

The project is already deployed and live:

| Component | Platform | URL |
|-----------|----------|-----|
| Public frontend | Firebase Hosting (free) | https://gadgetdoctorls.web.app |
| Backend + Admin | Render (Docker) | https://gadget-doctor-east-kilbride.onrender.com |
| Database | Supabase (PostgreSQL) | db.dfjccrdjqhphfplhsypp.supabase.co |
| Analytics | Firebase Analytics | gadgetdoctorls project |
| CI/CD | GitHub Actions | Auto-deploys on push to main |

**How it works:**
1. Push code to GitHub → `main` branch
2. GitHub Actions builds the Firebase static site → deploys to Firebase Hosting
3. Render auto-detects the push → rebuilds the Docker image → deploys the backend
4. Firebase `firebase.json` redirects `/admin` and `/superadmin` to Render
5. The static site calls Render APIs cross-origin (CORS is configured with 3 layers)

**GitHub Secrets needed:**
- `FIREBASE_SERVICE_ACCOUNT` — the Firebase service account JSON (for GitHub Actions to deploy to Firebase Hosting)

**Render Environment Variables:**
- `DATABASE_URL` — Supabase pooler URL (port 5432, Session mode)
- `DIRECT_DATABASE_URL` — Supabase direct URL (for Prisma migrations)
- `NODE_ENV` — `production`

---

### ▲ Vercel

1. Go to [vercel.com](https://vercel.com) → import the repo
2. Set `DATABASE_URL` env var (PostgreSQL connection string)
3. Deploy
4. Seed: `curl -X POST https://your-app.vercel.app/api/seed`

> Note: Vercel is serverless — use the Supabase pooler URL, not the direct connection.

---

### 🚂 Render (Standalone)

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - Runtime: Docker (auto-detects Dockerfile)
   - Build Command: `npm install --legacy-peer-deps && npx prisma generate && npm run build`
   - Start Command: `npm start`
4. Environment: `DATABASE_URL`, `DIRECT_DATABASE_URL`, `NODE_ENV=production`
5. Deploy

---

### 🚄 Railway

1. Go to [railway.app](https://railway.app) → Deploy from GitHub
2. Add a PostgreSQL database
3. Set `DATABASE_URL` from Railway's PostgreSQL
4. Deploy

---

### 🌐 Netlify

1. Go to [netlify.com](https://app.netlify.com) → Import from GitHub
2. Build command: `npm install --legacy-peer-deps && npx prisma generate && npm run build`
3. Set `DATABASE_URL` env var
4. Deploy

---

### 🌐 cPanel / Shared Hosting

1. cPanel → Setup Node.js App
2. Upload code (or git clone)
3. Create `server.js` entry point
4. Install deps + build: `npm install && npx prisma generate && npm run build`
5. Set env vars in cPanel
6. Start the app

---

### 🐳 Docker (any VPS)

```bash
git clone https://github.com/clicktaketechnologies/Gadget-Doctor-East-Kilbride.git
cd Gadget-Doctor-East-Kilbride
docker compose up -d --build
curl -X POST http://localhost:3000/api/seed
```

---

### 🖥️ Manual VPS (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx
cd /var/www
git clone https://github.com/clicktaketechnologies/Gadget-Doctor-East-Kilbride.git gadget-doctor
cd gadget-doctor
npm install --legacy-peer-deps
npx prisma generate
npx prisma db push
npm run build
npm install -g pm2
pm2 start "npm start" --name gadget-doctor
pm2 startup && pm2 save
# Configure Nginx reverse proxy + SSL with Certbot
```

---

## Database Migration (SQLite → PostgreSQL)

The project uses PostgreSQL (Supabase). If you need to switch databases:

1. Update `prisma/schema.prisma` → `provider = "postgresql"` (already set)
2. Set `DATABASE_URL` to your PostgreSQL connection string
3. Run `npx prisma db push` (or run `supabase-init.sql` in the SQL Editor)
4. Seed: `curl -X POST https://your-app/api/seed`

---

## Email / SMTP Setup

The admin panel has an **Email module** (`/admin` → Email) with:
- **Provider selector** — cPanel, Gmail, Outlook, Yahoo, Zoho, Mailgun, SendGrid, Brevo, Custom
- **Test email** — sends a test email with diagnostics + error hints
- **Sent email log** — last 50 emails

### Common providers:

| Provider | Host | Port | Secure |
|----------|------|------|--------|
| cPanel (your domain) | mail.gadgetdoctorls.co.uk | 465 | ON |
| Gmail | smtp.gmail.com | 587 | OFF |
| Outlook / 365 | smtp.office365.com | 587 | OFF |
| Yahoo | smtp.mail.yahoo.com | 587 | OFF |
| Zoho | smtp.zoho.com | 465 | ON |
| Mailgun | smtp.mailgun.org | 587 | OFF |
| SendGrid | smtp.sendgrid.net | 587 | OFF |
| Brevo | smtp-relay.brevo.com | 587 | OFF |

### Gmail setup (most common):
1. Enable 2-Step Verification
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use the App Password (not your Gmail password) in the SMTP settings

### How it works:
- When SMTP is **enabled + configured**, emails are sent via Nodemailer
- When SMTP is **disabled**, emails are simulated (logged but not sent)
- The test email feature verifies the connection + sends a branded test email

---

## Customization Guide

### Change the admin password
Admin → Settings → Change Password (current + new + confirm, with validation)

### Change branding (logo, favicon, colors, contact, hours, socials)
Admin → Branding module. Changes go live instantly on the public site.

### Add/edit services & pricing
Admin → Services & Pricing module. Full CRUD with icon picker.

### Edit page text
Admin → Pages module. Edit headings, subtitles, and section text for each public page.

### Manage blog posts
Admin → Blog module. Create, edit, publish, feature posts.

### Enable/disable collection service
Admin → Content → Collection Service — Site-wide Toggle

### Enable/disable ticket ID visibility
Admin → Content → Booking Ticket ID — Visibility Toggle

### Add announcement banner
Admin → Content → Announcement Banner

### Configure email/SMTP
Admin → Email → select provider → fill credentials → Save → Send Test Email

### Refresh admin data
Admin topbar → Refresh button (reload icon)

---

## Troubleshooting

### `npm install` fails with peer dependency errors
The repo includes a `.npmrc` with `legacy-peer-deps=true`. If you still see errors:
```bash
npm install --legacy-peer-deps
```

### Prisma client not generated
```bash
npx prisma generate
```

### Database doesn't exist / connection error
```bash
npx prisma db push
# OR run supabase-init.sql in Supabase SQL Editor
```

### Booking form shows "Failed to fetch"
This is a CORS issue. Ensure:
1. Render has deployed the latest code (with CORS in route handlers + next.config headers + proxy.ts)
2. Hard refresh your browser (Ctrl+Shift+R)
3. Clear localStorage (DevTools → Application → Local Storage → delete gd-app-store)

### Bookings table shows "0 of 0 tickets"
Your admin token may be expired. Sign out → sign in again.

### Admin login doesn't work after deploy
Seed the database: `curl -X POST https://your-url/api/seed`

### Email test fails
Check the error message + hint in the Test Email card. Common fixes:
- Gmail: use an App Password (not your Gmail password)
- cPanel: use full email address as username + email password
- Connection timeout: your host may block Render's IP — try Gmail or Brevo instead

### Port 3000 already in use
```bash
PORT=8080 npm run dev
```

### PowerShell `curl` doesn't work
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/seed"
# or
curl.exe -X POST http://localhost:3000/api/seed
```

---

## License

This project is proprietary. All rights reserved by **Gadget Doctor East Kilbride** and **ClickTake Technologies**.

---

## Credits

**Developed by**: [ClickTake Technologies](https://www.clicktaketech.com)

**Business**: Gadget Doctor East Kilbride, 14 Stroud Rd, East Kilbride, G75 0YA, Scotland

**Contact**: +44 7777 200175 · info@gadgetdoctorscotland.co.uk

**Website**: https://www.gadgetdoctoreastkilbride.co.uk

**Social**: [Facebook](https://www.facebook.com/GadgetDoctorEastKilbride/) · [Instagram](https://www.instagram.com/gadgetdoctoreastkilbride) · [TikTok](https://www.tiktok.com/@gadgetdoctoreastkilbride) · [YouTube](https://www.youtube.com/@gadgetdoctoreastkilbride) · [Pinterest](https://uk.pinterest.com/gadgetdoctoreastkilbride/) · [LinkedIn](https://www.linkedin.com/company/gadget-doctor-east-kilbride) · [Blog](https://gadgetdoctoreastkilbride.blogspot.com/)

---

*Powered by [ClickTake Technologies](https://www.clicktaketech.com)*
