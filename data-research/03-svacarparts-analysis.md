# SVA Car Parts (svacarparts.co.uk) — Data Analysis

*Reconnaissance date: 2026-07-23. First-party data — the site is owned by us, so any extraction method (including direct DB export) is available and authorized.*

## Site Platform

- **OpenCart-based custom build** (heavily customised). Telltales: `index.php?route=...` routing (`common/home`, `product/category`, `checkout/cart`), `catalog/view/javascript/...` asset paths, jQuery 2.1.1, custom controllers under `tool/` (`tool/getcatsajax`, `tool/vrmlookup`).
- Behind Cloudflare. `robots.txt` disallows all crawlers by default and whitelists major search engines only — irrelevant for us as owners, but a generic scraper UA works fine anyway (all test fetches with a plain `Mozilla/5.0` UA succeeded).
- **No sitemap**: `/sitemap.xml` times out/returns nothing, `/sitemap_index.xml` is 404, the standard OpenCart `feed/google_sitemap` route is 404. Crawling must go via the AJAX endpoint or category-page link walking.

## How Vehicle Data Is Structured

Vehicles are modelled as an **OpenCart category tree**, 4+ levels deep:

```
Make (top_cat)            e.g. Ford (category_id 122)
└─ Model (cat_2)          e.g. Focus (436)
   └─ Body style (cat_3)  e.g. Hatchback - 5 Door (441)
      └─ Generation       e.g. "Ford Focus MK 2 C37 | 2004-2008"
         └─ Part categories (Body Panels, Bumpers, Lighting, Cooling, ...)
            └─ Products (the actual parts)
```

- The **Year dropdown (cat_4)** is not a category level — it returns raw years (e.g. 1997–2027 for Focus 5dr) and the server resolves year → generation via `product/category/getCarFromSelector`.
- **Generation names are the richest data point**: they encode marque generation (MK 1, MK 2...), factory chassis/platform code (C37, C346, C519, CW17...), and production year ranges (1998-2001, 2022-> etc.).

### SEO URL patterns

```
/{make}/{make-model}                                  /ford/ford-focus
/{make}/{make-model}/{make-model-bodystyle}           /ford/ford-focus/ford-focus-hatchback-5-door
/.../{make-model-mk-N-yyyy-yyyy-code}                 /ford/ford-focus/ford-focus-hatchback-5-door/ford-focus-mk-2-2004-2008-c37-1
/.../{part-category-for-...}/{part-for-...}           .../bumpers-fittings-for-ford-focus-mk-2-2004-2008-c37-1/front-bumper-for-...
```

## Key Endpoint (this is the extraction goldmine)

**`POST https://svacarparts.co.uk/index.php?route=tool/getcatsajax`** — no auth, no session, no CSRF token required. Powers the cascading dropdowns.

Request (form-encoded): `id=<category_id>&box=<top_cat|cat_2|cat_3>`

- `box=top_cat`, `id=<make_id>` → child models of that make
- `box=cat_2`, `id=<model_id>` → body styles of that model
- `box=cat_3`, `id=<bodystyle_id>` → available years (raw year list, not generations)

Example — models for Ford (`id=122&box=top_cat`):

```json
{"name":"Transit Custom","id":"4445","total":24,
 "html":"<option value=\"4919\">B-MAX</option><option value=\"2028\">C-MAX</option>...<option value=\"436\">Focus</option>..."}
```

Example — body styles for Focus (`id=436&box=cat_2`):

```json
{"name":"Saloon - 4 Door","id":"445","total":6,
 "html":"<option value=\"2010\">Convertible - 2 Door</option><option value=\"437\">Estate - 5 Door</option><option value=\"441\">Hatchback - 5 Door</option>..."}
```

Responses are JSON with an `html` field of `<option value="{category_id}">{name}</option>` strings — trivially parseable with a regex. `total` gives the child count.

The make list (40 makes with IDs) is embedded directly in the homepage HTML in `<select id="top_cat">`.

**Generation-level data is NOT in the AJAX chain** (it returns years instead). Generations must come from the body-style SEO pages, e.g. `/ford/ford-focus/ford-focus-hatchback-5-door` lists the 8 generation links with year-range labels — a simple `<a href>` + `<span>` parse.

Related endpoints (less useful for extraction): `tool/vrmlookup` (UK number-plate lookup — proxies a third-party VRM API, rate-limited per user), `product/category/getCarFromSelector` (resolves path+year → generation category_id).

## Coverage

