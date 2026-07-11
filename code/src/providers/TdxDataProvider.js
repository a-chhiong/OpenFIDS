import { FlightDataProvider } from './FlightDataProvider.js';
import { FlightInfo } from '../models/FlightInfo.js';

const TAIWAN_AIRPORTS = {
  'TPE': { zh: '桃園', en: 'Taoyuan' },
  'KHH': { zh: '高雄', en: 'Kaohsiung' },
  'TSA': { zh: '台北松山', en: 'Taipei Songshan' },
  'RMQ': { zh: '台中', en: 'Taichung' },
  'MZG': { zh: '澎湖', en: 'Penghu' },
  'KNH': { zh: '金門', en: 'Kinmen' },
  'TNN': { zh: '台南', en: 'Tainan' },
  'TTT': { zh: '台東', en: 'Taitung' },
  'HUN': { zh: '花蓮', en: 'Hualien' },
  'LZN': { zh: '馬祖南竿', en: 'Matsu Nangan' },
  'MFK': { zh: '馬祖北竿', en: 'Matsu Beigan' },
  'CYI': { zh: '嘉義', en: 'Chiayi' },
  'HCN': { zh: '恆春', en: 'Hengchun' },
  'GDO': { zh: '綠島', en: 'Green Island' },
  'KYD': { zh: '蘭嶼', en: 'Lanyu' },
  'CMJ': { zh: '七美', en: 'Qimei' },
  'WOT': { zh: '望安', en: 'Wang-an' }
};

const AIRLINES = {
  'CI': { zh: '中華航空', en: 'China Airlines' },
  'AE': { zh: '華信航空', en: 'Mandarin Airlines' },
  'BR': { zh: '長榮航空', en: 'EVA Air' },
  'B7': { zh: '立榮航空', en: 'UNI Air' },
  'IT': { zh: '台灣虎航', en: 'Tigerair Taiwan' },
  'JX': { zh: '星宇航空', en: 'STARLUX Airlines' },
  'CX': { zh: '國泰航空', en: 'Cathay Pacific' },
  'SQ': { zh: '新加坡航空', en: 'Singapore Airlines' },
  'TR': { zh: '酷航', en: 'Scoot' },
  'MM': { zh: '樂桃航空', en: 'Peach Aviation' },
  'JL': { zh: '日本航空', en: 'Japan Airlines' },
  'NH': { zh: '全日空', en: 'ANA' },
  'KE': { zh: '大韓航空', en: 'Korean Air' },
  'OZ': { zh: '韓亞航空', en: 'Asiana Airlines' },
  'VJ': { zh: '越捷航空', en: 'VietJet Air' },
  'VN': { zh: '越南航空', en: 'Vietnam Airlines' },
  'FD': { zh: '泰國亞航', en: 'Thai AirAsia' },
  'AK': { zh: '亞洲航空', en: 'AirAsia' }
};

function getAirportName(code, lang) {
  const match = TAIWAN_AIRPORTS[code];
  if (match) return match[lang];
  return code;
}

function getAirlineName(code, lang) {
  const match = AIRLINES[code];
  if (match) return match[lang];
  return '-';
}

export class TdxDataProvider extends FlightDataProvider {
  /**
   * Fetches an access token if credentials are provided in localStorage.
   * If not, returns null (guest mode).
   * @private
   */
  async _getAccessToken() {
    const clientId = localStorage.getItem('openfids_tdx_client_id') || '';
    const clientSecret = localStorage.getItem('openfids_tdx_client_secret') || '';
    if (!clientId || !clientSecret) return null;

    const cachedToken = localStorage.getItem('openfids_tdx_access_token');
    const cachedExpiry = localStorage.getItem('openfids_tdx_token_expiry');
    if (cachedToken && cachedExpiry && Date.now() < parseInt(cachedExpiry, 10)) {
      return cachedToken;
    }

    try {
      const url = 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token';
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (!response.ok) throw new Error(`Token request status ${response.status}`);
      const data = await response.json();
      if (data.access_token) {
        const expiryTime = Date.now() + ((data.expires_in || 3600) - 60) * 1000;
        localStorage.setItem('openfids_tdx_access_token', data.access_token);
        localStorage.setItem('openfids_tdx_token_expiry', String(expiryTime));
        return data.access_token;
      }
    } catch (err) {
      console.warn('Failed to obtain TDX OAuth token:', err);
    }
    return null;
  }

