# cardata.wiki

A Wikipedia-style vehicle specifications database. Free to browse and download. Paid API for developers.

**Live site:** https://cardata.wiki
**Repo:** https://github.com/dijitul/CarDataWiki

---

## Stack

- **Next.js 14** (App Router, TypeScript)
- **PostgreSQL** + **Prisma** ORM
- **NextAuth v5** (email/password + optional OAuth)
- **Stripe** (£20/month API subscription)
- **Anthropic Claude** (CSV analysis AI)
- **Vercel Blob** (CSV file storage)
- **Tailwind CSS**

---

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/dijitul/CarDataWiki.git
cd CarDataWiki
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, AUTH_SECRET, Stripe keys, etc.

# 3. Setup database
npm run db:push        # Push schema to DB (dev)
npm run db:seed        # Create admin user

# 4. Import vehicle data (~30,000 variants)
npm run import:data

# 5. Run development server
npm run dev
```

Open http://localhost:3000

---

## Project Structure

```
src/
  app/
    page.tsx                     # Homepage
    [make]/page.tsx              # Make page (e.g. /audi)
    [make]/[model]/page.tsx      # Model page (e.g. /audi/a3)
    [make]/[model]/[variant]/    # Variant + edit history
    (auth)/login|register/       # Auth pages
    dashboard/                   # User dashboard, API keys, billing, submissions
    admin/                       # Admin panel
    api/
      auth/                      # NextAuth handlers
      v1/                        # Public REST API (key-authenticated)
      download/                  # Free CSV downloads
      revisions/                 # Edit submission
      submissions/               # CSV upload
      stripe/                    # Stripe checkout/portal/webhook
      api-keys/                  # Key management
  components/
    layout/  browse/  edit/  csv/  dashboard/  admin/  ui/
  lib/
    prisma.ts  auth.ts  stripe.ts  anthropic.ts
    api-auth.ts  slugify.ts  constants.ts
    csv/  exporter.ts  ai-analyser.ts
prisma/schema.prisma
scripts/import-data.ts
```

---

## Key Features

### Browse
- `/makes` — all 124 makes A-Z
- `/{make}` — models list with CSV download
- `/{make}/{model}` — variants comparison table
- `/{make}/{model}/{variant}` — full spec detail + edit button

### Edit System (Wikipedia-style)
- Any logged-in user can edit any spec field
- Every change stored as a `Revision` with old/new value, user, timestamp
- Full diff history at `/{make}/{model}/{variant}/history`
- On-demand ISR revalidation after every edit

### CSV Downloads (free, no auth required)
- `GET /api/download/make/{slug}` — all variants for a make
- `GET /api/download/model/{slug}` — all variants for a model

### CSV Uploads (users contribute data)
- Dashboard > Data Submissions > upload `.csv`
- AI (Claude) analyses rows: new/duplicate/conflict detection
- Admin reviews report and approves/discards

### Paid API (£20/month)
- Subscribe via Stripe on `/dashboard/billing`
- Generate API keys on `/dashboard/api-keys`
- All keys prefixed `cdw_`, stored as SHA-256 hash
- Endpoints: `/api/v1/makes`, `/api/v1/variants`, etc.
- Full docs at `/api-docs`

---

## Environment Variables

See `.env.example` for all required variables.

Key ones:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — NextAuth secret (`npx auth secret`)
- `STRIPE_SECRET_KEY` + `STRIPE_PRICE_ID` + `STRIPE_WEBHOOK_SECRET`
- `ANTHROPIC_API_KEY` — for CSV analysis
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob for CSV uploads

---

## Data Import

Data sourced from [ilyasozkurt/automobile-models-and-specs](https://github.com/ilyasozkurt/automobile-models-and-specs).

```bash
npm run import:data
```

Fetches JSON data directly from GitHub raw URLs. Handles ~124 makes, ~7,200 models, ~30,000 variants.

---

## Deployment (Vercel)

1. Connect repo to Vercel
2. Add all env vars in Vercel dashboard
3. Add a **Vercel Postgres** database (or external PostgreSQL)
4. Run `npm run db:push` via Vercel CLI or locally with production `DATABASE_URL`
5. Set up Stripe webhook pointing to `https://cardata.wiki/api/stripe/webhook`
6. Deploy — data import runs post-deploy via `npm run import:data`

---

## Admin Access

After seeding, sign in with `admin@cardata.wiki` (or `ADMIN_EMAIL` env var). Change the password immediately via the Prisma studio or a direct DB query.

---

## Contributing

1. Sign in or register
2. Browse to any variant page
3. Click the ✎ pencil icon next to any spec value
4. Enter the correct value + optional edit summary
5. Submit — change is live immediately, tracked in revision history

For bulk data: Dashboard > Data Submissions > Upload CSV.
