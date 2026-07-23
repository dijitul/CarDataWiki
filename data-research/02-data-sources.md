# Data Source Research — CarData.Wiki

Researched 2026-07-23. Goal: expand beyond `ilyasozkurt/automobile-models-and-specs` with UK/EU-market per-variant spec data, especially recent models and EVs.

Verdicts: **USE** (ingest now), **MAYBE** (useful with caveats / commercial decision), **SKIP**.

Schema fields we need per variant: engine code, displacement cc, cylinders, valves, fuel type, power kW/bhp, torque Nm, aspiration, gearbox type, gears, drivetrain, 0-100 km/h, top speed, fuel economy (urban/extra-urban/combined l/100km + mpg), fuel tank litres, CO2 g/km, emissions standard, NOx, dimensions (L/W/H/wheelbase mm), kerb weight, gross weight, boot litres, tyres, brakes, doors, seats, body type, battery kWh, electric range km, charging kW, production years.

---

## 1. UK VCA Car Fuel & Emissions Data — **USE** (primary UK spine)

- **URL:** https://carfueldata.vehicle-certification-agency.gov.uk/downloads/default.aspx
- **Verified download endpoints** (2026-07-23, all live):
  - Latest data (cars currently on sale, Euro 6/WLTP): `downloads/download.aspx?rg=latest` → links to `downloads/create_latest_data_csv.asp?id=6` (ZIP, ~110 KB, `Euro_6_latest.csv`)
  - Annual snapshots: `downloads/download.aspx?rg=2020` … `rg=2025` (Dec 2020, then each September 2021–2025)
  - Full archive back to July 2000: `downloads/archive.aspx` → `download.aspx?rg=july2000`, `rg=jan2001`, `rg=july2001`, `rg=may2002`…`may2010`, `rg=aug2011`…`aug2017`, `rg=sept2018`, `rg=2019`
- **Gotcha:** the download endpoints 302-redirect for plain HTTP clients (curl). They require a session cookie — the scraper must first GET the downloads page (or run headless browser / keep cookie jar with the right referer). Downloads verified working from a browser session.
- **Verified contents of latest file:** 5,437 variant rows, 44 columns. Exact header:
  `Manufacturer, Model, Description, Transmission, Manual or Automatic, Engine Capacity, Fuel Type, Powertrain, Engine Power (PS), Engine Power (Kw), Electric energy consumption Miles/kWh, wh/km, Maximum range (Km), Maximum range (Miles), Euro Standard, Diesel VED Supplement, Testing Scheme, WLTP Imperial Low/Medium/High/Extra High/Combined/Combined (Weighted), WLTP Metric Low/Medium/High/Extra High/Combined/Combined (Weighted), WLTP CO2, WLTP CO2 Weighted, Equivalent All Electric Range Miles/KM, Electric Range City Miles/Km, Emissions CO [mg/km], THC Emissions [mg/km], Emissions NOx [mg/km], THC + NOx Emissions [mg/km], Particulates [No.] [mg/km], RDE NOx Urban, RDE NOx Combined, Noise Level dB(A), Date of change`
  Sample row: `ABARTH, 500e MY25, 114kW Electric, A1, …, 155 PS / 114 kW, 3.3 mi/kWh, 187 Wh/km, 244 km range, Euro 6-WLTP (for BEVs only), …, 68.0 dB(A), 27 November 2025`.
  Older snapshots (2000–2017) use the NEDC-era layout: urban/extra-urban/combined l/100km + mpg, CO2, fuel type, transmission, engine cc, noise — i.e. exactly our urban/extra-urban fields.