  /**
   * Fetches and parses flights from TDX API.
   * @param {string} routeType - 'intl' | 'dom'
   * @param {string} viewType - 'D' | 'A'
   * @returns {Promise<FlightInfo[]>}
   */
  async fetchFlights(routeType, viewType) {
    const key = `${routeType}_${viewType}`;
    const url = this.config.apiEndpoints[key];
    if (!url) return [];

    const token = await this._getAccessToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let jsonText = '';
    try {
      const response = await fetch(url, { headers });
      if (response.status === 429) {
        window.dispatchEvent(new CustomEvent('tdx-rate-limited'));
      }
      if (response.ok) {
        jsonText = await response.text();
      }
    } catch (err) {
      console.warn('Direct fetch to TDX failed, trying proxy...', err);
    }

    if (!jsonText) {
      try {
        jsonText = await this.fetchThroughProxy(url);
      } catch (err) {
        console.error('All fetch methods failed for TDX:', err);
        return [];
      }
    }

    let items = [];
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed && Array.isArray(parsed.contents)) {
        items = parsed.contents;
      } else if (parsed && typeof parsed.contents === 'string') {
        items = JSON.parse(parsed.contents);
      } else if (Array.isArray(parsed)) {
        items = parsed;
      }
    } catch (e) {
      console.error('Failed to parse TDX JSON response:', e);
      return [];
    }

    if (!Array.isArray(items) || !items.length) return [];

    return items
      .map(item => {
        const airlineCode = (item.AirlineID || '').trim();
        const flightNumOnly = (item.FlightNumber || '').trim();
        if (!airlineCode || !flightNumOnly) return null;

        const arrivalAirport = (item.ArrivalAirportID || '').toUpperCase();
        const departureAirport = (item.DepartureAirportID || '').toUpperCase();
        const otherAirport = viewType === 'D' ? arrivalAirport : departureAirport;
        
        const isOtherDomestic = otherAirport in TAIWAN_AIRPORTS;
        
        if (routeType === 'dom' && !isOtherDomestic) return null;
        if (routeType === 'intl' && isOtherDomestic) return null;

        const schedTimeFull = viewType === 'D' ? item.ScheduleDepartureTime : item.ScheduleArrivalTime;
        if (!schedTimeFull) return null;
        const [scheduledDate, scheduledTime] = schedTimeFull.split('T');

        const estTimeFull = viewType === 'D'
          ? (item.ActualDepartureTime || item.EstimatedDepartureTime || '')
          : (item.ActualArrivalTime || item.EstimatedArrivalTime || '');
        let estimatedDate = scheduledDate;
        let estimatedTime = '';
        if (estTimeFull) {
          const parts = estTimeFull.split('T');
          estimatedDate = parts[0] || scheduledDate;
          estimatedTime = parts[1] || '';
        }

        const airlineNameZH = getAirlineName(airlineCode, 'zh');
        const originZH = getAirportName(departureAirport, 'zh');
        const originEN = getAirportName(departureAirport, 'en');
        const destinationZH = getAirportName(arrivalAirport, 'zh');
        const destinationEN = getAirportName(arrivalAirport, 'en');

        const airlineLogo = this.getAirlineLogo(airlineCode);

        const statusZH = viewType === 'D' ? (item.DepartureRemark || '') : (item.ArrivalRemark || '');
        const statusEN = viewType === 'D' ? (item.DepartureRemarkEn || '') : (item.ArrivalRemarkEn || '');

        return new FlightInfo({
          terminal: item.Terminal || '',
          type: viewType,
          airlineCode,
          airlineNameZH,
          flightNumber: flightNumOnly,
          gate: item.Gate || '',
          scheduledDate,
          scheduledTime: scheduledTime ? scheduledTime.substring(0, 5) : '',
          estimatedDate,
          estimatedTime: estimatedTime ? estimatedTime.substring(0, 5) : '',
          destinationIATA: arrivalAirport,
          originIATA: departureAirport,
          destinationZH,
          destinationEN,
          originZH,
          originEN,
          flightStatus: statusEN || statusZH,
          aircraftType: item.AcType || '',
          baggageCarousel: item.BaggageClaim || '',
          checkInCounter: item.CheckCounter || '',
          statusZH,
          statusEN,
          airlineLogo
        });
      })
      .filter(f => f && f.flightNumber && f.scheduledDate);
  }
}
