# 臺北松山機場 (TSA) - 航班資料開放規格 (公開 API)

**來源**: [政府資料開放平臺](https://data.gov.tw/) — 透過 `data.gov.tw` 資料集頁面解析最新 API 端點

> **注意:** API 端點中的 `id` (GUID) 可能隨時間變更。建議每次使用前先從 `data.gov.tw` 資料集頁面解析最新網址，而非直接寫死 GUID。
>
> 解析方式: 擷取資料集頁面 HTML 中 `GetFormaterData?id=` 後方的 GUID。參見 [Resolve IDs Script](#resolve-ids-script) 範例程式碼。

| # | Dataset | data.gov.tw 頁面 | API GUID |
|---|---------|-----------------|----------|
| 1 | 國際線即時離站航班 | [37242](https://data.gov.tw/dataset/37242) | `42879f51-f47f-4d26-8b2b-5535c652cbde` |
| 2 | 國際線即時到站航班 | [37248](https://data.gov.tw/dataset/37248) | `7dc1379a-9485-4491-866d-fc4f9590ffcf` |
| 3 | 國內線即時離站航班 | [37317](https://data.gov.tw/dataset/37317) | `c0f7d5b4-ba73-46d2-8485-6595c64c4e17` |
| 4 | 國內線即時到站航班 | [37319](https://data.gov.tw/dataset/37319) | `3057d52f-7a71-49e1-a0d4-87ffa3449a6a` |

## API Endpoints

所有 4 項資料集共用同一 API 結構，僅 `id` 參數不同:

| # | 名稱 | URL | 方法 |
|---|------|-----|------|
| 1 | 國際線起飛 (離站) | `https://www.tsa.gov.tw/api/publicDataArea/GetFormaterData?id=42879f51-f47f-4d26-8b2b-5535c652cbde` | GET |
| 2 | 國際線抵達 (到站) | `https://www.tsa.gov.tw/api/publicDataArea/GetFormaterData?id=7dc1379a-9485-4491-866d-fc4f9590ffcf` | GET |
| 3 | 國內線起飛 (離站) | `https://www.tsa.gov.tw/api/publicDataArea/GetFormaterData?id=c0f7d5b4-ba73-46d2-8485-6595c64c4e17` | GET |
| 4 | 國內線抵達 (到站) | `https://www.tsa.gov.tw/api/publicDataArea/GetFormaterData?id=3057d52f-7a71-49e1-a0d4-87ffa3449a6a` | GET |

## Response Structure

回傳為 JSON **陣列** (`[]`):

```json
[
  {
    "SequenceNo": 313989739,
    "ID": "8b7a5982-f4b2-4886-8b71-062a62361e07",
    "AirFlyDate": "0710",
    "AirLineCode": "MDA",
    "AirLineIATA": "AE",
    "AirLineName": "華信",
    "AirLineNum": "2375",
    "AirPlaneType": "AT7",
    "AirFlyLine": "2",
    "AirFlyIO": "1",
    "AirBoardingGate": "12",
    "UpAirportCode": "TSA",
    "UpAirportName": "台北",
    "GoalAirportCode": "MZG",
    "GoalAirportName": "澎湖",
    "ExpectDepartureTime": "1720",
    "RealDepartureTime": "1720",
    "ExpectArrivalTime": "1820",
    "RealArrivalTime": "1820",
    "AirFlyStatus": "取消Cancelled",
    "AirFlyDelayCause": "",
    "AirDrType": "PAX",
    "CheckInCount": "2A",
    "Master": "1",
    "AirFlyNO": "262800",
    "AirArType": "0",
    "AirFlyDelay": "",
    "AirFlyDelayTime": "",
    "CreateUser": "System",
    "CreateTime": "2026-07-10T20:42:02.68",
    "UpdateUser": "System",
    "UpdateTime": "2026-07-10T20:42:02.68"
  }
]
```

## Field Specification

| # | 代號 | Name | Type | Max Size | Description / Values |
|---|------|------|------|----------|---------------------|
| 1 | `SequenceNo` | 序號 | Integer | - | 資料流水號 (系統自增). Ex: `313989739` |
| 2 | `ID` | 唯一識別碼 | UUID | 36 | GUID 格式. Ex: `8b7a5982-f4b2-4886-8b71-062a62361e07` |
| 3 | `AirFlyDate` | 航班日期 | Char | 4 | MMdd 格式. Ex: `0710` (=7月10日) |
| 4 | `AirLineCode` | 航空公司代碼 (ICAO) | Char | 3 | ICAO 航空代碼 (3碼). Ex: `MDA` (華信), `UIA` (立榮), `EVA` (長榮), `CAL` (華航), `ANA` (全日空), `JAL` (日航), `CES` (東航), `CSH` (上航), `CCA` (國航), `TWB` (德威), `CSC` (川航), `CXA` (廈航) |
| 5 | `AirLineIATA` | 航空公司代碼 (IATA) | Char | 2 | IATA 航空代碼 (2碼). Ex: `AE`, `B7`, `BR`, `CI`, `NH`, `JL`, `MU`, `FM`, `CA`, `TW`, `3U`, `MF` |
| 6 | `AirLineName` | 航空公司名稱 | Char | 4 | 中文簡稱 (2字). Ex: `華信`, `立榮`, `長榮`, `華航`, `全日空`, `日航`, `東航`, `上航`, `國航`, `德威`, `川航`, `廈航` |
| 7 | `AirLineNum` | 班次號碼 | Char | 4 | 航班編號 (數字部分). Ex: `2375`, `8811`, `2069`, `9385` |
| 8 | `AirPlaneType` | 機型 | Char | 4 | ICAO 機型代碼. Ex: `AT7`, `321`, `738`, `32Q`, `788`, `789`, `781`, `333` (codeshare 航班為空字串 `""`) |
| 9 | `AirFlyLine` | 航線類別 | Char | 1 | `1`: 國際線, `2`: 國內線 |
| 10 | `AirFlyIO` | 航班方向 | Char | 1 | `1`: 離站 (出境/Departure), `2`: 到站 (入境/Arrival) |
| 11 | `AirBoardingGate` | 登機門 | Char | 2 | 登機門編號. Ex: `12`, `13`, `11`, `09`, `10`, (抵達航班為空字串 `""`) |
| 12 | `UpAirportCode` | 出發地機場代碼 | Char | 3 | IATA 機場代碼. Ex: `TSA`, `HND`, `GMP`, `SHA`, `XMN`, `PVG` |
| 13 | `UpAirportName` | 出發地機場中文 | VarChar | - | 中文名稱. Ex: `台北`, `羽田`, `金浦`, `虹橋`, `浦東`, `廈門` |
| 14 | `GoalAirportCode` | 目的地機場代碼 | Char | 3 | IATA 機場代碼. Ex: `TSA`, `MZG`, `KNH`, `HND`, `LZN`, `MFK`, `TTT` |
| 15 | `GoalAirportName` | 目的地機場中文 | VarChar | - | 中文名稱. Ex: `台北`, `澎湖`, `金門`, `羽田`, `南竿`, `北竿`, `台東` |
| 16 | `ExpectDepartureTime` | 表訂起飛時間 | Char | 4 | HHmm 格式 (24h). Ex: `1720`, `1045`, `1300` |
| 17 | `RealDepartureTime` | 實際起飛時間 | Char | 4 | HHmm 格式 (24h). 實際或預估起飛時間 (離站航班). 抵達航班填入表訂或留空 |
| 18 | `ExpectArrivalTime` | 表訂抵達時間 | Char | 4 | HHmm 格式 (24h). Ex: `1820`, `1150`, `1405` |
| 19 | `RealArrivalTime` | 實際抵達時間 | Char | 4 | HHmm 格式 (24h). 實際或預估抵達時間, 尚未抵達可能與表訂相同或留空 |
| 20 | `AirFlyStatus` | 航班狀態 | VarChar | - | 中文+英文合併. See [Flight Status Values](#flight-status-values) |
| 21 | `AirFlyDelayCause` | 延誤原因 | VarChar | - | 中文說明. Ex: `""` (正常), `"天氣影響"` |
| 22 | `AirDrType` | 資料類型 (DrType) | Char | 3 | `PAX`: 客運, `EXT`: 包機/額外, `0`: 未指定 (抵達航班) |
| 23 | `CheckInCount` | 報到櫃檯 | VarChar | 4 | 報到櫃檯編號 (離站航班). Ex: `2A`, `1A`, (抵達航班為空字串 `""`) |
| 24 | `Master` | 主/聯營標記 | Char | 1 | `1`: 主航班 (有機型), `2`: 聯營航班 (codeshare, 無機型), `3`: 次級聯營 |
| 25 | `AirFlyNO` | 航班系統編號 | Integer | - | 系統內部編號. Ex: `262800` |
| 26 | `AirArType` | 資料類型 (ArType) | Char | 3 | `PAX`: 客運, `0`: (離站航班), 空字串: 部分聯營航班 |
| 27 | `AirFlyDelay` | 延誤標記 | Char | - | 目前觀察均為空字串 `""` (可能預留欄位) |
| 28 | `AirFlyDelayTime` | 延誤時間 | Char | - | 目前觀察均為空字串 `""` (可能預留欄位) |
| 29 | `CreateUser` | 建立人員 | VarChar | - | 系統建立者. Ex: `System` |
| 30 | `CreateTime` | 建立時間 | DateTime | - | ISO 8601 格式. Ex: `2026-07-10T20:42:02.68` |
| 31 | `UpdateUser` | 更新人員 | VarChar | - | 系統更新者. Ex: `System` |
| 32 | `UpdateTime` | 更新時間 | DateTime | - | ISO 8601 格式. Ex: `2026-07-10T20:42:02.68` |

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
| FOC | 福州 | Fuzhou |
| MZG | 澎湖 | Penghu / Magong |
| KNH | 金門 | Kinmen |
| LZN | 南竿 | Nangan / Matsu |
| MFK | 北竿 | Beigan / Matsu |
| TTT | 臺東 | Taitung |
| HUN | 花蓮 | Hualien |

## Notes

- 回傳為 JSON **陣列** (`[]`)，非物件包裝 (`{}`)。與 KIA 格式相同。
- 所有時間為 **臺灣本地時間 (UTC+8, Asia/Taipei)**，格式為 `HHmm` (4 碼 24h) — 與其他機場的 `HH:mm` 格式不同。
- 日期格式為 `MMdd` (4 碼, 如 `0710` 代表 7月10日)。
- `Master` 欄位: `1`=主航班 (有機型代碼), `2`=聯營航班 (codeshare, 無機型), `3`=次級聯營。
- 聯營航班 (codeshare) 的 `AirPlaneType` 為空字串 `""`，主航班則有機型代碼。
- `AirLineName` 為**簡稱** (多為2字: `華信`, `立榮`, `長榮`, `華航`)，與內部私有 API 的 `AirLineName` (全名, 如 `華信航空公司`) 不同。
- `AirLineNum` 僅為**數字部分** (不包含 IATA 代碼前綴)，與內部私有 API 的 `FlightNumber` (含 IATA 前綴, 如 `AE2375`) 不同。
- `AirFlyLine`/`AirFlyIO` 以**數字字串**表示 (`"1"`, `"2"`)。
- `CreateUser`/`UpdateUser` 固定為 `System`，`CreateTime`/`UpdateTime` 提供時間戳記。
- `AirFlyDelay`/`AirFlyDelayTime` 為預留欄位，目前均為空字串 `""`。
- 同意使用條款: [政府資料開放授權條款](https://data.gov.tw/license)。
- API 端點中的 `id` (GUID) 為資料集發布時產生，通常穩定不變，但若 TSA 重新發布資料集則可能變更。建議實作自動解析機制，詳見 [Resolve IDs Script](#resolve-ids-script)。

### Resolve IDs Script

從 `data.gov.tw` 資料集頁面解析最新 API GUID:

```js
const https = require('https');
const ids = ['37242', '37248', '37317', '37319'];
let pending = ids.length;

ids.forEach(id => {
  https.get('https://data.gov.tw/dataset/' + id, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' }
  }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      const m = d.match(/GetFormaterData\?id=([a-f0-9-]+)/);
      if (m) {
        console.log(id + ' => ' + m[1]);
      } else {
        console.log(id + ' => NOT FOUND');
      }
      if (--pending === 0) {
        console.log('DONE');
      }
    });
  });
});
```