- **40 makes** (UK-market): Alfa Romeo, Audi, BMW, Chevrolet, Chrysler, Citroen, Cupra, Dacia, Daewoo, DS, Fiat, Ford, Honda, Hyundai, Iveco, Jaguar/Daimler, Jeep, Kia, Land Rover, Lexus, MAN, Mazda, Mercedes Benz, Mini, Mitsubishi, Nissan, Peugeot, Renault, Rover, Saab, Seat, Skoda, Smart, Subaru, Suzuki, Tesla, Toyota, Vauxhall, Volkswagen, Volvo.
- Ford alone has **24 models**; extrapolating, roughly **400–700 models** total, each with 1–6 body styles and multiple generations — plausibly **3,000–8,000 generation-level entries**.
- Distinctly **UK-market**: Vauxhall (not Opel), Rover, UK body-style conventions, vans (Transit, Sprinter, Iveco, MAN). Years span roughly 1980s–2027 (Focus 5dr years offered: 1997–2027).

## What the Data Contains (honest assessment)

**It is a fitment taxonomy, NOT a specs database.**

| Field | Present? |
|---|---|
| Make / model names | Yes |
| Body style + door count | Yes ("Hatchback - 5 Door", "Estate - 5 Door", "MPV - 5 Door"...) |
| Generation (MK number) | Yes, in generation names |
| Chassis/platform code | Yes, in generation names (C37, C346, C519, CW17...) |
| Production year ranges per generation/body style | Yes |
| Engine, power, torque | **No** |
| Dimensions, weight, wheelbase | **No** |
| Trim levels, fuel type, transmission | **No** |

Generation pages contain only parts categories (bonnets, bumpers, lamps, radiators) and occasional free-text fitment notes (e.g. rear-lamp mounting differences between Focus C346 and C519 facelifts). Product pages are parts, not vehicles.

**Value for CarData.Wiki:** moderate but real — as a **skeleton/cross-reference**, not a specs source:

1. A clean, human-curated UK-market make → model → body-style → generation tree with accurate UK production year splits (including facelift splits, e.g. MK 2 2004-2008 vs 2008-2011) — this is exactly the "vehicle identity spine" a specs wiki needs before attaching specs from other sources.
2. Chassis codes are a high-value join key for matching against spec databases (Wikipedia, manufacturer data, DVLA/VES data).
3. Body-style × generation granularity (e.g. Focus 5dr hatch has 8 generation entries) is finer than many free datasets.

It contributes **zero engine/performance/dimension specs**. Those must come from elsewhere (task for other research docs).

## Recommended Extraction Method

**Best option — direct database export (we own the site).** This is OpenCart, so the whole tree lives in two tables:

```sql
SELECT c.category_id, c.parent_id, cd.name, c.sort_order, c.status
FROM oc_category c
JOIN oc_category_description cd ON cd.category_id = c.category_id
ORDER BY c.parent_id, c.sort_order;
```

One query yields the entire make/model/bodystyle/generation tree with IDs and parent links (plus `oc_seo_url` / `url_alias` for slugs). Cleanest, zero load on the live site. Ask whoever has cPanel/phpMyAdmin access for a CSV of those tables.

**Fallback — polite API crawl (if DB access is awkward).** Total requests needed is small (~1,500–3,000):

1. Parse the 40 make IDs from the homepage `<select id="top_cat">`.
2. For each make: `POST index.php?route=tool/getcatsajax` with `id=<make_id>&box=top_cat` → models (~40 requests).
3. For each model: same endpoint with `box=cat_2` → body styles (~500 requests).
4. For each body style: fetch the SEO page (`/{make}/{model}/{bodystyle}`) and parse generation links + year-range spans (~1,000–2,000 requests). (The AJAX `box=cat_3` call only returns years, not generations, so the HTML page is required for this level.)
5. Throttle to ~1 req/sec with a normal browser UA; whole crawl finishes in under an hour.

Store as a normalized table: `make, model, body_style, doors, generation_label, mk_number, chassis_code, year_from, year_to, sva_category_id, sva_url` (mk/chassis/years regex-parsed from generation names like `Ford Focus MK 2 C37 | 2004-2008`).

## Bottom Line

svacarparts.co.uk holds a well-curated UK vehicle **fitment hierarchy** (40 makes, ~500 models, thousands of body-style/generation entries with chassis codes and year ranges) on an OpenCart platform with an open, unauthenticated JSON dropdown endpoint. It is an excellent source for CarData.Wiki's vehicle identity backbone and UK-market coverage checklist, but contains no technical specifications — pair it with a specs source keyed on make/model/generation/chassis code. Since we own the site, a direct `oc_category` DB export beats scraping entirely.
