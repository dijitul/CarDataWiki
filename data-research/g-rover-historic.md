# Rover (1986–2005) — Historic UK Range Research

Research date: 2026-07-23. Sources: Wikipedia model pages (fetched), Parkers spec pages (fetched, 25/45/75/Streetwise). MGF/MG TF excluded (covered under MG). Companion JSON: `g-rover-historic.json`.

**Global caveats / gaps**
- **CO2 g/km**: not captured — Parkers pages fetched did not expose CO2 and pre-2001 cars mostly pre-date mandatory publication. Recommend a follow-up pass against VCA carfueldata for 25/45/75/Streetwise/CityRover (2001+). All `co2Gkm` = null.
- Acceleration figures are UK-published **0–60 mph** times (recorded in `acceleration0100` as the closest equivalent, ~0.2s optimistic vs true 0–100 km/h).
- Kerb weights and boot volumes are patchy in the fetched sources; nulled where not confirmed. Torque figures marked (≈) are from well-documented engine-family data rather than the fetched page.
- Body-colour/trim-level proliferation (i/Si/SLi/GSi etc.) collapsed into engine variants — trim does not change homologation specs.

---

## 1. Metro / Rover 100 (1990–1997)

Supermini, 3/5-door hatchback, FWD. L 3403 / W 1549 / H 1372 / WB 2269 mm. Renamed **Rover 100** late 1994. Rover/PSA end-on gearboxes; CVT auto optional on 1.4. Sources: https://en.wikipedia.org/wiki/Rover_Metro

| Variant | Years | Engine | cc | Power | Torque | Notes |
|---|---|---|---|---|---|---|
| 1.1 (111) | 1990–1997 | K-series K8 8v | 1120 | 60 bhp | 90 Nm | 5MT |
| 1.4 (114) 8v | 1990–1997 | K8 8v | 1396 | 76 bhp | 117 Nm | 5MT or CVT; 105 mph, 0-60 ~10.5s (Wikipedia) |
| 1.4 GTi 16v SPi | 1990–1992 | K16 | 1396 | 95 bhp | 124 Nm | 0-60 9.6s, 113 mph |
| 1.4 GTi/GTa 16v MPi | 1992–1997 | K16 | 1396 | 103 bhp | 124 Nm | 0-60 8.6s, 116 mph (Wikipedia figure) |
| 1.4 D | 1992–1994 | PSA TUD3 | 1360 | 53 bhp | 83 Nm (≈) | |
| 1.5 D (115) | 1994–1997 | PSA TUD5 | 1527 | 57 bhp | 95 Nm | 0-60 15.3s, 96 mph, 56 mpg |

Gaps: kerb weights (~815–895 kg range, unverified), boot volume, CO2 (pre-2000, never published).

## 2. Rover 200 R8 (1989–1995)

Small family hatch (3/5-dr) + Coupe ("Tomcat") + Cabriolet. FWD. L 4220 / W 1680 / H 1385 / WB 2550 mm. Honda Concerto platform. Sources: https://en.wikipedia.org/wiki/Rover_200_/_25

| Variant | Years | Engine | cc | Power | Torque | Notes |
|---|---|---|---|---|---|---|
| 214 1.4 16v SPi | 1989–1992 | K16 | 1396 | 94 bhp | 122 Nm (≈) | |
| 214 1.4 16v MPi | 1992–1995 | K16 | 1396 | 102 bhp | 123 Nm | |
| 216 1.6 16v | 1989–1995 | Honda D16A6 SOHC | 1590 | 110 bhp (≈) | 135 Nm (≈) | auto available (Honda 4AT) |
| 216 GTi 1.6 16v | 1990–1994 | Honda D16A8 DOHC | 1590 | 128 bhp | 142 Nm (≈) | |
| 218 SD 1.9 D | 1991–1995 | PSA XUD9 | 1905 | 69 bhp (≈) | 118 Nm (≈) | NA diesel |
| 218 SLD Turbo 1.8 TD | 1991–1995 | PSA XUD7T | 1769 | 87 bhp | 180 Nm (≈) | |
| 220 GTi/GSi 2.0 16v | 1991–1995 | M-series M16 | 1994 | 134 bhp | 178 Nm (≈) | 0-60 8.2s (≈) |
| 220 Turbo 2.0 16v | 1992–1995 | T-series T16 turbo | 1994 | 197 bhp | 240 Nm | >150 mph — fastest Rover at the time; also Coupe |

