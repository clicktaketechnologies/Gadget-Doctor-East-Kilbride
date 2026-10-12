# Cloudflare DNS Migration — Remove cPanel, Point to Firebase

This guide walks you through migrating `gadgetdoctorls.co.uk` off cPanel and onto Firebase Hosting, using Cloudflare DNS.

## ⚠️ Before you start — two critical warnings

1. **Email will go down.** If you currently receive email at `info@gadgetdoctorls.co.uk` (or similar) through cPanel, **turning off cPanel stops email delivery**. You MUST set up email on a new provider FIRST (Step 0 below), or you'll lose incoming mail.
2. **Do this during a low-traffic window** (e.g. Sunday morning). DNS changes can take 5–60 minutes to propagate; there may be a brief period where the site is unreachable for some visitors.

---

## Step 0 — Migrate email OFF cPanel (do this FIRST, before any DNS changes)

cPanel typically hosts your email (`info@`, `admin@`, etc.). When you remove cPanel, those mailboxes stop working. Pick a replacement:

### Recommended: Google Workspace (Gmail for your domain)
- Cost: ~£5/user/month.
- Sign up: https://workspace.google.com
- Verify domain ownership (add a TXT record to Cloudflare — Google gives you the value).
- Create your mailboxes (e.g. `info@gadgetdoctorls.co.uk`).
- Google will give you **MX records** to add to Cloudflare (Step 2 below).

### Free alternative: Zoho Mail
- Cost: free for up to 5 mailboxes.
- Sign up: https://www.zoho.com/mail/
- Same process: verify domain → create mailboxes → get MX records.

### If email isn't important right now
Skip this step — but expect `info@gadgetdoctorls.co.uk` to stop receiving mail after you remove cPanel. You can always set up email later.

---

## Step 1 — Add both domains to Firebase Hosting

You need BOTH `www.gadgetdoctorls.co.uk` and `gadgetdoctorls.co.uk` (apex) added to Firebase so both resolve.

1. Go to https://console.firebase.google.com → your project → **Hosting**.
2. You should already have `www.gadgetdoctorls.co.uk` connected.
3. Click **Add custom domain** → add `gadgetdoctorls.co.uk` (the apex).
4. Firebase will show you an **A record** to add (e.g. `151.101.1.195` — the actual IPs Firebase gives you) OR a **CNAME** — copy the exact values.
5. Repeat for `www.gadgetdoctorls.co.uk` if not already there.

> Firebase gives you two IPs (e.g. `151.101.1.195` and `151.101.65.195`) for the apex `@` A record. Use both.

---

## Step 2 — Update Cloudflare DNS records

Go to **Cloudflare** → your domain (`gadgetdoctorls.co.uk`) → **DNS** → **Records**.

### 2a. Point the apex (`@`) and `www` to Firebase

| Type | Name | Content / Value | Proxy status | TTL |
|------|------|-----------------|--------------|-----|
| **A** | `@` | `151.101.1.195` (Firebase IP 1 — use the exact IP Firebase gave you) | DNS only (grey cloud) | Auto |
| **A** | `@` | `151.101.65.195` (Firebase IP 2 — use the exact IP Firebase gave you) | DNS only (grey cloud) | Auto |
| **A** | `www` | `151.101.1.195` (same Firebase IPs) | DNS only (grey cloud) | Auto |
| **A** | `www` | `151.101.65.195` | DNS only (grey cloud) | Auto |

> **Proxy status MUST be "DNS only" (grey cloud)** for Firebase Hosting. If you proxy (orange cloud), Firebase's SSL/cert won't work and you'll get redirect loops.

### 2b. Add the email MX records (if you migrated email in Step 0)

If you set up Google Workspace, add these MX records:

| Type | Name | Mail server | Priority | TTL |
|------|------|-------------|----------|-----|
| MX | `@` | `ASPMX.L.GOOGLE.COM` | 1 | Auto |
| MX | `@` | `ALT1.ASPMX.L.GOOGLE.COM` | 5 | Auto |
| MX | `@` | `ALT2.ASPMX.L.GOOGLE.COM` | 5 | Auto |
| MX | `@` | `ALT3.ASPMX.L.GOOGLE.COM` | 10 | Auto |
| MX | `@` | `ALT4.ASPMX.L.GOOGLE.COM` | 10 | Auto |

If Zoho, use the MX records Zoho gives you.

Also add the **SPF** TXT record for email deliverability:

| Type | Name | Content | TTL |
|------|------|---------|-----|
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` | Auto |

(Adjust the `include:` if using Zoho or another provider.)

### 2c. REMOVE the old cPanel records

Delete these old records (they point to cPanel — keeping them causes conflicts):

- Any **A record** pointing to your cPanel server IP (usually looks like `192.x.x.x` or a single IP — NOT Firebase's `151.101.x.x`).
- Any old **MX records** pointing to `mail.gadgetdoctorls.co.uk` (cPanel mail).
- Any old **TXT** record with an old SPF like `v=spf1 +a +mx ~all` (cPanel default SPF — replace with the Google/Zoho one above).
- Any **CNAME** for `mail`, `cpanel`, `webmail`, `webdisk` pointing to cPanel.

> Keep the **google-site-verification** TXT record (if you have one) and any domain-verification records.

### 2d. Confirm what to KEEP vs REMOVE

| Record | Action |
|--------|--------|
| `@` A → Firebase IPs | **ADD / UPDATE** |
| `www` A → Firebase IPs | **ADD / UPDATE** |
| `@` MX → Google/Zoho | **ADD** (if migrating email) |
| `@` TXT → `v=spf1 include:_spf...` | **ADD** (if migrating email) |
| `@` A → cPanel IP | **REMOVE** |
| `@` MX → `mail.gadgetdoctorls.co.uk` | **REMOVE** |
| `@` TXT → `v=spf1 +a +mx ~all` | **REMOVE** (replace with new SPF) |
| `mail` A/CNAME → cPanel | **REMOVE** |
| `cpanel` A → cPanel IP | **REMOVE** |
| `webmail` CNAME → cPanel | **REMOVE** |
| `google-site-verification` TXT | **KEEP** |

---

## Step 3 — Set up the apex → www 301 redirect (fixes Ahrefs W3)

You have two options. **Option A (Cloudflare) is simpler and recommended.**

### Option A — Cloudflare Redirect Rule (recommended)
1. Cloudflare → your domain → **Rules** → **Redirect Rules** → **Create rule**.
2. Name: "Apex to www".
3. When: `Custom filter expression` → Field: `Hostname`, Operator: `equals`, Value: `gadgetdoctorls.co.uk` (the apex, without www).
4. Then: `Dynamic` → URL: `concat("https://www.gadgetdoctorls.co.uk", http.request.uri.path)`.
5. Status code: `301`.
6. Save + Deploy.

Now any visit to `https://gadgetdoctorls.co.uk/anything` 301-redirects to `https://www.gadgetdoctorls.co.uk/anything`.

### Option B — Firebase Hosting redirect (if you prefer)
1. In Firebase Console → Hosting → add `gadgetdoctorls.co.uk` as a second site.
2. In that site's `firebase.json` (or via the Console "Redirects" UI), add:
```json
{ "redirects": [{ "source": "/**", "destination": "https://www.gadgetdoctorls.co.uk{path}", "type": 301 }] }
```

---

## Step 4 — Verify the migration

Run these checks 10–30 minutes after making the DNS changes:

### 4a. Apex redirects to www
```bash
curl -s -o /dev/null -w "apex: %{http_code} -> %{redirect_url}\n" https://gadgetdoctorls.co.uk/
```
Expected: `301 -> https://www.gadgetdoctorls.co.uk/`

### 4b. www serves the site
```bash
curl -s -o /dev/null -w "www: %{http_code}\n" https://www.gadgetdoctorls.co.uk/
```
Expected: `200`.

### 4c. Deep link renders the right page (the Ahrefs fix)
```bash
curl -s https://www.gadgetdoctorls.co.uk/services | grep -oP '<title>\K[^<]+'
```
Expected: `Repair Services in East Kilbride | Gadget Doctor East Kilbride`.

### 4d. Canonical is self-referential
```bash
curl -s https://www.gadgetdoctorls.co.uk/services | grep -oP '<link rel="canonical" href="\K[^"]+'
```
Expected: `https://www.gadgetdoctorls.co.uk/services` (NOT the homepage).

### 4e. Email works (if migrated)
Send a test email to `info@gadgetdoctorls.co.uk` from an external address and confirm it arrives in your new mailbox (Google Workspace / Zoho).

---

## Step 5 — Cancel cPanel

Once everything works (Steps 1–4 pass), you can safely cancel your cPanel hosting. **Do NOT cancel before verifying email + the website.**

---

## Rollback plan (if something breaks)

If the site goes down after the DNS change:
1. In Cloudflare DNS, restore the old cPanel A records (you noted them before deleting, right?).
2. Wait 5–30 minutes for propagation.
3. The site will be back on cPanel while you debug.

If email stops working:
1. Check the MX records in Cloudflare match what Google/Zoho gave you exactly.
2. Use https://toolbox.googleapps.com/apps/checkmx/ to diagnose MX issues.

---

## Quick checklist

- [ ] Step 0: Email migrated to Google Workspace / Zoho (if needed)
- [ ] Step 1: Apex domain added to Firebase Hosting
- [ ] Step 2a: `@` and `www` A records → Firebase IPs (proxy: DNS only)
- [ ] Step 2b: MX + SPF records added (if migrating email)
- [ ] Step 2c: Old cPanel A/MX/TXT/CNAME records removed
- [ ] Step 3: Apex→www 301 redirect set up (Cloudflare Redirect Rule)
- [ ] Step 4: All verification curls pass
- [ ] Step 5: cPanel cancelled
- [ ] Ahrefs re-crawl triggered
- [ ] Google Search Console sitemap submitted + URLs requested for indexing
