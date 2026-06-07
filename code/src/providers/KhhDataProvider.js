import { FlightDataProvider } from './FlightDataProvider.js';
import { FlightInfo } from '../models/FlightInfo.js';

export class KhhDataProvider extends FlightDataProvider {
  /**
   * Fetches and parses flights for KHH.
   * @param {string} routeType - 'intl' | 'dom'
   * @param {string} viewType - 'D' | 'A'
   * @returns {Promise<FlightInfo[]>}
   */
  async fetchFlights(routeType, viewType) {
    const key = `${routeType}_${viewType}`;
    const url = this.config.apiEndpoints[key];
    if (!url) return [];

    const jsonText = await this.fetchThroughProxy(url, 'utf-8');
    if (!jsonText) return [];

    let items = [];
    try {
      items = JSON.parse(jsonText);
    } catch (e) {
      console.error('Failed to parse KHH JSON:', e);
      return [];
    }

    if (!Array.isArray(items)) {
      if (items && Array.isArray(items.data)) {
        items = items.data;
      } else if (items && typeof items === 'object') {
        const arrKey = Object.keys(items).find(k => Array.isArray(items[k]));
        if (arrKey) {
          items = items[arrKey];
        } else {
          return [];
        }
      } else {
        return [];
      }
    }

    // Dynamic base date calculations in KHH timezone (+8)
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

    return items
      .map(item => {
        const expectTime = item.expectTime || '';
        if (!expectTime) return null;

        // Build scheduled date/time with midnight crossing adjustments
        const scheduledDateTime = new Date(`${currentDateStr}T${expectTime}`);
        const flightHour = parseInt(expectTime.split(':')[0], 10);

        if (airportHour >= 22 && flightHour <= 6) {
          scheduledDateTime.setDate(scheduledDateTime.getDate() + 1);
        } else if (airportHour <= 6 && flightHour >= 22) {
          scheduledDateTime.setDate(scheduledDateTime.getDate() - 1);
        }

        const realTime = item.realTime || '';
        let estimatedDateTime = null;
        if (realTime && realTime.trim()) {
          estimatedDateTime = new Date(`${currentDateStr}T${realTime}`);
          const realHour = parseInt(realTime.split(':')[0], 10);
          if (airportHour >= 18 && realHour <= 6) {
            estimatedDateTime.setDate(estimatedDateTime.getDate() + 1);
          } else if (airportHour <= 6 && realHour >= 18) {
            estimatedDateTime.setDate(estimatedDateTime.getDate() - 1);
          }
        }

        const rawAirlineNum = item.airLineNum || '';
        const airlineCode = rawAirlineNum.substring(0, 2).toUpperCase();
        const flightNumber = rawAirlineNum.substring(2).trim();

        // Resolve logo url using uppercase code (e.g. IT.png)
        const airlineLogo = airlineCode
          ? this.config.logoBaseUrl.replace('{code}', airlineCode)
          : '';

        // Handle bilingual airport names (separated by / if present)
        const targetAirportName = viewType === 'D'
          ? (item.goalAirportName || '')
          : (item.upAirportName || '');
        const nameParts = targetAirportName.split('/');
        const targetNameZH = nameParts[0]?.trim() || '';
        const targetNameEN = nameParts[1]?.trim() || targetNameZH;

        const props = {
          terminal: routeType === 'intl' ? 'INT' : 'DOM',
          type: viewType,
          airlineCode,
          airlineNameZH: item.airLineName || '',
          flightNumber,
          gate: item.airBoardingGate || '',
          scheduledDate: formatDate(scheduledDateTime),
          scheduledTime: expectTime,
          estimatedDate: estimatedDateTime ? formatDate(estimatedDateTime) : '',
          estimatedTime: realTime,
          destinationIATA: viewType === 'D' ? (item.goalAirportCode || '') : 'KHH',
          originIATA: viewType === 'D' ? 'KHH' : (item.upAirportCode || ''),
          destinationZH: viewType === 'D' ? targetNameZH : '高雄',
          originZH: viewType === 'D' ? '高雄' : targetNameZH,
          destinationEN: viewType === 'D' ? targetNameEN : 'Kaohsiung',
          originEN: viewType === 'D' ? 'Kaohsiung' : targetNameEN,
          flightStatus: item.airFlyStatus || '',
          aircraftType: item.airPlaneType || '',
          viaIATA: '',
          viaEN: '',
          viaZH: '',
          baggageCarousel: '',
          checkInCounter: item.checkInIsland || '',
          statusZH: item.airFlyStatus + (item.airFlyDelayCause ? ` (${item.airFlyDelayCause})` : ''),
          statusEN: '',
          airlineLogo
        };
        return new FlightInfo(props);
      })
      .filter(f => f && f.flightNumber && f.scheduledDate && !isNaN(f.scheduledDate.getTime()));
  }
}
