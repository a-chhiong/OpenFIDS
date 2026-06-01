import { LitElement, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

export class FlightTableRow extends LitElement {
  static properties = {
    flight: { type: Object },
    isDeparture: { type: Boolean },
    isRefreshing: { type: Boolean },
    rowHeight: { type: Number }
  };

  static MIN_ROW_HEIGHT = 64;

  // Since we are using Light DOM (returning 'this'), static styles won't work.
  // We use inline styles or expect global CSS for status classes.
  createRenderRoot() { return this; }



  /** * Helpers to keep render() clean 
   */
  _getStatusClass(status) {
    if (!status) return '';
    const s = status.toLowerCase();
    const map = {
      'status-ontime': ['到', '抵', '達', 'arrived', '準時', 'on time', 'gate', 'landed'],
      'status-delayed': ['誤', 'delayed', '改時間', 'late'],
      'status-cancelled': ['消', 'cancelled', '停']
    };
    for (const [className, keywords] of Object.entries(map)) {
      if (keywords.some(k => s.includes(k))) return className;
    }
    return 'status-estimated';
  }

  _getDayOffset(scheduledDate) {
    if (!scheduledDate) return 0;
    
    // 1. Create a date object for the flight (handling YYYY/MM/DD or YYYY-MM-DD)
    // We use replace to ensure compatibility, then set time to midnight local
    const flightDate = new Date(scheduledDate.replace(/\//g, '-'));
    flightDate.setHours(0, 0, 0, 0);

    // 2. Create a date object for "today" at midnight local
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Calculate the difference in milliseconds
    const diff = flightDate.getTime() - today.getTime();
    
    // 4. Return as a signed integer
    return Math.round(diff / 86400000);
  }

  render() {
    const f = this.flight || {};
    const rh = Math.max(FlightTableRow.MIN_ROW_HEIGHT, this.rowHeight || FlightTableRow.MIN_ROW_HEIGHT);
    
    // Shared Styles
    const rowStyles = styleMap({ height: `${rh}px`, maxHeight: `${rh}px`, overflow: 'hidden' });
    const cellStyles = styleMap({ height: `${rh}px`, maxHeight: `${rh}px` });
    
    // Common class for the "Ellipsis Trio" to reduce string size
    const truncate = "overflow-hidden whitespace-nowrap text-ellipsis";

    const dayOffset = this._getDayOffset(f.scheduledDate);
    const dayBadgeColor = dayOffset !== 0 ? 'var(--fids-warning, #f59e0b)' : 'var(--fids-dim)';

    const displayStatus = (f.statusZH && f.statusEN) 
      ? (f.statusZH + f.statusEN) 
      : (f.flightStatus || '');

    const logoUrl = f.airlineCode ? `https://www.taoyuan-airport.com/uploads/airlogo/${f.airlineCode.toLowerCase()}.gif` : '';

    return html`
      <style>
        /* Base Landscape (Modernized) */
        tr {
          background: rgba(255, 255, 255, 0.03);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          transition: background 0.2s ease;
        }
        tr:hover {
          background: rgba(255, 255, 255, 0.06);
        }
        .fids-cell { box-sizing: border-box; padding: 0 0.75rem; vertical-align: middle; border: none !important; }
        .fids-cell:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
        .fids-cell:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }
        
        .truncate { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .time-cell { font-variant-numeric: tabular-nums; letter-spacing: 0.5px; }
      </style>

      <tr class="${this.isRefreshing ? 'refreshing-row' : ''}" style=${rowStyles}>

        <td class="fids-cell" style=${cellStyles}>
          <div style="display:flex; align-items:center; height:100%;">
            ${logoUrl ? html`
              <img 
                src="${logoUrl}" 
                alt="${f.airlineCode}" 
                @error="${(e) => e.target.style.display = 'none'}"
                style="height: var(--fids-logo-height, 1.6em); width: auto; max-width: 2.8em; object-fit: contain; border-radius: 2px;"
              />
            ` : ''}
          </div>
        </td>

        <td class="fids-cell" style=${cellStyles}>
          <div class="truncate" style="font-weight:700; font-size:var(--fids-row-font-main, 0.95rem); letter-spacing:0.5px; line-height:1.1;">
            ${f.fullFlightNumber || '--'}
          </div>
          <div class="truncate" style="font-size:var(--fids-row-font-sub, 0.72rem); color:var(--fids-dim); margin-top:0.1em; line-height:1.1; font-weight:600;">
            ${f.airlineNameZH || ''}
          </div>
        </td>

        <td class="fids-cell" style=${cellStyles}>
          <div class="truncate" style="font-weight:700; font-size:var(--fids-row-font-main, 0.95rem); line-height:1.1;">
            ${this.isDeparture ? (f.destinationIATA || '--') : (f.originIATA || '--')}
          </div>
          <div class="truncate" style="font-size:var(--fids-row-font-city-en, 0.78rem); color:var(--fids-dim); margin-top:0.1em; line-height:1.1;">
            ${this.isDeparture ? `${f.destinationZH || ''} ${f.destinationEN || ''}` : `${f.originZH || ''} ${f.originEN || ''}`}
          </div>
        </td>

        <td class="fids-cell time-cell" style="text-align: center; padding-left: 0; padding-right: 0; ${cellStyles}">
          <div class="truncate" style="font-weight:700; font-size:var(--fids-row-font-main, 0.95rem); line-height:1.1;">
            ${f.scheduledTime?.substring(0, 5) || '--'}
            ${dayOffset !== 0 ? html`
              <sup style="font-size:0.6rem; font-weight:800; color:${dayBadgeColor};">
                ${dayOffset > 0 ? '+' : ''}${dayOffset}
              </sup>` : ''}
          </div>
          ${f.estimatedTime && f.estimatedTime !== f.scheduledTime ? html`
            <div class="truncate" style="font-size:var(--fids-row-font-sub, 0.68rem); color:#e34234; margin-top:0.1em; line-height:1.1;">
              EST ${f.estimatedTime.substring(0, 5)}
            </div>` : ''}
        </td>

        <td class="fids-cell" style="text-align: center; padding-left: 0; padding-right: 0; ${cellStyles}">
          <div class="truncate" style="font-weight:600; font-size:var(--fids-row-font-gate, 0.9rem);">${f.gate || '--'}</div>
        </td>

        <td class="fids-cell" style="text-align: center; padding-left: 0; padding-right: 0; ${cellStyles}">
          <div class="truncate" style="font-size:var(--fids-row-font-counter, 0.88rem);">
            ${this.isDeparture ? (f.checkInCounter || '--') : (f.baggageCarousel || '--')}
          </div>
        </td>

        <td class="fids-cell" style=${cellStyles}>
          <div style="display:flex; align-items:center; height:100%; overflow:hidden;">
            <flight-marquee text="${displayStatus}" statusClass="${this._getStatusClass(displayStatus)}"></flight-marquee>
          </div>
        </td>

      </tr>
    `;
  }
}

customElements.define('flight-table-row', FlightTableRow);