- **Schema mapping:** fuel type ✓, displacement cc ✓ (Engine Capacity), power kW+PS ✓, gearbox type/gears ✓ (Transmission code, e.g. M6/A8), fuel economy urban/extra-urban/combined mpg + l/100km ✓ (NEDC era) / WLTP low–extra-high ✓ (2018+), CO2 g/km ✓, emissions standard ✓ (Euro Standard), NOx ✓ (incl. RDE), battery efficiency (Wh/km, mi/kWh) ✓, electric range km ✓, powertrain/BEV/PHEV classification ✓, noise ✓. **Not covered:** torque, dimensions, weights, boot, tyres, brakes, doors, seats, 0-100, top speed, battery kWh, charging kW, engine code, cylinders/valves, aspiration.
- **Coverage:** every new car put on sale in the UK, 2000–present. Manufacturer/Model/Description granularity matches trim/engine variants (UK-market naming — ideal for our UK focus).
- **Format:** CSV inside ZIP. Small files (latest ≈110 KB zipped; yearly archives a few MB).
- **Licence:** Crown copyright, published by VCA (DfT executive agency); reusable under Open Government Licence terms with attribution. Free.
- **Freshness:** continuously updated ("latest") + yearly snapshots; latest data rows dated Nov 2025+.
- **Verdict: USE.** This is the authoritative UK-market spine: which variants were actually sold in the UK, with official WLTP/NEDC economy, CO2, Euro standard, NOx, and EV range/efficiency. Combine snapshots + archives to derive production years on the UK market.

## 2. EEA CO2 from New Passenger Cars ("co2cars") — **USE** (mass, wheelbase, power, CO2 per registration)

- **URLs:**
  - Datahub item: https://www.eea.europa.eu/en/datahub/datahubitem-view/fa8b1229-3db6-495d-b18e-9c9b3267c02b
  - Interactive: https://co2cars.apps.eea.europa.eu/
  - SQL REST endpoint (verified working 2026-07-23): `https://discodata.eea.europa.eu/sql?query=<URL-encoded SQL>` against `[CO2Emission].[latest].[co2cars]`. Test query returned live rows: `{"Mk":"CITROEN","Cn":"BERLINGO","Ft":"DIESEL","ec (cm3)":1499,"ep (KW)":75,"m (kg)":1505,"Ewltp (g/km)":137,"W (mm)":2785,"year":2021}`. Note: column names contain spaces/units and must be bracketed, e.g. `[ec (cm3)]`, `[Ewltp (g/km)]`; `INFORMATION_SCHEMA` is blocked.
  - Bulk CSV per year also downloadable from the datahub page (ASCII CSV/TXT/SQL).
- **Fields:** make (Mk), commercial name (Cn), type-approval number (Tan), type/variant/version codes (T/Va/Ve), category, fuel type (Ft), fuel mode (Fm — mono/bi-fuel/hybrid), engine capacity `ec (cm3)`, engine power `ep (KW)`, mass in running order `m (kg)` + test mass, CO2 NEDC `Enedc (g/km)` + WLTP `Ewltp (g/km)`, wheelbase `W (mm)`, axle track widths `At1/At2 (mm)`, electric energy consumption `z (Wh/km)`, electric range (km) in recent years, innovative-technology CO2 savings, registration country and year.
- **Schema mapping:** displacement ✓, power kW ✓, fuel type ✓, CO2 ✓ (NEDC + WLTP), kerb/running mass ✓, wheelbase ✓, EV consumption ✓, electric range ✓, first registration year ✓. Not covered: torque, gearbox, performance, full dimensions, boot, battery kWh.
- **Coverage:** every new passenger car registered in EU member states 2010–2025 (2025 provisional published June 2026). **UK rows included 2010–2019 only** (pre-Brexit); after that, use EU rows for the same Europe-market models (identical type approvals for most UK-sold cars) plus VCA for UK confirmation. Millions of rows per year — heavy dedupe by Tan/Va/Ve needed to reduce to variants.
- **Format:** CSV (large — tens of millions of rows across years) or targeted SQL via Discodata (recommended: `SELECT DISTINCT` variant-level rows per year).
- **Licence:** EEA standard re-use policy — free re-use for commercial/non-commercial purposes with attribution (CC BY-style).
- **Freshness:** annual (provisional mid-year, final later).
- **Verdict: USE.** Best free source for mass, wheelbase, power and official CO2 per exact type-approval variant; cross-links to VCA rows via make/model/fuel/cc/power.

