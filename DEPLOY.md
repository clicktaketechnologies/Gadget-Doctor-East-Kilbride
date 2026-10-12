# Deployment Guide — Gadget Doctor East Kilbride

This guide covers deploying the Ahrefs Site Audit fixes (project 5991516) to Firebase Hosting.

## What changed (summary)

All fixes for the approved Ahrefs plan are committed in the local source tree:

| Priority | Issue | Fix | Files |
|----------|-------|-----|-------|
| C1 + C2 | Duplicate canonical + duplicate title/description | Server-side `generateMetadata` (self-referential canonical + per-page title/description) + client-side `<SeoHead>` | `src/app/[...slug]/page.tsx`, `src/app/page.tsx`, `src/app/layout.tsx`, `src/lib/seo-routes.ts` (new), `src/components/public/seo-head.tsx` (new), `src/lib/store.ts` |
| W1 | Sitemap URL mismatch | Recreated with path-based URLs | `public/sitemap.xml` |
| W3 | Apex → www 301 redirect | Cloudflare Redirect Rule (see DNS-MIGRATION.md) | — |
| N1 | /favicon.ico 404 | Route handler redirects to logo | `src/app/favicon.ico/route.ts` (new) |
| N3 | Placeholder Google verification token | Real token in layout | `src/app/layout.tsx` |
| N4 | Missing local SEO files | Recreated locally | `public/robots.txt`, `public/llms.txt`, `public/rss.xml`, `public/manifest.json` |
| — | Firebase Hosting config | Complete `firebase.json` | `firebase.json` (new) |

## Step 1 — Get the code onto your machine / CI

This sandbox cannot push to GitHub or deploy to Firebase directly (no git remote, no Firebase CLI auth). You have two options:

### Option A — If you have the GitHub repo connected to Firebase auto-deploy
1. Copy the changed files (see the table above) into your local clone of the repo.
2. `git add -A && git commit -m "fix(seo): Ahrefs audit — per-page canonical/title/description, sitemap, favicon, verification token"` 
3. `git push origin main`
4. Your GitHub Action / Firebase auto-deploy triggers a rebuild.

### Option B — Manual Firebase CLI deploy
1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Log in: `firebase login`
3. Copy ALL the changed files into your project directory.
4. Make sure `firebase.json` (from this sandbox) is in your project root.
5. Build the static export: `npm run build` (the `next.config.ts` must have `output: "export"` — if it's conditional, set `BUILD_TARGET=firebase` env var or whatever your build script uses).
6. Deploy: `firebase deploy --only hosting`
7. Confirm at `https://www.gadgetdoctorls.co.uk/` — check a deep link like `/services` shows the title "Repair Services in East Kilbride | Gadget Doctor East Kilbride".

## Step 2 — Verify the deployment

After the deploy completes, check these URLs (the title should be UNIQUE per page, and the canonical should be self-referential):

| URL | Expected `<title>` | Expected canonical |
|-----|--------------------|--------------------|
| `https://www.gadgetdoctorls.co.uk/` | Gadget Doctor East Kilbride — Fast & Reliable Electronics Repair in East Kilbride | `https://www.gadgetdoctorls.co.uk/` |
| `https://www.gadgetdoctorls.co.uk/services` | Repair Services in East Kilbride \| Gadget Doctor East Kilbride | `…/services` |
| `https://www.gadgetdoctorls.co.uk/services/mobile` | Mobile Phone Repair in East Kilbride \| Gadget Doctor East Kilbride | `…/services/mobile` |
| `https://www.gadgetdoctorls.co.uk/contact` | Contact Us \| Gadget Doctor East Kilbride | `…/contact` |
| `https://www.gadgetdoctorls.co.uk/track` | Track Your Repair \| Gadget Doctor East Kilbride | `…/track` |
| `https://www.gadgetdoctorls.co.uk/blog` | Repair Tips, Guides & News \| Gadget Doctor East Kilbride | `…/blog` |
| `https://www.gadgetdoctorls.co.uk/blog/cracked-iphone-screen-repair-guide` | Cracked iPhone Screen? Here's What You Need to Know \| Gadget Doctor East Kilbride | `…/blog/cracked-iphone-screen-repair-guide` |
| `https://www.gadgetdoctorls.co.uk/reviews` | Customer Reviews \| Gadget Doctor East Kilbride | `…/reviews` |
| `https://www.gadgetdoctorls.co.uk/collection` | Doorstep Collection Service \| Gadget Doctor East Kilbride | `…/collection` |

**How to check:** open each URL → view source (Ctrl+U) → search for `<title>` and `<link rel="canonical"`. The canonical href must match the page's own URL (self-referential), NOT the homepage.

Also check:
- `https://www.gadgetdoctorls.co.uk/favicon.ico` → should 302-redirect to `/gadget-doctor-logo.jpg` (no more 404).
- `https://www.gadgetdoctorls.co.uk/sitemap.xml` → should list path-based URLs (`/services/mobile`, not `/services?category=mobile`).
- View-source on any page → search for `google-site-verification` → should contain `H-OKElcx2vleyf5JmpMgN3in5UqGlIwjV8z7KRqM7SA`.

## Step 3 — Point the apex domain to Firebase (if not already done)

The apex domain `gadgetdoctorls.co.uk` must ALSO be added to Firebase Hosting so the apex→www redirect (W3) works. See **DNS-MIGRATION.md** for the full Cloudflare DNS guide.

## Step 4 — Trigger re-crawl in Ahrefs + Google

1. **Ahrefs Site Audit** → project 5991516 → **Crawl** → **Re-run audit**.
2. **Google Search Console** → submit `https://www.gadgetdoctorls.co.uk/sitemap.xml`.
3. **Google Search Console** → URL Inspection on each of the 9 URLs above → **Request indexing**.
4. Wait 2–7 days for Ahrefs to reflect the fixes (duplicate canonical + duplicate title/description counts should drop to 0).

## The firebase.json explained

The `firebase.json` in this sandbox configures:
- **`public: "out"`** — serves the Next.js static export directory.
- **`rewrites: [{ source: "**", destination: "/index.html" }]`** — the SPA catch-all: any unmatched route serves `index.html` (so `/services`, `/blog`, etc. return 200, not 404). This is the Firebase-side counterpart of the Next.js catch-all route.
- **`redirects: [{ source: "/favicon.ico", destination: "/gadget-doctor-logo.jpg", type: 302 }]`** — eliminates the favicon 404 (N1).
- **`headers`** — correct Content-Types for SEO files (sitemap.xml, robots.txt, llms.txt, rss.xml, manifest.json) + long-cache headers for static assets.
- **`cleanUrls: true`** — strips trailing `.html` extensions.
- **`trailingSlash: false`** — no trailing slashes (matches the sitemap URLs).

> **Note on apex→www (W3):** this redirect is NOT in `firebase.json` because it requires the apex domain to be added as a separate Firebase Hosting site. The cleaner path is a Cloudflare Redirect Rule (see DNS-MIGRATION.md). If you prefer the Firebase route, add the apex as a second site in the Console and add a redirect there: `source: "**", destination: "https://www.gadgetdoctorls.co.uk{path}", type: 301`.
