import { airports } from '../config/Airports.js';
import { ProviderFactory } from '../providers/ProviderFactory.js';

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

    this.resolveState();
  }

  resolveState() {
    const hash = window.location.hash.toLowerCase();
    const params = new URLSearchParams(window.location.search);

    let airportKey = 'tpe';
    let viewType = 'D';

    // 1. Resolve Airport and View Type from hash
    const cleanedHash = hash.replace(/^#/, '');
    const hashParts = cleanedHash.split('/').filter(Boolean);

    if (hashParts.length >= 2) {
      const apt = hashParts[0];
      const view = hashParts[1];
      if (airports[apt] && (view === 'departure' || view === 'arrival')) {
        airportKey = apt;
        viewType = view === 'arrival' ? 'A' : 'D';
      }
    } else {
      const savedAirport = localStorage.getItem('openfids_airport');
      const savedViewType = localStorage.getItem('openfids_view_type');
      if (savedAirport && airports[savedAirport]) airportKey = savedAirport;
      if (savedViewType === 'A' || savedViewType === 'D') viewType = savedViewType;
    }

    // 2. Resolve Route Type
    let routeType = 'intl';
    if (params.has('route')) {
      routeType = params.get('route') === 'dom' ? 'dom' : 'intl';
    } else {
      const savedRouteType = localStorage.getItem('openfids_route_type');
      if (savedRouteType === 'intl' || savedRouteType === 'dom') {
        routeType = savedRouteType;
      }
    }

    // 3. Resolve Time Offsets
    const config = airports[airportKey];
    let fromOffset = config.defaultFrom;
    let toOffset = config.defaultTo;

    if (params.has('from')) {
      fromOffset = parseInt(params.get('from'), 10);
    } else {
      const savedFrom = localStorage.getItem('openfids_from');
      if (savedFrom !== null && !isNaN(parseInt(savedFrom, 10))) {
        fromOffset = parseInt(savedFrom, 10);
      }
    }

    if (params.has('to')) {
      toOffset = parseInt(params.get('to'), 10);
    } else {
      const savedTo = localStorage.getItem('openfids_to');
      if (savedTo !== null && !isNaN(parseInt(savedTo, 10))) {
        toOffset = parseInt(savedTo, 10);
      }
    }

    // Poka-yoke: If the airport does not support domestic flights, fallback to intl
    const hasDomestic = !!(config.apiEndpoints && config.apiEndpoints.dom_D && config.apiEndpoints.dom_A);
    if (routeType === 'dom' && !hasDomestic) {
      routeType = 'intl';
    }

    // 4. Resolve Theme Mode
    let themeMode = 'auto';
    const savedTheme = localStorage.getItem('openfids_theme_mode');
    if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'auto') {
      themeMode = savedTheme;
    }
    if (this.host) {
      this.host.themeMode = themeMode;
    }

    this.airportCode = airportKey.toUpperCase();
    this.viewType = viewType;
    this.routeType = routeType;
    this.startHourOffset = fromOffset;
    this.endHourOffset = toOffset;

    this.saveStateToLocalStorage();
    this.provider = ProviderFactory.createProvider(config);
    this.syncUrlBar();
  }

  saveStateToLocalStorage() {
    const airportKey = this.airportCode.toLowerCase();
    localStorage.setItem('openfids_airport', airportKey);
    localStorage.setItem('openfids_view_type', this.viewType);
    localStorage.setItem('openfids_route_type', this.routeType);
    localStorage.setItem('openfids_from', String(this.startHourOffset));
    localStorage.setItem('openfids_to', String(this.endHourOffset));
    if (this.host && this.host.themeMode) {
      localStorage.setItem('openfids_theme_mode', this.host.themeMode);
    }
  }

  syncUrlBar() {
    const airportKey = this.airportCode.toLowerCase();
    const viewName = this.viewType === 'A' ? 'arrival' : 'departure';
    const hash = `#/${airportKey}/${viewName}`;

    const url = new URL(window.location);
    url.searchParams.set('route', this.routeType);
    url.searchParams.set('from', this.startHourOffset >= 0 ? `+${this.startHourOffset}` : String(this.startHourOffset));
    url.searchParams.set('to', this.endHourOffset >= 0 ? `+${this.endHourOffset}` : String(this.endHourOffset));
    
    const newUrlStr = `${url.pathname}${url.search}${hash}`;
    if (window.location.hash !== hash || window.location.search !== url.search) {
      window.history.replaceState({}, '', newUrlStr);
    }
  }

  hostConnected() {
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
      this.lastHiddenTime = Date.now();
    } else if (document.visibilityState === 'visible') {
      if (this.lastHiddenTime > 0 && Date.now() - this.lastHiddenTime >= 3600000) {
        this.fetchData();
        this.nextRefreshIn = 60;
      }
    }
  };

  _syncRoute() {
    this.resolveState();
    if (this.host && typeof this.host._refreshTheme === 'function') {
      this.host._refreshTheme();
    }
    this.fetchData();
  }

  async fetchData() {
    if (this.hasLoaded) {
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }
    this.error = null;
    this.nextRefreshIn = 60;

    try {
      this.flights = await this.provider.fetchFlights(this.routeType, this.viewType);
      this.lastUpdated = new Date();
    } catch (err) {
      console.error('Provider fetch failed:', err);
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

  applyFilters() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const airportTime = new Date(utc + (3600000 * airports[this.airportCode.toLowerCase()].utcOffset));

    const startTime = new Date(airportTime.getTime() + this.startHourOffset * 60 * 60 * 1000);
    const endTime = new Date(airportTime.getTime() + this.endHourOffset * 60 * 60 * 1000);
    const viewType = (this.viewType || 'D').toUpperCase();

    this.filteredFlights = this.flights
      .filter(f => (f.type || '').toUpperCase() === viewType)
      .filter(f => {
        const fTime = f.scheduledDateTime;
        if (!fTime || isNaN(fTime.getTime())) return false;
        return fTime >= startTime && fTime <= endTime;
      })
      .sort((a, b) => a.scheduledDateTime - b.scheduledDateTime);

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

    this.saveStateToLocalStorage();
    this.syncUrlBar();
    this.applyFilters();
    this.host?.requestUpdate();
  }

  setViewType(type) {
    this.viewType = type;
    const config = airports[this.airportCode.toLowerCase()];
    this.startHourOffset = config.defaultFrom;
    this.endHourOffset = config.defaultTo;

    this.saveStateToLocalStorage();
    this.syncUrlBar();
    this.fetchData();
  }

  setAirport(airportKey) {
    const key = airportKey.toLowerCase();
    if (!airports[key]) return;

    const config = airports[key];
    this.airportCode = config.code;
    this.startHourOffset = config.defaultFrom;
    this.endHourOffset = config.defaultTo;

    // Poka-yoke: If the new airport does not support domestic flights, fallback to intl
    const hasDomestic = !!(config.apiEndpoints && config.apiEndpoints.dom_D && config.apiEndpoints.dom_A);
    if (this.routeType === 'dom' && !hasDomestic) {
      this.routeType = 'intl';
    }

    this.provider = ProviderFactory.createProvider(config);
    this.hasLoaded = false;
    this.flights = [];
    this.filteredFlights = [];

    this.saveStateToLocalStorage();
    this.syncUrlBar();

    if (this.host && typeof this.host._refreshTheme === 'function') {
      this.host._refreshTheme();
    }

    this.fetchData();
  }

  setRouteType(routeType) {
    this.routeType = routeType === 'dom' ? 'dom' : 'intl';
    this.saveStateToLocalStorage();
    this.syncUrlBar();
    this.fetchData();
  }

  updateSettings(settings) {
    const { airportCode, viewType, routeType, themeMode, startHourOffset, endHourOffset } = settings;

    let keyChanged = false;
    const airportKey = airportCode.toLowerCase();

    if (this.airportCode.toLowerCase() !== airportKey) {
      this.airportCode = airportCode;
      this.provider = ProviderFactory.createProvider(airports[airportKey]);
      keyChanged = true;
    }

    this.viewType = viewType;
    this.routeType = routeType;
    this.startHourOffset = startHourOffset;
    this.endHourOffset = endHourOffset;

    if (this.host) {
      this.host.themeMode = themeMode;
      localStorage.setItem('openfids_theme_mode', themeMode);
      if (typeof this.host._refreshTheme === 'function') {
        this.host._refreshTheme();
      }
    }

    if (keyChanged) {
      this.hasLoaded = false;
      this.flights = [];
      this.filteredFlights = [];
    }

    this.saveStateToLocalStorage();
    this.syncUrlBar();
    this.fetchData();
  }

  toggleAutoFlip() {
    this.isAutoFlipEnabled = !this.isAutoFlipEnabled;
    this.host?.requestUpdate();
  }

  getSunTimes(date = new Date()) {
    const rad = d => d * Math.PI / 180;
    const deg = r => r * 180 / Math.PI;

    const config = airports[this.airportCode.toLowerCase()];
    const { lat, lon, utcOffset } = config;

    const start = new Date(date.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((date - start) / 86_400_000);

    const B = rad((360 / 365) * (dayOfYear - 81));
    const decl = rad(23.45 * Math.sin(B));

    const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    const TC = 4 * (lon - 15 * utcOffset) + EoT;

    const cosHA = -Math.tan(rad(lat)) * Math.tan(decl);
    const HA = deg(Math.acos(Math.max(-1, Math.min(1, cosHA))));

    return {
      sunrise: 12 - HA / 15 - TC / 60,
      sunset: 12 + HA / 15 - TC / 60,
    };
  }

  computeAutoIsDark() {
    const now = new Date();
    const localHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const { sunrise, sunset } = this.getSunTimes(now);
    return localHour < sunrise || localHour >= sunset;
  }
}
