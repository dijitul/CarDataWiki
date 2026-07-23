# Data Import & Enrichment Runbook

How the UK-focused dataset is built, and how to apply it to any environment
(local dev or production). Built July 2026. All sources are free; attribution
requirements are noted per step.

## Prerequisites

- PostgreSQL reachable via `DATABASE_URL` in `.env`
- `npm install` done, schema pushed (`npm run db:push`)
- `curl` and a `tar`/`unzip` on PATH (the VCA importer uses the system tar on Windows)

## Order matters

Later steps only **fill blank fields** — they never overwrite existing values
(including wiki edits), so the sequence below is safe to re-run at any time.
Each script is idempotent.

| # | Command | What it does | Source / licence |
|---|---------|--------------|------------------|
| 1 | `npm run import:data` | Base dataset: ~124 makes / 30k variants (snapshot Oct 2024) | ilyasozkurt/automobile-models-and-specs (GitHub) |
| 2 | `npm run import:research` | Agent-researched UK variants: new EV brands (BYD, JAECOO, OMODA, Chery, GWM…), Rover historic, specialist British makers, post-2024 launches. Reads `data-research/*.json` | UK press/brand sites, cited per variant in `data-research/*.md` |
| 3 | `npm run import:sva` | UK vehicle-identity spine: generation/chassis-code variants incl. vans. Reads `data-research/05-sva-*` — **these files are NOT in git** (derived from the private SVA DB dump); copy them to the target machine manually before running | svacarparts.co.uk category tree (own data) |
| 4 | `npm run import:vca` | Official UK spec spine: WLTP mpg, CO2, Euro std, NOx, EV range for every car on sale in the UK. Downloads live data (needs outbound HTTPS) | VCA carfueldata — Crown copyright, **OGL v3 attribution required** |
| 5 | `npm run enrich:openev` | Battery kWh, DC charging kW, WLTP range, torque, 0-100 for EVs. Needs `oev.csv` (OpenEV Data release CSV) in repo root — download from github.com/open-ev-data/open-ev-data-dataset releases | CDLA-Permissive-2.0, **attribution required** |
| 6 | `npm run enrich:eea` | Kerb weight, wheelbase, CO2 via EEA Discodata SQL API (slow: ~1 query/make, rate-limited; run in background) | EEA co2cars — free re-use, **attribution required** |
| 7 | `npx tsx scripts/merge-duplicate-models.ts --dry-run` then without flag | Merges parallel model families created by different sources (e.g. "25" vs "25 Series"). Dry-run first, always | — |

## Production application

1. Take a DB backup first (`pg_dump`).
2. Run steps 2–7 with production `DATABASE_URL` (step 1 only on a fresh DB).
3. Trigger ISR revalidation or redeploy so pages pick up new data.

## Attribution page

The site should credit: VCA (OGL v3), EEA co2cars, OpenEV Data
(CDLA-Permissive-2.0). Suggested location: /about or a /data-sources page.

## Known data caveats

- ~40 flagged spec conflicts (DC charge rates, torque, boot volumes) are
  documented in `data-research/*.md` with sources — candidates for wiki edits.
- Make-name casing is inconsistent (base data is UPPERCASE, research data is
  mixed) — cosmetic normalization pass pending.
- OpenEV matching left 765 EV variants unmatched (older/rare models) — safe,
  just unenriched.
- `acceleration0100` for some UK-sourced historic variants holds 0-60 mph
  times (noted in the research reports).

## Refreshing

- **VCA**: re-run `npm run import:vca` monthly — picks up new UK-market cars
  automatically.
- **OpenEV**: download the newest release CSV over `oev.csv`, re-run.
- **Research JSONs**: static snapshots (July 2026); future brand launches need
  a new research pass or wiki edits.
