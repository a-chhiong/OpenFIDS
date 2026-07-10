# 臺北松山機場 (TSA) - 航班資料開放規格

**來源**: [臺北松山機場 即時航班資訊](https://www.tsa.gov.tw/flights/international/today)、[國內線航班資訊](https://www.tsa.gov.tw/flights/domestic/today) → 內部 API (逆向工程)

## API Endpoints

### 航班資訊 (Paging API)

航班資料需以 `POST` 方式請求, 不接受 `GET`:

| # | 名稱 | URL | 方法 |
|---|------|-----|------|
| 1 | 國際線起飛 | `https://www.tsa.gov.tw/api/airFlyTab/Paging` | POST |
| 2 | 國際線抵達 | `https://www.tsa.gov.tw/api/airFlyTab/Paging` | POST |
| 3 | 國內線起飛 | `https://www.tsa.gov.tw/api/airFlyTab/Paging` | POST |
| 4 | 國內線抵達 | `https://www.tsa.gov.tw/api/airFlyTab/Paging` | POST |

> 此 API 為松山機場網站自身使用的**內部 API**，並無正式公開文件，請合理使用。

### Request Parameters

```json
{
  "AirFlyLine": 1,          // 1=國際線, 2=國內線
  "AirFlyIO": 1,            // 1=起飛(出境), 2=抵達(入境)
  "FlightNumber": null,     // 指定航班編號篩選 (null=全部)
  "Culture": 1,             // 1=中文, 2=English, 3=日本語, 4=한국어
  "Limit": 20,              // 回傳筆數上限
  "Sort": "RealDepartureTime", // 排序欄位
  "Time": "1200",           // 當前時間 (HHmm 格式)
  "Order": "asc"            // "asc"=升冪, "desc"=降冪
}
```

**參數組合範例:**

| 目的 | `AirFlyLine` | `AirFlyIO` | `Sort` |
|------|:------------:|:----------:|--------|
| 國際線起飛 | 1 | 1 | `RealDepartureTime` |
| 國際線抵達 | 1 | 2 | `RealArrivalTime` |
| 國內線起飛 | 2 | 1 | `RealDepartureTime` |
| 國內線抵達 | 2 | 2 | `RealArrivalTime` |

### Request Example (cURL)

```bash
curl -X POST "https://www.tsa.gov.tw/api/airFlyTab/Paging" \
  -H "Content-Type: application/json" \
  -d '{
    "AirFlyLine": 1,
    "AirFlyIO": 1,
    "FlightNumber": null,
    "Culture": 1,
    "Limit": 20,
    "Sort": "RealDepartureTime",
    "Time": "1200",
    "Order": "asc"
  }'
```

## Response Structure

```json
{
  "total": 23,
  "Floor": null,
  "rows": [
    {
      "ExpectDepartureTime": "1220",
      "RealDepartureTime": "1220",
      "ExpectArrivalTime": "1435",
      "RealArrivalTime": "1435",
      "AirLineName": "上海航空公司(東方航空公司)",
      "FlightNumber": "FM802",
      "GoalAirportName": "浦東PVG",
      "UpAirportName": "台北TSA",
      "AirPlaneType": "738",
      "CheckInCount": "1",
      "AirFlyStatus": "取消Cancelled",
      "ImagePath": "/Content/Uploads/AirLline/fea2a387-534c-4ef5-b62e-7da0a275c925.jpg"
    }
  ]
}
```

## Field Specification

| # | 代號 | Name | Type | Max Size | Description / Values |
|---|------|------|------|----------|---------------------|
| 1 | `ExpectDepartureTime` | 表訂起飛時間 | Char | 4 | HHmm 格式 (24h). Ex: `1220`, `1330`, `1620` |
| 2 | `RealDepartureTime` | 實際起飛時間 | Char | 4 | HHmm 格式 (24h). 實際起飛或預估時間, 若尚未起飛則與表訂相同 |
| 3 | `ExpectArrivalTime` | 表訂抵達時間 | Char | 4 | HHmm 格式 (24h). Ex: `1435`, `1745`, `2020` |
| 4 | `RealArrivalTime` | 實際抵達時間 | Char | 4 | HHmm 格式 (24h). 實際抵達或預估時間, 入境航班為空字串時表示尚未抵達 |
| 5 | `AirLineName` | 航空公司中文 | VarChar | - | 中文全名 (含分公司註記). Ex: `長榮航空公司`, `中華航空公司`, `全日本空輸`, `上海航空公司(東方航空公司)` |
| 6 | `FlightNumber` | 班機編號 | Char | 7 | IATA 代碼+班次. Ex: `FM802`, `NH852`, `BR2176`, `CI222`, `JL098` |
| 7 | `GoalAirportName` | 目的地機場 | VarChar | - | IATA 代碼附於中文名後 (起飛航班). Ex: `浦東PVG`, `羽田HND`, `金浦GMP`, `虹橋SHA`, `廈門XMN` |
| 8 | `UpAirportName` | 出發地機場 | VarChar | - | IATA 代碼附於中文名後 (抵達航班). Ex: `台北TSA`, `金浦GMP`, `羽田HND`, `虹橋SHA` |
| 9 | `AirPlaneType` | 機型 | Char | 4 | ICAO 機型代碼. Ex: `738`, `789`, `781`, `333`, `321`, `AT7`, `32Q`, `788`, (codeshare 航班為空字串 `""`) |
| 10 | `CheckInCount` | 報到櫃檯 | VarChar | 4 | 報到櫃檯編號 (起飛航班). Ex: `1`, `2A`, `3`, `4`, `5`, `6`, 抵達航班為空字串 `""` |
| 11 | `AirFlyStatus` | 航班狀態 | VarChar | - | 中文+英文合併. See [Flight Status Values](#flight-status-values) |
| 12 | `ImagePath` | 航空公司 Logo URL | VarChar | - | 相對路徑. Ex: `/Content/Uploads/AirLline/fc167c04-f061-4246-b1dd-424344a892e7.jpg`，完整 URL 為 `https://www.tsa.gov.tw/Content/Uploads/AirLline/{guid}.jpg` |

> **Note:** `GoalAirportName` 主要出現在**起飛航班** (出境), `UpAirportName` 主要出現在**抵達航班** (入境)，但兩者皆會同時回傳。
> `RealArrivalTime` 在抵達航班為空字串 `""` 表示尚未實際抵達。
> `CheckInCount` 在抵達航班固定為空字串 `""`。

## Flight Status Values

欄位 `AirFlyStatus` 為**中文+英文合併**的字串, 無空格或分隔符。可能的取值如下:

| 中文 | English | Combined (as appears in data) | Description |
|------|---------|-------------------------------|-------------|
| 已飛 | Departed | `已飛Departed` | 航班已起飛離站 |
| 已到 | Arrived | `已到Arrived` | 航班已抵達目的地 |
| 取消 | Cancelled | `取消Cancelled` | 航班已取消 |
| 提早 | Early | `提早Early` | 航班提早出發或抵達 |

## Airport Codes (TSA related)

| Code | 中文 | English |
|------|------|---------|
| TSA | 臺北松山機場 | Taipei Songshan Airport (IATA/ICAO: RCSS) |
| TPE | 桃園 | Taipei Taoyuan |
| KHH | 高雄 | Kaohsiung |
| HND | 羽田 | Tokyo Haneda |
| GMP | 金浦 | Seoul Gimpo |
| SHA | 虹橋 | Shanghai Hongqiao |
| PVG | 浦東 | Shanghai Pudong |
| XMN | 廈門 | Xiamen |
| TFU | 天府 | Chengdu Tianfu |
| CKG | 重慶 | Chongqing |
| MZG | 澎湖 | Penghu / Magong |
| KNH | 金門 | Kinmen |
| LZN | 南竿 | Nangan / Matsu |
| MFK | 北竿 | Beigan / Matsu |
| TTT | 臺東 | Taitung |

## Notes

- 此 API 僅接受 `POST` 請求，不接受 `GET`。使用 `GET` 會回傳 `{"Message":"The requested resource does not support http method 'GET'."}`
- 站點架構：**Next.js** (CSR for FIDS 功能) + **ASP.NET** (後端 API)。航班頁面為靜態 HTML Shell，航班資料完全由瀏覽器端 JavaScript 於頁面載入後透過 API 即時擷取，並處理搜尋/篩選/切換頁籤等互動。
- 所有時間為 **臺灣本地時間 (UTC+8, Asia/Taipei)**，格式為 `HHmm` (4 碼 24h) — 與其他機場的 `HH:mm` 格式不同。
- 航班篩選功能：`FlightNumber` 傳入指定航班編號（大寫）可篩選單一航班。
- 回應包裝在 `{ total, Floor, rows: [...] }` 物件中，`rows` 為實際航班陣列。
- `ImagePath` 為**相對路徑**，需補上 `https://www.tsa.gov.tw` 字首才能存取。
- 航空公司 Logo 以 GUID 作為檔案名稱，無固定命名規則，每次上傳可能不同。
- 聯營航班 (codeshare)：`AirPlaneType` 為空字串 `""`，主航班則有機型代碼。
- 松山機場另有提供正式開放資料(Open Data)專區，請參閱 [`tsa_spec_public.md`](tsa_spec_public.md) — 透過 `data.gov.tw` 發布之公開 API。
