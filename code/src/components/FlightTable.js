import { LitElement, html, css } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

export class FlightTable extends LitElement {

  static properties = {
    flights: { type: Array },
    isDeparture: { type: Boolean },
    isRefreshing: { type: Boolean },
    rowHeight: { type: Number }
  };

  // Landscape mode: generous spacing, especially for status
  static COL_WIDTHS_LANDSCAPE = {
    airline: 50,
    flight: 115,
    dest: 195,
    time: 85,
    gate: 60,
    counter: 60,
    status: 240,
  };

  // Portrait mode: tighter spacing to prevent excessive horizontal scroll on vertical screens
  static COL_WIDTHS_PORTRAIT = {
    airline: 50,
    flight: 105,
    dest: 145,
    time: 85,
    gate: 60,
    counter: 60,
    status: 160,
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    /*
     * Horizontal scroll IS allowed here (mobile users can swipe left/right).
     * Vertical scroll is NOT allowed — row count is calculated to fill the height exactly.
     */
    .table-scroll-area {
      flex: 1 1 0;
      min-height: 0;
      overflow-x: auto;
      overflow-y: hidden;
      width: 100%;
      -webkit-overflow-scrolling: touch; /* smooth momentum scroll on iOS */
      overscroll-behavior-x: contain;
    }

    table {
      border-collapse: separate;
      border-spacing: 0 0.5rem;
      table-layout: fixed;
      /* min-width set inline from COL_WIDTHS sum so it can reference the JS value */
    }

    thead {
      position: sticky;
      top: 0;
      background: var(--fids-surface-2);
      color: var(--fids-dim);
      z-index: 5;
      text-align: left;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
    }

    /* Light theme: the thead shadow must be nearly invisible so it
       doesn't bleed over the first tbody row on a white background */
    :host-context(.light-theme) thead {
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
    }

    th {
      box-sizing: border-box;
      padding: var(--fids-table-th-padding, 0.5rem 0.75rem);
      text-align: left;
      font-size: var(--fids-header-font-size, 0.75rem);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      white-space: nowrap;
      border-bottom: none;
    }

    td {
      box-sizing: border-box;
      padding: 0 0.75rem;
      border-bottom: 1px solid var(--fids-separator);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    flight-table-row { display: contents; }

    .airline-logo-wrapper {
      background-color: #ffffff;
      padding: 2px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: calc(var(--fids-logo-height, 1.4em) + 6px);
      height: calc(var(--fids-logo-height, 1.4em) + 6px);
      overflow: hidden;
    }

    .airline-logo-wrapper img {
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
      object-fit: contain !important;
      border-radius: 2px;
      display: block;
    }

    :host-context(.light-theme) .airline-logo-wrapper {
      background-color: transparent;
      padding: 0;
      border-radius: 0;
      width: var(--fids-logo-height, 1.4em);
      height: var(--fids-logo-height, 1.4em);
    }


    .refreshing-row { animation: row-flash 0.5s ease-in-out; }
    @keyframes row-flash { 0% { background: rgba(59,130,246,0.15); } 100% { background: transparent; } }

    /* Subtle scrollbar so users know horizontal scroll is available */
    .table-scroll-area::-webkit-scrollbar {
      height: 4px;
    }
    .table-scroll-area::-webkit-scrollbar-track {
      background: transparent;
    }
    .table-scroll-area::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.18);
      border-radius: 2px;
    }

  `;

  constructor() {
    super();
    this.flights = [];
    this.isDeparture = true;
    this.isRefreshing = false;
    this.rowHeight = 64;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this._handleHashChange);
    window.addEventListener('popstate', this._handleHashChange);
    window.addEventListener('resize', this._handleResize);
    this._handleHashChange();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this._handleHashChange);
    window.removeEventListener('popstate', this._handleHashChange);
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize = () => {
    // Force re-render when viewport aspect ratio or scale might change
    this.requestUpdate();
  };

  _handleHashChange = () => {
    this.isDeparture = !window.location.hash.toLowerCase().includes('arrival');
  };

  getStatusClass(status) {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s.includes('到') || s.includes('arrived') || s.includes('準時') || s.includes('on time')) return 'status-ontime';
    if (s.includes('誤') || s.includes('delayed') || s.includes('改時間')) return 'status-delayed';
    if (s.includes('消') || s.includes('cancelled')) return 'status-cancelled';
    return 'status-estimated';
  }

  _getColWidths() {
    if (typeof window === 'undefined') {
      return FlightTable.COL_WIDTHS_LANDSCAPE;
    }
    
    // Choose base based on aspect ratio
    const isPortrait = window.innerHeight > window.innerWidth;
    const base = isPortrait ? FlightTable.COL_WIDTHS_PORTRAIT : FlightTable.COL_WIDTHS_LANDSCAPE;

    const scale = window.innerWidth >= 2500 ? 2.2 : 
                  window.innerWidth >= 1440 ? 1.3 : 1.0;
    return {
      airline: Math.round(base.airline * scale),
      flight: Math.round(base.flight * scale),
      dest: Math.round(base.dest * scale),
      time: Math.round(base.time * scale),
      gate: Math.round(base.gate * scale),
      counter: Math.round(base.counter * scale),
      status: Math.round(base.status * scale)
    };
  }

  render() {
    const rh = this.rowHeight || 64;
    const cw = this._getColWidths();
    const minW = cw.airline + cw.flight + cw.dest + cw.time + cw.gate + cw.counter + cw.status;

    return html`
      <div class="table-scroll-area">
        <table style=${styleMap({ width: `max(100%, ${minW}px)`, minWidth: `${minW}px` })}>
          <colgroup>
            <col style=${styleMap({ width: `${cw.airline}px` })}>
            <col style=${styleMap({ width: `${cw.flight}px` })}>
            <col style=${styleMap({ width: `${cw.dest}px` })}>
            <col style=${styleMap({ width: `${cw.time}px` })}>
            <col style=${styleMap({ width: `${cw.gate}px` })}>
            <col style=${styleMap({ width: `${cw.counter}px` })}>
            <col style=${styleMap({ width: `${cw.status}px` })}>
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th>Flight</th>
              <th>${this.isDeparture ? 'To' : 'From'}</th>
              <th style="text-align: center; padding-left: 0; padding-right: 0;">Time</th>
              <th style="text-align: center; padding-left: 0; padding-right: 0;">Gate</th>
              <th style="text-align: center; padding-left: 0; padding-right: 0;">${this.isDeparture ? 'Counter' : 'Baggage'}</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${this.flights.length === 0
        ? html`<tr><td colspan="7" style="text-align:center;color:var(--fids-dim);padding:2rem;">No flights found</td></tr>`
        : this.flights.map(f => html`
                  <flight-table-row
                    .flight=${f}
                    .isDeparture=${this.isDeparture}
                    .isRefreshing=${this.isRefreshing}
                    .rowHeight=${rh}
                  ></flight-table-row>
                `)
      }
          </tbody>
        </table>
      </div>
    `;
  }
}

customElements.define('flight-table', FlightTable);
