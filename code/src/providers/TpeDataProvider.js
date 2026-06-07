import { FlightDataProvider } from './FlightDataProvider.js';
import { FlightInfo } from '../models/FlightInfo.js';

export class TpeDataProvider extends FlightDataProvider {
  /**
   * Fetches and parses flights for TPE.
   * @param {string} routeType - 'intl' | 'dom'
   * @param {string} viewType - 'D' | 'A'
   * @returns {Promise<FlightInfo[]>}
   */
  async fetchFlights(routeType, viewType) {
    const key = `${routeType}_${viewType}`;
    const url = this.config.apiEndpoints[key] || this.config.apiEndpoints.intl_D;

    const text = await this.fetchThroughProxy(url, 'big5');
    if (!text) return [];

    const lines = this._lexCSV(text);
    return lines
      .map(row => {
        if (!row || row.length < 5) return null;
        const airlineCode = row[2]?.trim() || '';
        
        // Resolve logo url using lowercase code
        const airlineLogo = airlineCode
          ? this.config.logoBaseUrl.replace('{code}', airlineCode.toLowerCase())
          : '';

        const props = {
          terminal: row[0],
          type: row[1],
          airlineCode,
          airlineNameZH: row[3],
          flightNumber: row[4],
          gate: row[5],
          scheduledDate: row[6],
          scheduledTime: row[7],
          estimatedDate: row[8],
          estimatedTime: row[9],
          destinationIATA: row[10],
          originIATA: row[10],
          destinationEN: row[11],
          originEN: row[11],
          destinationZH: row[12],
          originZH: row[12],
          flightStatus: row[13],
          aircraftType: row[14],
          viaIATA: row[15],
          viaEN: row[16],
          viaZH: row[17],
          baggageCarousel: row[18],
          checkInCounter: row[19],
          statusZH: row[20],
          statusEN: row[21],
          airlineLogo
        };
        return new FlightInfo(props);
      })
      .filter(f => f && f.flightNumber && f.scheduledDateTime && !isNaN(f.scheduledDateTime.getTime()));
  }

  /**
   * Robust RFC 4180 compliant CSV line parser.
   * @param {string} text 
   * @returns {string[][]}
   */
  _lexCSV(text) {
    const lines = [];
    let row = [];
    let cell = '';
    let inQuotes = false;

    const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const nextChar = cleanText[i + 1];

      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            cell += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cell += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          row.push(cell.trim());
          cell = '';
        } else if (char === '\n') {
          if (i === cleanText.length - 1 && cell === '' && row.length === 0) {
            break;
          }
          row.push(cell.trim());
          lines.push(row);
          row = [];
          cell = '';
        } else {
          cell += char;
        }
      }
    }

    if (row.length > 0 || cell !== '') {
      row.push(cell.trim());
      lines.push(row);
    }

    return lines;
  }
}