## 3. OpenEV Data (`open-ev-data/open-ev-data-dataset`) — **USE** (EV enrichment)

- **URL:** https://github.com/open-ev-data/open-ev-data-dataset (docs: https://open-ev-data.github.io/)
- **Verified release v1.24.0** (published 2025-12-30): assets `open-ev-data-v1.24.0.csv` (230 KB), `.json` (3.2 MB), `.sql`, `.db` (SQLite), `.xml` — download URLs confirmed via GitHub API, CSV downloaded and inspected.
- **Verified contents:** 1,189 EV variant rows. Columns: `unique_code, make_slug/name, model_slug/name, year, trim, variant, vehicle_type, drivetrain, system_power_kw, system_torque_nm, battery_capacity_gross_kwh, battery_capacity_net_kwh, battery_chemistry, dc_max_power_kw, ac_max_power_kw, range_wltp_km, range_epa_km, acceleration_0_100_s, top_speed_kmh, charge_connectors, sources` (JSON version adds charge-port detail, V2X, market availability by country, dimensions/weight where authored).
- **Schema mapping:** battery kWh (gross+net) ✓, charging kW (AC+DC) ✓, electric range WLTP ✓, power kW ✓, torque Nm ✓, 0-100 ✓, top speed ✓, drivetrain ✓, production year ✓.
- **Licence:** CDLA-Permissive-2.0 — free to use/modify/share, commercial OK. Data-as-code with schema validation and community review.
- **Freshness:** active; 28 releases, last Dec 2025.
- **Verdict: USE.** Clean, liberally licensed EV spec data that fills exactly the battery/charging/performance gap VCA+EEA leave for EVs.

## 4. KilowattApp `open-ev-data` — **MAYBE** (secondary EV cross-check)

- **URL:** https://github.com/KilowattApp/open-ev-data — `data/ev-data.json` (1.5 MB, verified present via GitHub contents API) + `data/v2/` per-brand files.
- Fields: brand/model/variant/release year, battery, AC/DC charging (incl. charging-curve style data), energy consumption. Fork/continuation of the original Chargeprice dataset, maintained by the Kilowatt iOS app.
- **Licence:** MIT with attribution requirement ("Open EV Data" credit). **Repo archived May 2025** — frozen, no updates since ~Dec 2024.
- **Verdict: MAYBE.** Use only as cross-validation for charging specs; OpenEV Data (No. 3) is fresher and better structured.

## 5. Chargeprice `open-ev-data` — **SKIP**

- **URL:** https://github.com/chargeprice/open-ev-data — now just a sample file; the real dataset moved into the paid Chargeprice API (`/v2/vehicles`, weekly/daily updates, subscription). Docs: https://chargeprice.github.io/chargeprice-api-docs/
- **Verdict: SKIP** (unmaintained sample; paid API not needed given 3 and 4).

## 6. EV Database (ev-database.org) — **MAYBE** (reference only, no bulk data)

- **URL:** https://ev-database.org/ (has a UK country mode with £ pricing and UK availability)
- Richest consumer EV data anywhere: battery gross/net kWh + chemistry, WLTP + "real range", charging AC/DC kW + charge curve/time, 1-stop range, 0-100, top speed, dimensions, cargo litres, weight, towing, heat pump, V2L, price. Hundreds of current EU/UK-market EVs.
- **Access:** no API, no downloads. Site data is proprietary; scraping is against their terms (they license data commercially on request).
- **Verdict: MAYBE** — great for manual verification and as a field-coverage benchmark; do not scrape. Contact for licence only if commercial budget exists.

## 7. EVKX (evkx.net) — **MAYBE**

