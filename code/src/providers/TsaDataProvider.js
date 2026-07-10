import { FlightDataProvider } from './FlightDataProvider.js';
import { FlightInfo } from '../models/FlightInfo.js';

/**
 * Maps airline short names (from public API) to full names.
 * The public API returns 2-char short names (e.g. "華信"), we expand
 * them for consistency with the other providers' format.
 */
const SHORT_TO_FULL = {
  '華信': '華信航空公司',
  '立榮': '立榮航空公司',
  '長榮': '長榮航空公司',
  '華航': '中華航空公司',
  '全日空': '全日本空輸',
  '日航': '日本航空公司',
  '東航': '中國東方航空公司',
  '上航': '上海航空公司',
  '國航': '中國國際航空公司',
  '廈航': '廈門航空公司',
  '德威': '德威航空公司',
  '川航': '四川航空公司',
  '酷航': '酷航',
  '越捷': '越捷航空',
  '韓亞': '韓亞航空公司',
  '高爾': '高爾航空',
  '馬亞洲': '馬來西亞亞洲航空',
  '菲航': '菲律賓航空',
  '汶萊': '汶萊皇家航空',
  '聯合航空': '聯合航空',
  '南方航空': '中國南方航空',
  '青島航空': '青島航空',
  '捷星': '捷星日本航空',
  '法國航空': '法國航空',
  '荷蘭皇家航空': '荷蘭皇家航空',
  '紐西蘭航空': '紐西蘭航空',
  '新加坡航空': '新加坡航空',
  '大韓航空': '大韓航空',
  '韓進': '韓進航空',
  '海南航空': '海南航空',
  '深圳航空': '深圳航空',
  '吉祥航空': '吉祥航空',
  '春秋航空': '春秋航空',
};

