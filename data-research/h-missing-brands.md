# Missing UK Brands Research — Changan/Deepal, Abarth, LEVC, and Niche British Makers

Research date: 2026-07-23. Free sources only (Parkers, carwow, Autocar, Auto Express, ev-database.org, Wikipedia, brand UK sites, specialist press). Companion JSON: `h-missing-brands.json`.

---

## 1. Deepal (Changan) — China, UK launch Sept 2025

**Structure note:** Changan UK Ltd is the importer; **Deepal** is the consumer brand sold in the UK (Changan's EV sub-brand). Cars are badged Deepal; press/fleet data sometimes lists them as "Changan Deepal". Recommend make = "Deepal" with a Changan parent-make reference.

### Deepal S07 (mid-size electric SUV, Sept 2025–, from £39,990)
- Single UK spec: 79.97 kWh gross / 78 kWh usable NMC battery, RWD, 160 kW (215 bhp), 320 Nm.
- 0-62 in 7.9 s, 112 mph (180 kph), 295 miles / 475 km WLTP.
- DC 93 kW (30–80% ~35 min), AC 11 kW.
- 4750 × 1930 × 1625 mm, wheelbase 2900 mm, 5 doors / 5 seats.
- **Conflicts flagged:** boot 635 L (encyCARpedia) vs 510 L (ev-database, to parcel shelf); weight 2073 kg kerb vs 2148 kg EU unladen (ev-database).
- Sources: ev-database.org/car/3369, encycarpedia.com/deepal/25-s07-suv, fleetnews.co.uk (ref 3369), en.wikipedia.org/wiki/Deepal_S07

### Deepal S05 (compact electric SUV, UK on sale March 2026, £37,990/£39,990)
- 68.8 kWh LFP battery, "3C" fast charge (30–80% in ~15 min; peak DC kW not officially quoted for UK — left null, flagged).
- RWD: 200 kW (268 bhp), 290 Nm, 0-62 7.5 s, 303 mi (488 km) WLTP.
- AWD: 320 kW (429 bhp), 502 Nm, 0-62 5.5 s, 278 mi (447 km) WLTP. Both 112 mph.
- ~4620 × 1900 × 1600 mm, wheelbase 2880 mm (Wikipedia, China spec — verify UK homologation).
- Sources: electrive.com, fleetnews.co.uk, carnewschina.com, ev-database.org/car/3367, en.wikipedia.org/wiki/Deepal_S05

---

## 2. Abarth — Italy (UK since 2008 relaunch)

### 500 / 595 / 695 hatch (2008–2024) — 1.4 T-Jet turbo, 1368 cc, 4-cyl, FWD
Key power steps (all 5-speed manual, optional MTA robotised auto; 3 doors, 4 seats):
| Variant | Years | bhp | Nm | 0-62 | Top speed |
|---|---|---|---|---|---|
| 500 (135 PS) | 2008–2015 | 133 | 180 (206 Sport) | 7.9 s | 127 mph |
| 595 Custom (145 PS) | 2012–2022 | 143 | 206 | 7.8 s | 130 mph |
| 595 Turismo (165 PS) | 2012–2023 | 162 | 230 | 7.3 s | 135 mph |
| 595/695 Competizione (180 PS) | 2015–2024 | 177 | 250 | 6.7 s | 140 mph |
- 160 PS Turismo existed 2012–2014 before the 165 PS bump; also 695 Biposto 190 PS (2014–2016, not core range).
- WLTP-era CO2 ~155–162 g/km; earlier NEDC figures lower — flagged in JSON notes.
- Sources: parkers.co.uk/abarth/595/specs, autocar.co.uk, Wikipedia (Abarth 500)

### 124 Spider (2016–2019) — convertible, RWD
- 1.4 MultiAir turbo, 1368 cc, 168 bhp (170 PS), 250 Nm, 6MT (6AT option).
- 0-62 6.8 s, 144 mph, 44.1 mpg combined (NEDC), 148 g/km, 1060 kg, boot 140 L.
- Sources: en.wikipedia.org/wiki/Abarth_124_Spider, parkers.co.uk, auto-data.net

### 500e (2023–) — electric hatch + cabrio
- 42.2 kWh gross (~37.3 usable), 114 kW / 152 bhp, 235 Nm, FWD.
- 0-62 7.0 s, 96 mph, 164 mi / 265 km WLTP, DC 85 kW, AC 11 kW.
- 3673 × 1682 × 1518 mm, wb 2322 mm, ~1410 kg, boot 185 L. Trims: 500e, Turismo, Scorpionissima (same powertrain).
- Sources: parkers.co.uk/abarth/500e/specs, carwow.co.uk/abarth/500e/specifications, autocar.co.uk/car-review/abarth/500e

### 600e (2024–) — electric compact SUV, 54 kWh (~50.8 usable), FWD
- **Turismo:** 175 kW / 237 bhp, 345 Nm, 0-62 6.2 s.
- **Scorpionissima:** 207 kW / 276 bhp (280 PS), 345 Nm, 0-62 5.85 s (launch edition 1,949 units, then ongoing flagship).
- Both: 124 mph, 207 mi / ~333 km WLTP, DC 100 kW, boot 360 L, 5 doors / 5 seats.
- Sources: autocar.co.uk/car-review/abarth/600e, Stellantis technical sheet (media.stellantis.com), arenaev.com

---

## 3. LEVC (London EV Company) — UK (Coventry-built)

Both use the "eCity" series-hybrid (range-extender) powertrain: 31 kWh battery, 110 kW / 148 bhp e-motor (255 Nm) driving the rear wheels, 1.5-litre 3-cyl petrol generator (does not drive wheels). DC 50 kW, AC 11/22 kW.

### TX taxi (2018–)
- EV range: 64 mi WLTP originally, up to 78 mi (city) after 2022 update — flagged. Total range ~300+ mi.
- Top speed ~80 mph. Kerb weight ~2270 kg. Driver + 6 passengers, wheelchair accessible.
- CO2 quoted ~19–25 g/km (weighted PHEV-style figure) — flagged as methodology-dependent.
- Sources: en.wikipedia.org/wiki/LEVC_TX, levc.com, taxi-point.co.uk

### VN5 van (2020–)
- Same powertrain. EV range 61 mi / 98 km, total ~300 mi.
- Load volume 5.5 m³, payload up to 830 kg (780 kg Ultima trim), roof load 100 kg, load bay 2447 × 1574 × 1373 mm.
- Sources: parkers.co.uk/vans-pickups/levc/vn5, autoexpress.co.uk/levc/vn5, drivingelectric.com/levc/vn5

---

## 4. Niche British sports/specialist makers

### BAC (Briggs Automotive Company, Liverpool)
- **Mono (gen 2, 2023–):** single-seater; Ford-based 2.3 EcoBoost turbo 4-cyl, 332 bhp, 400 Nm, 6-spd sequential, 570 kg, 0-60 2.7 s, 170 mph.
- **Mono R (2019–, 30 units):** 2.5 NA Mountune 4-cyl, 340 bhp, 555 kg, 0-60 2.5 s, 170 mph. Torque not officially confirmed — null.
- Sources: bac-mono.com, autocar.co.uk, autoexpress.co.uk/news/351785

### Ginetta (Leeds)
- **G40 (2010–):** entry sports/race car. **Conflict:** road version engine quoted as 2.0 Mazda MZR (Wikipedia) vs 1.8 Ford Zetec ~140 bhp (G40R road car, older sources); race Academy car 1.8 Zetec. Power left null, flagged. ~795 kg road.
- **G56 (2021–):** GTA/GT Pro use 3.7 Ford Duratec V6 ("250+ bhp"); GT4/GTR/GTP8 use 6.2 LS3 V8 (400–500 bhp). Primarily race cars — G56 GTA is track/race, not UK road-registered; flagged.
- Sources: ginetta.com, en.wikipedia.org/wiki/Ginetta_G40, en.wikipedia.org/wiki/Ginetta_G56

### Morgan (Malvern)
Current range: Plus Four, Supersport, Super 3 (Plus Six ended 2024, replaced by Supersport).
- **Plus Four (2020–):** BMW B48 2.0T, 255 bhp, 400 Nm (auto; 350 Nm manual — flagged), 6MT/8AT, 0-62 4.8 s (auto), 149 mph, ~1013 kg dry.
- **Plus Six (2019–2024):** BMW B58 3.0T I6, 335 bhp, 500 Nm, 8AT, 0-62 4.2 s, 166 mph, 1075 kg dry.
- **Supersport (2025–):** B58 335 bhp, 500 Nm, 8AT, 0-62 3.9 s, 166 mph, 1170 kg kerb, from £102k. New CXV platform.
- **Super 3 (2022–):** three-wheeler; Ford 1.5 NA 3-cyl, 118 bhp, 150 Nm, Mazda 5MT, 0-62 7.0 s, 130 mph, 635 kg dry, ~40 mpg.
- Sources: morgan-motor.com, en.wikipedia.org (Morgan Supersport / Super 3 / Plus Six), motoringresearch.com

### Caterham (Dartford/Crawley)
Seven range (all front-engine RWD roadsters, 2 seats):
- **170 (2021–):** Suzuki 658 cc turbo 3-cyl, 84 bhp, 116 Nm, 5MT, 440 kg, 0-62 6.9 s, 105 mph.
- **340 (2022–):** Ford Duratec 2.0, 168 bhp, 5MT, 560 kg, 0-62 4.8 s.
- **360 (2013–2024):** Duratec 2.0, 180 bhp, 194 Nm, 5MT, 560 kg, 130 mph.
- **420 (2016–):** Duratec 2.0, 210 bhp, 203 Nm, 5MT (6MT option), 560 kg, 0-60 ~3.8–4.2 s (S vs R) — flagged.
- **620 (2013–):** supercharged 2.0, 310 bhp, 297 Nm; 620S 5MT 0-60 3.4 s; 620R 6-spd sequential 0-60 2.8 s; 155 mph, 572 kg.
- **Project V status (July 2026):** still a prototype. Functional prototype shown at Tokyo Auto Salon Jan 2026; testing through 2026; global sales now expected 2027 (slipped from 2025/26). Targets: ~200 kW / 268 bhp rear motor, 55 kWh, <1200 kg, 2+1 seats. Not yet a production model — captured with status note.
- Sources: caterhamcars.com, carfolio.com, encycarpedia.com, carscoops.com (Project V 2026)

### Noble (Leicester)
- **M500 (2023–, very low volume):** mid-engined; Ford GT-derived 3.5 twin-turbo V6, target ~550 bhp ("nearly 600 lb ft" claimed — torque flagged, not homologated), Graziano 6MT gated manual, RWD, ~1250–1400 kg (prototype vs target — flagged), top speed just under 200 mph, ~£150k. Production status/volumes unclear — flagged.
- Sources: autocar.co.uk, topgear.com/car-reviews/noble/m500-prototype, en.wikipedia.org/wiki/Noble_M500

### Munro (East Kilbride, Scotland)
- **M280 (Series-M, 2024–):** electric utility 4x4 (SUV/pickup body). 280 kW (375 bhp), 700 Nm, 85 kWh LFP, AWD, 0-62 ~6 s, 95 mph, ~170 mi real-world (WLTP est. 170–200 mi — flagged), DC 130 kW, payload 1050 kg, towing 3500 kg. M170 (61 kWh) is the lower variant.
- Sources: munro-ev.com/technical, electrifying.com, fwi.co.uk, greencarguide.co.uk

### Ariel (Crewkerne, Somerset)
- **Atom 4 (2018–):** Honda K20C 2.0 turbo (Civic Type R), 320 bhp, 420 Nm, 6MT, 595 kg, 0-60 2.8 s, 162 mph. (Atom 4R: 400 bhp; 4RR: 525 bhp — noted, not separate JSON variants.)
- **Nomad 2 (2024–):** off-road buggy; Ford 2.3 EcoBoost, 305 bhp (switchable 260/305), 518 Nm, 6MT, 715 kg, 0-60 3.4 s, 134 mph (limited).
- Sources: arielmotor.co.uk, autocar.co.uk, topgear.com

---

## Notable gaps / conflicts summary
1. **Deepal S07 boot & weight** — 510 vs 635 L; 2073 vs 2148 kg (kerb vs EU unladen). Both flagged.
2. **Deepal S05 peak DC kW** — "3C" marketing claim only; no official UK kW figure yet.
3. **LEVC** — CO2/mpg figures methodology-dependent (weighted REx cycle); no official 0-62; TX EV range changed mid-life (64→78 mi).
4. **Ginetta G40 road engine/power** — sources conflict (Mazda 2.0 vs Ford 1.8); power null. G56 is effectively race-only.
5. **Noble M500** — pre-production figures only; torque and weight not homologated.
6. **Caterham Project V** — not on sale; sales expected 2027; specs are targets.
7. **Munro** — WLTP not yet certified; range figures are manufacturer estimates.
8. Abarth petrol CO2/mpg shift between NEDC and WLTP eras — JSON uses late-era WLTP where a single figure was needed, flagged in notes.
9. Niche makers (BAC, Ariel, Caterham, Ginetta) rarely publish CO2/mpg/dimensions — many nulls are genuinely unpublished, not unresearched.