- **URLs:** https://evkx.net, GitHub org https://github.com/evkx (`evkx.github.io` site repo, `evkxapi` C# API, `evdb-frontend` MIT).
- Very deep EV specs (battery packs, charging curves, trim-level detail) authored in the open on GitHub; the site repo is public but data files carry no clear data licence.
- **Verdict: MAYBE.** Worth a follow-up to inspect the repo's data directory and ask the maintainer about licence; smaller model coverage than EV Database but open-source-friendly.

## 8. `ilyasozkurt/automobile-models-and-specs` (current baseline) — keep, don't expand

- 263 stars, last data update 2024-10-23 (repo pushed 2026-04). Scraped global car specs (SQL dumps). **No licence declared**, provenance is scraped content — legally grey. Coverage thins out for 2023+ models and EVs.
- **Verdict:** keep as legacy seed only; progressively supersede fields with the licensed sources above.

## 9. `vbalagovic/cars-dataset` — **SKIP**

- https://github.com/vbalagovic/cars-dataset — 54k+ variants, 370+ brands, 1898–2026, 40+ fields incl. performance/dimensions/emissions, EU pricing. Looks ideal **but is explicitly proprietary — "Sample data provided for evaluation purposes only."**
- **Verdict: SKIP** (licence). Could be a commercial lead if they sell licences.

## 10. Make/model/year-only open datasets — **SKIP** for specs