Gaps: kerb weights; coupe/cabriolet dimensional deltas (coupe L ≈4270 mm); CO2 n/a.

## 3. Rover 200 R3 (1995–1999)

Supermini-sized hatch, 3/5-dr, FWD, in-house design. L 3970 / W 1690 / H 1420 / WB 2500 mm. Sources: https://en.wikipedia.org/wiki/Rover_200_/_25

| Variant | Years | Engine | cc | Power | Torque | Notes |
|---|---|---|---|---|---|---|
| 211 1.1 8v | 1997–1999 | K8 | 1120 | 59 bhp | 90 Nm | |
| 214 1.4 8v | 1995–1999 | K8 | 1396 | 74 bhp | 117 Nm (≈) | |
| 214 1.4 16v | 1995–1999 | K16 | 1396 | 102 bhp | 123 Nm | |
| 216 1.6 16v | 1995–1999 | K16 | 1588 | 109 bhp | 138 Nm (≈) | CVT option |
| 200vi 1.8 VVC | 1996–1999 | K16 VVC (18K4K) | 1796 | 143 bhp | 174 Nm | 145 PS; BRM LE (1998) same engine |
| 220 D 2.0 TD | 1995–1999 | L-series 20T2N | 1994 | 85 bhp | 170 Nm (≈) | non-intercooled |
| 220 SDi 2.0 TD | 1995–1999 | L-series 20T2R | 1994 | 104 bhp | 210 Nm (≈) | intercooled |

Gaps: kerb weights (~1005–1160 kg), per-variant mpg, CO2 (largely pre-publication).

## 4. Rover 25 (1999–2005) + Streetwise (2003–2005)

Facelifted R3, repositioned supermini. 3/5-dr hatch, FWD. L 3990 / W 1690 / H 1420 / WB 2500 mm. Streetwise = raised-ride-height "urban on-roader" derivative, same engines minus VVC/113 TD. Stepspeed CVT on 1.8 from 2000. Sources: https://en.wikipedia.org/wiki/Rover_200_/_25 ; https://www.parkers.co.uk/rover/25/hatchback-1999/specs/ ; https://www.parkers.co.uk/rover/streetwise/hatchback-2003/specs/

| Variant | Years | Engine | cc | Power | Torque | 0-60 | mpg | Notes |
|---|---|---|---|---|---|---|---|---|
| 1.1 16v | 1999–2005 | K16 | 1120 | 73 bhp | 92 Nm (≈) | 13.5 | 41–42 | |
| 1.4 16v 84 | 1999–2005 | K16 | 1396 | 82 bhp | 117 Nm (≈) | 11.8 | 41 | Streetwise: 38 mpg |
| 1.4 16v 103 | 1999–2005 | K16 | 1396 | 101 bhp | 123 Nm | 10.2 | 41 | 180 km/h |
| 1.6 16v | 1999–2005 | K16 | 1588 | 107 bhp | 138 Nm (≈) | 9.5 | 40–41 | |
| 1.8 16v | 1999–2005 | K16 | 1796 | 115 bhp | 160 Nm (≈) | 9.5 | 34 | Stepspeed CVT option |
| 1.8 VVC (25 GTi) | 1999–2005 | K16 VVC | 1796 | 143 bhp | 174 Nm | 8.0 | 37 | 204 km/h |
| 2.0 iDT 101 | 1999–2005 | L-series | 1994 | 100 bhp | 240 Nm | 9.9 | 53 | Streetwise TD: 47 mpg |
| 2.0 iTD 113 | 1999–2005 | L-series | 1994 | 111 bhp | 240 Nm | 9.1 | 51 | 185 km/h |

Streetwise variants captured separately in JSON (1.4 84 / 1.4 103 / 1.6 / 1.8 CVT / 2.0 TD). Gaps: CO2 (published for these — VCA follow-up recommended), kerb weights, boot volume.

