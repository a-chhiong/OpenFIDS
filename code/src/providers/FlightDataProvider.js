export class FlightDataProvider {
  constructor(config) {
    this.config = config; // Contains airport config from Airports.js
  }

  /**
   * Resolves the logo URL for a given airline code.
   * If the airport configuration does not provide a logoBaseUrl,
   * falls back to the iata-airelines-logos repository.
   * @param {string} code - The airline IATA/ICAO code
   * @returns {string} Logo URL
   */
  getAirlineLogo(code) {
    if (!code || code === '-') return '';
    const baseUrl = this.config.logoBaseUrl;
    if (!baseUrl) {
      return `https://raw.githubusercontent.com/urbullet/iata-airelines-logos/master/scripts/airlines-logos/${code.toUpperCase()}.png`;
    }
    return baseUrl.replace('{code}', code);
  }

  /**
   * Abstract method to fetch and parse flights.
   * @param {string} routeType - 'intl' | 'dom'
   * @param {string} viewType - 'D' | 'A'
   * @returns {Promise<import('../models/FlightInfo.js').FlightInfo[]>}
   */
  async fetchFlights(routeType, viewType) {
    throw new Error('fetchFlights() must be implemented in concrete subclass');
  }

  /**
   * Helper to fetch content through CORS proxies.
   * Handles binary vs text decoding.
   * @param {string} url - Target URL to fetch
   * @param {string} encoding - 'utf-8' | 'big5'
   * @returns {Promise<string>} Clean text contents
   */
  async fetchThroughProxy(url, encoding = 'utf-8') {
    const proxies = [
      {
        url: `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
        mode: 'binary',
      },
      {
        url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        mode: 'json',
      },
    ];

    let lastError = null;
    for (const proxy of proxies) {
      try {
        const response = await fetch(proxy.url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        if (proxy.mode === 'json') {
          const json = await response.json();
          if (!json?.contents) throw new Error('Empty contents from allorigins');
          return json.contents;
        } else {
          const buffer = await response.arrayBuffer();
          const decoder = new TextDecoder(encoding);
          return decoder.decode(buffer);
        }
      } catch (err) {
        console.warn(`Proxy failed (${proxy.url}):`, err.message);
        lastError = err;
      }
    }
    throw lastError || new Error('All proxies failed');
  }
}
