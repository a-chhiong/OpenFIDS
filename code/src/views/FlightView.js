import { LitElement, html, css } from 'lit';
import { FlightViewModel } from './FlightViewModel.js';

// Explicitly import Shoelace components for Shadow DOM compatibility
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/icon/icon.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/button/button.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/alert/alert.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/tooltip/tooltip.js';
import '../components/FlightSettingsDialog.js';

export class FlightView extends LitElement {
  static properties = {
    vm: { type: Object },
    isDark: { type: Boolean },
    isFullscreen: { type: Boolean },
    themeMode: { type: String }, // 'dark' | 'light' | 'auto'
    ticker: { type: Number },
    _isSettingsOpen: { type: Boolean }
  };

  constructor() {
    super();
    this.themeMode = 'auto';
    this.isDark = true;
    this.isFullscreen = false;
    this.ticker = 0;
    this._isSettingsOpen = false;
    this.currentPage = 1;
    this.minRowsPerPage = 3;
    this.maxRowsPerPage = 20;
    this._tableBodyHeight = 0;
    this.isCompact = window.innerWidth <= 400;
    this._resizeObserver = null;
    this._clockInterval = null;
    this._autoThemeInterval = null;
    this._onFullscreenChange = this._onFullscreenChange.bind(this);
    this.vm = new FlightViewModel(this);
  }

  _getMinRowHeight() {
    if (typeof window === 'undefined') return 64;
    if (window.innerWidth >= 2500) return 140; // 2K and 4K TV displays
    if (window.innerWidth >= 1440) return 72;  // Small Desktop / 1080p
    return 64; // default / mobile
  }

