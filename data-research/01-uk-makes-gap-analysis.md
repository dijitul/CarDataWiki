# UK Makes Gap Analysis — CarData.Wiki

**Date:** 2026-07-23
**Current dataset:** [ilyasozkurt/automobile-models-and-specs](https://github.com/ilyasozkurt/automobile-models-and-specs) — 124 brands, scraped from autoevolution.com. **Data last updated 2024-10-23** (verified via commit history of `automobiles.csv.zip`). Everything launched after ~October 2024 is absent, even for brands that are present.

---

## 1. Executive summary

- The dataset is fresher than expected (it includes MG4, MG3 Hybrid+, Tesla Model 3 Highland, Smart #1/#5, Cupra Terramar/Tavascan, Fisker Ocean, XPeng G6). The dominant problem is **entire missing makes**, not stale legacy data.
- **~20 makes currently on sale in the UK are missing entirely**, headed by the high-volume Chinese entrants: **BYD, Omoda, Jaecoo, Chery, KGM, GWM (Ora/Haval), Leapmotor, Maxus, Changan (Deepal), Skywell, Abarth, LEVC, Farizon**, plus niche UK makers (BAC, Ginetta, Munro, Noble, David Brown, JAC, Praga).
- **2 more launch in 2026:** Denza (BYD premium) and Firefly (NIO).
- **1 major historic UK gap:** **Rover** (1990–2005 volume brand) is completely absent — critical for a 1990–2026 UK database. Westfield, Marcos, Jensen, Yugo and Austin are also absent (lower priority).
- Several present brands are **materially outdated for the UK**: MG (missing MGS5 EV, new HS, ZS Hybrid+, Cyberster, IM5/IM6), SsangYong (no KGM rebrand, no Torres/Torres EVX/Actyon/Musso EV), Isuzu (no 2021+ D-Max), Geely (only 2005–2011 China-market models, no EX5), Subaru (no Crosstrek/new Forester), plus all post-Oct-2024 launches across every brand (Tesla Model Y "Juniper", Dacia Bigster, DS N°8, Polestar 5, Skoda Elroq, Alpine A290/A390, Suzuki eVitara, Renault 4, Smart #3, INEOS Quartermaster…).
- ~25 dataset brands are **US/other-market only** and low priority for UK (Pontiac, Mercury, Eagle, Oldsmobile, GMC, RAM, Holden, Maruti Suzuki, etc.).

---

## 2. Brands in the current dataset (124)

AC, Acura, Alfa Romeo, Alpine, Ariel, ARO, Artega, Aston Martin, Audi, Aurus, Bentley, BMW, Bristol, Bufori, Bugatti, Buick, Cadillac, Caterham, Chevrolet, Chrysler, Citroen, Cupra, Dacia, Daewoo, Daihatsu, Datsun, DeLorean, Dodge, Donkervoort, DR Motor, DS Automobiles, Eagle, Ferrari, Fiat, Fisker, Ford, FSO, Geely, Genesis, GMC, Gordon Murray Automotive, GTA Motor, Hindustan, Holden, Honda, Hummer, Hyundai, INEOS, Infiniti, Isuzu, Jaguar, Jeep, Karma, Kia, Koenigsegg, KTM, Lada, Lamborghini, Lancia, Land Rover, Lexus, Lightyear, Lincoln, Lotus, Lucid Motors, Mahindra, Marussia, Maruti Suzuki, Maserati, Maybach, Mazda, McLaren, Mercedes-Benz, Mercedes-AMG, Mercury, MG, MINI, Mitsubishi, Morgan, NIO, Nissan, Oldsmobile, Opel, Pagani, Panoz, Perodua, Peugeot, Pininfarina, Plymouth, Polestar, Pontiac, Porsche, Proton, Qoros, RAM Trucks, Renault, Rimac, Rivian, Rolls-Royce, Saab, Saleen, Samsung, Santana, Saturn, Scion, SEAT, Skoda, Smart, Spyker, SsangYong, Subaru, Suzuki, Tata Motors, Tesla, Toyota, TVR, Vauxhall, VinFast, Volkswagen, Volvo, Wiesmann, XPeng, Zender, Zenvo

---

## 3. Master table — UK-market makes (1990–2026)

Status key: **On sale** = new cars sold in UK now (mid-2026). **In dataset:** Yes / **NO** / Outdated (present but missing UK-critical current models).

### Currently on sale in the UK

| Make | Origin | UK status | In dataset? |
|---|---|---|---|
| Abarth | Italy | On sale (500e, 600e) | **NO** |
| Alfa Romeo | Italy | On sale | Yes |
| Alpine | France | On sale | Outdated (missing A290, A390) |
| Ariel | UK | On sale (niche) | Yes |
| Aston Martin | UK | On sale | Yes |
| Audi | Germany | On sale | Yes |
| BAC | UK | On sale (niche) | **NO** |
| Bentley | UK | On sale | Yes |
| BMW | Germany | On sale | Yes |
| BYD | China | On sale — top-10 UK brand by volume | **NO** |
| Caterham | UK | On sale | Yes |
| Changan (Deepal) | China | On sale (S07 2025, S05 Mar 2026) | **NO** |
| Chery | China | On sale (launched 2025) | **NO** |
| Citroen | France | On sale | Yes |
| Cupra | Spain | On sale | Yes (fairly current) |
| Dacia | Romania | On sale | Outdated (missing Bigster) |
| David Brown Automotive | UK | On sale (niche) | **NO** |
| Denza | China (BYD) | Launching mid-2026 (Z9GT) | **NO** |
| DS Automobiles | France | On sale | Outdated (missing N°8) |
| Farizon | China (Geely) | On sale (SV electric van, 2025) | **NO** |
| Ferrari | Italy | On sale | Yes |
| Fiat | Italy | On sale | Yes |
| Firefly (NIO) | China | Launching 2026 | **NO** |
| Ford | US/Europe | On sale | Yes (missing post-Oct-24: Puma Gen-E etc.) |
| Geely | China | On sale (EX5, launched late 2025) | Outdated — only 2005–2011 China-market models |
| Genesis | South Korea | On sale | Yes (fairly current) |
| Ginetta | UK | On sale (niche) | **NO** |
| Gordon Murray Automotive | UK | On sale (niche) | Yes |
| GWM (Ora / Haval) | China | On sale (Ora 03, Haval Jolion Pro, H6 GT PHEV; Tank/Poer coming) | **NO** |
| Honda | Japan | On sale | Yes |
| Hyundai | South Korea | On sale | Yes |
| INEOS | UK | On sale | Outdated (missing Quartermaster pickup) |
| Isuzu | Japan | On sale (D-Max) | Outdated — missing 2021+ D-Max generation |
| Jaecoo | China (Chery) | On sale — Jaecoo 7 a 2026 top-3 seller | **NO** |
| Jaguar | UK | Paused; EV relaunch 2026 | Yes |
| JAC | China | On sale (T9 pickup, niche) | **NO** |
| Jeep | US | On sale | Yes |
| KGM (ex-SsangYong) | South Korea | On sale (rebranded 2024) | **NO** as KGM; SsangYong present but missing Torres, Torres EVX, Actyon, Musso EV |
| Kia | South Korea | On sale | Yes |
| Lamborghini | Italy | On sale | Yes |
| Land Rover | UK | On sale | Yes |
| Leapmotor | China (Stellantis) | On sale (launched 2025) | **NO** |
| LEVC | UK (Geely) | On sale (TX taxi, VN5 van) | **NO** |
| Lexus | Japan | On sale | Yes |
| Lotus | UK | On sale | Yes |
| Maserati | Italy | On sale | Yes |
| Maxus | China (SAIC) | On sale (vans + pickup + MPV) | **NO** |
| Mazda | Japan | On sale | Yes |
| McLaren | UK | On sale | Yes |
| Mercedes-Benz | Germany | On sale | Yes |
| MG | China (SAIC) / UK heritage | On sale — top-10 UK brand | **Outdated** — missing MGS5 EV, HS Mk2, ZS Hybrid+, Cyberster, IM5, IM6 |
| MINI | UK/Germany | On sale | Yes |
| Morgan | UK | On sale | Yes |
| Munro | UK (Scotland) | On sale (niche EV 4x4) | **NO** |
| Nissan | Japan | On sale | Yes |
| Noble | UK | On sale (niche) | **NO** |
| Omoda | China (Chery) | On sale — Omoda 5 a 2026 top-10 seller | **NO** |
| Peugeot | France | On sale | Yes |
| Polestar | Sweden/China | On sale | Outdated (missing Polestar 5) |
| Porsche | Germany | On sale | Yes |
| Praga | Czech/UK ops | On sale (Bohema, niche) | **NO** |
| Renault | France | On sale | Yes (missing Renault 4 E-Tech) |
| Rolls-Royce | UK | On sale | Yes |
| SEAT | Spain | On sale (winding down) | Yes |
| Skoda | Czech Republic | On sale | Yes (missing Elroq) |
| Skywell | China | On sale (BE11, relaunched 2026) | **NO** |
| Smart | Germany/China | On sale (#1, #3, #5) | Outdated (has #1 and #5, missing #3) |
| Subaru | Japan | On sale | Outdated (missing Crosstrek, 2025 Forester) |
| Suzuki | Japan | On sale | Yes (missing eVitara) |
| Tesla | US | On sale | Outdated (missing 2025 Model Y "Juniper") |
| Toyota | Japan | On sale | Yes |
| Vauxhall | UK | On sale | Yes |
| Volkswagen | Germany | On sale | Yes |
| Volvo | Sweden | On sale | Yes |
| XPeng | China | On sale (G6; X9 & G9 due 2026) | Yes (China models; UK-spec updates missing) |

### Departed / historic UK makes (1990–2026)

| Make | Origin | UK status | In dataset? |
|---|---|---|---|
| Rover | UK | Departed 2005 (MG Rover collapse) | **NO — biggest historic gap** |
| Austin | UK | Departed ~1989 (pre-scope, marginal) | **NO** |
| Saab | Sweden | Departed 2011 | Yes |
| Daewoo | South Korea | Rebranded Chevrolet 2004 | Yes |
| Daihatsu | Japan | Departed 2011 | Yes |
| Proton | Malaysia | Departed 2014 | Yes |
| Perodua | Malaysia | Departed ~2008 | Yes |
| Lada | Russia | Departed 1997 | Yes |
| FSO | Poland | Departed ~1993 | Yes |
| Yugo (Zastava) | Yugoslavia | Departed 1992 | **NO** (marginal) |
| Chevrolet (Europe) | US/Korea | Departed 2015 | Yes |
| Lancia | Italy | Departed 1994 | Yes |
| Mitsubishi | Japan | Departed 2021 (new sales) | Yes |
| Infiniti | Japan | Departed 2019 | Yes |
| SsangYong | South Korea | Rebranded KGM 2024 | Yes (as SsangYong) |
| Fisker | US | Departed 2024 (bankrupt; Ocean was UK-sold) | Yes |
| VinFast | Vietnam | UK launch cancelled; VinFast UK closed | Yes |
| Chrysler | US | Departed 2015 | Yes |
| Dodge | US | Departed ~2010 | Yes |
| Hummer | US | Departed ~2009 | Yes |
| Cadillac | US | Sporadic UK sales | Yes |
| TVR | UK | Dormant | Yes |
| Bristol | UK | Defunct 2020 | Yes |
| Westfield | UK | Defunct 2023 | **NO** |
| Marcos | UK | Defunct 2007 | **NO** |
| Jensen | UK | Defunct (2002 revival attempt) | **NO** |
| Radford | UK | Dormant (Type 62-2) | **NO** |
| Alpina | Germany | Separate sales ended 2025 (absorbed by BMW) | **NO** |

### Watchlist (announced / rumoured UK entrants)

Zeekr (Geely premium EV), Xiaomi, Hongqi, GWM Tank/Poer/Wey sub-brands, BYD Yangwang, NIO main brand (after Firefly). None in dataset.

---

## 4. Prioritized missing brands with current UK lineups

Priority = UK sales volume now, highest first. Body/fuel per variant.

### P1 — High-volume brands on sale now (missing entirely)

**1. BYD** (China) — top-10 UK brand, fastest-growing marque
| Model | Body | Fuel |
|---|---|---|
| Dolphin Surf | City hatchback | EV |
| Dolphin | Hatchback | EV |
| Atto 2 | Small SUV | EV |
| Atto 3 / Atto 3 EVO | SUV | EV |
| Seal | Saloon | EV |
| Seal U DM-i | SUV | PHEV |
| Seal 6 DM-i / DM-i Touring | Saloon / Estate | PHEV |
| Sealion 7 | SUV coupe | EV |
| (Due 2026: Sealion 5 DM-i SUV PHEV, Sealion 8 large SUV, Shark 6 pickup PHEV, Dolphin G) | | |

**2. Jaecoo** (China, Chery group) — Jaecoo 7 was a UK top-3 seller in 2026
| Model | Body | Fuel |
|---|---|---|
| Jaecoo 7 | SUV | Petrol / PHEV (SHS-P) / HEV (SHS-H) |
| Jaecoo 5 | Compact SUV | Petrol / HEV / EV |
| Jaecoo 8 | Large SUV (5/7-seat) | PHEV (SHS-P) |

**3. Omoda** (China, Chery group) — Omoda 5 a UK top-10 seller
| Model | Body | Fuel |
|---|---|---|
| Omoda 5 | SUV | Petrol / HEV (SHS-H) |
| Omoda E5 | SUV | EV |
| Omoda 9 | Large SUV | PHEV (SHS-P) |
| Omoda 7 (Q2 2026) | SUV | PHEV / Petrol |

**4. MG-adjacent note** — MG itself is present but see Section 5 (outdated).

**5. KGM** (South Korea; SsangYong rebrand 2024)
| Model | Body | Fuel |
|---|---|---|
| Tivoli | Small SUV | Petrol |
| Korando | SUV | Petrol |
| Torres | SUV | Hybrid |
| Torres EVX | SUV | EV |
| Actyon | SUV coupe | Hybrid |
| Rexton | Large 7-seat SUV | Diesel |
| Musso / Musso Saracen | Pickup | Diesel |
| Musso EV | Pickup | EV |
| (Musso Rhino pickup new for 2026) | | |

**6. Chery** (China) — launched UK 2025
| Model | Body | Fuel |
|---|---|---|
| Tiggo 4 | Small SUV | Petrol / HEV (CSH) |
| Tiggo 7 | SUV | Petrol / PHEV |
| Tiggo 8 | 7-seat SUV | Petrol / PHEV |
| Tiggo 9 | Large SUV | PHEV |

**7. Leapmotor** (China, Stellantis-distributed) — launched UK 2025
| Model | Body | Fuel |
|---|---|---|
| T03 | City hatchback | EV (UK's cheapest new car, £12,995) |
| B10 | Compact SUV | EV (REEV hybrid due summer 2026) |
| C10 | Mid-size SUV | EV / REEV |
| B05 (mid-2026) | Hatchback | EV |

**8. GWM** (China)
| Model | Body | Fuel |
|---|---|---|
| Ora 03 (ex-Funky Cat) | Hatchback | EV |
| Haval Jolion Pro | SUV | HEV |
| Haval H6 GT PHEV | SUV coupe | PHEV |
| (Tank 300 off-roader, Poer/Cannon pickup, Wey models due) | | |

**9. Maxus** (China, SAIC) — LCV specialist + MPV
| Model | Body | Fuel |
|---|---|---|
| eDeliver 3 / 5 / 7 / 9 | Vans | EV |
| Deliver 9 | Large van | Diesel |
| T60 | Pickup | Diesel |
| T90EV | Pickup | EV |
| Mifa 9 | Large MPV | EV |

**10. Changan / Deepal** (China) — launched UK 2025
| Model | Body | Fuel |
|---|---|---|
| Deepal S07 | Mid-size SUV | EV |
| Deepal S05 (Mar 2026) | Compact SUV | EV |

**11. Abarth** (Italy, Stellantis) — long-standing UK brand, absent entirely
| Model | Body | Fuel |
|---|---|---|
| 500e / 500e Cabrio | Hot hatch | EV |
| 600e | Small SUV | EV |
| 595 / 695 (historic, to 2024) | Hot hatch | Petrol |

**12. Skywell** (China, via Innovation Automotive)
| Model | Body | Fuel |
|---|---|---|
| BE11 (relaunched 2026, £31,990) | Mid-size SUV | EV |

**13. LEVC** (UK, Geely-owned, Coventry-built)
| Model | Body | Fuel |
|---|---|---|
| TX | Taxi | Range-extender EV |
| VN5 | Van | Range-extender EV |

**14. Farizon** (China, Geely; via Jameel Motors) — launched UK 2025
| Model | Body | Fuel |
|---|---|---|
| SV (incl. SV Sport, Core trims) | Large van | EV |

**15. Geely** (present in dataset but only 2005–2011 China models)
| Model | Body | Fuel |
|---|---|---|
| EX5 (on sale, from £31,990) | Mid-size SUV | EV |

### P2 — Launching 2026

- **Denza** (BYD premium): Z9GT (shooting brake, EV + PHEV) mid-2026; D9 MPV likely to follow.
- **Firefly** (NIO): premium compact hatchback, EV; RHD confirmed, UK 2026.

### P3 — Niche UK manufacturers missing

- **BAC**: Mono / Mono R (single-seat track car, petrol)
- **Ginetta**: G40, G56 (sports/track, petrol)
- **Munro** (Scotland): MK_1 / M-Series (utility off-roader, EV)
- **Noble**: M500 (supercar, petrol)
- **David Brown Automotive**: Speedback GT, Mini Remastered (coachbuilt, petrol)
- **JAC**: T9 (pickup, diesel)
- **Praga**: Bohema (hypercar, petrol)
- **Radford**: Type 62-2 (sports, petrol) — dormant
- **Alpina**: B3/B4/B5/B8/D3/D4/XB7 etc. (performance saloons/SUVs, petrol/diesel) — sold UK until 2025

### P4 — Historic UK gaps (for 1990–2026 completeness)

- **Rover** (critical): Metro/100, 200, 400, 25, 45, 75, 600, 800, Streetwise, CityRover — hatch/saloon/estate, petrol/diesel. The dataset's MG brand covers MG ZR/ZS/ZT (rebadged Rovers) but the Rover-badged volume cars are absent.
- **Westfield** (kits/sports, defunct 2023), **Marcos**, **Jensen** (S-V8), **Yugo/Zastava** (Sana/Tempo, to 1992), **Austin** (Metro/Maestro/Montego, to 1989).

---

## 5. Present but outdated — UK-critical refresh list

All brands lack post-October-2024 models. The worst UK-relevant offenders:

| Brand | Missing UK-relevant models (examples) |
|---|---|
| **MG** | MGS5 EV (SUV, EV), HS Mk2 (SUV, petrol/PHEV), ZS Hybrid+ (SUV, HEV), Cyberster (roadster, EV), IM5 (saloon, EV), IM6 (SUV, EV). Dataset stops at 2019 HS / MG4 / 2025 MG3 Hybrid+ |
| **SsangYong/KGM** | Torres (HEV), Torres EVX (EV), Actyon (HEV), Musso EV, Musso Rhino — and the KGM rebrand itself |
| **Isuzu** | Current-gen D-Max (2021+, diesel pickup) — dataset stops at 2016 AT35 |
| **Geely** | EX5 (EV SUV) — dataset has only 2005–2011 China-market cars |
| **Subaru** | Crosstrek, Forester (2025), current Outback |
| **Tesla** | Model Y "Juniper" (2025) |
| **Smart** | #3 (SUV coupe, EV) — #1 and #5 are present |
| **Polestar** | Polestar 5 (GT, EV) |
| **DS** | N°8 (SUV coupe, EV) |
| **Dacia** | Bigster (SUV, HEV/petrol) |
| **Alpine** | A290 (hot hatch, EV), A390 (SUV, EV) |
| **INEOS** | Quartermaster (pickup, petrol/diesel) |
| **Skoda** | Elroq (SUV, EV) |
| **Suzuki** | eVitara (SUV, EV) |
| **Renault** | Renault 4 E-Tech (SUV, EV) |
| **XPeng** | UK-spec G6 refresh (Q1 2026), X9 (MPV, EV, mid-2026), G9 |
| **Ford / Vauxhall / VW / Toyota etc.** | All post-Oct-2024 launches (Puma Gen-E, Frontera, ID.7 Tourer, Urban Cruiser, etc.) |

---

## 6. Low-priority brands in dataset (US/other-market, little/no UK relevance)

Keep but deprioritize:

- **US-only:** Acura, Buick, Eagle, GMC, Karma, Lincoln, Mercury, Oldsmobile, Plymouth, Pontiac, RAM Trucks, Saturn, Scion, Saleen, Panoz, DeLorean, Rivian (no UK RHD sales), Lucid (not yet UK)
- **Other markets:** Holden (Australia), Hindustan & Maruti Suzuki & Mahindra & Tata (India; Tata had minor 1990s UK sales), Samsung (Renault Samsung, Korea), Qoros & Aurus (China/Russia), DR Motor (Italy), Santana (Spain), ARO (Romania; trace UK imports), Bufori, GTA Motor, Marussia, Artega, Zender, Lightyear (defunct)
- **Historic UK importers worth keeping for 1990s coverage:** Daewoo, Daihatsu, Proton, Perodua, Lada, FSO, Datsun (pre-1984)
- **Low-volume UK-sold exotics (keep):** Koenigsegg, Pagani, Bugatti, Rimac, Spyker, Wiesmann, Zenvo, KTM (X-Bow), Donkervoort

---

## 7. Sources

- Dataset: [ilyasozkurt/automobile-models-and-specs](https://github.com/ilyasozkurt/automobile-models-and-specs) — `brands.csv` + `automobiles.csv` extracted from `automobiles.csv.zip`; GitHub API commit history (data files last updated 2024-10-23; scrape source autoevolution.com)
- BYD UK range: [The Electric Car Scheme](https://www.electriccarscheme.com/blog/byd-electric-cars-uk-atto-dolphin-seal-guide-2026), [Auto Express](https://www.autoexpress.co.uk/byd/368822/byds-new-car-blitz-just-getting-started-dolphin-g-sealion-8-shark-6-due-soon), [Autocar](https://www.autocar.co.uk/car-news/new-cars/byd-launch-uks-first-plug-hybrid-supermini-2026)
- Omoda/Jaecoo: [omodaauto.co.uk registrations news](https://omodaauto.co.uk/news/omoda-jaecoo-uk-april-registrations-2026/), [jaecoo.co.uk](https://jaecoo.co.uk/), [CarGurus UK](https://www.cargurus.co.uk/research/articles/best-jaecoo-and-omoda-cars-and-suvs)
- KGM: [Carwow](https://www.carwow.co.uk/kgm-motors), [TC Harrison lineup guide](https://www.tch.co.uk/help-insights/support-guides/kgm-model-lineup/), [KGM media site](https://kgm-motors.media/releases/304)
- Leapmotor: [Leapmotor UK](https://www.leapmotor.net/uk/leapmotor-models), [Stellantis Media](https://www.media.stellantis.com/uk-en/leapmotor/press), [Fleet Evolution](https://fleetevolution.com/leapmotor-ev-t03-b10-c10-b05-b03x/)
- GWM: [Autocar Jolion Pro review](https://www.autocar.co.uk/car-review/gwm/haval-jolion-pro), [Motor1 Tank/Poer/Haval UK](https://www.motor1.com/news/749634/tank-poer-haval-uk-launch-rumours/), [Fleet News Ora rebrand](https://www.fleetnews.co.uk/news/gwm-ora-to-rebrand-as-it-prepares-to-expand-model-line-up-with-luxury-hybrid)
- XPeng: [XPeng UK 2026 roadmap](https://xpengcars.co.uk/2026/01/xpeng-accelerates-its-2026-product-roadmap-as-the-uk-market-grows/), [Autocar](https://www.autocar.co.uk/car-news/new-cars/xpeng-bring-seven-seat-x9-starship-and-g9-uk-2026)
- Chery: [The Car Expert Tiggo 4](https://www.thecarexpert.co.uk/chery-tiggo-4-2026/), [Honest John](https://www.honestjohn.co.uk/news/new-cars/2026-03/2026-chery-tiggo-4/)
- Denza: [Electrifying](https://www.electrifying.com/blog/article/denza-z9gt-price-range-specs-uk), [Fleet News](https://www.fleetnews.co.uk/news/denza-z9gt), [Denza UK](https://www.denza.com/uk)
- Geely EX5: [The Interface](https://theinterface.uk/blog-posts/all-electric-geely-ex5-now-on-sale-in-the-uk-from-ps31-990-and-8-year-warranty), [Geely Auto UK](https://www.geelyauto.co.uk/geely-ex5)
- Changan Deepal: [Autocar S07 review](https://www.autocar.co.uk/car-review/changan/deepal-s07), [Auto Express S05](https://www.autoexpress.co.uk/changan/369248/new-changan-deepal-s05-2026-uk-pictures)
- Skywell: [AM Online BE11 relaunch](https://www.am-online.com/news/skywell-relaunches-be11-with-adas-upgrade-and-5-000-price-cut), [Skywell UK](https://skywell-uk.com/news/introducing-the-new-2026-be11/)
- Farizon: [AM Online](https://www.am-online.com/news/farizon-adds-sport-version-to-sv-electric-van-range), [Farizon UK](https://farizonauto.co.uk/news/first-batch-of-farizon-sv-vans-land-in-uk)
- NIO Firefly: [Autocar](https://www.autocar.co.uk/car-news/new-cars/nio-confirms-firefly-hatchback-2026-uk-launch), [AM Online](https://www.am-online.com/news/chinese-brand-nio-paves-way-for-uk-launch-with-rhd-firefly)
- MG IM5/IM6/MGS5: [Fleet World first drive](https://fleetworld.co.uk/first-drive-mg-im5-and-im6/), [MG Motor UK](https://www.mg.co.uk/media-centre/mg-surges-future-goodwood-festival-speed), [cinch MG guide](https://www.cinch.co.uk/guides/choosing-a-car/mg-models-explained)
- Maxus: [Rygor Maxus range](https://www.rygor-maxus.co.uk/range/), [Autocar Mifa 9](https://www.autocar.co.uk/car-review/maxus/mifa-9)
- VinFast UK cancellation: [Fleet News](https://www.fleetnews.co.uk/news/vinfast-abandons-uk-launch-plans), [The Interface](https://theinterface.uk/blog-posts/vinfast-uk-launch-postponed-until-further-notice)
