import { FlightDataProvider } from './FlightDataProvider.js';
import { FlightInfo } from '../models/FlightInfo.js';

export class RmqDataProvider extends FlightDataProvider {
  /**
   * Fetches and parses flights for RMQ (Taichung International Airport).
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

    let data = null;
    try {
      data = JSON.parse(jsonText);
    } catch (e) {
      console.error('Failed to parse RMQ JSON:', e);
      return [];
    }

    // Extract the InstantSchedule array from the response
    let items = [];
    if (data && Array.isArray(data.InstantSchedule)) {
      items = data.InstantSchedule;
    } else if (Array.isArray(data)) {
      items = data;
    } else if (data && typeof data === 'object') {
      const arrKey = Object.keys(data).find(k => Array.isArray(data[k]));
      if (arrKey) items = data[arrKey];
    }

    if (!items.length) return [];

    // Dynamic base date calculations in RMQ timezone (+8)
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
        // Extract airline IATA from airLineIATA (right-padded to 4 chars)
        const rawAirlineIATA = (item.airLineIATA || '').trim();
        const airlineIATA = rawAirlineIATA || '';

        // Build flight number: combine airline IATA + airLineNum
        const rawAirlineNum = item.airLineNum || '';
        const flightNumber = rawAirlineNum.trim();

        // Determine scheduled time based on view type
        const scheduledTime = viewType === 'D'
          ? (item.expectDepartureTime || '')
          : (item.expectArrivalTime || '');
        if (!scheduledTime) return null;

        // Build scheduled date/time with midnight crossing adjustments
        const scheduledDateTime = new Date(`${currentDateStr}T${scheduledTime}:00`);
        const flightHour = parseInt(scheduledTime.split(':')[0], 10);

        if (airportHour >= 18 && flightHour <= 6) {
          scheduledDateTime.setDate(scheduledDateTime.getDate() + 1);
        } else if (airportHour <= 6 && flightHour >= 18) {
          scheduledDateTime.setDate(scheduledDateTime.getDate() - 1);
        }

        // Determine estimated/real time based on view type
        const realTime = viewType === 'D'
          ? (item.realDepartureTime || '')
          : (item.realArrivalTime || '');
        let estimatedDateTime = null;
        if (realTime && realTime.trim()) {
          estimatedDateTime = new Date(`${currentDateStr}T${realTime}:00`);
          const realHour = parseInt(realTime.split(':')[0], 10);
          if (airportHour >= 18 && realHour <= 6) {
            estimatedDateTime.setDate(estimatedDateTime.getDate() + 1);
          } else if (airportHour <= 6 && realHour >= 18) {
            estimatedDateTime.setDate(estimatedDateTime.getDate() - 1);
          }
        }

        // Resolve logo url from the airLineimg field (e.g., AE.png)
        // Strip the extension since logoBaseUrl already includes it
        const airLineimg = item.airLineimg || '';
        const logoCode = airLineimg.replace(/\.\w+$/, '');
        const airlineLogo = logoCode
          ? this.config.logoBaseUrl.replace('{code}', logoCode)
          : '';

        // Handle bilingual airport names (separated by / if present, though RMQ mostly uses Chinese)
        const targetAirportName = viewType === 'D'
          ? (item.goalAirportName || '')
          : (item.upAirportName || '');
        const nameParts = targetAirportName.split('/');
        const targetNameZH = nameParts[0]?.trim() || '';
        const targetNameEN = nameParts[1]?.trim() || targetNameZH;

        const props = {
          terminal: routeType === 'intl' ? 'INT' : 'DOM',
          type: viewType,
          airlineCode: airlineIATA,
          airlineNameZH: item.airLineName || '',
          flightNumber,
          gate: item.airBoardingGate || '',
          scheduledDate: formatDate(scheduledDateTime),
          scheduledTime: scheduledTime,
          estimatedDate: estimatedDateTime ? formatDate(estimatedDateTime) : formatDate(scheduledDateTime),
          estimatedTime: realTime,
          destinationIATA: viewType === 'D' ? (item.goalAirportCode || '') : 'RMQ',
          originIATA: viewType === 'D' ? 'RMQ' : (item.upAirportCode || ''),
          destinationZH: viewType === 'D' ? targetNameZH : '臺中',
          originZH: viewType === 'D' ? '臺中' : targetNameZH,
          destinationEN: viewType === 'D' ? targetNameEN : 'Taichung',
          originEN: viewType === 'D' ? 'Taichung' : targetNameEN,
          flightStatus: item.airFlyStatus || '',
          aircraftType: '',
          viaIATA: '',
          viaEN: '',
          viaZH: '',
          baggageCarousel: '',
          checkInCounter: item.CheckInCount || '',
          statusZH: item.airFlyStatus + (item.airFlyDelayCause ? ` (${item.airFlyDelayCause})` : ''),
          statusEN: '',
          airlineLogo
        };
        return new FlightInfo(props);
      })
      .filter(f => f && f.flightNumber && f.scheduledDateTime && !isNaN(f.scheduledDateTime.getTime()));
  }
}
