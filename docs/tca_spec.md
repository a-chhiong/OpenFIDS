# 臺中國際機場 (RMQ) - 航班資料開放規格

**來源**: [臺中國際機場 開放資料專區](https://www.tca.gov.tw/cht/index.php?code=list&ids=407)

## API Endpoints

| # | 名稱 | URL | 格式 |
|---|------|-----|------|
| 1 | 即時航班(國際線抵達) | `https://www.tca.gov.tw/cht/index.php?act=fids&code=international_a` | JSON |
| 2 | 即時航班(國際線起飛) | `https://www.tca.gov.tw/cht/index.php?act=fids&code=international_l` | JSON |
| 3 | 即時航班(國內線抵達) | `https://www.tca.gov.tw/cht/index.php?act=fids&code=domestic_a` | JSON |
| 4 | 即時航班(國內線起飛) | `https://www.tca.gov.tw/cht/index.php?act=fids&code=domestic_l` | JSON |
| 5 | 最新消息 | `https://www.tca.gov.tw/cht/index.php?code=list&flag=detail&ids=407&article_id=876` | XML |

## Response Structure

```json
{
  "InstantSchedule": [
    {
      "airLineCode": "...",
      "airLineName": "...",
      "airLineIATA": "...",
      "airLineNum": "...",
      "upAirportName": "...",
      "goalAirportName": "...",
      "upAirportCode": "...",
      "goalAirportCode": "...",
      "expectDepartureTime": "...",
      "expectArrivalTime": "...",
      "CheckInCount": "...",
      "airBoardingGate": "...",
      "realArrivalTime": "...",
      "realDepartureTime": "...",
      "airFlyStatus": "...",
      "airFlyDelayCause": "...",
      "airLineimg": "..."
    }
  ]
}
```

## Field Specification

| # | 代號 | Name | Type | Max Size | Description / Values |
|---|------|------|------|----------|---------------------|
| 1 | `airLineCode` | 航空公司代碼 | Char | 3 | ICAO 航空代碼 (3碼). Ex: `MDA` (華信), `UIA` (立榮), `TTW` (虎航), `SJX` (星宇), `HKE` (香港快運), `CPA` (國泰), `JNA` (真航空), `AMU` (澳門航空), `EVA` (長榮), `VJC` (越捷), `TWB` (德威航空) |
| 2 | `airLineName` | 航空公司中文 | Char | 10 | 中文名稱. Ex: `華信航空`, `立榮航空`, `台灣虎航`, `星宇航空`, `香港快運` |
| 3 | `airLineIATA` | 航空公司 IATA | Char | 4 | IATA 航空代碼 (2碼, 右側填補空白). Ex: `AE   `, `B7   `, `IT   `, `JX   `, `UO   ` |
| 4 | `airLineNum` | 班次號碼 | Char | 4 | 航班編號. Ex: `761`, `192`, `8951` |
| 5 | `upAirportName` | 起點機場中文 | VarChar | - | Ex: `臺中`, `香港`, `澎湖`, `金門`, `仁川`, `澳門`, `胡志明` |
| 6 | `goalAirportName` | 終點機場中文 | VarChar | - | Ex: `金門`, `澎湖`, `香港`, `沖繩`, `名古屋`, `釜山`, `胡志明` |
| 7 | `upAirportCode` | 起點機場代碼 | Char | 3 | IATA 機場代碼. Ex: `RMQ` (臺中), `HKG` (香港), `MZG` (澎湖), `KNH` (金門), `ICN` (仁川), `SHI` (下地島), `MFM` (澳門) |
| 8 | `goalAirportCode` | 終點機場代碼 | Char | 3 | IATA 機場代碼. Ex: `RMQ`, `KNH`, `MZG`, `OKA`, `NGO`, `SGN`, `HKG` |
| 9 | `expectDepartureTime` | 表訂起飛時間 | Char | 5 | HH:mm 格式 (24h). Ex: `07:00`, `08:05`, `20:40` |
| 10 | `expectArrivalTime` | 表訂抵達時間 | Char | 5 | HH:mm 格式 (24h). Ex: `08:05`, `09:35`, `12:20` |
| 11 | `CheckInCount` | 報到櫃檯 | VarChar | - | 櫃檯編號 (逗號分隔). Ex: `""` (空), `"2,3,4,5,6,7,8"`, `"20,21,22,23,24"`, `"15,16,17,18,19"` |
| 12 | `airBoardingGate` | 登機門 | Char | 2 | Ex: `""` (空), `1`, `2`, `3`, `4`, `5`, `6`, `7` |
| 13 | `realArrivalTime` | 實際抵達時間 | Char | 5 | HH:mm 格式 (24h). 預估或實際抵達時間 |
| 14 | `realDepartureTime` | 實際起飛時間 | Char | 5 | HH:mm 格式 (24h). 預估或實際起飛時間 |
| 15 | `airFlyStatus` | 航班狀態 | VarChar | - | 中文/英文 雙語. See [Flight Status](#flight-status-values) |
| 16 | `airFlyDelayCause` | 延誤原因 | VarChar | - | 中文說明. Ex: `""` (準時), `"天氣影響"` |
| 17 | `airLineimg` | 航空公司 Logo | Char | 10 | 檔案名稱. Ex: `AE.png`, `B7.png`, `IT.png`, `JX.png`, `UO.png` |

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
| 請候 | Wait | 請等候 |
| 已關櫃 | Counter Closed | 報到櫃檯已關閉 |
| 報到 | Check In | 開放報到中 |

## Airport Codes (RMQ related)

| Code | 中文 | English |
|------|------|---------|
| RMQ | 臺中 | Taichung (IATA) |
| RMQ | 臺中國際機場 | Taichung Intl Airport (ICAO: RCMQ) |
| TPE | 桃園 | Taipei Taoyuan |
| KHH | 高雄 | Kaohsiung |
| MZG | 澎湖 | Penghu / Magong |
| KNH | 金門 | Kinmen |
| HKG | 香港 | Hong Kong |
| MFM | 澳門 | Macau |
| ICN | 仁川 | Seoul Incheon |
| NRT | 東京成田 | Tokyo Narita |
| OKA | 沖繩 | Okinawa |
| NGO | 名古屋 | Nagoya |
| KIX | 大阪關西 | Osaka Kansai |
| PUS | 釜山 | Busan |
| SGN | 胡志明 | Ho Chi Minh City |
| HAN | 河內 | Hanoi |
| SHI | 下地島 | Shimojishima |
| TAK | 高松 | Takamatsu |
| UKB | 神戶 | Kobe |
| KMJ | 熊本 | Kumamoto |

## Notes

- All responses are direct JSON (no HTML wrapping), served with `Content-Type: text/html` despite being JSON format.
- The data is **real-time** (隨時更新, updated whenever the page is requested).
- All 4 flight endpoints share the same 17-field schema.
- Times are in **Taiwan local time (UTC+8, Asia/Taipei)**.
- `airLineIATA` is right-padded with spaces to 4 characters.
- When `airFlyDelayCause` is empty `""`, the flight is on schedule.
- For domestic flights, `airLineCode` typically uses the ICAO code (3 chars: `MDA`, `UIA`).
- For international flights, more diverse ICAO codes appear: `TTW`, `SJX`, `HKE`, `CPA`, `JNA`, `AMU`, `EVA`, `VJC`, `TWB`.
- The `airLineimg` filename pattern is `{IATA_airline_code}.png` (e.g., `AE.png`, `B7.png`, `IT.png`, `JX.png`).