export class TsaDataProvider extends FlightDataProvider {
  /**
   * Fetches and parses flights for TSA (Taipei Songshan Airport).
   * Uses the public Open Data API (GET-based, CORS-friendly).
   * @param {string} routeType - 'intl' | 'dom'
   * @param {string} viewType - 'D' | 'A'
   * @returns {Promise<FlightInfo[]>}
   */
  async fetchFlights(routeType, viewType) {
    const url = this.config.apiEndpoints[`${routeType}_${viewType}`];
    if (!url) return [];

    // Try direct GET first — the public API returns
    // Access-Control-Allow-Origin: * so CORS may permit it.
    let jsonText = await this._fetchDirect(url);

    // Fallback: use CORS proxies through the inherited method
    if (!jsonText) {
      try {
        jsonText = await this.fetchThroughProxy(url);
      } catch (e) {
        console.error('TSA proxy fetch failed:', e);
        return [];
      }
    }

    if (!jsonText) return [];

    let items = [];
    try {
      const data = JSON.parse(jsonText);
      // Public API returns a flat JSON array (not wrapped in {total, rows})
      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.contents)) {
        // allorigins.win wraps in {contents: [...]}
        items = data.contents;
      } else if (data && typeof data.contents === 'string') {
        // allorigins.win wraps in {contents: "json-string"}
        items = JSON.parse(data.contents);
      }
    } catch (e) {
      console.error('Failed to parse TSA public API JSON:', e);
      return [];
    }

    if (!Array.isArray(items) || !items.length) return [];

    // Dynamic base date in TSA timezone (+8)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTimeAtAirport = new Date(utc + (3600000 * this.config.utcOffset));
    const airportHour = localTimeAtAirport.getHours();

    const formatDate = (date) => {
      if (!date) return '';
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const formatTime = (hhmm) => {
      if (!hhmm || hhmm.length < 3) return '';
      const hh = hhmm.substring(0, 2);
      const mm = hhmm.substring(2, 4);
      return `${hh}:${mm}`;
    };

    // Parse AirFlyDate (MMdd format) into a Date object
    const parseMMDD = (mmdd) => {
      if (!mmdd || mmdd.length < 4) return null;
      const month = parseInt(mmdd.substring(0, 2), 10) - 1;
      const day = parseInt(mmdd.substring(2, 4), 10);
      return new Date(localTimeAtAirport.getFullYear(), month, day);
    };

    const result = [];

    for (const item of items) {
      const scheduledTime = viewType === 'D'
        ? (item.ExpectDepartureTime || '')
        : (item.ExpectArrivalTime || '');
      if (!scheduledTime) continue;

      const scheduledTimeDisplay = formatTime(scheduledTime);
      const flightDate = parseMMDD(item.AirFlyDate);
      if (!flightDate) continue;
      const flightDateStr = formatDate(flightDate);
      const scheduledDateTime = new Date(`${flightDateStr}T${scheduledTimeDisplay}`);

      // Day-crossing adjustment for late-night / early-morning flights
      const flightHour = parseInt(scheduledTime.substring(0, 2), 10);
      if (airportHour >= 18 && flightHour <= 6) {
        scheduledDateTime.setDate(scheduledDateTime.getDate() + 1);
      } else if (airportHour <= 6 && flightHour >= 18) {
        scheduledDateTime.setDate(scheduledDateTime.getDate() - 1);
      }

      // Estimated / real time
      const realTime = viewType === 'D'
        ? (item.RealDepartureTime || '')
        : (item.RealArrivalTime || '');
      const realTimeDisplay = formatTime(realTime);
      let estimatedDateTime = null;
      if (realTime && realTime.trim() && realTime !== scheduledTime) {
        estimatedDateTime = new Date(`${flightDateStr}T${realTimeDisplay}`);
        const realHour = parseInt(realTime.substring(0, 2), 10);
        if (airportHour >= 18 && realHour <= 6) {
          estimatedDateTime.setDate(estimatedDateTime.getDate() + 1);
        } else if (airportHour <= 6 && realHour >= 18) {
          estimatedDateTime.setDate(estimatedDateTime.getDate() - 1);
        }
      }

      // Flight number: AirLineIATA (2-letter) + AirLineNum
      const airlineIATA = (item.AirLineIATA || '').trim();
      const airlineNum = (item.AirLineNum || '').trim();
      const rawFlightNumber = airlineIATA && airlineNum ? `${airlineIATA}${airlineNum}` : '';

      // Airline name (expand short name to full)
      const shortName = (item.AirLineName || '').trim();
      const airlineNameZH = SHORT_TO_FULL[shortName] || shortName;

      // Airport names
      const originIATA = item.UpAirportCode || '';
      const originNameZH = item.UpAirportName || '';
      const destIATA = item.GoalAirportCode || '';
      const destNameZH = item.GoalAirportName || '';

      // Gate
      const gate = item.AirBoardingGate || '';

      // Status
      const { statusZH, statusEN } = this._splitStatus(item.AirFlyStatus || '');

      const props = {
        terminal: routeType === 'intl' ? 'INT' : 'DOM',
        type: viewType,
        airlineCode: airlineIATA || (item.AirLineCode || ''),
        airlineNameZH,
        flightNumber: airlineNum || rawFlightNumber,
        gate,
        scheduledDate: formatDate(scheduledDateTime),
        scheduledTime: scheduledTimeDisplay,
        estimatedDate: estimatedDateTime ? formatDate(estimatedDateTime) : formatDate(scheduledDateTime),
        estimatedTime: realTimeDisplay,
        destinationIATA: viewType === 'D' ? destIATA : originIATA,
        originIATA: viewType === 'D' ? originIATA : destIATA,
        destinationZH: viewType === 'D' ? destNameZH : '',
        originZH: viewType === 'D' ? '' : destNameZH,
        destinationEN: '',
        originEN: '',
        flightStatus: item.AirFlyStatus || '',
        aircraftType: item.AirPlaneType || '',
        viaIATA: '',
        viaEN: '',
        viaZH: '',
        baggageCarousel: '',
        checkInCounter: item.CheckInCount || '',
        statusZH,
        statusEN,
        airlineLogo: '',
        // Store raw FlightNumber for the filter in FlightViewModel
        rawFlightNumber,
      };

      const flight = new FlightInfo(props);
      if (flight.flightNumber && flight.scheduledDateTime && !isNaN(flight.scheduledDateTime.getTime())) {
        result.push(flight);
      }
    }

    return result;
  }

  /**
   * Attempts a direct GET to the public API URL.
   * The TSA public Open Data API returns Access-Control-Allow-Origin: *,
   * so CORS may permit this from the browser in many environments.
   * @param {string} url
   * @returns {Promise<string|null>}
   */
  async _fetchDirect(url) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.text();
      }
    } catch (err) {
      // Quietly fall through — CORS may block direct access
    }
    return null;
  }

  /**
   * Splits combined ZH+EN status like "已飛Departed" into separate fields.
   * @param {string} status - Combined status string
   * @returns {{ statusZH: string, statusEN: string }}
   */
  _splitStatus(status) {
    if (!status) return { statusZH: '', statusEN: '' };

    const knownEN = ['Departed', 'Arrived', 'Cancelled', 'Early'];
    for (const en of knownEN) {
      const idx = status.lastIndexOf(en);
      if (idx >= 0) {
        return {
          statusZH: status.substring(0, idx).trim(),
          statusEN: en
        };
      }
    }

    const fallbackMatch = status.match(/^([\u4e00-\u9fff]+)([A-Za-z].*)$/);
    if (fallbackMatch) {
      return {
        statusZH: fallbackMatch[1].trim(),
        statusEN: fallbackMatch[2].trim()
      };
    }

    return { statusZH: status, statusEN: '' };
  }
}
