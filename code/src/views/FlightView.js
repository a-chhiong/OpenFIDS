import { LitElement, html, css } from 'lit';
import { FlightViewModel } from './FlightViewModel.js';

// Explicitly import Shoelace components for Shadow DOM compatibility
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/select/select.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/option/option.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/icon/icon.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/button/button.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/alert/alert.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/input/input.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/tooltip/tooltip.js';

export class FlightView extends LitElement {
  static properties = {
    vm: { type: Object },
    isDark: { type: Boolean },
    ticker: { type: Number }
  };

  constructor() {
    super();
    this.vm = new FlightViewModel(this);
    this.isDark = true;
    this.ticker = 0;
    this.currentPage = 1;
    this.minRowsPerPage = 3;
    this.maxRowsPerPage = 20;
    this._tableBodyHeight = 0; // height available for rows (wrapper minus thead)
    this.isCompact = window.innerWidth <= 400;
    this._resizeObserver = null;
    this._clockInterval = null;
  }

  _getMinRowHeight() {
    if (typeof window === 'undefined') return 64;
    if (window.innerWidth >= 2500) return 140; // 2K and 4K resolution TVs
    if (window.innerWidth >= 1440) return 72;  // Small Desktop / 1080p
    return 64; // default / mobile
  }

  connectedCallback() {
    super.connectedCallback();
    this._applyTheme();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
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
    
    // Cap max rows to 10 on TVs (1080p, 2K, 4K) to improve readability and avoid crowding
    const currentMaxRows = window.innerWidth >= 1440 ? 10 : this.maxRowsPerPage;
    
    if (bodyHeight <= 0) {
      // Fallback before first measurement: use 65% of viewport
      return Math.max(this.minRowsPerPage, Math.min(currentMaxRows, Math.floor((window.innerHeight * 0.65) / minRH)));
    }
    // Use floor — but the adjusted row height will stretch rows to fill the gap,
    // so we never under-count (rows * adjustedRH == bodyHeight exactly).
    const possible = Math.max(this.minRowsPerPage, Math.floor(bodyHeight / minRH));
    return Math.min(currentMaxRows, possible);
  }

  /**
   * Compute the exact row height that perfectly fills the table body area.
   * We use a precise (non-floored) value so CSS distributes the space without
   * leaving a clipped gap at the bottom.
   */
  _getAdjustedRowHeight() {
    const rows = this._getRowsPerPage();
    const minRH = this._getMinRowHeight();
    if (rows <= 0 || this._tableBodyHeight <= 0) return minRH;
    
    // We explicitly floor the body height to ignore fractional sub-pixels from getBoundingClientRect.
    // Then we subtract a small safety buffer (2px) to guarantee no row borders/padding cause clipping.
    const safeBodyHeight = Math.floor(this._tableBodyHeight) - 2;
    return Math.max(minRH, Math.floor(safeBodyHeight / rows));
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (!this.shadowRoot) return;
    this._setupResizeObserver();
  }

  _setupResizeObserver() {
    if (this._resizeObserver) return; // already set up
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

    // Try to find the thead inside the flight-table shadow root
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

  toggleTheme() {
    this.isDark = !this.isDark;
    this._applyTheme();
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
  }

  formatTimeRange() {
    const now = new Date();
    const start = new Date(now.getTime() + this.vm.startHourOffset * 60 * 60 * 1000);
    const end = new Date(now.getTime() + this.vm.endHourOffset * 60 * 60 * 1000);
    const fmt = (d) => d.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' });
    return `${fmt(start)} - ${fmt(end)}`;
  }

  handleRangeChange() {
    const start = this.shadowRoot.getElementById('start-hour').value;
    const end = this.shadowRoot.getElementById('end-hour').value;
    this.vm.setRange(start, end);
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
      /* Lock host to the full viewport — no page scroll */
      display: block;
      position: fixed;
      inset: 0;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      color: var(--fids-text);
      background: var(--fids-bg);

      /* Default row and table fonts for mobile / smaller layouts */
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
    }

    :not(:defined) {
      visibility: hidden;
    }

    /* Full-height flex column — children stack vertically */
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
      /* Premium panel effect on large screens */
      background: var(--fids-bg);
      border-left: 1px solid var(--fids-separator);
      border-right: 1px solid var(--fids-separator);
      box-shadow: 0 0 50px rgba(0,0,0,0.3);
    }

    /* Header and live clock styles are managed in FlightHeader.js */

    flight-config {
      flex: 0 0 auto;
    }

    flight-alert {
      flex: 0 0 auto;
    }

    /* The table wrapper fills ALL remaining vertical space */
    .flight-table-wrapper {
      flex: 1 1 0;
      min-height: 0;
      /* Vertical overflow stays locked; horizontal is handled by flight-table internally */
      overflow: hidden;
      background-color: var(--fids-surface);
      border-radius: 4px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;
      display: flex;
      flex-direction: column;
    }

    flight-table {
      flex: 1 1 0;
      min-height: 0;
      /* Do NOT set overflow:hidden here — it would clip flight-table's
         internal horizontal scroll area in its shadow DOM. */
      display: block;
    }

    flight-pagination {
      flex: 0 0 auto;
    }

    .nav-links a {
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    sl-select {
      min-width: 130px;
      max-width: 150px;
    }

    /* Laptop / 1080p TV */
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

    /* 2K and 4K Displays */
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
    const compact = window.innerWidth <= 640;
    const adjustedRowHeight = this._getAdjustedRowHeight();

    return html`
      <div class="app-container">
        <flight-header
          title="TPE FIDS"
          .isRefreshing=${this.vm.isLoading || this.vm.isRefreshing}
        ></flight-header>

        <flight-selection
          .viewType=${this.vm.viewType}
          .startHourOffset=${this.vm.startHourOffset}
          .endHourOffset=${this.vm.endHourOffset}
          .isDark=${this.isDark}
          .compact=${compact}
          .isRefreshing=${this.vm.isRefreshing}
          .flightCount=${this.vm.filteredFlights.length}
          @view-changed=${e => { this.vm.setViewType(e.detail); this.currentPage = 1; }}
          @range-changed=${e => { this.vm.setRange(e.detail.start, e.detail.end); this.currentPage = 1; }}
          @theme-toggle=${() => { this.toggleTheme(); }}
        ></flight-selection>

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
          .isAutoFlipEnabled=${this.vm.isAutoFlipEnabled}
          @page-changed=${(e) => this._setPage(Number(e.detail.page))}
          @autoflip-toggle=${() => this.vm.toggleAutoFlip()}
        ></flight-pagination>
      </div>
    `;
  }

  getStatusClass(status) {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s.includes('到') || s.includes('arrived') || s.includes('準時') || s.includes('on time')) return 'status-ontime';
    if (s.includes('誤') || s.includes('delayed') || s.includes('改時間')) return 'status-delayed';
    if (s.includes('消') || s.includes('cancelled')) return 'status-cancelled';
    return 'status-estimated';
  }
}

customElements.define('flight-view', FlightView);

