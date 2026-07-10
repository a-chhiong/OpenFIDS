# 臺灣桃園國際機場 (TPE) - 航班資料開放規格

**來源**: [臺灣桃園國際機場 即時航班資訊](https://www.taoyuan-airport.com/flights) → 原始 CSV 資料: [`a_flight_v6.txt`](https://www.taoyuan-airport.com/uploads/flightx/a_flight_v6.txt)

## API Endpoints

| # | 名稱 | URL | 格式 |
|---|------|-----|------|
| 1 | 即時航班資訊 (全部航廈, 所有航班) | `https://www.taoyuan-airport.com/uploads/flightx/a_flight_v6.txt` | CSV (Big5 編碼) |

> 此單一 CSV 檔案涵蓋所有航廈 (T1/T2) 及所有航班 (入境/出境)，每筆記錄固定 22 個欄位，以逗號分隔，無引號包裹。

## Field Specification

| # | 代號 | Item | Type | Max Size | Description / Values |
|---|------|------|------|----------|---------------------|
| 1 | `terminal` | 航廈 | Char | 1 | `1`: 第一航廈 (Terminal 1), `2`: 第二航廈 (Terminal 2) |
| 2 | `type` | 種類 | Char | 1 | `A`: 入境 (Arrival), `D`: 出境 (Departure) |
| 3 | `airlineCode` | 航空公司代碼 | Char | 2 | 航空公司 IATA 代碼 (2碼). Ex: `BR`, `CI`, `JX`, `LJ`, `KE`, `CX` |
| 4 | `airlineNameZH` | 航空公司中文 | Char | 20 | 航空公司中文名稱 (固定寬度, 右側填補空白). Ex: `長榮航空`, `中華航空`, `星宇航空` |
| 5 | `flightNumber` | 班次 | Char | 4 | 航班編號 (右側填補空白). Ex: ` 733` (3碼), `5759` (4碼) |
| 6 | `gate` | 機門 (登機門) | Char | 4 | 登機門編號. Ex: `A1`, `B1R`, `C5R`, `D11`, `D14R` |
| 7 | `scheduledDate` | 表訂日期 | Char | 10 | 格式: `YYYY/MM/DD`. Ex: `2026/07/09` |
| 8 | `scheduledTime` | 表訂時間 | Char | 8 | 格式: `HH:mm:ss` (24h). Ex: `00:10:00` |
| 9 | `estimatedDate` | 預計/實際日期 | Char | 10 | 格式: `YYYY/MM/DD`. 預估或實際日期 |
| 10 | `estimatedTime` | 預計/實際時間 | Char | 8 | 格式: `HH:mm:ss` (24h). 預估或實際時間 |
| 11 | `destinationIATA` / `originIATA` | 往來地點 (IATA) | Char | 3 | IATA 機場代碼 (抵達=出發地, 出發=目的地). Ex: `ICN`, `NRT`, `SFO`, `HKG` |
| 12 | `destinationEN` / `originEN` | 往來地點英文 | VarChar | | 英文名稱. Ex: `Incheon`, `Tokyo`, `San Francisco` |
| 13 | `destinationZH` / `originZH` | 往來地點中文 | VarChar | | 中文名稱. Ex: `仁川`, `東京`, `舊金山` |
| 14 | `flightStatus` | Flight Status | Char | 23 | 航班狀態 (中文+英文合併, 無分隔符). See [Flight Status Values](#flight-status-values) |
| 15 | `aircraftType` | 機型 | Char | 8 | 航空器型號. 非空白表示為聯營主航班 (codeshare parent). 空白/空值表示 codeshare 或取消. Ex: `B777-200`, `A350-900`, `B787-10 `, `-` (取消) |
| 16 | `viaIATA` | 中途航點 (IATA) | VarChar | | IATA 機場代碼, 僅用於中途停靠航班. Ex: `VIE`, `LHR`, `AKL`, `AMS` |
| 17 | `viaEN` | 中途航點英文 | VarChar | | 英文名稱. Ex: `Vienna`, `London`, `Auckland`, `Amsterdam` |
| 18 | `viaZH` | 中途航點中文 | VarChar | | 中文名稱. Ex: `維也納`, `倫敦`, `奧克蘭`, `阿姆斯特丹` |
| 19 | `baggageCarousel` | 行李轉盤 | VarChar | | 行李轉盤編號 (僅入境航班有值). Ex: `1`, `6`, `12` |
| 20 | `checkInCounter` | 報到櫃檯 | VarChar | | 報到櫃檯編號 (僅出境航班有值). Ex: `1`, `7`, `9`, `10` |
| 21 | `statusZH` | 航班動態中文 | VarChar | | 飛機狀態中文. See [Flight Movement Status](#flight-movement-status) |
| 22 | `statusEN` | 航班動態英文 | VarChar | | 飛機狀態英文. See [Flight Movement Status](#flight-movement-status) |

## Flight Status Values

欄位 `flightStatus` (index 14) 為**中文+英文合併**的字串, 無空格或分隔符。可能的取值如下:

| 中文 | English | Combined (as appears in data) | Description |
|------|---------|-------------------------------|-------------|
| 已抵達 | Arrived | `已抵達Arrived` (9 chars) | 航班已抵達目的地 |
| 已出發 | Departed | `已出發Departed` (10 chars) | 航班已起飛離站 |
| 取消 | Cancelled | `取消Cancelled` (11 chars) | 航班已取消 |
| 延遲 | Delay | `延遲Delay` (9 chars) | 航班延誤 |
| 預計時間變更 | EST. Time Changed | `預計時間變更EST. Time Changed` (23 chars) | 預計時間已變更 |

## Flight Movement Status

欄位 `statusZH` (index 21) 與 `statusEN` (index 22) 描述**飛機目前動態階段** (非航班狀態), 僅出境航班有值:

| statusZH | statusEN | Description | Occurs |
|----------|----------|-------------|--------|
| 已飛 | `Flew` | 已起飛離場 | 1019 |
| 前往登機門 | `To Gate` | 前往登機門/靠橋中 | 950 |
| 關閉 | `Closed` | 登機門已關閉 | 6 |
| 開始降噪 | (none or Boarding) | 開始降噪/登機中 | 6 |
| 登機中 | `Boarding` | 登機中 | 1 |

> 注意: `開始降噪` 狀態在其他資料中也會以 `Boarding` 作為對應英文。

## Flight Status -> Movement Mapping

一般來說, 航班狀態與飛機動態的對應關係:

| Flight Status (index 14) | Status ZH (index 21) | Status EN (index 22) | Meaning |
|-------------------------|----------------------|----------------------|---------|
| `已抵達Arrived` | 前往登機門 | `To Gate` | 已 Landing, 正在前往登機門 |
| `已抵達Arrived` | (empty) | (empty) | 已抵達登機門已完成 |
| `已出發Departed` | 已飛 | `Flew` | 已起飛 |
| `取消Cancelled` | (empty) | (empty) | 航班取消 |

## Notes

- CSV 檔案編碼為 **Big5** (CP950), 需以 Big5 解碼才能正確顯示中文。
- 所有時間為 **臺灣本地時間 (UTC+8, Asia/Taipei)**。
- 日期格式為 `YYYY/MM/DD`, 時間格式為 `HH:mm:ss` (24h)。
- 資料為**即時更新** (real-time)。
- 所有 3756 筆記錄 (2026/07/09 資料) 均為 22 欄位, 無引號包裹, 純逗號分隔。
- 聯營航班 (codeshare): `aircraftType` (欄位 15) 為空白, 而主航班有機型資訊。
- 中途航點 (`viaIATA`, `viaEN`, `viaZH`) 僅用於有中途停靠的航班 (如 TPE→BKK→VIE), 約佔全部資料的 1%。
- 登機門 (`gate`) 最多 4 字元, 如 `D14R` (R = Remote, 遠端機坪), `B1R`, `C5R`。
- 往來地點欄位 (11, 12, 13) 在入境航班 `A` 代表**出發地**, 在出境航班 `D` 代表**目的地**。
