# 高雄國際航空站 (KHH) - 航班資料開放規格

**來源**: [高雄國際航空站 開放資料專區](https://www.kia.gov.tw/opendata.html)

## API Endpoints

### 方式一: RESTful 路徑式 (JSON files)

| # | 名稱 | URL | 格式 |
|---|------|-----|------|
| 1 | 國際線抵達 | `https://www.kia.gov.tw/Announce/NewsArea/InstantSchedule_INTARR.json` | JSON |
| 2 | 國際線起飛 | `https://www.kia.gov.tw/Announce/NewsArea/InstantSchedule_INTDEP.json` | JSON |
| 3 | 國內線抵達 | `https://www.kia.gov.tw/Announce/NewsArea/InstantSchedule_DOMARR.json` | JSON |
| 4 | 國內線起飛 | `https://www.kia.gov.tw/Announce/NewsArea/InstantSchedule_DOMDEP.json` | JSON |

### 方式二: API 參數式 (ashx handler)

| # | 名稱 | URL | 格式 |
|---|------|-----|------|
| 1 | 國際線抵達 | `https://www.kia.gov.tw/API/InstantSchedule.ashx?AirFlyLine=1&AirFlyIO=2` | JSON |
| 2 | 國際線起飛 | `https://www.kia.gov.tw/API/InstantSchedule.ashx?AirFlyLine=1&AirFlyIO=1` | JSON |
| 3 | 國內線抵達 | `https://www.kia.gov.tw/API/InstantSchedule.ashx?AirFlyLine=2&AirFlyIO=2` | JSON |
| 4 | 國內線起飛 | `https://www.kia.gov.tw/API/InstantSchedule.ashx?AirFlyLine=2&AirFlyIO=1` | JSON |

**參數說明:**
- `AirFlyLine`: `1`=國際線, `2`=國內線
- `AirFlyIO`: `1`=出境(起飛), `2`=入境(抵達)

## Response Structure

```json
[
    {
        "expectTime": "06:30",
        "realTime": "06:36",
        "airLineName": "泰國獅航",
        "airLineCode": "TLM",
        "airLineLogo": "https://www.kia.gov.tw/images/ALL-square/SL.png",
        "airLineUrl": "https://www.kia.gov.tw/contact.html#泰國獅航",
        "airLineNum": "SL392",
        "upAirportCode": "DMK",
        "upAirportName": "曼谷/廊曼",
        "airPlaneType": "B739",
        "airBoardingGate": "24",
        "airFlyStatus": "抵達",
        "airFlyDelayCause": ""
    }
]
```

## Field Specification

| # | 代號 | Name | Type | Max Size | Description / Values |
|---|------|------|------|----------|---------------------|
| 1 | `expectTime` | 表定時間 | Char | 5 | HH:mm 格式 (24h). 抵達/起飛表訂時間 |
| 2 | `realTime` | 實際/預計時間 | Char | 5 | HH:mm 格式 (24h). 實際或預估更新時間 |
| 3 | `airLineName` | 航空公司中文 | Char | 12 | 中文全名. Ex: `立榮航空`, `華信航空`, `台灣虎航`, `中華航空`, `長榮航空`, `德安航空`, `泰國獅航` |
| 4 | `airLineCode` | 航空公司代碼 | Char | 3 | ICAO 航空代碼 (3碼). Ex: `UIA`, `MDA`, `TTW`, `CAL`, `EVA`, `SJX`, `DAC`, `TLM`, `AIQ`, `AXM` |
| 5 | `airLineLogo` | 航空公司 Logo URL | VarChar | - | 完整 URL. Ex: `https://www.kia.gov.tw/images/ALL-square/B7.png` |
| 6 | `airLineUrl` | 航空公司聯絡頁 | VarChar | - | 聯絡資訊頁 URL. Ex: `https://www.kia.gov.tw/contact.html#立榮航空` |
| 7 | `airLineNum` | 班機編號 | Char | 7 | IATA 代碼+班次. Ex: `B78690`, `AE332`, `SL392`, `IT284`, `CI166` |
| 8 | `upAirportCode` | 出發地機場代碼 | Char | 3 | IATA 格式 (入境航班). Ex: `MZG`, `KNH`, `HKG`, `NRT`, `ICN`, `DMK`, `KUL`, `CMJ`, `WOT` |
| 9 | `upAirportName` | 出發地機場中文 | VarChar | - | Ex: `澎湖`, `金門`, `香港`, `曼谷/廊曼`, `吉隆坡`, `七美`, `望安` |
| 10 | `goalAirportCode` | 目的地機場代碼 | Char | 3 | IATA 格式 (出境航班). Ex: `KIX`, `ICN`, `MZG`, `KNH`, `NRT` |
| 11 | `goalAirportName` | 目的地機場中文 | VarChar | - | Ex: `大阪/關西`, `仁川`, `澎湖`, `金門` |
| 12 | `airPlaneType` | 機型 | Char | 8 | ICAO 機型代碼. Ex: `B739`, `320`, `A320`, `A321`, `B738`, `AT76`, `DHC6` |
| 13 | `airBoardingGate` | 登機門 | VarChar | 4 | Ex: `""` (未指定), `24`, `25`, `28`, `17`, `14`, `15`, `4` |
| 14 | `checkInIsland` | 報到島櫃 | Char | 1 | (僅出境航班有). Ex: `D`, `C`, `B` |
| 15 | `checkInDeskRange` | 報到櫃檯範圍 | VarChar | 8 | (僅出境航班有). Ex: `12–0`, `2–0`, `4–0` |
| 16 | `airFlyStatus` | 航班狀態 | Char | 4 | 中文狀態. See [Flight Status](#flight-status-values) |
| 17 | `airFlyDelayCause` | 備註/延遲原因 | VarChar | - | Ex: `""` (正常), `"天氣影響"` |

> **Note:** `goalAirportCode`, `goalAirportName`, `checkInIsland`, `checkInDeskRange` 僅出現在出境航班資料中.
> `upAirportCode`, `upAirportName` 僅出現在入境航班資料中.

## Flight Status Values

| 中文 | English | Description |
|------|---------|-------------|
| 準時 | On Time | 航班準時 |
| 抵達 | Arrived | 已抵達 |
| 離站 | Departed | 已離站/已起飛 |
| 取消 | Cancelled | 航班取消 |
| 到站 | Arrived | 已到站 |
| 登機 | Boarding | 正在登機 |
| 延遲 | Delayed | 航班延誤 |
| 報到 | Check In | 開放報到中 |

## Airport Codes (KHH related)

| Code | 中文 | English |
|------|------|---------|
| KHH | 高雄 | Kaohsiung (IATA) |
| KHH | 高雄國際機場 | Kaohsiung Intl Airport (ICAO: RCKH) |
| RMQ | 臺中 | Taichung |
| TPE | 桃園 | Taipei Taoyuan |
| MZG | 澎湖 | Penghu / Magong |
| KNH | 金門 | Kinmen |
| CMJ | 七美 | Cimei / Qimei |
| WOT | 望安 | Wang'an |
| HKG | 香港 | Hong Kong |
| MFM | 澳門 | Macau |
| NRT | 東京成田 | Tokyo Narita |
| ICN | 仁川 | Seoul Incheon |
| OKA | 沖繩 | Okinawa |
| NGO | 名古屋 | Nagoya |
| KIX | 大阪關西 | Osaka Kansai |
| PUS | 釜山 | Busan |
| SGN | 胡志明 | Ho Chi Minh City |
| DMK | 曼谷/廊曼 | Bangkok Don Mueang |
| KUL | 吉隆坡 | Kuala Lumpur |

## Notes

- Response is a JSON **array** (`[]`), not an object wrapper.
- Updated every **2 minutes** (page meta refresh: `120` seconds).
- Times are in **Taiwan local time (UTC+8, Asia/Taipei)**.
- The `airLineNum` field includes the IATA airline code prefix (e.g., `B78690`, not just `8690`).
- The `airLineLogo` field provides a full HTTPS URL to the airline logo image.
- For arrivals: `upAirportCode`/`upAirportName` are populated, `goalAirportCode`/`goalAirportName` are absent.
- For departures: `goalAirportCode`/`goalAirportName` are populated, along with `checkInIsland`/`checkInDeskRange`.
- When `airFlyDelayCause` is empty `""`, the flight is on schedule.