## 5. Rover 400 R8 (1990–1995)

Booted 200: 4-dr saloon + 5-dr Tourer estate (1994–1998). FWD. L 4370 / W 1680 / H 1400 / WB 2550 mm. Sources: https://en.wikipedia.org/wiki/Rover_400_/_45

| Variant | Years | Engine | cc | Power | Torque |
|---|---|---|---|---|---|
| 414 1.4 16v SPi | 1990–1992 | K16 | 1396 | 94 bhp | 122 Nm (≈) |
| 414 1.4 16v MPi | 1992–1995 | K16 | 1396 | 102 bhp | 123 Nm |
| 416 1.6 16v | 1990–1995 | Honda D16A6/D16Z2 SOHC | 1590 | 110 bhp (≈) | 135 Nm (≈) |
| 416 GTi 1.6 16v | 1990–1994 | Honda D16A8 DOHC | 1590 | 128 bhp | 142 Nm (≈) |
| 420 2.0 16v | 1991–1995 | M-series M16 | 1994 | 134 bhp | 178 Nm (≈) |
| 420 Turbo (GSi Sport) | 1992–1995 | T16 turbo | 1994 | 197 bhp | 240 Nm |
| 418 SLD Turbo 1.8 TD | 1991–1995 | PSA XUD7T | 1769 | 87 bhp | 180 Nm (≈) |

Gaps: weights, performance figures, Tourer-specific specs.

## 6. Rover 400 HH-R (1995–1999)

Honda Domani/Civic-based. 5-dr hatch + 4-dr saloon (saloon from 1996, L ≈4520 mm). Hatch L 4316 / W 1695 / H 1390 / WB 2620 mm. Sources: https://en.wikipedia.org/wiki/Rover_400_/_45

| Variant | Years | Engine | cc | Power | Torque |
|---|---|---|---|---|---|
| 414 1.4 16v | 1995–1999 | K16 | 1396 | 102 bhp | 123 Nm |
| 416 1.6 16v | 1995–1999 | K16 | 1588 | 109 bhp | 138 Nm (≈) |
| 416 1.6 auto | 1995–1999 | Honda D16 SOHC | 1590 | 113 bhp (≈) | 138 Nm (≈) — auto only |
| 420 2.0 16v | 1995–1999 | T16 (NA) | 1994 | 134 bhp | 185 Nm (≈) |
| 420 Di 2.0 TD | 1995–1999 | L-series | 1994 | 85 bhp | 170 Nm (≈) |
| 420 SDi 2.0 TD | 1995–1999 | L-series | 1994 | 104 bhp | 210 Nm (≈) |

## 7. Rover 45 (1999–2005)

Facelifted HH-R. 5-dr hatch (L 4362) + 4-dr saloon (L 4520). W 1695 / H 1390 / WB 2620 mm. Sources: https://en.wikipedia.org/wiki/Rover_400_/_45 ; https://www.parkers.co.uk/rover/45/hatchback-2000/specs/

| Variant | Years | Engine | cc | Power | Torque | 0-60 | mpg |
|---|---|---|---|---|---|---|---|
| 1.4 16v | 1999–2005 | K16 | 1396 | 101 bhp | 123 Nm | 11.2 | 40 |
| 1.6 16v | 1999–2005 | K16 | 1588 | 107 bhp | 138 Nm (≈) | 10.3 | 39–40 |
| 1.8 16v | 1999–2005 | K16 | 1796 | 115 bhp | 160 Nm (≈) | 9.3 (man) | 38 man / 33 Stepspeed |
| 2.0 V6 | 1999–2004 | KV6 | 1997 | 148 bhp | 185 Nm | — | — (saloon only) |
| 2.0 iDT 101 | 1999–2005 | L-series | 1994 | 100 bhp | 240 Nm | 10.6 | 50–52 |
| 2.0 iTD 113 | 1999–2005 | L-series | 1994 | 111 bhp | 240 Nm | 9.8 | 50–52 |

