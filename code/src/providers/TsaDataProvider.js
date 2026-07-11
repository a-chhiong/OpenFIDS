import { FlightDataProvider } from './FlightDataProvider.js';
import { FlightInfo } from '../models/FlightInfo.js';

const TSA_METADATA = {
  intl_D: { datasetId: '37242', fallbackGuid: '42879f51-f47f-4d26-8b2b-5535c652cbde' },
  intl_A: { datasetId: '37248', fallbackGuid: '7dc1379a-9485-4491-866d-fc4f9590ffcf' },
  dom_D: { datasetId: '37317', fallbackGuid: 'c0f7d5b4-ba73-46d2-8485-6595c64c4e17' },
  dom_A: { datasetId: '37319', fallbackGuid: '3057d52f-7a71-49e1-a0d4-87ffa3449a6a' }
};

export class TsaDataProvider extends FlightDataProvider {
  /**
   * Resolves the latest GUID from data.gov.tw for a given dataset ID.
   * @param {string} datasetId
   * @returns {Promise<string|null>} Resolved GUID or null if failed
   */
  async _resolveGuid(datasetId) {
    const datasetUrl = `https://data.gov.tw/dataset/${datasetId}`;
    try {
      const html = await this.fetchThroughProxy(datasetUrl);
      const match = html.match(/GetFormaterData\?id=([a-f0-9-]+)/);
      if (match && match[1]) {
        return match[1];
      }
    } catch (err) {
      console.warn(`Failed to resolve dynamic TSA GUID for dataset ${datasetId}:`, err);
    }
    return null;
  }

  /**
   * Fetches and parses flights for TSA (Taipei Songshan Airport).
   * Uses the public Open Data API (GET-based, CORS-friendly).
   * @param {string} routeType - 'intl' | 'dom'
   * @param {string} viewType - 'D' | 'A'
   * @returns {Promise<FlightInfo[]>}
   */
  async fetchFlights(routeType, viewType) {
    const key = `${routeType}_${viewType}`;
    const template = this.config.apiEndpoints[key];
    if (!template) return [];

    let url = template;
    if (template.includes('{query_param}')) {
      const meta = TSA_METADATA[key];
      let guid = null;
      if (meta && meta.datasetId) {
        guid = await this._resolveGuid(meta.datasetId);
      }
      if (!guid) {
        guid = meta ? meta.fallbackGuid : '';
        console.log(`[TSA] Using fallback GUID for ${key}: ${guid}`);
      }
      url = template.replace('{query_param}', `id=${guid}`);
    }

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
      let year = localTimeAtAirport.getFullYear();
      
      // Handle year-crossing boundary
      if (localTimeAtAirport.getMonth() === 11 && month === 0) {
        year += 1;
      } else if (localTimeAtAirport.getMonth() === 0 && month === 11) {
        year -= 1;
      }
      return new Date(year, month, day);
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

      // Estimated / real time
      const realTime = viewType === 'D'
        ? (item.RealDepartureTime || '')
        : (item.RealArrivalTime || '');
      const realTimeDisplay = formatTime(realTime);
      let estimatedDateTime = null;
      if (realTime && realTime.trim() && realTime !== scheduledTime) {
        estimatedDateTime = new Date(`${flightDateStr}T${realTimeDisplay}`);
        const scheduledHour = parseInt(scheduledTime.substring(0, 2), 10);
        const realHour = parseInt(realTime.substring(0, 2), 10);
        if (scheduledHour >= 18 && realHour <= 6) {
          estimatedDateTime.setDate(estimatedDateTime.getDate() + 1);
        } else if (scheduledHour <= 6 && realHour >= 18) {
          estimatedDateTime.setDate(estimatedDateTime.getDate() - 1);
        }
      }

      // Flight number: AirLineIATA (2-letter) + AirLineNum
      const airlineIATA = (item.AirLineIATA || '').trim();
      const airlineNum = (item.AirLineNum || '').trim();
      const rawFlightNumber = airlineIATA && airlineNum ? `${airlineIATA}${airlineNum}` : '';

      // Airline name (honor upstream name, fall back to '-' if missing)
      const airlineNameZH = (item.AirLineName || '').trim() || '-';

      // Airport names
      const originIATA = item.UpAirportCode || '';
      const originNameZH = item.UpAirportName || '';
      const destIATA = item.GoalAirportCode || '';
      const destNameZH = item.GoalAirportName || '';

      const targetAirportCode = viewType === 'D' ? destIATA : originIATA;
      const targetAirportName = viewType === 'D' ? destNameZH : originNameZH;

      // Gate
      const gate = (item.AirBoardingGate || '').trim() || '-';

      // Status
      const { statusZH, statusEN } = this._splitStatus(item.AirFlyStatus || '');

      const props = {
        terminal: routeType === 'intl' ? 'INT' : 'DOM',
        type: viewType,
        airlineCode: (airlineIATA || item.AirLineCode || '').trim() || '-',
        airlineNameZH,
        flightNumber: airlineNum || rawFlightNumber,
        gate,
        scheduledDate: formatDate(scheduledDateTime),
        scheduledTime: scheduledTimeDisplay,
        estimatedDate: estimatedDateTime ? formatDate(estimatedDateTime) : formatDate(scheduledDateTime),
        estimatedTime: realTimeDisplay || '-',
        destinationIATA: viewType === 'D' ? (targetAirportCode || '-') : 'TSA',
        originIATA: viewType === 'D' ? 'TSA' : (targetAirportCode || '-'),
        destinationZH: viewType === 'D' ? (targetAirportName || '-') : '台北',
        originZH: viewType === 'D' ? '台北' : (targetAirportName || '-'),
        destinationEN: viewType === 'D' ? '' : 'Taipei',
        originEN: viewType === 'D' ? 'Taipei' : '',
        flightStatus: (item.AirFlyStatus || '').trim() || '-',
        aircraftType: (item.AirPlaneType || '').trim() || '-',
        viaIATA: '',
        viaEN: '',
        viaZH: '',
        baggageCarousel: '',
        checkInCounter: (item.CheckInCount || '').trim() || '-',
        statusZH: statusZH || '-',
        statusEN: statusEN || '-',
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
