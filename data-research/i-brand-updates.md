# Existing-Brand UK Model Updates (post-Oct-2024 snapshot gaps)

Research date: 2026-07-23. UK-market variants for recent launches from brands already in the dataset.
Companion machine-readable file: `i-brand-updates.json` (19 makes / 45 models / 106 variants).

Convention: trim-level duplicates with identical powertrains are collapsed to one variant per powertrain.
Range figures are WLTP combined unless noted. Unknowns are null in the JSON; conflicts are flagged inline.

---

## MG (7 models)

### MGS5 EV (2025–) — compact electric SUV, replaces ZS EV
- **Standard Range 49 kWh** (47.1 usable, LFP): 170 kW / 228 bhp, 350 Nm, RWD, 0-62 6.3 s, 211 mi (340 km), DC 120 kW.
- **Long Range 64 kWh** (62.1 usable, NMC): 170 kW / 228 bhp, RWD, 298 mi SE / 289 mi Trophy, DC 139 kW.
- 4476 x 1849 x 1621 mm, boot 453 L.
- Sources: [EV Database SR](https://ev-database.org/uk/car/3146/MG-MGS5-EV-Standard-Range), [EV Database LR](https://ev-database.org/uk/car/3147/MG-MGS5-EV-Long-Range), [Top Gear spec](https://www.topgear.com/car-reviews/107592/MG%20MOTOR%20UK/MGS5%20ELECTRIC%20ESTATE/170kW%20SE%20EV%20Long%20Range%2064kWh%205dr%20Auto/spec)

### HS (2024 gen)
- **1.5T 170PS petrol**: 125 kW / 168 bhp, 275 Nm, 6MT or 7DCT, FWD, 0-62 9.4 s (auto), ~38.2 mpg (manual).
- **1.5T PHEV**: system ~302 bhp (1.5T 143 PS + 154 kW motor), 24.7 kWh, 75 mi EV range, 0-62 6.8 s, CO2 12 g/km, boot 441 L (507 L petrol).
- **CONFLICT**: system power quoted between 272 and 307 PS across sources; 302 bhp most commonly cited by UK press. Combined torque 432 Nm per ultimatespecs (motor alone 340 Nm).
- Sources: [Parkers PHEV spec](https://www.parkers.co.uk/mg/hs/suv-2024/15-t-gdi-phev-se-5dr-auto/specs/), [Motorpoint launch article](https://www.motorpoint.co.uk/car-news/2024-mg-hs-suv-price-specs-and-release-date)

### ZS Hybrid+ (2024 gen)
- 1.5 NA + 100 kW e-motor, system 196 PS (144 kW), 465 Nm combined, 3-speed hybrid auto, FWD, 0-62 8.7 s, 55.4 mpg, CO2 113 g/km, boot 443 L.
- Sources: [MG UK](https://www.mg.co.uk/new-cars/mg-zs-hybrid), [MG brochure PDF](https://www.mg.co.uk/sites/default/files/2024-12/MG_ZS_Hybrid_Brochure.pdf)

### MG3 (2024 gen)
- **Hybrid+**: same 143 kW / 194 PS system as ZS, 0-62 8.0 s, 64.2 mpg, CO2 100 g/km, boot 293 L.
- **1.5 VTi-tech 115PS** manual added 2025 (details sparse — verify).
- Sources: [MG UK MG3](https://www.mg.co.uk/new-cars/mg3-hybrid), [MG press](https://www.mg.co.uk/media-centre/new-mg3-hybrid-has-arrived)

### Cyberster (2024–) — electric roadster, 77 kWh
- **Trophy RWD**: 250 kW / 335 bhp, 475 Nm, 0-62 5.0 s, 316 mi (509 km).
- **GT AWD**: 375 kW / 503 bhp, 725 Nm, 0-62 3.2 s, 276 mi (444 km).
- 2 doors / 2 seats, scissor doors, boot 249 L.
- Sources: [MG press release](https://www.mg.co.uk/media-centre/ready-exhilarate-mg-cyberster-trophy-and-gt), [Auto Express](https://www.autoexpress.co.uk/mg/cyberster)

### IM5 (2025–, sold via MG UK as "MG IM") — large saloon
- **Standard Range 75 kWh** (400V LFP): 217 kW / 291 bhp, RWD, 0-62 6.8 s, 304 mi, DC 153 kW.
- **Long Range 100 kWh** (800V): ~300 kW / 402 bhp, RWD, 0-62 4.9 s, 441 mi, DC up to 396 kW.
- **Performance AWD 100 kWh**: 572 kW / 767 bhp, 0-62 3.2 s, 357 mi.
- Sources: [EV Database SR](https://ev-database.org/uk/car/3244/MG-IM5-Standard-Range), [EV Database LR](https://ev-database.org/uk/car/3245/MG-IM5-Long-Range), [CarGurus UK](https://www.cargurus.co.uk/research/articles/2025-mg-im5-im6-price-specs-release-date), [carwow](https://www.carwow.co.uk/mg/im5/specifications)

### IM6 (2025–) — large SUV, same platform
- **Long Range 100 kWh RWD**: ~300 kW, 0-62 5.5 s, 388 mi.
- **Performance AWD 100 kWh**: 572 kW, 0-62 3.5 s (WLTP range not confirmed — GAP).
- Sources: [CarGurus UK](https://www.cargurus.co.uk/research/articles/2025-mg-im5-im6-price-specs-release-date)

---

## Tesla (1 model)

### Model Y "Juniper" facelift (2025–)
- **RWD**: ~60-62.5 kWh LFP, 0-62 5.9 s, 311 mi (500 km), DC 175 kW.
- **Long Range RWD**: 78.4 kWh NMC, 0-60 5.4 s, 386 mi (622 km), DC 250 kW. Reported dropped from UK line-up mid-2026.
- **Long Range AWD**: 364 mi (early figure; later quoted up to 372 mi — minor CONFLICT), 0-60 4.6 s.
- **Performance AWD** (late 2025): 460 PS, 0-60 3.3 s, 355 mi, 250 kph top speed.
- Tesla publishes no official motor outputs — kW figures in JSON are estimates and flagged.
- Note: **Model 3 Highland Performance** launched April 2024 (pre-snapshot cutoff) so was NOT researched; verify it is present in the existing dataset.
- Sources: [EV Database RWD](https://ev-database.org/uk/car/3362/Tesla-Model-Y-RWD), [EV Database LR RWD](https://ev-database.org/uk/car/3120/Tesla-Model-Y-Long-Range-RWD), [InsideEVs Europe specs](https://insideevs.com/news/751466/tesla-model-y-details-europe/), [DriveElectric review](https://www.drive-electric.co.uk/reviews/tesla/model-y/)

---

## Dacia (3 models)

### Bigster (2025–) — C-SUV
- **TCe 140** mild hybrid: 1.2 3-cyl 48V, 138 bhp, 230 Nm, 6MT, FWD, 0-62 9.8 s, 52.3 mpg, boot 667 L.
- **Hybrid 155**: 1.8 4-cyl + 2 e-motors, 153 bhp system, multi-mode auto, 0-62 9.7 s, ~60 mpg, CO2 ~106 g/km.
- **TCe 130 4x4** mild hybrid: 128 bhp, 6MT, AWD, 47.1 mpg, Terrain Control.
- Sources: [Dacia UK engines page](https://www.dacia.co.uk/hybrid-and-electric-range/bigster-suv/engines.html), [Auto Express](https://www.autoexpress.co.uk/dacia/bigster), [auto-data.net TCe 140](https://www.auto-data.net/en/dacia-bigster-1.2-tce-140hp-mild-hybrid-53506)

### Duster (2024 gen)
- **TCe 100 Bi-Fuel** (petrol/LPG), **TCe 130 MHEV** FWD (51 mpg) and **4x4** (47.1 mpg, boot 445 L), **Hybrid 140** (56 mpg).
- Sources: [Dacia UK press](https://www.press.dacia.co.uk/releases/463), [Parkers 4x4 spec](https://www.parkers.co.uk/dacia/duster/suv-2024/12-tce-130-extreme-5dr-4x4/specs/), [ultimatespecs Hybrid 140](https://www.ultimatespecs.com/car-specs/Dacia/138201/Dacia-Duster-3-Hybrid-140.html)

### Spring (UK launch late 2024/2025)
- **Electric 45** (44 bhp, no DC charging) and **Electric 65** (64 bhp, DC 30 kW); both 26.8 kWh, 140 mi WLTP, 4 seats.
- Withdrawn Dec 2025; replaced by Spring Electric 100 for 2026 (out of scope).
- Sources: [EV Database Electric 65](https://ev-database.org/uk/car/2127/Dacia-Spring-Electric-65), [What Car?](https://www.whatcar.com/dacia/spring/hatchback/review/n26964)

---

## Alpine (2 models)

### A290 (2024–) — hot hatch (Renault 5 based), 52 kWh usable
- **GT 180hp**: 132 kW, 285 Nm, 0-62 7.4 s, 236 mi, DC 100 kW.
- **GTS 220hp**: 160 kW, 300 Nm, 0-62 6.4 s, 226–236 mi (wheel-dependent — minor CONFLICT).
- Sources: [Alpine UK](https://www.alpine-cars.co.uk/electric-models/a290/electric-performance.html), [EV Database](https://ev-database.org/uk/car/2269/Alpine-A290-Electric-220-hp), [Parkers GTS](https://www.parkers.co.uk/alpine/a290/hatchback-2025/trim-gts/specs/)

### A390 (2025–, UK deliveries 2026) — tri-motor fastback SUV, 89 kWh
- **GT**: 294 kW / 394 bhp, 0-62 4.8 s, up to 345 mi claimed.
- **GTS**: 345 kW / 463 bhp, 808 Nm, 0-62 3.9 s, ~323 mi. DC 190 kW.
- Sources: [EV Database A390 GTS](https://ev-database.org/uk/car/3391/Alpine-A390-GTS), [Wikipedia](https://en.wikipedia.org/wiki/Alpine_A390)

---

## Geely (1 model)

### EX5 (UK 2025) — electric mid-size SUV
- 60.2 kWh LFP, 160 kW / 215 bhp, 320 Nm, FWD, 0-62 6.9 s, 267 mi (SE) / 255 mi (Pro), DC 100 kW, boot 461 L, from £31,990.
- Sources: [CarGurus UK](https://www.cargurus.co.uk/research/articles/2025-geely-ex5-price-specs-release-date), [carwow](https://www.carwow.co.uk/geely/ex5)

---

## Isuzu (1 model)

### D-Max (2021 gen incl. 2025 facelift)
- **1.9TD 164PS** (120 kW, 360 Nm, 6MT/6AT) in 4x2 and 4x4 forms; 3.5 t towing. 2025 facelift is styling/tech only — powertrain unchanged.
- **D-Max EV** (revealed 2025, UK deliveries from early 2026): 66.9 kWh, dual-motor permanent 4WD, 140 kW (some sources 149.3 kW peak — minor CONFLICT), 325 Nm, 0-62 10.1 s, 163 mi WLTP, DC only 50 kW, >1 t payload, 3.5 t towing.
- Sources: [Isuzu UK press](https://www.isuzu.co.uk/news/introducing-the-new-electric-isuzu-d-max/), [electrive](https://www.electrive.com/2025/07/25/isuzu-uk-reveals-d-max-ev-pricing-ahead-of-2026-launch/), [Parkers D-Max](https://www.parkers.co.uk/isuzu/d-max/)

---

## Polestar (3 models)

### Polestar 3 (2024–), 111 kWh (107 usable) at launch
- **LR Single Motor RWD**: 220 kW / 295 bhp, 490 Nm, 0-62 7.8 s, 438 mi.
- **LR Dual Motor**: 360 kW / 483 bhp, 840 Nm, 0-62 5.0 s, 392 mi.
- **LR DM Performance**: 380 kW / 510 bhp, 910 Nm, 0-62 4.7 s, 348 mi. All DC 250 kW.
- **NOTE**: MY26 update (announced late 2025) moves to 92 kWh (RWD) / 106 kWh packs, adds 680 bhp Performance — treat as a separate refresh when ingesting.
- Sources: [Polestar UK specs](https://www.polestar.com/uk/polestar-3/specifications/), [Auto Express single motor](https://www.autoexpress.co.uk/polestar/3/104074/new-polestar-3-specs-details-and-cheaper-single-motor-version)

### Polestar 4 (2024–), 100 kWh (94 usable)
- **LR Single Motor RWD**: 200 kW / 268 bhp, 0-62 7.1 s, 385 mi.
- **LR Dual Motor AWD**: 400 kW / 536 bhp, 0-62 3.8 s, 367 mi. DC 200 kW. No rear window.
- Sources: [Polestar UK](https://www.polestar.com/uk/polestar-4/specifications/), [Synergy comparison](https://www.synergycarleasing.co.uk/guides/polestar-3-vs-4/)

### Polestar 5 (2025–), 112 kWh (106 usable), 800V GT
- **Dual Motor**: 550 kW / 738 bhp, 0-62 3.9 s, up to 416 mi, DC 350 kW, £89,500.
- **Dual Motor Performance**: 650 kW / 871 bhp, 1015 Nm, 0-62 3.2 s, ~351 mi.
- Sources: [EV Database](https://ev-database.org/uk/car/3298/Polestar-5-Dual-Motor), [Top Gear](https://www.topgear.com/car-reviews/polestar/5-grand-tourer-special-edition-2025/650kw-112kwh-lr-dm-performance-launch-ed), [paultan debut specs](https://paultan.org/2025/09/09/polestar-5-debuts-twin-motor-awd-grand-tourer-ev-with-up-to-884-ps-1015-nm-up-to-670-km-range-wltp/)

- Polestar 2 post-Oct-2024: only minor MY changes; the big MY25 refresh (June 2024) predates the snapshot cutoff — no action needed.

---

## DS (1 model)

### N°8 (2025–) — flagship electric fastback SUV, from £50,790
- **FWD 74 kWh (230hp)**: 169 kW, 355 mi, DC 160 kW. (Some UK sources quote 256 bhp boost figure — minor CONFLICT.)
- **FWD Long Range 97.2 kWh (245hp)**: 180 kW, headline 466 mi.
- **AWD Long Range 97.2 kWh (350hp)**: 257 kW, 509 Nm, 0-62 5.4 s, 426 mi. 20-80% in 27 min at 200 kW.
- DS 4 / DS 7 range refresh: NOT researched (time-boxed out; carried-over powertrains).
- Sources: [Stellantis UK press](https://www.media.stellantis.com/uk-en/ds/press/the-new-all-electric-ds-n08-is-now-available-to-order), [Autocar](https://www.autocar.co.uk/car-news/new-cars/new-ds-no8-tops-out-%C2%A363290-370bhp-and-426-miles), [EV Database AWD LR](https://ev-database.org/uk/car/3078/DS-Automobiles-N8-AWD-Long-Range)

---

## Suzuki (2 models)

### eVitara (2025–) — first Suzuki EV
- **49 kWh 2WD**: 106 kW / 142 bhp, 193 Nm, 213 mi.
- **61 kWh 2WD**: 128 kW / 172 bhp, 264 mi.
- **61 kWh ALLGRIP-e AWD**: 135 kW / 181 bhp, 307 Nm, 245 mi.
- GAP: official peak DC rate not published (10-80% ~45 min, ~70 kW class); 0-62 times not consistently published.
- Sources: [Suzuki UK](https://cars.suzuki.co.uk/new-cars/e-vitara/), [Auto Express](https://www.autoexpress.co.uk/suzuki/e-vitara), [Top Gear](https://www.topgear.com/car-reviews/suzuki/evitara)

### Swift (2024 gen)
- 1.2 3-cyl mild hybrid, 61 kW / 81 bhp, 112 Nm, 5MT or CVT (ALLGRIP 4WD manual option), 0-62 12.5 s, 64.2 mpg, CO2 99 g/km, boot 265 L.
- Sources: [Suzuki UK](https://cars.suzuki.co.uk/new-cars/swift/), [Parkers](https://www.parkers.co.uk/suzuki/swift/)

---

## Skoda (2 models)

### Elroq (2025–) — compact MEB SUV, boot 470 L
- **50**: 55/52 kWh, 125 kW, RWD, 232 mi, DC 145 kW.
- **60**: 63/59 kWh, 150 kW, RWD, 267 mi, DC 165 kW.
- **85**: 82/77 kWh, 210 kW / 282 bhp, 545 Nm, RWD, 0-62 6.6 s, up to 360 mi, DC 175 kW.
- **vRS**: 84/79 kWh, 250 kW / 335 bhp, AWD, 0-62 5.4 s, ~345 mi, DC 185 kW.
- Sources: [Skoda Storyboard press kit](https://www.skoda-storyboard.com/en/press-kits/skoda-elroq-press-kit/batteries-and-powertrains-long-range-and-reduced-charging-times-for-an-even-better-customer-experience/), [Auto Express](https://www.autoexpress.co.uk/skoda/elroq), [carwow](https://www.carwow.co.uk/skoda/elroq)

### Enyaq 2025 facelift (SUV + Coupe)
- **60** (150 kW, 268 mi), **85** (210 kW, 359 mi), **85x AWD** (~334 mi), **vRS** (250 kW, 0-62 5.5 s, ~340 mi). Boot 585 L.
- Sources: [Skoda UK](https://www.skoda.co.uk/models/enyaq), [Auto Express](https://www.autoexpress.co.uk/skoda/enyaq)

---

## Renault (3 models)

### 5 E-Tech (2024–)
- **120hp / 40 kWh**: 90 kW, 190 mi, DC 80 kW.
- **150hp / 52 kWh**: 110 kW, 245 Nm, 0-62 8.0 s, 252 mi, DC 100 kW. Boot 326 L.
- Sources: [Renault UK tech sheet](https://www.renault.co.uk/electric-vehicles/r5-e-tech-electric/specifications.html), [carwow](https://www.carwow.co.uk/renault/5-e-tech)

### 4 E-Tech (2025–) — crossover sibling
- UK: 52 kWh / 148 bhp only, 0-62 8.2 s, 247 mi, DC 100 kW, boot 420 L.
- Sources: [Renault UK specs](https://www.renault.co.uk/electric-vehicles/r4-e-tech-electric/specifications.html), [RAC review](https://www.rac.co.uk/drive/car-reviews/renault/4-e-tech/4-e-tech/)

### Scenic E-Tech (2024–)
- **60 kWh / 170hp**: 260 mi, DC 130 kW. **87 kWh / 220hp**: 0-62 7.9 s, 379 mi, DC 150 kW. Boot 545 L.
- Sources: [Renault UK](https://www.renault.co.uk/electric-vehicles/scenic-e-tech-electric.html), [EV Database LR](https://ev-database.org/uk/car/1946/Renault-Scenic-E-Tech-Long-Range)

---

## Vauxhall (2 models)

### Frontera (2024–) — boxy B-SUV, 5 or 7 seats (hybrid only), boot 460 L
- **Hybrid 110** 48V e-DCT (Hybrid 145 added 2025).
- **Electric 44 kWh** LFP: 83 kW / 111 bhp, 186 mi, DC 100 kW. 0-62 quoted 12.1–13.0 s across sources (CONFLICT).
- **Electric Extended Range 54 kWh** NMC (2025): 253 mi.
- Sources: [Stellantis press](https://www.media.stellantis.com/uk-en/vauxhall/press/new-vauxhall-frontera-press-information), [Extended Range press](https://www.media.stellantis.com/uk-en/vauxhall/press/vauxhall-announces-details-for-new-frontera-electric-extended-range), [EV Database](https://ev-database.org/uk/car/2238/Vauxhall-Frontera-Electric-44-kWh)

### Grandland (2024 gen) — STLA Medium, boot 550 L
- **Hybrid 145** 48V e-DCT (~51.4 mpg).
- **Plug-in Hybrid 195** (2025): 1.6T + motor, 192 bhp, 39 mi EV. Battery quoted 13.2 kWh vs 17.9 kWh gross elsewhere (CONFLICT).
- **Electric 73 kWh**: 157 kW / 210 bhp, 323 mi, DC 160 kW.
- **Electric AWD 321hp** (2025): 0-62 6.1 s, 311 mi.
- **Electric Long Range 97 kWh** (2025): ~435 mi claimed (power output approx — verify).
- Sources: [Stellantis press](https://www.media.stellantis.com/uk-en/vauxhall/press/vauxhall-grandland-press-information), [EV Database 73 kWh](https://ev-database.org/uk/car/3037/Vauxhall-Grandland-Electric-73-kWh), [Auto Express](https://www.autoexpress.co.uk/vauxhall/grandland), [GreenCarGuide PHEV](https://www.greencarguide.co.uk/car-reviews-and-road-tests/vauxhall-grandland-plug-in-hybrid-review/)

---

## Citroen (2 models)

### C3 / e-C3 (2024 gen)
- **1.2 PureTech 100** 6MT; **Hybrid 110** 48V e-DCT (2025).
- **e-C3 44 kWh** LFP: 83 kW / 111 bhp, 0-62 11.0 s, 199 mi, DC 100 kW, boot 310 L.
- Sources: [Citroen UK](https://www.citroen.co.uk/models/e-c3.html), [EV Database e-C3](https://ev-database.org/uk/car/2189/Citroen-e-C3)

### C3 Aircross / e-C3 Aircross (2024 gen) — boot 460 L, 7-seat option (ICE/hybrid only)
- **1.2 PureTech 100**; **Hybrid 145** (UK material also references "Hybrid 136" revised output — CONFLICT flagged).
- **e-C3 Aircross 44 kWh**: 111 bhp, 188 mi. 54 kWh Extended Range (~247 mi) announced for later.
- Sources: [Parkers](https://www.parkers.co.uk/citroen/e-c3/aircross-2025/specs/), [Autocar](https://www.autocar.co.uk/car-review/citroen/e-c3-aircross/specs), [CarsUK pricing article](https://www.carsuk.net/new-citroen-c3-aircross-and-electric-e-c3-aircross-uk-specs-and-pricing-announced/)

---

## Ford (3 models)

### Explorer EV (2024–) — MEB-based, boot 470 L
- **Standard Range RWD** 52 kWh usable: 125 kW / 168 bhp, 239 mi, DC 125 kW.
- **Extended Range RWD** 77 kWh usable: 210 kW / 282 bhp, 0-62 6.4 s, 374 mi, DC 135 kW.
- **Extended Range AWD** 79 kWh usable: 250 kW / 335 bhp, 0-62 5.3 s, 329 mi, DC 185 kW.
- Sources: [Ford UK](https://www.ford.co.uk/cars/explorer), EV Database entries per variant (in JSON).

### Capri EV (2024–) — coupe sibling, boot 572 L
- **Extended Range RWD** (282 bhp, 390 mi), **Extended Range AWD** (335 bhp, 346 mi), **Standard Range RWD** added 2025 (~243 mi — verify UK availability).
- Sources: [Ford UK](https://www.ford.co.uk/cars/capri), [EV Database](https://ev-database.org/uk/car/2216/Ford-Capri-Extended-Range-RWD)

### Puma Gen-E (2025–)
- 43.6 kWh usable, 123 kW / 166 bhp, 290 Nm, FWD, 0-62 8.0 s, 259 mi Select / 251 mi Premium (early material said 233 mi — figure was revised up), DC 100 kW, boot 523 L (Gigabox) + 43 L frunk.
- Sources: [Ford UK](https://www.ford.co.uk/cars/puma-gen-e), [Auto Express](https://www.autoexpress.co.uk/ford/puma/gen-e), [InsideEVs](https://insideevs.com/news/742709/ford-puma-gen-e-electric-specs-range-battery/)

---

## Kia (3 models) — Sportage 2025 facelift skipped per brief

### EV3 (2024–): 150 kW / 201 bhp FWD; **58.3 kWh** (270 mi, DC 102 kW) and **81.4 kWh** (375 mi, DC 128 kW). Boot 460 L.
- Sources: [Kia UK](https://www.kia.com/uk/new-cars/ev3/), [Wikipedia EV3](https://en.wikipedia.org/wiki/Kia_EV3)

### EV4 (2025–, UK-relevant hatch built in Slovakia): 150 kW FWD; **58.3 kWh** (273 mi) and **81.4 kWh** (388 mi hatch / 391 mi saloon).
- Sources: [Kia UK](https://www.kia.com/uk/new-cars/ev4/), [DriveElectric](https://www.drive-electric.co.uk/news/kia-ev4-spec-and-pricing-revealed/)

### EV5 (2025–): 81.4 kWh, 160 kW / 214 bhp FWD, 329 mi (313 mi higher trims), boot 566 L. Orders from July 2025.
- Sources: [Kia UK](https://www.kia.com/uk/new-cars/ev5/), [carwow](https://www.carwow.co.uk/kia/ev5)

---

## Hyundai (2 models)

### Inster (2025–) — city EV, 4 seats
- **42 kWh**: 71.1 kW / 95 bhp, 0-62 11.7 s, 203 mi. **49 kWh Long Range**: 84.5 kW / 113 bhp, 0-62 10.6 s, 229 mi. Both 147 Nm, DC 85 kW. From £23,495.
- Sources: [Hyundai UK press](https://www.hyundai.news/uk/articles/press-releases/all-new-inster-pricing-and-specification.html), [Auto Express](https://www.autoexpress.co.uk/hyundai/inster)

### Ioniq 9 (2025–) — 7-seat flagship, 110.3 kWh, 800V, DC 233 kW
- **LR RWD 218PS** (385 mi), **LR AWD 307PS** (0-62 6.7 s), **Performance AWD 427PS** (0-62 5.2 s). From £64,995.
- GAP: exact UK WLTP for AWD/Performance not captured.
- Sources: [Hyundai UK press](https://www.hyundai.news/uk/articles/press-releases/ioniq-9-pricing-specs-tech-0725.html), [electrive](https://www.electrive.com/2025/07/15/hyundai-reveals-ioniq-9-uk-pricing-and-specs/)

---

## Honda (2 models)

### e:Ny1 — CHECK ITEM: launched 2023 (pre-snapshot), likely already in dataset. One variant included for completeness (68.8 kWh, 150 kW, 256 mi).
### Prelude (2026) — UK spec published late 2025: 2.0 e:HEV, 135 kW / 181 bhp, 315 Nm, e-CVT, 0-62 8.2 s, 2-door 4-seat coupe.
- Sources: [Honda EU UK tech spec](https://hondanews.eu/eu/el/cars/media/pressreleases/553086/2026-honda-prelude-coupe-ehev-technical-specification-uk), [Autocar](https://www.autocar.co.uk/car-review/honda/prelude)

---

## Toyota (2 models)

### Urban Cruiser (UK on sale Dec 2025, deliveries Q1 2026) — eVitara twin
- **49 kWh FWD** (142 bhp, 214 mi), **61 kWh FWD** (172 bhp, 264 mi), **61 kWh AWD** (181 bhp — UK availability TBC). DC 67 kW. From £29,995.
- Sources: [Toyota UK media](https://media.toyota.co.uk/the-all-new-toyota-urban-cruiser-uk-sales-launch/), [EV Database](https://ev-database.org/uk/car/3209/Toyota-Urban-Cruiser-611-kWh)

### C-HR+ (UK Q4 2025) — dedicated BEV
- **57.7 kWh FWD** (165 bhp, 283 mi), **77 kWh FWD** (221 bhp, 378 mi), **77 kWh AWD** (338 bhp, 0-62 5.2 s). DC 150 kW.
- Sources: [Toyota UK media](https://media.toyota.co.uk/the-all-new-battery-electric-toyota-c-hr/)

---

## Nissan (3 models)

### Micra EV (2025–) — Renault 5 twin
- **40 kWh** (121 bhp, 198 mi, DC 80 kW), **52 kWh** (148 bhp, 260 mi, DC 100 kW). From £22,995.
- Sources: [The Car Expert](https://www.thecarexpert.co.uk/nissan-micra-2025/), [EV Database 52 kWh](https://ev-database.org/car/3203/Nissan-Micra-Extended-Range-52-kWh)

### Leaf 3rd gen (2025–) — Sunderland-built coupe-crossover
- **52 kWh** (174 bhp, 271 mi) and **75 kWh** (215 bhp, up to 386 mi, DC 150 kW).
- **CONFLICT**: some outlets describe "60 kWh LFP / 265 mi" and "87 kWh / 340 mi" packs — treated as non-UK/erroneous; UK spec is 52/75 kWh.
- Sources: [Nissan Europe press](https://europe.nissannews.com/en-GB/releases/an-electrifying-2025-ahead-for-nissan-return-of-micra-as-an-ev-third-generation-leaf-to-launch-and-updated-e-power-for-qashqai), [Nissan UK](https://www.nissan.co.uk/vehicles/new-vehicles/leaf.html)

### Qashqai e-Power (2025 update)
- 3rd-gen e-Power: 1.5 3-cyl generator + 151 kW / 201 bhp motor (205 PS Sport mode), 330 Nm, 0-62 7.9 s, 62.8 mpg, CO2 102 g/km.
- Sources: [Nissan Europe press](https://europe.nissannews.com/en-GB/releases/an-electrifying-2025-ahead-for-nissan-return-of-micra-as-an-ev-third-generation-leaf-to-launch-and-updated-e-power-for-qashqai), [Auto Express](https://www.autoexpress.co.uk/nissan/qashqai/e-power)

---

## Known gaps & conflicts summary

| Item | Issue |
|---|---|
| MG HS PHEV | System power quoted 272–307 PS across sources; 302 bhp used |
| MG IM6 Performance | WLTP range not confirmed |
| Tesla Model Y | No official motor outputs; kW figures estimated. LR AWD range 364 vs 372 mi |
| Tesla Model 3 Highland Performance | Pre-Oct-2024 launch — verify already in dataset, not researched |
| Vauxhall Frontera Electric | 0-62 quoted 12.1–13.0 s |
| Vauxhall Grandland PHEV | Battery 13.2 vs 17.9 kWh across sources |
| Vauxhall Grandland 97 kWh | Power output approximate |
| Citroen C3 Aircross | "Hybrid 145" vs "Hybrid 136" naming/output |
| Suzuki eVitara / Toyota Urban Cruiser | Peak DC rate (~67-70 kW) and 0-62 times patchy |
| Hyundai Ioniq 9 | AWD/Performance UK WLTP ranges not captured |
| Nissan Leaf | Conflicting 60/87 kWh pack claims; 52/75 kWh used |
| DS 4 / DS 7 refresh | Not researched (time-boxed; carried-over powertrains) |
| Polestar 3 MY26 | New 92/106 kWh packs + 680 bhp variant announced late 2025 — separate refresh, launch specs recorded here |
| MpgFigures for some ICE models | CO2/mpg nulled where sources disagreed or were unpublished |