Gaps: V6 performance/economy (Parkers page fetched did not list it), CO2, weights.

## 8. Rover 600 (1993–1999)

D-segment 4-dr saloon, Honda Accord (CB/CD) platform, Cowley-built. FWD. L 4650 / W 1727 / H 1380 / WB 2720 mm. Kerb 1280–1365 kg. Sources: https://en.wikipedia.org/wiki/Rover_600

| Variant | Years | Engine | cc | Power | Torque | Notes |
|---|---|---|---|---|---|---|
| 618i 1.8 | 1995–1999 | Honda F18A3 | 1849 | 113 bhp | 150 Nm (≈) | |
| 620i 2.0 | 1993–1999 | Honda F20Z2 | 1997 | 113 bhp | 168 Nm (≈) | |
| 620 Si/SLi/GSi 2.0 | 1993–1999 | Honda F20Z1 | 1997 | 129 bhp | 178 Nm (≈) | 4AT option |
| 620ti 2.0 Turbo | 1994–1999 | T16 turbo | 1994 | 197 bhp | 236 Nm | 0-60 7.0s, 143 mph |
| 623 2.3 | 1993–1999 | Honda H23A3 | 2259 | 156 bhp | 196 Nm (≈) | 4AT option |
| 620 SDi 2.0 TD | 1994–1999 | L-series | 1994 | 104 bhp | 210 Nm (≈) | |

Gaps: per-variant mpg, boot volume (~500 L unverified), CO2 n/a.

## 9. Rover 75 (1999–2005) incl. Tourer and V8

4-dr saloon (L 4747) + 5-dr Tourer (L 4791, boot 400–1222 L). W 1778 / H 1424 / WB 2746 mm. Saloon boot 432 L. Kerb 1370–1600 kg. FWD except V8 (RWD, only 166 built). Getrag 283 5MT / JATCO JF506E 5AT. Sources: https://en.wikipedia.org/wiki/Rover_75 ; https://www.parkers.co.uk/rover/75/saloon-1999/specs/

| Variant | Years | Engine | cc | Power | Torque | 0-60 | Top | mpg |
|---|---|---|---|---|---|---|---|---|
| 1.8 | 1999–2005 | K16 18K4F | 1796 | 118 bhp | 160 Nm | 10.9 | 121 mph | 36 |
| 1.8 T | 2002–2005 | K16 turbo 18K4T | 1796 | 148 bhp | 215 Nm | 9.1 | 130 mph | 31–35 |
| 2.0 V6 | 1999–2002 | KV6 | 1997 | 148 bhp | 185 Nm | 9.3 | ~127 mph | 24–29 |
| 2.5 V6 | 1999–2005 | KV6 25K4F | 2497 | 175 bhp | 240 Nm | 8.2 | 140 mph | 26–29 |
| 2.0 CDT | 1999–2005 | BMW M47R | 1951 | 114 bhp | 260 Nm | 11.0 | — | 40–48 |
| 2.0 CDTi | 2002–2005 | BMW M47R | 1951 | 129 bhp | 300 Nm | 10.0 | 121 mph | 40–48 |
| 4.6 V8 | 2003–2005 | Ford Modular 2L2E | 4601 | 256 bhp | 410 Nm | 7.0 | 151 mph | — |

LPG factory-approved 2.5 V6 conversion (2002–05) noted but not a separate JSON variant. Gaps: CO2 (VCA follow-up), Tourer-specific perf deltas.

## 10. Rover 800 (1986–1999) incl. Sterling / Vitesse

Executive: 4-dr saloon, 5-dr fastback, 2-dr coupé (from 1992). FWD, Honda Legend co-development. Mk1 L 4694 / Mk2 L 4880, WB 2760 mm, W ≈1730 mm (Wikipedia infobox width 1946/1965 mm includes mirrors — flagged, true body width ~1730 mm), H 1398 (Mk1) / 1390 (Mk2, infobox 1363). Sources: https://en.wikipedia.org/wiki/Rover_800

