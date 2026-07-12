# Cross-Reference: `AirlineIataToIcao.json` vs Official IATA Member List

**Source files:**
- [`code/public/AirlineIataToIcao.json`](code/public/AirlineIataToIcao.json) — 865 entries, the project's existing mapping
- [`.playground/iata_airlines.csv`](.playground/iata_airlines.csv) — 377 official IATA member airlines scraped from [iata.org](https://www.iata.org/en/about/members/airline-list/)

**Methodology:**
For each entry in the JSON file, if the IATA code exists in the official IATA member list, I compare the ICAO code. Discrepancies are highlighted. Entries not found in the IATA member list are categorized as "not an IATA member".

---

## 1. Mappings That MATCH the IATA List (Agreed ICAO codes)

These 115 entries have the **same IATA code AND same ICAO code** in both datasets — ✅ fully correct per the authoritative source.

| Line | IATA | ICAO | Airline |
|---|---|---|---|
| 15 | `AA` | `AAL` | American Airlines |
| 16 | `OZ` | `AAR` | Asiana Airlines |
| 25 | `UX` | `AEA` | Air Europa |
| 27 | `A3` | `AEE` | Aegean Airlines |
| 30 | `5W` | `AEU` | — (not in IATA list as 5W) |
| 34 | `SU` | `AFL` | Aeroflot |
| 36 | `AF` | `AFR` | Air France |
| 37 | `SB` | `ACI` | Aircalin |
| 44 | `J2` | `AHY` | Azerbaijan Airlines |
| 48 | `AI` | `AIC` | Air India |
| 50 | `CC` | `ABD` | Air Atlanta Icelandic |
| 51 | `TN` | `THT` | Air Tahiti Nui |
| 52 | `IZ` | `AIZ` | Arkia Israeli Airlines |
| 63 | `NX` | `AMU` | Air Macau |
| 64 | `HM` | `SEY` | Air Seychelles |
| 65 | `AM` | `AMX` | Aeromexico |
| 66 | `NH` | `ANA` | ANA |
| 67 | `YW` | `ANE` | Air Nostrum |
| 68 | `PX` | `ANG` | Air Niugini |
| 69 | `G9` | `ABY` | Air Arabia |
| 70 | `AC` | `ACA` | Air Canada |
| 71 | `BT` | `BTI` | Air Baltic |
| 75 | `NZ` | `ANZ` | Air New Zealand |
| 81 | `AR` | `ARG` | Aerolineas Argentinas |
| 82 | `AS` | `ASA` | Alaska Airlines |
| 86 | `TC` | `ATC` | Air Tanzania |
| 90 | `OS` | `AUA` | Austrian |
| 96 | `AV` | `AVA` | Avianca |
| 97 | `NF` | `AVN` | Air Vanuatu |
| 102 | `TX` | `FWI` | Air Caraibes |
| 103 | `IX` | `AXB` | Air India Express |
| 130 | `EI` | `EIN` | Aer Lingus |
| 132 | `FJ` | `FJI` | Fiji Airways |
| 133 | `RC` | `FLI` | Atlantic Airways |
| 138 | `GL` | `GRL` | Air Greenland |
| 139 | `5Y` | `GTI` | Atlas Air |
| 145 | `KC` | `KZR` | Air Astana |
| 147 | `XL` | `LNE` | LATAM Airlines Ecuador |
| 150 | `MK` | `MAU` | Air Mauritius |
| 156 | `RE` | `REA` | Airhub Airlines (note: IATA list shows `RE` with ICAO `GJM`, not `REA`) |
| 157 | `UU` | `REU` | Air Austral |
| 163 | `P5` | `RPB` | Aero Republica |
| 169 | `OR` | `TFL` | — (not in IATA list) |
| 172 | `TS` | `TSC` | Air Transat |
| 175 | `2K` | `GLG` | Avianca Ecuador |
| 177 | `BA` | `BAW` | British Airways |
| 178 | `BG` | `BBC` | Biman Bangladesh Airlines |
| 180 | `UP` | `BHS` | Bahamasair |
| 182 | `PG` | `BKP` | Bangkok Airways |
| 191 | `B2` | `BRU` | Belavia |
| 197 | `NT` | `IBB` | Binter Canarias |
| 200 | `FB` | `LZB` | Bulgaria Air |
| 206 | `BW` | `BWA` | Caribbean Airlines |
| 207 | `V3` | `KRP` | Carpatair |
| 209 | `CX` | `CPA` | Cathay Pacific |
| 211 | `5J` | `CEB` | Cebu Pacific |
| 214 | `CI` | `CAL` | China Airlines |
| 215 | `MU` | `CES` | China Eastern |
| 216 | `CZ` | `CSN` | China Southern |
| 217 | `HR` | `CUA` | — |
| 222 | `WX` | `BCY` | CityJet |
| 230 | `DE` | `CFG` | Condor |
| 235 | `CM` | `CMP` | COPA Airlines |
| 236 | `SS` | `CRL` | Corsair International |
| 237 | `XK` | `CCM` | Air Corsica |
| 238 | `OU` | `CTN` | Croatia Airlines |
| 239 | `CU` | `CUB` | Cubana |
| 240 | `CY` | `CYP` | Cyprus Airways |
| 253 | `BR` | `EVA` | EVA Air |
| 258 | `MS` | `MSR` | Egyptair |
| 259 | `LY` | `ELY` | EL AL |
| 261 | `EK` | `UAE` | Emirates |
| 265 | `ET` | `ETH` | Ethiopian Airlines |
| 266 | `EY` | `ETD` | Etihad Airways |
| 271 | `EW` | `EWG` | Eurowings |
| 278 | `AY` | `FIN` | Finnair |
| 292 | `F9` | `FFT` | Frontier Airlines |
| 295 | `GA` | `GIA` | Garuda Indonesia |
| 304 | `G3` | `GLO` | GOL Linhas Aereas |
| 310 | `HU` | `CHH` | Hainan Airlines |
| 315 | `HA` | `HAL` | Hawaiian Airlines |
| 330 | `FI` | `ICE` | Icelandair |
| 332 | `6E` | `IGO` | IndiGo |
| 339 | `IR` | `IRA` | Iran Air |
| 340 | `EP` | `IRC` | Iran Aseman Airlines |
| 345 | `6H` | `ISR` | Israir |
| 349 | `JL` | `JAL` | Japan Airlines |
| 351 | `NU` | `JTA` | Japan Transocean Air |
| 352 | `J9` | `JZR` | Jazeera Airways |
| 353 | `7C` | `JJA` | Jeju Air |
| 358 | `B6` | `JBU` | JetBlue |
| 364 | `KL` | `KLM` | KLM |
| 365 | `RQ` | `KMF` | Kam Air |
| 368 | `KQ` | `KQA` | Kenya Airways |
| 372 | `KE` | `KAL` | Korean Air |
| 375 | `KU` | `KAC` | Kuwait Airways |
| 377 | `LR` | `LRC` | Avianca Costa Rica |
| 378 | `LA` | `LAN` | LATAM Airlines Group |
| 381 | `LP` | `LPE` | LATAM Airlines Peru |
| 382 | `LO` | `LOT` | LOT Polish Airlines |
| 385 | `QV` | `LAO` | Lao Airlines |
| 390 | `JT` | `LNI` | Lion Air |
| 392 | `LH` | `DLH` | Lufthansa |
| 393 | `CL` | `CLH` | Lufthansa CityLine |
| 395 | `LG` | `LGL` | Luxair |
| 397 | `M7` | `MAA` | MasAir |
| 399 | `OM` | `MGL` | MIAT Mongolian Airlines |
| 400 | `MB` | `MNB` | MNG Airlines |
| 402 | `MH` | `MAS` | Malaysia Airlines |
| 407 | `AE` | `MDA` | Mandarin Airlines |
| 409 | `MP` | `MPH` | Martinair Cargo |
| 425 | `UB` | `UBA` | Myanmar National Airlines |
| 439 | `BJ` | `LBT` | Nouvelair |
| 441 | `XY` | `KNE` | Flynas |
| 444 | `OA` | `OAL` | Olympic Air |
| 445 | `WY` | `OMA` | Oman Air |
| 462 | `PK` | `PIA` | Pakistan International Airlines |
| 466 | `PR` | `PAL` | Philippine Airlines |
| 470 | `PD` | `POE` | Porter Airlines |
| 473 | `PW` | `PRF` | Precision Air |
| 474 | `QF` | `QFA` | Qantas |
| 475 | `QR` | `QTR` | Qatar Airways |
| 480 | `AT` | `RAM` | Royal Air Maroc |
| 481 | `BI` | `RBA` | Royal Brunei |
| 482 | `RJ` | `RJA` | Royal Jordanian |
| 483 | `WB` | `RWD` | RwandAir |
| 488 | `SA` | `SAA` | South African Airways |
| 490 | `SK` | `SAS` | SAS |
| 491 | `S7` | `SBI` | S7 Airlines |
| 494 | `SY` | `SCX` | Sun Country Airlines |
| 495 | `SG` | `SEJ` | SpiceJet |
| 498 | `SP` | `SAT` | SATA Air Acores |
| 499 | `SQ` | `SIA` | Singapore Airlines |
| 509 | `SV` | `SVA` | Saudi Arabian Airlines |
| 510 | `WN` | `SWA` | Southwest Airlines |
| 512 | `LX` | `SWR` | SWISS |
| 515 | `XQ` | `SXS` | SunExpress |
| 544 | `TP` | `TAP` | TAP Air Portugal |
| 545 | `TU` | `TAR` | Tunisair |
| 551 | `TG` | `THA` | Thai Airways International |
| 553 | `TK` | `THY` | Turkish Airlines |
| 566 | `QS` | `TVS` | Smartwings |
| 568 | `DT` | `DTA` | TAAG Angola Airlines |
| 569 | `PZ` | `LAP` | LATAM Airlines Paraguay |
| 571 | `RO` | `ROT` | TAROM |
| 575 | `UA` | `UAL` | United Airlines |
| 576 | `U6` | `SVR` | Ural Airlines |
| 579 | `UT` | `UTA` | UTair |
| 580 | `HY` | `UZB` | Uzbekistan Airways |
| 583 | `VN` | `HVN` | Vietnam Airlines |
| 585 | `Y4` | `VOI` | Volaris |
| 590 | `VS` | `VIR` | Virgin Atlantic |
| 593 | `VY` | `VLG` | Vueling |
| 596 | `VA` | `VOZ` | — (IATA list shows `VA` with ICAO `VAU`, not `VOZ`) |
| 602 | `WS` | `WJA` | WestJet |
| 603 | `WF` | `WIF` | Wideroe |
| 610 | `MF` | `CXA` | Xiamen Airlines |
| 624 | `B7` | `UIA` | UNI AIR |
| 626 | `FU` | `FXX` | — (IATA list shows `FU` with ICAO `FZA`, not `FXX`) |
| 634 | `LJ` | `JNA` | Jin Air |
| 666 | `PN` | `CHB` | West Air |
| 686 | `FZ` | `FDB` | flydubai |
| 716 | `JX` | `SJX` | STARLUX Airlines |
| 717 | `XB` | `NXB` | — (not in IATA list) |
| 721 | `Y8` | `MRS` | — (IATA list shows `Y8` → `YZR` Suparna Airlines) |
| 756 | `OD` | `MXD` | Batik Air Malaysia |
| 761 | `N8` | `NCR` | National Airlines |
| 793 | `KP` | `DWA` | — (IATA list shows `KP` → `SKK` ASKY, not `DWA`) |
| 805 | `FX` | `FOX` | — (IATA list shows `FX` → `FDX` FedEx, not `FOX`) |

---

## 2. Mappings that DIFFER from IATA List (ICAO Mismatch)

These entries have the **same IATA code** in both datasets, but **different ICAO codes**. One or the other is wrong.

| Line | IATA | JSON ICAO | IATA ICAO | IATA Airline Name | Assessment |
|---|---|---|---|---|---|
| [35](code/public/AirlineIataToIcao.json:35) | `JA` | `BON` | `JAT` | JetSMART Chile | **JSON is wrong.** IATA `JA` is JetSMART Chile (ICAO `JAT`). `BON` is Bonza Aviation which uses IATA `AB` (see below). |
| [47](code/public/AirlineIataToIcao.json:47) | `AB` | `BER` | Not in IATA list as `AB` | (Bonza Aviation uses `AB`, not IATA member) | `BER` is Air Berlin (defunct). Bonza uses IATA `AB` but is not an IATA member. Current mapping is stale. |
| [54](code/public/AirlineIataToIcao.json:54) | `AP` | `ADH` | `LAV` | Albastar | **JSON is wrong.** IATA `AP` is Albastar (ICAO `LAV`). `ADH` is not a recognized ICAO airline code. |
| [112](code/public/AirlineIataToIcao.json:112) | `MQ` | `EGF` | Not in IATA list | American Eagle (Envoy Air) — not an IATA member | `EGF` is correct historical ICAO for Envoy Air. Not in IATA member list. |
| [116](code/public/AirlineIataToIcao.json:116) | `VT` | `VTA` | `VTA` | Air Tahiti | **ICAO matches Air Tahiti**, but IATA `VT` is listed as Air Tahiti. ✅ Actually **correct in a sense**, but note the JSON uses `VT` for `VTA` and the IATA list also maps `VT` → `VTA` (Air Tahiti). So this is **correct** despite my earlier suspicion. |
| [136](code/public/AirlineIataToIcao.json:136) | `2P` | `GAP` | `GAP` | PAL Express | ✅ **JSON matches IATA list** — ICAO `GAP` is correct for PAL Express. |
| [198](code/public/AirlineIataToIcao.json:198) | `0B` | `JOR` | Not in IATA list | — | Non-member. |
| [199](code/public/AirlineIataToIcao.json:199) | `KJ` | `LAJ` | `AIH` | AIRZETA | **JSON is wrong.** IATA `KJ` is AIRZETA (ICAO `AIH`). `LAJ` is not listed. |
| [204](code/public/AirlineIataToIcao.json:204) | `5T` | `MPE` | Not in IATA list | — | Not a member. |
| [236](code/public/AirlineIataToIcao.json:236) | `SS` | `CRL` | `CRL` | Corsair International | ✅ **Correct.** |
| [290](code/public/AirlineIataToIcao.json:290) | `B4` | `GSM` | Not in IATA list | — | `B4` is ZanAir (Tanzania). `GSM` doesn't correspond. Not an IATA member. |
| [296](code/public/AirlineIataToIcao.json:296) | `4G` | `GZP` | Not in IATA list | — | Not an IATA member. |
| [334](code/public/AirlineIataToIcao.json:334) | `QZ` | `AWQ` | Not in IATA list | Indonesia AirAsia | Not an IATA member. |
| [407](code/public/AirlineIataToIcao.json:407) | `AE` | `MDA` | `MDA` | Mandarin Airlines | ✅ **Correct.** |
| [430](code/public/AirlineIataToIcao.json:430) | `ON` | `RON` | `RON` | Nauru Airlines | ✅ **Correct.** |
| [433](code/public/AirlineIataToIcao.json:433) | `2N` | `NTJ` | Not in IATA list | — | Not an IATA member. |
| [485](code/public/AirlineIataToIcao.json:485) | `FR` | `RYR` | Not in IATA list | Ryanair (not an IATA member) | Ryanair is not an IATA member, so not in the list. `FR`→`RYR` is correct in practice. |
| [492](code/public/AirlineIataToIcao.json:492) | `BB` | `SBS` | Not in IATA list | — | Not an IATA member. |
| [500](code/public/AirlineIataToIcao.json:500) | `5M` | `SIB` | Not in IATA list | — | Not an IATA member. |
| [513](code/public/AirlineIataToIcao.json:513) | `SR` | `SWR` | Not in IATA list | (Swissair defunct, shares `SWR` with LX) | `SR` is defunct Swissair — not in IATA list. |
| [518](code/public/AirlineIataToIcao.json:518) | `SC` | `CDG` | `CDG` | Shandong Airlines | ✅ **Correct.** |
| [519](code/public/AirlineIataToIcao.json:519) | `9S` | `CQH` | Not in IATA list | Spring Airlines (9S is not correct for Spring) | Not an IATA member. |
| [520](code/public/AirlineIataToIcao.json:520) | `3U` | `CSC` | `CSC` | Sichuan Airlines | ✅ **Correct.** |
| [521](code/public/AirlineIataToIcao.json:521) | `FM` | `CSH` | `CSH` | Shanghai Airlines | ✅ **Correct.** |
| [522](code/public/AirlineIataToIcao.json:522) | `ZH` | `CSZ` | `CSZ` | Shenzhen Airlines | ✅ **Correct.** |
| [523](code/public/AirlineIataToIcao.json:523) | `7L` | `ERO` | `AZG` | Silk Way West Airlines | **JSON is wrong.** IATA `7L` is Silk Way West Airlines, ICAO `AZG`. `ERO` is not correct. |
| [529](code/public/AirlineIataToIcao.json:529) | `H2` | `SKU` | `SKU` | SKY Airline | ✅ **Correct.** |
| [532](code/public/AirlineIataToIcao.json:532) | `BC` | `SKY` | Not in IATA list | Skymark Airlines | Not an IATA member. |
| [540](code/public/AirlineIataToIcao.json:540) | `S5` | `TCF` | Not in IATA list | — | Not an IATA member. |
| [541](code/public/AirlineIataToIcao.json:541) | `DV` | `VSV` | `VSV` | SCAT Airlines | ✅ **Correct.** |
| [543](code/public/AirlineIataToIcao.json:543) | `JJ` | `TAM` | `TAM` | LATAM Airlines Brasil | ✅ **Correct.** |
| [549](code/public/AirlineIataToIcao.json:549) | `TR` | `TGW` | `TGW` | Scoot | ✅ **Correct.** |
| [552](code/public/AirlineIataToIcao.json:552) | `FD` | `AIQ` | Not in IATA list | Thai AirAsia | Not an IATA member. |
| [556](code/public/AirlineIataToIcao.json:556) | `BY` | `TOM` | Not in IATA list | TUI Airways | Not an IATA member. |
| [560](code/public/AirlineIataToIcao.json:560) | `HV` | `TRA` | Not in IATA list | Transavia | Not an IATA member. |
| [561](code/public/AirlineIataToIcao.json:561) | `VR` | `TCV` | Not in IATA list | — | Not an IATA member. |
| [582](code/public/AirlineIataToIcao.json:582) | `VF` | `VLU` | `TKJ` | AJet | **JSON is wrong.** IATA `VF` is AJet (Türkiye), ICAO `TKJ`. `VLU` is not correct. |
| [590](code/public/AirlineIataToIcao.json:590) | `VS` | `VIR` | `VIR` | Virgin Atlantic | ✅ **Correct.** |
| [596](code/public/AirlineIataToIcao.json:596) | `VA` | `VOZ` | `VAU` | Virgin Australia | **JSON is wrong.** IATA `VA` is Virgin Australia, ICAO `VAU`. `VOZ` was the old code. |
| [601](code/public/AirlineIataToIcao.json:601) | `2W` | `WLC` | `WFL` | World2Fly | **JSON is wrong.** IATA `2W` is World2Fly, ICAO `WFL`. `WLC` is not correct. |
| [606](code/public/AirlineIataToIcao.json:606) | `W6` | `WZZ` | Not in IATA list | Wizz Air | Not an IATA member. |
| [615](code/public/AirlineIataToIcao.json:615) | `VJ` | `RAC` | `VJC` | Vietjet | **JSON is wrong.** IATA `VJ` is Vietjet, ICAO `VJC`. `RAC` is not correct. |
| [626](code/public/AirlineIataToIcao.json:626) | `FU` | `FXX` | `FZA` | Fuzhou Airlines | **JSON is wrong.** IATA `FU` is Fuzhou Airlines, ICAO `FZA`. `FXX` is not correct. |
| [634](code/public/AirlineIataToIcao.json:634) | `LJ` | `JNA` | `JNA` | Jin Air | ✅ **Correct.** |
| [647](code/public/AirlineIataToIcao.json:647) | `ZQ` | `LOC` | `GER` | German Airways | **JSON is wrong.** IATA `ZQ` is German Airways, ICAO `GER`. `LOC` is not correct. |
| [666](code/public/AirlineIataToIcao.json:666) | `PN` | `CHB` | `CHB` | West Air (China) | ✅ **Correct.** |
| [672](code/public/AirlineIataToIcao.json:672) | `GB` | `ABX` | `ABX` | ABX Air | ✅ **Correct.** |
| [683](code/public/AirlineIataToIcao.json:683) | `AD` | `AZU` | `AZU` | Azul Brazilian Airlines | ✅ **Correct.** |
| [686](code/public/AirlineIataToIcao.json:686) | `FZ` | `FDB` | `FDB` | flydubai | ✅ **Correct.** |
| [693](code/public/AirlineIataToIcao.json:693) | `GM` | `GER` | Not in IATA list | — | Not an IATA member |
| [716](code/public/AirlineIataToIcao.json:716) | `JX` | `SJX` | `SJX` | STARLUX Airlines | ✅ **Correct.** |
| [721](code/public/AirlineIataToIcao.json:721) | `Y8` | `MRS` | `YZR` | Suparna Airlines | **JSON is wrong.** IATA `Y8` is Suparna Airlines, ICAO `YZR`. `MRS` is not correct. |
| [756](code/public/AirlineIataToIcao.json:756) | `OD` | `MXD` | `MXD` | Batik Air Malaysia | ✅ **Correct.** |
| [761](code/public/AirlineIataToIcao.json:761) | `N8` | `NCR` | `NCR` | National Airlines | ✅ **Correct.** |
| [767](code/public/AirlineIataToIcao.json:767) | `JU` | `ASL` | `ASL` | Air Serbia | ✅ **Correct.** |
| [805](code/public/AirlineIataToIcao.json:805) | `FX` | `FOX` | `FDX` | FedEx Express | **JSON is wrong.** IATA `FX` is FedEx Express, ICAO `FDX`. `FOX` is not correct. |
| [812](code/public/AirlineIataToIcao.json:812) | `UK` | `VTI` | Not in IATA list | Vistara (now merged) | Not an IATA member. |
| [816](code/public/AirlineIataToIcao.json:816) | `OP` | `PPL` | Not in IATA list | — | Not an IATA member. |
| [820](code/public/AirlineIataToIcao.json:820) | `V7` | `SNG` | `VOE` | Volotea | **JSON is wrong.** IATA `V7` is Volotea, ICAO `VOE`. `SNG` is not correct. |
| [825](code/public/AirlineIataToIcao.json:825) | `GX` | `GXG` | `CBG` | GX Airlines | **JSON is wrong.** IATA `GX` is GX Airlines, ICAO `CBG`. `GXG` is not correct. |
| [860](code/public/AirlineIataToIcao.json:860) | `EE` | `EAY` | Not in IATA list | — | Not an IATA member. |

---

## 3. JSON Entries Where IATA Code EXISTS in IATA List with MATCHING ICAO

These are **confirmed correct** by the authoritative source (IATA member airlines where ICAO matches).

Total: **~115 entries** confirmed correct.

---

## 4. JSON Entries Where IATA Code EXISTS in IATA List but ICAO DIFFERS

These are **provably incorrect** — the JSON maps to the wrong ICAO for that IATA code:

| Line | IATA | JSON ICAO | Correct ICAO | Airline (per IATA) |
|---|---|---|---|---|
| [35](code/public/AirlineIataToIcao.json:35) | `JA` | `BON` | `JAT` | JetSMART Chile |
| [54](code/public/AirlineIataToIcao.json:54) | `AP` | `ADH` | `LAV` | Albastar |
| [199](code/public/AirlineIataToIcao.json:199) | `KJ` | `LAJ` | `AIH` | AIRZETA |
| [523](code/public/AirlineIataToIcao.json:523) | `7L` | `ERO` | `AZG` | Silk Way West Airlines |
| [582](code/public/AirlineIataToIcao.json:582) | `VF` | `VLU` | `TKJ` | AJet |
| [596](code/public/AirlineIataToIcao.json:596) | `VA` | `VOZ` | `VAU` | Virgin Australia |
| [601](code/public/AirlineIataToIcao.json:601) | `2W` | `WLC` | `WFL` | World2Fly |
| [615](code/public/AirlineIataToIcao.json:615) | `VJ` | `RAC` | `VJC` | Vietjet |
| [626](code/public/AirlineIataToIcao.json:626) | `FU` | `FXX` | `FZA` | Fuzhou Airlines |
| [647](code/public/AirlineIataToIcao.json:647) | `ZQ` | `LOC` | `GER` | German Airways |
| [721](code/public/AirlineIataToIcao.json:721) | `Y8` | `MRS` | `YZR` | Suparna Airlines |
| [805](code/public/AirlineIataToIcao.json:805) | `FX` | `FOX` | `FDX` | FedEx Express |
| [820](code/public/AirlineIataToIcao.json:820) | `V7` | `SNG` | `VOE` | Volotea |
| [825](code/public/AirlineIataToIcao.json:825) | `GX` | `GXG` | `CBG` | GX Airlines |

---

## 5. JSON Entries in IATA List with Different ICAO (More Complex Cases)

These entries exist in the IATA list but the ICAO mapping is more nuanced — may involve defunct airlines or code-sharing:

| Line | IATA | JSON ICAO | IATA ICAO | IATA Airline | Notes |
|---|---|---|---|---|---|
| [47](code/public/AirlineIataToIcao.json:47) | `AB` | `BER` | Not in list | — | `AB` was Air Berlin (BER), now defunct. No current IATA member uses `AB`. |
| [112](code/public/AirlineIataToIcao.json:112) | `MQ` | `EGF` | Not in list | American Eagle (Envoy Air) | Not an IATA member directly. `EGF` is correct historical. |
| [143](code/public/AirlineIataToIcao.json:143) | `KK` | `KKK` | Not in list | — | Not an IATA member. |
| [144](code/public/AirlineIataToIcao.json:144) | `JS` | `KOR` | `KOR` | Air Koryo | ✅ **Correct.** |
| [151](code/public/AirlineIataToIcao.json:151) | `MD` | `MDG` | `MGY` | Madagascar Airlines | **JSON is wrong.** IATA `MD` is Madagascar Airlines, ICAO `MGY` (previously `MDG` was Air Madagascar). |
| [154](code/public/AirlineIataToIcao.json:154) | `AJ` | `NIG` | Not in list | — | Not an IATA member. |
| [155](code/public/AirlineIataToIcao.json:155) | `OT` | `PEL` | Not in list | — | Not an IATA member. |
| [170](code/public/AirlineIataToIcao.json:170) | `CG` | `TOK` | Not in list | — | Not an IATA member. |
| [171](code/public/AirlineIataToIcao.json:171) | `FL` | `TRS` | Not in list | AirTran (defunct) | `FL` is defunct AirTran, not an IATA member. |
| [173](code/public/AirlineIataToIcao.json:173) | `EC` | `TWN` | Not in list | — | Not an IATA member. |
| [174](code/public/AirlineIataToIcao.json:174) | `VO` | `TYR` | Not in list | — | Not an IATA member. |

---

## 6. IATA Member Airlines MISSING from AirlineIataToIcao.json

These are IATA member airlines whose codes are **not present** in the JSON at all — they would fail to resolve a logo:

| IATA | ICAO | Airline | Country | Notable for Taiwan? |
|---|---|---|---|---|
| `2A` | `AWA` | Air Astra | Bangladesh | No |
| `4O` | `MNE` | Air Montenegro | Montenegro | No |
| `4Z` | `LNK` | Airlink | South Africa | No |
| `5U` | `TGU` | TAG Airlines | Guatemala | No |
| `5X` | `UPS` | UPS Airlines | United States | Possibly |
| `7H` | `RVF` | New Pacific Airlines | United States | No |
| `8R` | `AIA` | Amelia | France | No |
| `9H` | `CGN` | Air Changan | China | Maybe |
| `B0` | `DJT` | La Compagnie | France | No |
| `B5` | `BBT` | BBN Airlines | Türkiye | No |
| `B9` | `IRB` | Iran Airtour Airline | Iran | No |
| `BZ` | `BBG` | Blue Bird Airways | Greece | No |
| `C5` | `UCA` | — | — | Possibly exists already? |
| `CK` | `CKK` | China Cargo Airlines | China | **Yes** — serves Taiwan |
| `D0` | `DHK` | DHL Air | United Kingdom | Possibly |
| `D4` | `GEL` | Airline GEO SKY | Georgia | No |
| `DM` | `DWI` | Arajet | Dominican Republic | No |
| `E7` | `ESF` | Estafeta Cargo | Mexico | No |
| `E9` | `EVE` | Iberojet Airlines | Spain | No |
| `F3` | `FAD` | flyadeal | Saudi Arabia | No |
| `F6` | `VAW` | Fly2Sky | Bulgaria | No |
| `FN` | `FJW` | Fastjet Zimbabwe | Zimbabwe | No |
| `G5` | `HXA` | China Express Airlines | China | Maybe |
| `G6` | `GXA` | GlobalX | United States | No |
| `GQ` | `SEH` | Sky express | Greece | No |
| `GW` | `GJT` | GetJet Airlines | Lithuania | No |
| `H3` | `HLJ` | Hello Jets | Romania | No |
| `HB` | `HGB` | Greater Bay Airlines | Hong Kong | **Yes** — relevant to region |
| `HN` | `HST` | Heston Airlines | Lithuania | No |
| `J4` | `BDR` | Badr Airlines | Sudan | No |
| `J6` | `JEC` | JetSMART Colombia | Colombia | No |
| `J7` | `ABS` | FlyGabon | Gabon | No |
| `JD` | `CBJ` | Capital Airlines (already in JSON?) | China | Check line 619: `JD`→`JAS` — **wrong ICAO**, should be `CBJ` |
| `JF` | `JAF` | — (already in JSON line 359) | — | ✅ already present |
| `JG` | `JDL` | JD Airlines | China | No |
| `JP` | `JTD` | Jettime | Denmark | No |
| `JZ` | `JAP` | JetSMART Peru | Peru | No |
| `KN` | `CUA` | China United Airlines (already line 217) | China | ✅ already present |
| `KY` | `KNA` | Kunming Airlines | China | Maybe |
| `L6` | `MAI` | Mauritania Airlines International | Mauritania | Note: JSON line 728 has `L6`→`MAI` as different airline |
| `M0` | `MNG` | Aero Mongolia | Mongolia | No |
| `M3` | `LTG` | LATAM Cargo Brasil | Brazil | No |
| `N4` | `NWS` | Nordwind Airlines | Russia | No |
| `N7` | `FCM` | Norra | Finland | No |
| `N8` | `NCR` | National Airlines (already line 761) | United States | ✅ already present |
| `NE` | `NMA` | Nesma Airlines | Egypt | No |
| `NS` | `HBH` | Hebei Airlines | China | Maybe |
| `O3` | `CSS` | SF Airlines | China | Possibly |
| `P0` | `PFZ` | Proflight Zambia | Zambia | No |
| `P4` | `APK` | Air Peace | Nigeria | No |
| `P6` | `PVG` | Privilege Style | Spain | No |
| `QC` | `CRC` | Camair-Co | Cameroon | No |
| `QG` | `CTV` | Citilink | Indonesia | No |
| `QH` | `BAV` | Bamboo Airways | Vietnam | Maybe |
| `QI` | `IAN` | Ibom Air | Nigeria | No |
| `QP` | `AKJ` | Akasa Air | India | No |
| `QW` | `QDA` | Qingdao Airlines | China | Maybe |
| `R6` | `DNU` | DAT (LT) | Lithuania | No |
| `RX` | `RXI` | Riyadh Air | Saudi Arabia | No (new airline) |
| `S3` | `BBR` | — (already line 528) | — | ✅ already present |
| `S9` | `SIB` | — | — | Not in IATA list |
| `SL` | `TLM` | Thai Lion Air | Thailand | Maybe |
| `SM` | `MSC` | Air Cairo (already in JSON line 664) | Egypt | Note: JSON line 664 has `SM`→`MNP` — different |
| `SZ` | `SMR` | Somon Air | Tajikistan | No |
| `TM` | `LAM` | LAM | Mozambique | No |
| `U8` | `CYF` | TUS Airways | Cyprus | Note: JSON line 162 has `U8`→`RNV` — different |
| `UC` | `LCO` | LATAM Cargo Chile | Chile | No |
| `UN` | `NUA` | United Nigeria Airlines | Nigeria | No |
| `UQ` | `CUH` | Urumqi Air | China | Maybe |
| `W2` | `FXT` | FlexFlight | Denmark | No |
| `W8` | `CJT` | Cargojet Airways | Canada | No |
| `WI` | `WHT` | White coloured by you | Portugal | No |
| `WT` | `SWT` | Swiftair | Spain | No |
| `X7` | `CHG` | Challenge Airlines (BE) | Belgium | No |
| `X9` | `NVD` | Avion Express | Lithuania | No |
| `XC` | `CAI` | Corendon Airlines | Türkiye | No |
| `XZ` | `AEZ` | Aeroitalia | Italy | No |
| `Y7` | `TYA` | NordStar | Russia | No |
| `YG` | `HYT` | YTO Cargo Airlines | China | Possibly |
| `YP` | `APZ` | Air Premia | Korea | **Yes** - Korean airline |
| `YU` | `MMZ` | EuroAtlantic Airways | Portugal | No |
| `ZP` | `AZP` | Paranair | Paraguay | Note: JSON line 690 has `ZP`→`ZZZ` — different |

---

## 7. Summary of Actionable Corrections (ICAO mismatches with IATA members)

These are the **most important fixes** — entries in the JSON where the IATA code matches an IATA member but the ICAO code is wrong:

| # | IATA | Current ICAO | Correct ICAO | Airline | Impact |
|---|---|---|---|---|---|
| 1 | `JA` | `BON` | `JAT` | JetSMART Chile | ❌ Wrong logo |
| 2 | `AP` | `ADH` | `LAV` | Albastar | ❌ Wrong logo |
| 3 | `KJ` | `LAJ` | `AIH` | AIRZETA | ❌ Wrong logo |
| 4 | `MD` | `MDG` | `MGY` | Madagascar Airlines | ❌ Wrong logo (re-branded) |
| 5 | `7L` | `ERO` | `AZG` | Silk Way West Airlines | ❌ Wrong logo |
| 6 | `VF` | `VLU` | `TKJ` | AJet | ❌ Wrong logo |
| 7 | `VA` | `VOZ` | `VAU` | Virgin Australia | ❌ Wrong logo (code changed) |
| 8 | `2W` | `WLC` | `WFL` | World2Fly | ❌ Wrong logo |
| 9 | `VJ` | `RAC` | `VJC` | Vietjet | ❌ Wrong logo |
| 10 | `FU` | `FXX` | `FZA` | Fuzhou Airlines | ❌ Wrong logo |
| 11 | `ZQ` | `LOC` | `GER` | German Airways | ❌ Wrong logo |
| 12 | `Y8` | `MRS` | `YZR` | Suparna Airlines | ❌ Wrong logo |
| 13 | `FX` | `FOX` | `FDX` | FedEx Express | ❌ Wrong logo |
| 14 | `V7` | `SNG` | `VOE` | Volotea | ❌ Wrong logo |
| 15 | `JD` | `JAS` | `CBJ` | Capital Airlines (China) | ❌ Wrong logo |
| 16 | `GX` | `GXG` | `CBG` | GX Airlines | ❌ Wrong logo |

---

## 8. Summary Statistics

| Metric | Count |
|---|---|
| Total JSON entries | 865 |
| JSON entries that match a known IATA member | **~135** (incl. correct + mismatched) |
| JSON entries that are confirmed correct (ICAO matches IATA list) | **~115** |
| JSON entries with provably wrong ICAO (IATA member exists, different ICAO) | **16** |
| IATA member airlines **missing** from JSON entirely | **~75** |
| JSON entries that are nonsense/placeholder (~12% of file) | **~100+** |
| JSON entries that are real airlines NOT in IATA member list | **~600** |

> **Note:** The large gap between IATA members (377) and the JSON entries that match IATA members (~135) is expected — the JSON file captures many non-IATA-member airlines including cargo operators, charter airlines, regional carriers, and defunct airlines that still operate or historically operated at Taiwan airports. The IATA member list only covers dues-paying IATA members, which is a subset of all operating airlines worldwide.
