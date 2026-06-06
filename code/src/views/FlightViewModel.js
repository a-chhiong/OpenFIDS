import { FlightInfo } from '../models/FlightInfo.js';

export class FlightViewModel {
  constructor(host) {
    this.host = host;
    if (host && typeof host.addController === 'function') {
      host.addController(this);
    }

    this.flights = [];
    this.filteredFlights = [];
    this.lastUpdated = null;
    this.isLoading = false;
    this.isRefreshing = false;
    this.error = null;
    this.hasLoaded = false;
    this.nextRefreshIn = 60;
    this.isAutoFlipEnabled = true;

    this.timerRefresh = null;
    this.timerCountdown = null;
    this.timerPage = null;

    const hash = window.location.hash.toLowerCase();
    const routeType = hash.includes('arrival') ? 'A' : hash.includes('departure') ? 'D' : 'D';

    const params = new URLSearchParams(window.location.search);
    this.viewType = routeType;

    this.startHourOffset = parseInt(params.get('from') || this.defaultFrom);
    this.endHourOffset = parseInt(params.get('to') || this.defaultTo);
  }

  get defaultFrom() {
    return this.viewType === 'D' ? '-1' : '-1';
  }

  get defaultTo() {
    return this.viewType === 'D' ? '6' : '6';
  }

  hostConnected() {
    this._syncRoute();
    this.fetchData();
    this.lastHiddenTime = 0;

    this.timerRefresh = setInterval(async () => {
      await this.fetchData();
      this.isRefreshing = true;
      this.host?.requestUpdate();
      setTimeout(() => {
        this.isRefreshing = false;
        this.host?.requestUpdate();
      }, 800);
    }, 60000);

    this.timerCountdown = setInterval(() => {
      if (!this.isLoading && this.hasLoaded) {
        this.nextRefreshIn = Math.max(0, this.nextRefreshIn - 1);
        this.host?.requestUpdate();
      }
    }, 1000);

    this.timerPage = setInterval(() => {
      if (this.isAutoFlipEnabled) {
        this.host?._autoFlipPage?.();
      }
    }, 9999);

    window.addEventListener('hashchange', this._handleHashChange);
    window.addEventListener('resize', this._handleResize);
    document.addEventListener('visibilitychange', this._handleVisibilityChange);
  }

  hostDisconnected() {
    clearInterval(this.timerRefresh);
    clearInterval(this.timerCountdown);
    clearInterval(this.timerPage);
    window.removeEventListener('hashchange', this._handleHashChange);
    window.removeEventListener('resize', this._handleResize);
    document.removeEventListener('visibilitychange', this._handleVisibilityChange);
  }

  _handleHashChange = () => this._syncRoute();
  _handleResize = () => this.host?.requestUpdate();