| Variant | Years | Engine | cc | Power | Torque | Notes |
|---|---|---|---|---|---|---|
| 820 2.0 8v | 1988–1990 | O-series | 1994 | 99 bhp (≈) | 160 Nm (≈) | fleet fastback |
| 820e/Se 2.0 | 1986–1991 | M16e SPi | 1994 | 118 bhp | 163 Nm (≈) | |
| 820i/Si 2.0 | 1986–1991 | M16i MPi | 1994 | 138 bhp | 178 Nm (≈) | |
| 820 Turbo (Tickford) | 1989–1991 | M16 turbo | 1994 | 178 bhp | 240 Nm (≈) | ~500 cars |
| 820 2.0 (Mk2) | 1991–1998 | T16 | 1994 | 134 bhp | 185 Nm (≈) | |
| Vitesse 2.0 Turbo | 1991–1996 | T16 turbo | 1994 | 178 bhp | 240 Nm (≈) | |
| Vitesse Sport 2.0 Turbo | 1994–1998 | T16 turbo | 1994 | 194 bhp | 240 Nm (≈) | 143 mph |
| 825i / Sterling 2.5 V6 | 1986–1988 | Honda C25A | 2494 | 171 bhp | 213 Nm (≈) | |
| 827i / Sterling 2.7 V6 | 1988–1996 | Honda C27A | 2675 | 175 bhp | 228 Nm (≈) | 4AT option |
| 825 2.5 KV6 (Sterling) | 1996–1998 | KV6 | 2497 | 173 bhp | 240 Nm (≈) | replaced C27A |
| 825 D/SD/TD 2.5 | 1990–1999 | VM Motori 425 TD | 2498 | 116 bhp | 265 Nm (≈) | |

Gaps: per-variant performance/economy, weights (~1380–1480 kg), coupe deltas; CO2 n/a.

## 11. Rover CityRover (2003–2005)

Tata Indica-based supermini, built in Pune. 5-dr hatch, FWD, 5MT. L 3703 / W 1620 / H 1500 / WB 2400 mm, kerb 1040 kg (Wikipedia — some sources ~980 kg). Sources: https://en.wikipedia.org/wiki/CityRover

| Variant | Years | Engine | cc | Power | Torque | Perf |
|---|---|---|---|---|---|---|
| 1.4 8v | 2003–2005 | Tata 475 (Peugeot-derived) | 1405 | 85 bhp | 119 Nm | 0-60 11.9s, 100 mph |

Gaps: mpg, CO2 (published ~gap — VCA follow-up).

## 12. Rover SD1 (1976–1986)

Executive 5-dr fastback, front-engine **RWD**. L 4699 / W 1768 / H 1372 / WB 2814 mm. LT77 5MT; BW65 (S1) / GM TH180 (S2) 3AT. Sources: https://en.wikipedia.org/wiki/Rover_SD1

| Variant | Years | Engine | cc | Power | Torque | Notes |
|---|---|---|---|---|---|---|
| 2000 | 1982–1986 | O-series | 1994 | 101 bhp | 160 Nm (≈) | fleet-tax model |
| 2300 | 1977–1986 | PE166 I6 | 2350 | 123 bhp | 176 Nm (≈) | |
| 2600 | 1977–1986 | PE166 I6 | 2597 | 136 bhp | 206 Nm (≈) | |
| 3500 V8 | 1976–1986 | Rover V8 | 3528 | 155 bhp | 268 Nm (≈) | |
| Vitesse 3.5 EFI | 1982–1986 | Rover V8 EFI | 3528 | 190 bhp | 298 Nm | Twin-plenum ~210-220 bhp homologation |
| 2400 SD Turbo | 1982–1986 | VM Motori HR492 | 2393 | 90 bhp | 217 Nm (≈) | only diesel SD1 |

Gaps: weights, performance, economy per variant; CO2 n/a.

---

## Summary

- 13 model entries (generations split), **84 variants** in JSON.
- Strongest data: 75, 25, 45, 600, Metro, CityRover, SD1 V8s.
- Weakest data / follow-ups: CO2 for all 2001+ cars (VCA carfueldata), R8 200/400 kerb weights & performance, 800 per-variant performance and economy, 45 2.0 V6 economy, boot volumes for everything except 75.
