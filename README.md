# 🔧 Gadget Doctor East Kilbride

> **Fast & Reliable Electronics Repair in East Kilbride**
>
> A complete, production-ready business website + admin dashboard built with Next.js 16, TypeScript, Tailwind CSS, and Prisma. Features 8 service category pages, a blog, ticket tracking, a full CMS admin panel, SMTP email, and a branding manager.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start (Local Development)](#quick-start-local-development)
- [Environment Variables](#environment-variables)
- [Database Setup & Seeding](#database-setup--seeding)
- [Admin Access](#admin-access)
- [Production Build](#production-build)
- [Deployment Guides](#deployment-guidides)
  - [Vercel](#-vercel-recommended--easiest)
  - [Render](#-render)
  - [Railway](#-railway)
  - [Netlify](#-netlify)
  - [Firebase](#-firebase)
  - [cPanel / Shared Hosting](#-cpanel--shared-hosting)
  - [Docker (any VPS)](#-docker-any-vps)
  - [Manual VPS (Ubuntu/Debian)](#-manual-vps-ubuntudebian)
- [Database Migration (SQLite → PostgreSQL)](#database-migration-sqlite--postgresql)
- [Email / SMTP Setup](#email--smtp-setup)
- [Customization Guide](#customization-guide)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

Gadget Doctor East Kilbride is a real electronics repair business in East Kilbride, Scotland. This project is their complete online presence:

- **Public website** (`/`): Home, 8 service category pages, blog, ticket tracker, reviews, contact, collection service.
- **Admin dashboard** (`/admin` or `/superadmin`): 9 modules — Overview, Bookings, Services & Pricing, Reviews, Content, Branding, Blog, Pages (CMS), Email (SMTP).

The public site and admin are completely separate (different URLs, no public link to admin).

---

## Features

### 🌐 Public Website
- **8 service category pages** — Mobile, Tablet, Laptop, MacBook, Computer, Custom PC, Console, Apple Watch — each with sub-services, pricing, and a booking CTA.
- **Blog** — full CMS-managed blog with featured posts, categories, markdown content, and share buttons.
- **Ticket tracking** — customers track repairs by ticket ID (e.g. `GD-1000`) with a live status timeline.
- **Booking system** — 4-step quote builder (device → problem → collection → contact).
- **Reviews** — aggregate rating display + customer review submission.
- **Contact page** — Google Maps embed, opening hours, all social links, target areas.
- **Collection service** — master toggle hides collection site-wide when disabled.
- **Branding** — logo, colors, contact info, hours, socials all DB-driven and editable from admin.
- **Responsive** — mobile-first, works on all devices.

### 🔐 Admin Dashboard
- **Overview** — analytics: total requests, pending collections, completed jobs, revenue, charts.
- **Bookings** — filterable/searchable table, status management, technician notes, quoted/final pricing, reply-to-customer email.
- **Services & Pricing** — full CRUD for the service catalogue with icon picker, pricing, turnaround.
- **Reviews** — approve/edit/delete customer testimonials.
- **Content** — collection master toggle, announcement banner, collection banner.
- **Branding** — edit business name, tagline, about, logo, brand colors, phone, WhatsApp, email, website, GMB profile, address, map, opening hours, 7 social links, target areas, rating.
- **Blog** — full CRUD for blog posts with markdown content, cover images, categories, tags, publish/feature toggles.
- **Pages (CMS)** — edit text and images on public pages (home, services, collection, reviews, contact, blog).
- **Email** — SMTP configuration + sent email log.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS 4** + **shadcn/ui** (New York) |
| Icons | **lucide-react** |
| Database | **Prisma ORM** + **SQLite** (dev) / PostgreSQL (production) |
| State | **Zustand** (client) + **TanStack Query** (server) |
| Charts | **Recharts** |
| Animation | **Framer Motion** |
| Email | **Nodemailer** |
| Auth | Mock JWT (base64 token, 12h expiry) |
| Package Manager | **npm** or **bun** |

---

## Prerequisites

- **Node.js 20+** (LTS recommended) — [download here](https://nodejs.org)
- **npm** (comes with Node.js) or **[bun](https://bun.sh)**
- **Git**

---

## Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/clicktaketechnologies/Gadget-Doctor-East-Kilbride.git
cd Gadget-Doctor-East-Kilbride

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# (the defaults work for local development)

# 4. Create the database + generate Prisma client
npx prisma db push

# 5. Seed the database (admin user, services, reviews, sample bookings, blog posts)
#    Make sure the dev server is running first (step 6), then in another terminal:
npm run dev

# In a second terminal, seed the database:
# PowerShell:
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/seed"
# OR (Mac/Linux/curl):
curl -X POST http://localhost:3000/api/seed
```

Then open **http://localhost:3000** in your browser.

- **Public site**: http://localhost:3000
- **Admin dashboard**: http://localhost:3000/admin
- **Admin login**: `admin@gadgetdoctor.co.uk` / `admin123`

---

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```env
# Database — SQLite (relative path for local dev)
DATABASE_URL=file:./db/custom.db

# ── Optional: SMTP email (for reply-to-customer feature) ──
# Can also be configured in the admin panel (Email module)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# SMTP_FROM_EMAIL=your-email@gmail.com
# SMTP_FROM_NAME=Gadget Doctor East Kilbride
```

> **Important**: The `.env` file is gitignored. Never commit real credentials. The `.env.example` is tracked as a template.

---

## Database Setup & Seeding

The project uses **Prisma ORM** with **SQLite** for local development. The schema is in `prisma/schema.prisma`.

```bash
# Create/migrate the database from the schema
npx prisma db push

# Generate the Prisma client (also runs automatically on npm install)
npx prisma generate

# Seed the database (requires the dev server to be running):
# PowerShell:
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/seed"
# Mac/Linux:
curl -X POST http://localhost:3000/api/seed

# Reset the database (drops all data):
rm db/custom.db
npx prisma db push
# then re-seed
```

The seed creates:
- 1 admin user (`admin@gadgetdoctor.co.uk` / `admin123`)
- 38 services across 8 categories
- 14 reviews
- 12 sample bookings (GD-1000 through GD-1011)
- 4 blog posts
- 1 branding record
- 1 site settings record
- 1 email settings record

---

## Admin Access

- **URL**: `http://localhost:3000/admin` (or `/superadmin`)
- **Email**: `admin@gadgetdoctor.co.uk`
- **Password**: `admin123`

> ⚠️ **Change the admin password immediately after deploying.** Either update the seed file before seeding, or change it in the database after. The password is stored in plaintext in the `AdminUser` table (sufficient for this demo — use bcrypt hashing for a real production app).

---

## Production Build

```bash
# Build the production bundle
npm run build

# Start the production server
npm start
```

The app runs on **port 3000** by default. Set `PORT` env var to change it:

```bash
PORT=8080 npm start
```

---

## Deployment Guides

> **⚠️ Database note**: This project uses **SQLite** (a local file). This works on platforms with a **persistent filesystem** (Render Web Service, Railway, cPanel, VPS, Docker with volumes). For **serverless platforms** (Vercel free tier, Netlify, Cloudflare), you **must switch to PostgreSQL** — see [Database Migration](#database-migration-sqlite--postgresql) below.

---

### ▲ Vercel (Recommended — Easiest)

Vercel is the creator of Next.js and the easiest deployment target.

**⚠️ Vercel is serverless** — SQLite won't persist. You need PostgreSQL.

#### Step 1: Switch to PostgreSQL
1. Create a free PostgreSQL database on [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Render Postgres](https://render.com/docs/postgresql).
2. Get the connection string (looks like `postgresql://user:pass@host:5432/dbname`).
3. Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"   // changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
4. Run locally to create the schema:
   ```bash
   DATABASE_URL="postgresql://..." npx prisma db push
   DATABASE_URL="postgresql://..." npx prisma generate
   ```

#### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Sign Up / Log In** with GitHub.
2. Click **Add New** → **Project** → import the `Gadget-Doctor-East-Kilbride` repo.
3. Vercel auto-detects Next.js. In the **Environment Variables** section, add:
   - `DATABASE_URL` = your PostgreSQL connection string
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME` (if using email)
4. Click **Deploy**. Vercel runs `npm install` (which triggers `postinstall` → `prisma generate`) and `npm run build` automatically.
5. After deploy, **seed the database** by calling the seed API:
   ```bash
   curl -X POST https://your-app.vercel.app/api/seed
   ```
6. Visit your app at `https://your-app.vercel.app`.
   - Admin: `https://your-app.vercel.app/admin`

#### Vercel settings (auto-detected, but verify):
- Framework Preset: **Next.js**
- Build Command: `npx prisma generate && next build` (or just `next build` — `postinstall` handles prisma generate)
- Output Directory: `.next` (auto)
- Install Command: `npm install`

---

### 🚂 Render

Render offers persistent disks (paid plans) and PostgreSQL, making it a solid choice.

#### Option A: One-click deploy (Blueprint)
1. Go to [render.com](https://render.com) → **New** → **Blueprint**.
2. Select your GitHub repo. Render reads `render.yaml` automatically.
3. Review the config, add any secret env vars (`SMTP_USER`, `SMTP_PASS`, etc.), and click **Apply**.

#### Option B: Manual setup
1. Go to [render.com](https://render.com) → **New +** → **Web Service**.
2. Connect your GitHub repo.
3. Settings:
   - **Runtime**: Node
   - **Build Command**: `npm ci && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma db push --accept-data-loss && npm start`
   - **Plan**: Free (ephemeral disk — DB resets on deploy) or **Starter** ($7/mo — persistent disk for SQLite).
4. Environment Variables:
   - `DATABASE_URL` = `file:/data/custom.db` (with a persistent disk mounted at `/data`)
   - SMTP vars if needed.
5. If using **Starter** plan: add a **Disk** — mount path `/data`, size 1 GB.
6. Click **Create Web Service**.
7. After deploy, seed: `curl -X POST https://your-app.onrender.com/api/seed`

#### Using PostgreSQL on Render (recommended for production):
1. **New +** → **PostgreSQL** → create a database.
2. Copy the **Internal Database URL**.
3. Set `DATABASE_URL` on your web service to this URL.
4. Update `prisma/schema.prisma`: `provider = "postgresql"`.
5. Redeploy. The start command runs `prisma db push` which creates all tables.

---

### 🚄 Railway

Railway is similar to Render with built-in PostgreSQL.

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
2. Select your repo.
3. **Add a PostgreSQL database**: click **+** → **Database** → **Add PostgreSQL**.
4. Railway auto-sets `DATABASE_URL` in your app's environment.
5. Update `prisma/schema.prisma`: `provider = "postgresql"`.
6. In your service **Settings**:
   - **Build Command**: `npm ci && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma db push --accept-data-loss && npm start`
7. Add a **Volume** (for any file uploads) if needed.
8. Deploy. Then seed: `curl -X POST https://your-app.up.railway.app/api/seed`

---

### 🌐 Netlify

Netlify supports Next.js via the Next.js Runtime. **Serverless — needs PostgreSQL.**

1. Go to [netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Connect GitHub and select your repo.
3. Settings:
   - **Build command**: `npm install && npx prisma generate && npm run build`
   - **Publish directory**: `.next`
4. Environment Variables:
   - `DATABASE_URL` = your PostgreSQL connection string (use Neon/Supabase)
   - Update `prisma/schema.prisma` to `provider = "postgresql"` first.
   - SMTP vars if needed.
5. Click **Deploy site**.
6. Seed after deploy: `curl -X POST https://your-site.netlify.app/api/seed`

> Note: Netlify's Next.js Runtime has some limitations with serverless functions. If you hit issues, Vercel or Render are better choices for this project.

---

### 🔥 Firebase

Firebase doesn't natively run Next.js App Router server components. You have two options:

#### Option A: Firebase App Hosting (recommended for Firebase)
Firebase's new **App Hosting** supports Next.js server components.

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
2. In your project root:
   ```bash
   firebase init
   ```
   - Select **App Hosting** (or **Hosting** + **Functions** for older approach).
3. Firebase detects Next.js. Edit `apphosting.yaml`:
   ```yaml
   run:
     buildCommand: npm ci && npx prisma generate && npm run build
     startCommand: npm start
   env:
     - variable: DATABASE_URL
       secret: DATABASE_URL  # set via: firebase apphosting:secrets:set DATABASE_URL
   ```
4. **Database**: Use **Firestore** (Firebase's native DB) or connect an external PostgreSQL. You'll need to switch Prisma to PostgreSQL (`provider = "postgresql"`).
5. Deploy:
   ```bash
   firebase deploy
   ```
6. Seed after deploy: `curl -X POST https://your-app.web.app/api/seed`

#### Option B: Firebase Hosting + Cloud Run (manual)
1. Create a `firebase.json`:
   ```json
   {
     "hosting": {
       "rewrites": [
         { "source": "**", "run": { "serviceId": "gadget-doctor" } }
       ]
     }
   }
   ```
2. Build a Docker image and push to Google Container Registry.
3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy gadget-doctor --image gcr.io/PROJECT/gadget-doctor --platform managed --region europe-west2
   ```
4. Set env vars on Cloud Run (DATABASE_URL, SMTP_*).
5. `firebase deploy` to connect Hosting → Cloud Run.

> **Firebase is more complex than Vercel/Render for this project.** Only choose Firebase if you're already invested in the Google Cloud ecosystem.

---

### 🌐 cPanel / Shared Hosting

Many shared hosts (HostGator, Bluehost, Namecheap, etc.) now support Node.js apps via cPanel's **Setup Node.js App** feature. This works well because cPanel provides a **persistent filesystem** (SQLite works!).

#### Prerequisites
- cPanel with **Setup Node.js App** (look for the Node.js icon in cPanel).
- Node.js 20+ available on the server.
- SSH access (optional but helpful).

#### Steps
1. **Push your code to GitHub** (already done).

2. In **cPanel** → **Software** → **Setup Node.js App** → **Create Application**:
   - **Node.js version**: 20.x (or latest available)
   - **Application mode**: Production
   - **Application root**: `gadget-doctor` (or your preferred folder)
   - **Application URL**: your domain or subdomain
   - **Application startup file**: `server.js` (we'll create this below)

3. cPanel creates the app and gives you a `.cpanel.yml` or shows the app path (e.g. `/home/username/gadget-doctor`).

4. **Upload your code** to the application root:
   - Option A: Use cPanel's **File Manager** → upload a ZIP, extract.
   - Option B: SSH in and `git clone`:
     ```bash
     cd ~/gadget-doctor
     git clone https://github.com/clicktaketechnologies/Gadget-Doctor-East-Kilbride.git .
     ```

5. Create a **`server.js`** file in the app root (cPanel needs this as the entry point):
   ```javascript
     const { createServer } = require("http");
     const next = require("next");
     const port = process.env.PORT || 3000;
     const dev = process.env.NODE_ENV !== "production";
     const app = next({ dev });
     const handle = app.getRequestHandler();
     app.prepare().then(() => {
       createServer((req, res) => handle(req, res)).listen(port);
       console.log(`> Ready on http://localhost:${port}`);
     });
   ```

6. Install dependencies and build via SSH (or cPanel's terminal):
   ```bash
   cd ~/gadget-doctor
   npm install
   npx prisma generate
   npx prisma db push
   npm run build
   ```

7. In cPanel's **Setup Node.js App**, set **Environment Variables**:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = `file:/home/username/gadget-doctor/db/custom.db`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME` (if using email)

8. Click **Run NPM Install** and **Start App** in cPanel.

9. Seed the database:
   ```bash
   curl -X POST https://yourdomain.com/api/seed
   ```

10. Visit your site at the Application URL.

#### cPanel with PostgreSQL
If your cPanel host offers PostgreSQL databases:
1. Create a PostgreSQL database + user in cPanel → **PostgreSQL Databases**.
2. Update `prisma/schema.prisma`: `provider = "postgresql"`.
3. Set `DATABASE_URL` = `postgresql://user:pass@localhost:5432/dbname`.
4. Run `npx prisma db push` to create tables.

---

### 🐳 Docker (any VPS)

The project includes a `Dockerfile` and `docker-compose.yml` for easy containerized deployment on any VPS (DigitalOcean, Linode, Vultr, AWS EC2, etc.).

#### Quick start with Docker Compose
```bash
# Clone the repo
git clone https://github.com/clicktaketechnologies/Gadget-Doctor-East-Kilbride.git
cd Gadget-Doctor-East-Kilbride

# Build and start
docker compose up -d --build

# Seed the database
curl -X POST http://localhost:3000/api/seed
```

The app is now running on **port 3000**. The SQLite database persists in a Docker volume (`gd-db`).

#### Configure SMTP email
Edit `docker-compose.yml` and uncomment/set the `SMTP_*` environment variables, then:
```bash
docker compose up -d
```

#### Behind a reverse proxy (Nginx/Caddy)
For production, put the container behind a reverse proxy with SSL:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
Then add SSL with Certbot: `certbot --nginx -d yourdomain.com`.

#### Manual Docker build (without compose)
```bash
docker build -t gadget-doctor .
docker run -d -p 3000:3000 -v gd-db:/app/db --name gadget-doctor gadget-doctor
curl -X POST http://localhost:3000/api/seed
```

---

### 🖥️ Manual VPS (Ubuntu/Debian)

For a raw VPS without Docker:

```bash
# 1. SSH into your server
ssh root@your-server-ip

# 2. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx

# 3. Clone the repo
cd /var/www
git clone https://github.com/clicktaketechnologies/Gadget-Doctor-East-Kilbride.git gadget-doctor
cd gadget-doctor

# 4. Install + build
npm install
npx prisma generate
npx prisma db push
npm run build

# 5. Create .env
cp .env.example .env
# Edit .env if needed (DATABASE_URL defaults to ./db/custom.db which is fine)

# 6. Run with PM2 (process manager)
npm install -g pm2
pm2 start "npm start" --name gadget-doctor
pm2 startup
pm2 save

# 7. Seed the database
curl -X POST http://localhost:3000/api/seed

# 8. Configure Nginx reverse proxy
cat > /etc/nginx/sites-available/gadget-doctor << 'EOF'
server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
ln -s /etc/nginx/sites-available/gadget-doctor /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 9. Add SSL with Certbot
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

Visit `https://yourdomain.com`. Admin at `https://yourdomain.com/admin`.

---

## Database Migration (SQLite → PostgreSQL)

SQLite is great for development and persistent-host deployments. For **serverless platforms** (Vercel, Netlify, Cloudflare) or **horizontal scaling**, switch to PostgreSQL:

### Step 1: Create a PostgreSQL database
Use any of:
- **[Neon](https://neon.tech)** — free tier, generous, serverless PostgreSQL
- **[Supabase](https://supabase.com)** — free tier, includes auth + realtime
- **[Render Postgres](https://render.com/docs/postgresql)** — free 90 days, then $7/mo
- **[Railway Postgres](https://railway.app)** — $5/mo, simple
- **Self-hosted** — `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres:16`

### Step 2: Update Prisma schema
Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 3: Set the DATABASE_URL
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

### Step 4: Push the schema + seed
```bash
npx prisma generate
npx prisma db push
# Start the dev server, then:
curl -X POST http://localhost:3000/api/seed
```

That's it — Prisma handles the rest. The data models are identical; only the `provider` line changes.

### Migrating existing SQLite data to PostgreSQL
If you have existing data in SQLite you want to keep:
```bash
# Export from SQLite
npx prisma studio  # opens a GUI — manually export or use a script
# OR use a tool like pgloader or prisma's data import
```
For a fresh deploy, just re-seed: `curl -X POST https://your-app.com/api/seed`

---

## Email / SMTP Setup

The admin panel has an **Email module** (`/admin` → Email) where you configure SMTP. This powers the **Reply to Customer** feature in the bookings module.

### Supported providers
| Provider | Host | Port | Secure |
|----------|------|------|--------|
| Gmail | `smtp.gmail.com` | 587 | false |
| Outlook / Office 365 | `smtp.office365.com` | 587 | false |
| Yahoo | `smtp.mail.yahoo.com` | 587 | false |
| Zoho | `smtp.zoho.com` | 587 | false |
| Mailgun | `smtp.mailgun.org` | 587 | false |
| SendGrid | `smtp.sendgrid.net` | 587 | false |
| Amazon SES | `email-smtp.us-east-1.amazonaws.com` | 587 | false |

### Gmail setup (most common)
1. Enable **2-Step Verification** on your Google account.
2. Go to https://myaccount.google.com/apppasswords.
3. Create an app password (16 characters).
4. In the admin Email module:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Secure: off
   - User: your-email@gmail.com
   - Password: the 16-character app password
   - From Email: your-email@gmail.com
   - From Name: Gadget Doctor East Kilbride
   - Enabled: on

### How it works
- When SMTP is **enabled + configured**, emails are actually sent via Nodemailer.
- When SMTP is **disabled** (default), emails are **simulated** — logged in the Sent Email table but not actually delivered. This is useful for testing.
- All sent/reply emails appear in the **Sent Email Log** in the Email module.

---

## Customization Guide

### Change the admin password
1. Edit `src/app/api/seed/route.ts` — change `ADMIN_DEMO.password`.
2. Reset and re-seed:
   ```bash
   rm db/custom.db
   npx prisma db push
   curl -X POST http://localhost:3000/api/seed
   ```

### Change branding (logo, colors, contact, hours, socials)
- **Admin** → **Branding** module. Changes go live instantly on the public site.

### Add/edit services & pricing
- **Admin** → **Services & Pricing** module. Full CRUD with icon picker.

### Edit page text
- **Admin** → **Pages** module. Edit headings, subtitles, and section text for each public page.

### Manage blog posts
- **Admin** → **Blog** module. Create, edit, publish, feature posts.

### Enable/disable collection service site-wide
- **Admin** → **Content** module → **Collection Service — Site-wide Toggle**. When off, all collection UI disappears from the public site.

### Add announcement banner
- **Admin** → **Content** module → **Announcement Banner**. Toggle on + set the text.

---

## Troubleshooting

### `npm install` fails with peer dependency errors
Run with the legacy resolver:
```bash
npm install --legacy-peer-deps
```

### Prisma client not generated
```bash
npx prisma generate
```
This runs automatically on `npm install` (via the `postinstall` script), but sometimes you need to run it manually.

### Database doesn't exist / `DATABASE_URL` error
```bash
# Ensure the db directory exists
mkdir -p db
# Create the database from the schema
npx prisma db push
```

### `bun: command not found` (Windows)
You don't need bun. Use `npm` instead:
```bash
npm install
npm run dev
```

### `curl -X POST` doesn't work in PowerShell
PowerShell aliases `curl` to `Invoke-WebRequest`. Use:
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/seed"
# or
curl.exe -X POST http://localhost:3000/api/seed
```

### Port 3000 already in use
```bash
# Use a different port
PORT=8080 npm run dev
# or
npx next dev -p 8080
```

### Build fails on deployment
1. Ensure `DATABASE_URL` is set in the environment.
2. Ensure `prisma generate` runs (it should via `postinstall`).
3. Check that `prisma/schema.prisma` `provider` matches your database (`sqlite` or `postgresql`).

### Admin login doesn't work after deploy
You need to **seed the database** after deploying:
```bash
curl -X POST https://your-app-url.com/api/seed
```

### Images not loading
The logo and section images are in `/public`. Make sure they're included in your build (they are by default — `public/` is tracked in git).

---

## License

This project is proprietary. All rights reserved by **Gadget Doctor East Kilbride** and **ClickTake Technologies**.

---

## Credits

**Developed by**: [ClickTake Technologies](https://www.clicktaketech.com)

**Business**: Gadget Doctor East Kilbride, 14 Stroud Rd, East Kilbride, G75 0YA, Scotland

**Contact**: +44 1355 458135 · info@gadgetdoctorscotland.co.uk

---

*Powered by [ClickTake Technologies](https://www.clicktaketech.com)*