  _handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      // Record the exact time the app goes into the background
      this.lastHiddenTime = Date.now();
    } else if (document.visibilityState === 'visible') {
      // When coming back, check how long it was hidden
      // Only refresh if it was hidden for more than 1 hour (3600000 ms)
      if (this.lastHiddenTime > 0 && Date.now() - this.lastHiddenTime >= 3600000) {
        this.fetchData();
        this.nextRefreshIn = 60;
      }
    }
  };

  _syncRoute() {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('arrival')) {
      this.viewType = 'A';
    } else if (hash.includes('departure')) {
      this.viewType = 'D';
    }
    this.applyFilters();
    this.host?.requestUpdate();
  }

  async fetchData() {
    if (this.hasLoaded) {
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }
    this.error = null;
    this.nextRefreshIn = 60;

    const remoteUrl = 'https://www.taoyuan-airport.com/uploads/flightx/a_flight_v6.txt';

    // Proxy strategies: each entry defines how to fetch and decode the response.
    // - allorigins.win wraps the response in JSON { contents, status }, returning
    //   the body as a (possibly re-encoded) string — use JSON + string decode.
    // - corsproxy.io passes through raw bytes — use arrayBuffer + Big5 decode.
    const proxies = [
      {
        url: `https://corsproxy.io/?url=${encodeURIComponent(remoteUrl)}`,
        mode: 'binary',
      },
      {
        url: `https://api.allorigins.win/get?url=${encodeURIComponent(remoteUrl)}`,
        mode: 'json',
      },
    ];

    let success = false;
    for (const proxy of proxies) {
      try {
        const response = await fetch(proxy.url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        let text;
        if (proxy.mode === 'json') {
          // allorigins.win wraps the payload: { contents: "...", status: {...} }
          const json = await response.json();
          if (!json?.contents) throw new Error('Empty contents from allorigins');
          text = json.contents;
        } else {
          // Raw passthrough proxy — decode Big5 binary directly
          const buffer = await response.arrayBuffer();
          const decoder = new TextDecoder('big5');
          text = decoder.decode(buffer);
        }

        this.parseCSV(text);
        this.lastUpdated = new Date();
        success = true;
        break;
      } catch (err) {
        console.warn(`Proxy failed (${proxy.url}):`, err.message);
      }
    }

    if (!success) {
      this.error = `Failed to fetch live data from all available proxies. The airport server might be temporarily blocking requests.`;
      if (!this.hasLoaded) {
        this.flights = [];
        this.filteredFlights = [];
      }
    }

    this.isLoading = false;
    this.isRefreshing = false;
    this.hasLoaded = true;
    this.applyFilters();
    this.host?.requestUpdate();
  }

  parseCSV(text) {
    if (!text) return;

    const lines = this._lexCSV(text);
    this.flights = lines
      .map(row => new FlightInfo(row))
      .filter(f => f && f.flightNumber && f.scheduledDateTime && !isNaN(f.scheduledDateTime.getTime()));
  }

  /**
   * Robust RFC 4180 compliant CSV line parser.
   * Properly handles quoted values containing commas or line breaks.
   * @param {string} text 
   * @returns {string[][]} Array of unescaped row arrays
   */
  _lexCSV(text) {
    const lines = [];
    let row = [];
    let cell = '';
    let inQuotes = false;

    // Standardize line endings to LF, stripping carriage returns smoothly
    const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const nextChar = cleanText[i + 1];

      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            // Handle escaped quotes: "" inside a quoted string maps to a single "
            cell += '"';
            i++;
          } else {
            // Closing quote found
            inQuotes = false;
          }
        } else {
          cell += char;
        }
      } else {
        if (char === '"') {
          // Opening quote found
          inQuotes = true;
        } else if (char === ',') {
          // End of field
          row.push(cell.trim());
          cell = '';
        } else if (char === '\n') {
          // End of row (ignore terminal trailing empty newlines)
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

    // Push trailing data if file didn't end with a trailing newline
    if (row.length > 0 || cell !== '') {
      row.push(cell.trim());
      lines.push(row);
    }

    return lines;
  }

  applyFilters() {
    const now = new Date();
    const startTime = new Date(now.getTime() + this.startHourOffset * 60 * 60 * 1000);
    const endTime = new Date(now.getTime() + this.endHourOffset * 60 * 60 * 1000);
    const viewType = (this.viewType || 'D').toUpperCase();

    this.filteredFlights = this.flights
      .filter(f => (f.type || '').toUpperCase() === viewType)
      .filter(f => {
        const fTime = f.scheduledDateTime;
        if (!fTime || isNaN(fTime.getTime())) return false;
        return fTime >= startTime && fTime <= endTime;
      })
      .sort((a, b) => a.scheduledDateTime - b.scheduledDateTime);

    // fallback: if we have any flights in the source and none after filtering, keep all same viewType flights to avoid always showing 'No flights found' due parse drift.
    if (this.flights.length > 0 && this.filteredFlights.length === 0) {
      this.filteredFlights = this.flights
        .filter(f => (f.type || '').toUpperCase() === viewType)
        .sort((a, b) => a.scheduledDateTime - b.scheduledDateTime);
    }
  }

  setRange(start, end) {
    const s = parseInt(start, 10);
    let e = parseInt(end, 10);

    if (s >= e) {
      e = s + 1;
    }

    this.startHourOffset = s;
    this.endHourOffset = e;

    const url = new URL(window.location);
    url.searchParams.set('from', s >= 0 ? `+${s}` : s);
    url.searchParams.set('to', e >= 0 ? `+${e}` : e);
    window.history.replaceState({}, '', url);

    this.applyFilters();
    this.host?.requestUpdate();
  }

  setViewType(type) {
    this.viewType = type;

    this.startHourOffset = this.defaultFrom;
    this.endHourOffset = this.defaultTo;

    const url = new URL(window.location);
    url.searchParams.set('from', this.startHourOffset >= 0 ? `+${this.startHourOffset}` : this.startHourOffset);
    url.searchParams.set('to', this.endHourOffset >= 0 ? `+${this.endHourOffset}` : this.endHourOffset);

    const hash = type === 'A' ? '#/arrival' : '#/departure';
    window.history.replaceState({}, '', `${url.pathname}${url.search}${hash}`);
    window.dispatchEvent(new Event('hashchange'));

    this.applyFilters();
    this.host?.requestUpdate();
  }

  toggleAutoFlip() {
    this.isAutoFlipEnabled = !this.isAutoFlipEnabled;
    this.host?.requestUpdate();
  }

  // ---------------------------------------------------------------------------
  // Sunrise / Sunset (NOAA simplified algorithm)
  // Taoyuan Airport: 25.0797°N, 121.2342°E, UTC+8
  // ---------------------------------------------------------------------------
  static TPE_LAT = 25.0797;
  static TPE_LON = 121.2342;
  static TPE_UTC_OFFSET = 8;

  /**
   * Returns sunrise and sunset as local decimal hours for Taipei Airport.
   * Accurate to ±1 minute using the NOAA simplified formula.
   * @param {Date} [date]
   * @returns {{ sunrise: number, sunset: number }}
   */
  getSunTimes(date = new Date()) {
    const rad = d => d * Math.PI / 180;
    const deg = r => r * 180 / Math.PI;

    const { TPE_LAT: lat, TPE_LON: lon, TPE_UTC_OFFSET: utcOffset } = FlightViewModel;

    // Day of year
    const start = new Date(date.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((date - start) / 86_400_000);

    // Solar declination
    const B = rad((360 / 365) * (dayOfYear - 81));
    const decl = rad(23.45 * Math.sin(B));

    // Equation of time (minutes)
    const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

    // Time correction (minutes) — longitude offset from the time-zone meridian
    const TC = 4 * (lon - 15 * utcOffset) + EoT;

    // Hour angle at sunrise / sunset (degrees)
    const cosHA = -Math.tan(rad(lat)) * Math.tan(decl);
    const HA = deg(Math.acos(Math.max(-1, Math.min(1, cosHA))));

    return {
      sunrise: 12 - HA / 15 - TC / 60,
      sunset: 12 + HA / 15 - TC / 60,
    };
  }

  /**
   * Returns true when the current local clock is before sunrise or after sunset.
   * @returns {boolean}
   */
  computeAutoIsDark() {
    const now = new Date();
    const localHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const { sunrise, sunset } = this.getSunTimes(now);
    return localHour < sunrise || localHour >= sunset;
  }
}
