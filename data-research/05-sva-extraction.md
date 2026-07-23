# SVA Car Parts — Extracted Vehicle Taxonomy

Extracted 2026-07-23 from an owner-provided OpenCart database dump (`sva1.sql.gz`, since deleted — not committed to git). Source tables: `oc_category` + `oc_category_description` (single language, default store).

## What was extracted

| Level | Count | Example |
|---|---|---|
| Makes | 42 | BMW, Vauxhall, Rover, Iveco, MAN |
| Models | 516 | BMW 3 Series, Ford Focus |
| Body styles | 855 | Saloon - 4 Door, Estate - 5 Door |
| Generations | 2,441 | `BMW 3 Series E46 (1998-2001) / Saloon/Estate` |
| Engine variants | 7,179 | `316i 1.9 E46`, `320d 2.0 E46` |

Parse quality: **86%** of generations have a year range, **53%** carry a factory chassis code (E46, 9N, W201, P11…). Engine variants come from the per-variant parts categories one level below each generation (`"Cooling & Parts parts for 316i 1.9 E46"` → `316i 1.9 E46`).

## Files

- `05-sva-vehicle-tree.json` — full nested Make → Model → BodyStyle → Generation tree (with parsed mk/phase/chassisCode/yearFrom/yearTo/notes and the OpenCart `internalReference` id)
- `05-sva-generations.csv` — flat generation list, one row per (make, model, bodyStyle, generation)
- `05-sva-engine-variants.csv` — 7,179 deduped engine-variant strings keyed to their generation

## Value to CarData.Wiki

This is **not** spec data — no power/dimensions/economy figures exist in the source. Its value:

1. **UK-market vehicle identity spine**: generation splits (incl. facelifts), year ranges, and chassis codes for the cars that actually matter in the UK — including Rover (Metro, 25, 45, 75…), Vauxhall, and LCVs (Transit, Sprinter, Iveco Daily, MAN TGE) that the current autoevolution-derived dataset handles poorly.
2. **Chassis codes as join keys** for matching VCA / EEA / OpenEV rows to the right generation.
3. **Engine-variant checklists** per generation (e.g. every E46 engine sold in the UK) — a coverage yardstick to audit whether our variants table is complete per generation.

## Caveats

- `not_car` flagged nodes were retained in the tree walk only where they sat on the vehicle path; parts categories were ignored.
- Generation naming is human-entered: chassis-code column sometimes contains stray words; notes column holds unparsed remainders. Treat `chassisCode` as high-confidence when it matches `^[A-Z]{1,2}\d{1,3}$`-ish patterns, lower otherwise.
- Duplicate (make, model, generation) rows exist across body styles by design — the same generation appears under each body style it was sold as.