- `n8barr/automotive-model-year-data` (563★, last push 2017, US-centric), `plowman/open-vehicle-db` (make/model/year/style, 2025), `arthurkao/vehicle-make-model-data`, Back4App "Car Make Model Dataset" (https://www.back4app.com/database/back4app/car-make-model-dataset — 9k records, 60 makes, 1992–2022, CC0, GraphQL/REST).
- Only make/model/year/category — no variant specs. **SKIP** except possibly for name normalisation/aliasing (Back4App is CC0, safe).

## 11. US EPA fueleconomy.gov — **MAYBE** (US-market supplement)

- **Verified:** https://fueleconomy.gov/feg/epadata/vehicles.csv — HTTP 200, 21.6 MB, last-modified 2026-06-16. ~50k vehicles 1984–2027, public domain. Fields: displacement, cylinders, drive, transmission, fuel economy (EPA cycles), CO2, EV range/battery for many models.
- **Verdict: MAYBE.** Free and clean but US-spec (EPA mpg not WLTP, US trims). Only useful for US-market variants if the wiki ever wants them; do not mix EPA figures into UK records.

## 12. DVSA/DVLA/DfT open data — **MAYBE** (supporting, not specs)

- **Anonymised MOT results:** https://open.data.dvsa.gov.uk/mot-anonymised/index.html (2005–present, also on data.gov.uk). Per-test make, model, first-use date, fuel type, engine cc, mileage, outcome. Huge (GBs). No variant specs, but excellent for: which models/engines actually exist on UK roads, popularity ranking, and validating make/model naming. OGL licence.
- **DfT vehicle licensing statistics (VEH tables)** on gov.uk: registrations by make/model — good for popularity metadata. OGL.
- **data.gov.uk "Car fuel data, CO2 and vehicle tax tools"** entry (https://www.data.gov.uk/dataset/07766da5-6bd8-4024-ace5-44b20e5fa85c/...) just points at the VCA site (No. 1).
- **Verdict: MAYBE** — ingest later for popularity/UK-fleet validation, not for specs.

## 13. Commercial options (for the dimensions/torque gap)

| Provider | Offer | Coverage | Terms/cost | Note |
|---|---|---|---|---|
| **Auto-Data.net API** (https://api.auto-data.net/) | XML/JSON API or bulk licence; pay only for chosen parameters, quote-based | 55,000+ variant spec sheets, 3,500+ models, 10,000+ generations, 120+ parameters (engine code, cylinders/valves, aspiration, torque, dimensions, boot, tyres, brakes, weights — everything we're missing) | Quote via get-a-quote page; per-parameter pricing | Best single fill for our full schema; EU-oriented data |
| **Teoalida / DatabaseAtlas** (https://www.teoalida.com/cardatabase/ → databaseatlas.com) | XLS/CSV/SQL one-off purchase (~$500 for full-spec DB; partial DBs $150–200) | Dedicated **UK database** + Europe DB 1980–present: 121 makes, 2,900+ models, 90,000+ versions, 68 spec columns | One-off licence; site 403s bots — contact by email | Cheapest full-schema bulk buy; quality is scraped-aggregated |
| **CarQuery API** (https://www.carqueryapi.com/) | Free JSONP API (makes/models/trims + decent spec fields) + paid DB download | Global, but data largely stale (thin after ~2020) | Free tier; API probe on 2026-07-23 returned empty responses — service unreliable | **SKIP** |
| **Chargeprice API** | Paid EV data (see No. 5) | EVs only | Subscription | Skip — OpenEV covers it |

**Verdict:** if budget exists, Auto-Data.net (parameter-targeted) or Teoalida UK DB (one-off) closes the dimensions/torque/tyres/boot/kerb-weight gap in one purchase. Otherwise those fields come from EEA (mass, wheelbase only) + manual/community entry.

---

## Recommended ingestion strategy

Priority order (all free/open unless noted):

1. **VCA Car Fuel Data (UK spine).** Ingest the latest file plus all yearly snapshots and archives (2000–2025). This defines the canonical UK-market variant list per year, and fills: fuel type, cc, power, transmission/gears, urban/extra-urban/combined mpg + l/100km (NEDC era) and WLTP cycle economy, CO2, Euro standard, NOx/RDE, EV range + Wh/km, noise. Derive UK production years from presence across snapshots. Build the scraper with a cookie-holding session (plain curl gets 302'd).
2. **EEA co2cars (variant physique + EU coverage).** Query Discodata with `SELECT DISTINCT` per year on `[Mk],[Cn],[Tan],[T],[Va],[Ve],[Ft],[ec (cm3)],[ep (KW)],[m (kg)],[W (mm)],[Ewltp (g/km)],[Enedc (g/km)],[z (Wh/km)],[Electric range (km)],year` rather than downloading full multi-GB CSVs. Join to VCA variants on make + model + fuel + cc + power (fuzzy) to add kerb mass, wheelbase, and to cover EU-market variants 2010–2025 (UK rows native 2010–2019).
3. **OpenEV Data (EV enrichment).** Ingest release CSV/JSON (CDLA-P-2.0, attribution). Fills battery gross/net kWh, chemistry, AC/DC charging kW, connectors, torque, 0-100, top speed, drivetrain for ~1,200 EV variants — precisely the fields VCA/EEA lack for EVs. Cross-check against KilowattApp open-ev-data (frozen, MIT) where values disagree.
4. **(Optional, paid) Auto-Data.net or Teoalida UK DB** to backfill the remaining ICE-variant fields no open source provides at scale: length/width/height, boot litres, kerb/gross weight (beyond EEA mass), tyres, brakes, doors/seats, cylinders/valves, aspiration, engine codes, torque, 0-100/top speed. Until then, keep the ilyasozkurt baseline for those fields (flagged as unverified/legacy) and overwrite wherever sources 1–3 have authoritative values.

Supporting/later: DVSA anonymised MOT + DfT VEH tables for UK-fleet popularity and name validation; EV Database/EVKX as manual verification references (no scraping); Back4App CC0 make-model list for name normalisation.

This combination gives: authoritative UK-market coverage 2000–present (VCA), official physique/CO2 per type-approval variant across EU+UK (EEA), and complete modern EV specs (OpenEV) — all freely licensed — with a single optional commercial purchase to reach full schema coverage on dimensions and chassis details.
