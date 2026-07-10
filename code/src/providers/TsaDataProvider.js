import { FlightDataProvider } from './FlightDataProvider.js';
import { FlightInfo } from '../models/FlightInfo.js';

export class TsaDataProvider extends FlightDataProvider {
  /**
   * Fetches and parses flights for TSA (Taipei Songshan Airport).
   * Uses a POST-based paging API — all four route/view combinations
   * hit the same endpoint with different request body parameters.
   * @param {string} routeType - 'intl' | 'dom'
   * @param {string} viewType - 'D' | 'A'
   * @returns {Promise<FlightInfo[]>}
   */
  async fetchFlights(routeType, viewType) {
    const url = this.config.apiEndpoints[`${routeType}_${viewType}`];
    if (!url) return [];

    const body = this._buildRequestBody(routeType, viewType);
    const jsonText = await this._postThroughProxy(url, body);
    if (!jsonText) return [];

    let data = null;
    try {
      data = JSON.parse(jsonText);
    } catch (e) {
      console.error('Failed to parse TSA JSON:', e);
      return [];
    }

    // Extract rows array from { total, Floor, rows: [...] }
    const items = (data && Array.isArray(data.rows)) ? data.rows : [];
    if (!items.length) return [];

    // Dynamic base date in TSA timezone (+8)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTimeAtAirport = new Date(utc + (3600000 * this.config.utcOffset));
    const currentDateStr = `${localTimeAtAirport.getFullYear()}-${String(localTimeAtAirport.getMonth() + 1).padStart(2, '0')}-${String(localTimeAtAirport.getDate()).padStart(2, '0')}`;
    const airportHour = localTimeAtAirport.getHours();

    const formatDate = (date) => {
      if (!date) return '';
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    // Helper: convert HHmm to HH:mm for display
    const formatTime = (hhmm) => {
      if (!hhmm || hhmm.length < 3) return '';
      const hh = hhmm.substring(0, 2);
      const mm = hhmm.substring(2, 4);
      return `${hh}:${mm}`;
    };

    return items
      .map(item => {
        // --- Scheduled time ---
        const scheduledTime = viewType === 'D'
          ? (item.ExpectDepartureTime || '')
          : (item.ExpectArrivalTime || '');
        if (!scheduledTime) return null;

        // Build scheduled date/time in HH:mm format for FlightInfo
        const scheduledTimeDisplay = formatTime(scheduledTime);
        const scheduledDateTime = new Date(`${currentDateStr}T${scheduledTimeDisplay}`);
        const flightHour = parseInt(scheduledTime.substring(0, 2), 10);

        if (airportHour >= 18 && flightHour <= 6) {
          scheduledDateTime.setDate(scheduledDateTime.getDate() + 1);
        } else if (airportHour <= 6 && flightHour >= 18) {
          scheduledDateTime.setDate(scheduledDateTime.getDate() - 1);
        }

        // --- Estimated / real time ---
        const realTime = viewType === 'D'
          ? (item.RealDepartureTime || '')
          : (item.RealArrivalTime || '');
        const realTimeDisplay = formatTime(realTime);
        let estimatedDateTime = null;
        if (realTime && realTime.trim()) {
          estimatedDateTime = new Date(`${currentDateStr}T${realTimeDisplay}`);
          const realHour = parseInt(realTime.substring(0, 2), 10);
          if (airportHour >= 18 && realHour <= 6) {
            estimatedDateTime.setDate(estimatedDateTime.getDate() + 1);
          } else if (airportHour <= 6 && realHour >= 18) {
            estimatedDateTime.setDate(estimatedDateTime.getDate() - 1);
          }
        }

        // --- Airline info from FlightNumber (e.g. FM802, NH852, BR2176) ---
        const rawFlightNumber = (item.FlightNumber || '').trim();
        // Extract airline IATA code (alpha prefix) and numeric flight number
        const airlineMatch = rawFlightNumber.match(/^([A-Z]+)(\d+.*)$/);
        const airlineCode = airlineMatch ? airlineMatch[1] : '';
        const flightNumber = airlineMatch ? airlineMatch[2] : rawFlightNumber;

        // --- Airport names with embedded IATA codes (e.g. "浦東PVG", "羽田HND") ---
        const targetAirportRaw = viewType === 'D'
          ? (item.GoalAirportName || '')
          : (item.UpAirportName || '');
        const sourceAirportRaw = viewType === 'D'
          ? (item.UpAirportName || '')
          : (item.GoalAirportName || '');

        // Parse name + IATA from strings like "浦東PVG"
        const parseAirport = (raw) => {
          const iataMatch = raw.match(/([A-Z]{3})$/);
          const iata = iataMatch ? iataMatch[1] : '';
          const nameZH = iataMatch ? raw.slice(0, -3).trim() : raw;
          return { nameZH, iata };
        };

        const destParsed = viewType === 'D' ? parseAirport(targetAirportRaw) : { nameZH: '臺北', iata: 'TSA' };
        const originParsed = viewType === 'D' ? { nameZH: '臺北', iata: 'TSA' } : parseAirport(targetAirportRaw);

        // --- Airline Logo from ImagePath (relative path → full URL) ---
        const imagePath = item.ImagePath || '';
        const airlineLogo = imagePath
          ? `https://www.tsa.gov.tw${imagePath}`
          : '';

        // --- Split AirFlyStatus into ZH/EN ---
        const { statusZH, statusEN } = this._splitStatus(item.AirFlyStatus || '');

        const props = {
          terminal: routeType === 'intl' ? 'INT' : 'DOM',
          type: viewType,
          airlineCode,
          airlineNameZH: item.AirLineName || '',
          flightNumber,
          gate: '',
          scheduledDate: formatDate(scheduledDateTime),
          scheduledTime: scheduledTimeDisplay,
          estimatedDate: estimatedDateTime ? formatDate(estimatedDateTime) : formatDate(scheduledDateTime),
          estimatedTime: realTimeDisplay,
          destinationIATA: viewType === 'D' ? destParsed.iata : 'TSA',
          originIATA: viewType === 'D' ? 'TSA' : originParsed.iata,
          destinationZH: viewType === 'D' ? destParsed.nameZH : '臺北',
          originZH: viewType === 'D' ? '臺北' : originParsed.nameZH,
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
          airlineLogo
        };
        return new FlightInfo(props);
      })
      .filter(f => f && f.flightNumber && f.scheduledDateTime && !isNaN(f.scheduledDateTime.getTime()));
  }

  /**
   * Builds the POST request body for the TSA paging API.
   * @param {string} routeType - 'intl' | 'dom'
   * @param {string} viewType - 'D' | 'A'
   * @returns {Object}
   */
  _buildRequestBody(routeType, viewType) {
    const airFlyLine = routeType === 'intl' ? 1 : 2;
    const airFlyIO = viewType === 'D' ? 1 : 2;
    const sort = viewType === 'D' ? 'RealDepartureTime' : 'RealArrivalTime';

    // Current time in HHmm format (TSA timezone, UTC+8)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTimeAtAirport = new Date(utc + (3600000 * (this.config.utcOffset || 8)));
    const hh = String(localTimeAtAirport.getHours()).padStart(2, '0');
    const mm = String(localTimeAtAirport.getMinutes()).padStart(2, '0');
    const timeStr = `${hh}${mm}`;

    return {
      AirFlyLine: airFlyLine,
      AirFlyIO: airFlyIO,
      FlightNumber: null,
      Culture: 1,
      Limit: 50,
      Sort: sort,
      Time: timeStr,
      Order: 'asc'
    };
  }

  /**
   * Sends a POST request through CORS proxies.
   * The TSA API only accepts POST, not GET.
   * @param {string} url - The target API URL
   * @param {Object} body - JSON request body
   * @returns {Promise<string>} Response text
   */
  async _postThroughProxy(url, body) {
    // corsproxy.io: send POST with JSON body directly to proxy
    // allorigins.win: send POST with JSON body directly to proxy
    const proxies = [
      {
        url: `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
        mode: 'binary',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      },
      {
        url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        mode: 'json',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      },
    ];

    let lastError = null;
    for (const proxy of proxies) {
      try {
        const response = await fetch(proxy.url, {
          method: proxy.method,
          headers: proxy.headers,
          body: proxy.body
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        if (proxy.mode === 'json') {
          const json = await response.json();
          if (!json?.contents) throw new Error('Empty contents from allorigins');
          return json.contents;
        } else {
          const buffer = await response.arrayBuffer();
          const decoder = new TextDecoder('utf-8');
          return decoder.decode(buffer);
        }
      } catch (err) {
        console.warn(`TSA proxy failed (${proxy.url}):`, err.message);
        lastError = err;
      }
    }
    throw lastError || new Error('All proxies failed for TSA POST API');
  }

  /**
   * Splits combined ZH+EN status like "已飛Departed" into separate fields.
   * @param {string} status - Combined status string
   * @returns {{ statusZH: string, statusEN: string }}
   */
  _splitStatus(status) {
    if (!status) return { statusZH: '', statusEN: '' };

    // Known English statuses that appear appended to Chinese text
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

    // Fallback: try to split at the first uppercase English letter
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