  connectedCallback() {
    super.connectedCallback();
    const savedTheme = localStorage.getItem('openfids_theme_mode');
    if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'auto') {
      this.themeMode = savedTheme;
    }
    this._refreshTheme();
    this._startAutoThemeTimer();
    document.addEventListener('fullscreenchange', this._onFullscreenChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._autoThemeInterval) {
      clearInterval(this._autoThemeInterval);
      this._autoThemeInterval = null;
    }
    document.removeEventListener('fullscreenchange', this._onFullscreenChange);
  }

  _autoFlipPage() {
    const pageCount = this._getPageCount();
    if (pageCount <= 1) return;
    this.currentPage += 1;
    if (this.currentPage > pageCount) this.currentPage = 1;
    this.requestUpdate();
  }

  _getRowsPerPage() {
    if (typeof window === 'undefined') return 10;
    const minRH = this._getMinRowHeight();
    const bodyHeight = this._tableBodyHeight || 0;
    
    const currentMaxRows = window.innerWidth >= 1440 ? 10 : this.maxRowsPerPage;
    
    if (bodyHeight <= 0) {
      return Math.max(this.minRowsPerPage, Math.min(currentMaxRows, Math.floor((window.innerHeight * 0.65) / minRH)));
    }
    
    const gap = 8;
    const possible = Math.max(this.minRowsPerPage, Math.floor((bodyHeight - gap) / (minRH + gap)));
    return Math.min(currentMaxRows, possible);
  }

  _getAdjustedRowHeight() {
    const rows = this._getRowsPerPage();
    const minRH = this._getMinRowHeight();
    if (rows <= 0 || this._tableBodyHeight <= 0) return minRH;
    
    const gap = 8;
    const totalGapsHeight = (rows + 1) * gap;
    const safeBodyHeight = Math.floor(this._tableBodyHeight) - totalGapsHeight - 2;
    
    return Math.max(minRH, Math.floor(safeBodyHeight / rows));
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (!this.shadowRoot) return;
    this._setupResizeObserver();
  }

  _setupResizeObserver() {
    if (this._resizeObserver) return;
    const wrapper = this.shadowRoot?.querySelector('.flight-table-wrapper');
    if (!wrapper) return;

    this._resizeObserver = new ResizeObserver(() => {
      this._measureTableSizes();
    });
    this._resizeObserver.observe(wrapper);
    this._measureTableSizes();
  }

  _measureTableSizes() {
    const wrapper = this.shadowRoot?.querySelector('.flight-table-wrapper');
    if (!wrapper) return;
    const wrapperHeight = wrapper.getBoundingClientRect().height;

    const flightTable = wrapper.querySelector('flight-table');
    let theadHeight = 0;
    if (flightTable?.shadowRoot) {
      const thead = flightTable.shadowRoot.querySelector('thead');
      if (thead) theadHeight = thead.getBoundingClientRect().height;
    }

    const newBodyHeight = Math.max(0, wrapperHeight - theadHeight);
    if (Math.abs(newBodyHeight - this._tableBodyHeight) > 1) {
      this._tableBodyHeight = newBodyHeight;
      this.requestUpdate();
    }
  }

  _getPageCount() {
    const rowsPerPage = this._getRowsPerPage();
    return Math.max(1, Math.ceil(this.vm.filteredFlights.length / rowsPerPage));
  }

  _setPage(page) {
    const pageCount = this._getPageCount();
    this.currentPage = Math.min(Math.max(1, page), pageCount);
    this.requestUpdate();
  }

  cycleTheme() {
    const next = { dark: 'light', light: 'auto', auto: 'dark' };
    this.themeMode = next[this.themeMode] ?? 'dark';
    localStorage.setItem('openfids_theme_mode', this.themeMode);
    this._refreshTheme();
  }

  _refreshTheme() {
    if (this.themeMode === 'light') {
      this.isDark = false;
    } else if (this.themeMode === 'dark') {
      this.isDark = true;
    } else {
      this.isDark = this.vm.computeAutoIsDark();
    }
    this._applyTheme();
  }

  _startAutoThemeTimer() {
    if (this._autoThemeInterval) return;
    this._autoThemeInterval = setInterval(() => {
      if (this.themeMode === 'auto') this._refreshTheme();
    }, 60_000);
  }

  async toggleFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  }

  _onFullscreenChange() {
    this.isFullscreen = Boolean(document.fullscreenElement);
  }

  _applyTheme() {
    document.body.classList.toggle('light-theme', !this.isDark);
    this.classList.toggle('light-theme', !this.isDark);

    if (this.isDark) {
      document.body.classList.add('sl-theme-dark');
      document.body.classList.remove('sl-theme-light');
    } else {
      document.body.classList.remove('sl-theme-dark');
      document.body.classList.add('sl-theme-light');
    }
    this.requestUpdate();
  }

  static styles = css`
    :host {
      --fids-bg: #0b0e14;
      --fids-surface: #1a1f26;
      --fids-surface-2: #242b35;
      --fids-text: #ffffff;
      --fids-accent: #ffcc00;
      --fids-dim: #94a3b8;
      --fids-success: #10b981;
      --fids-warning: #f59e0b;
      --fids-danger: #ef4444;
      --fids-separator: rgba(255, 255, 255, 0.09);
      --fids-shadow-ambient: 0 0 50px rgba(0, 0, 0, 0.3);
      --fids-shadow-surface: 0 4px 6px -1px rgba(0, 0, 0, 0.25);
      display: block;
      position: fixed;
      inset: 0;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      color: var(--fids-text);
      background: var(--fids-bg);

      --fids-row-font-main: 0.95rem;
      --fids-row-font-sub: 0.68rem;
      --fids-row-font-city-en: 0.78rem;
      --fids-row-font-gate: 0.9rem;
      --fids-row-font-counter: 0.88rem;
      --fids-row-font-badge: 0.72rem;
      --fids-row-badge-padding: 0.25rem 0.55rem;
      --fids-header-font-size: 0.75rem;
      --fids-table-th-padding: 0.5rem 0.75rem;
      --fids-logo-height: 1.4em;
    }

    :host(.light-theme) {
      --fids-bg: #f8fafc;
      --fids-surface: #ffffff;
      --fids-surface-2: #e2e8f0;
      --fids-text: #0f172a;
      --fids-dim: #64748b;
      --fids-accent: #eab308;
      --fids-separator: rgba(0, 0, 0, 0.1);
      --fids-shadow-ambient: 0 0 30px rgba(100, 116, 139, 0.08);
      --fids-shadow-surface: 0 1px 3px rgba(0, 0, 0, 0.06);
    }

    :not(:defined) {
      visibility: hidden;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      max-width: 1920px;
      margin: 0 auto;
      box-sizing: border-box;
      overflow: hidden;
      padding: 0.25rem 0.5rem;
      background: var(--fids-bg);
      border-left: 1px solid var(--fids-separator);
      border-right: 1px solid var(--fids-separator);
      box-shadow: var(--fids-shadow-ambient);
    }

    flight-alert {
      flex: 0 0 auto;
    }

    .flight-table-wrapper {
      flex: 1 1 0;
      min-height: 0;
      overflow: hidden;
      background-color: var(--fids-surface);
      border-radius: 4px;
      box-shadow: var(--fids-shadow-surface);
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;
      display: flex;
      flex-direction: column;
    }

    flight-table {
      flex: 1 1 0;
      min-height: 0;
      display: block;
    }

    flight-pagination {
      flex: 0 0 auto;
    }

    @media (min-width: 1440px) {
      :host {
        --fids-row-font-main: 1.3rem;
        --fids-row-font-sub: 0.95rem;
        --fids-row-font-city-en: 1.1rem;
        --fids-row-font-gate: 1.2rem;
        --fids-row-font-counter: 1.15rem;
        --fids-row-font-badge: 1.0rem;
        --fids-row-badge-padding: 0.35rem 0.7rem;
        --fids-header-font-size: 1.0rem;
        --fids-table-th-padding: 0.7rem 0.9rem;
        --fids-logo-height: 1.9em;
      }
      .app-container {
        max-width: 100%;
        padding: 0.5rem 1rem;
      }
    }

    @media (min-width: 2500px) {
      :host {
        --fids-row-font-main: 2.2rem;
        --fids-row-font-sub: 1.6rem;
        --fids-row-font-city-en: 1.8rem;
        --fids-row-font-gate: 2.0rem;
        --fids-row-font-counter: 1.9rem;
        --fids-row-font-badge: 1.7rem;
        --fids-row-badge-padding: 0.6rem 1.2rem;
        --fids-header-font-size: 1.8rem;
        --fids-table-th-padding: 1.4rem 1.6rem;
        --fids-logo-height: 2.2em;
      }
    }
  `;

  render() {
    const isDeparture = this.vm.viewType === 'D';
    const rowsPerPage = this._getRowsPerPage();
    const pageCount = this._getPageCount();
    if (this.currentPage > pageCount) {
      this.currentPage = 1;
    }
    const offset = (this.currentPage - 1) * rowsPerPage;
    const pageFlights = /** @type {any[]} */ (this.vm.filteredFlights.slice(offset, offset + rowsPerPage));
    const adjustedRowHeight = this._getAdjustedRowHeight();

    return html`
      <div class="app-container">
        <flight-header
          .airportCode=${this.vm.airportCode}
          .viewType=${this.vm.viewType}
          .isRefreshing=${this.vm.isLoading || this.vm.isRefreshing}
          @open-settings=${() => { this._isSettingsOpen = true; }}
          @theme-toggle=${() => { this.cycleTheme(); }}
        ></flight-header>

        <flight-settings-dialog
          .open=${this._isSettingsOpen}
          .viewType=${this.vm.viewType}
          .startHourOffset=${this.vm.startHourOffset}
          .endHourOffset=${this.vm.endHourOffset}
          .airportCode=${this.vm.airportCode}
          .routeType=${this.vm.routeType}
          .themeMode=${this.themeMode}
          @close-dialog=${() => { this._isSettingsOpen = false; }}
          @confirm-settings=${e => {
            this.vm.updateSettings(e.detail);
            this.currentPage = 1;
            this._isSettingsOpen = false;
          }}
        ></flight-settings-dialog>

        <flight-alert
          .message=${this.vm.error || ''}
          variant="danger"
          .open=${Boolean(this.vm.error && !this.vm.hasLoaded)}
        ></flight-alert>

        <div class="flight-table-wrapper">
          <flight-table
            .flights=${/** @type {never[]} */ (pageFlights)}
            .isDeparture=${isDeparture}
            .isRefreshing=${this.vm.isRefreshing}
            .rowHeight=${adjustedRowHeight}
          ></flight-table>
        </div>

        <flight-pagination
          .currentPage=${this.currentPage}
          .pageCount=${pageCount}
          .flightCount=${this.vm.filteredFlights.length}
          .isAutoFlipEnabled=${this.vm.isAutoFlipEnabled}
          .isFullscreen=${this.isFullscreen}
          @page-changed=${(e) => this._setPage(Number(e.detail.page))}
          @autoflip-toggle=${() => this.vm.toggleAutoFlip()}
          @fullscreen-toggle=${() => { this.toggleFullscreen(); }}
        ></flight-pagination>
      </div>
    `;
  }
}

customElements.define('flight-view', FlightView);
