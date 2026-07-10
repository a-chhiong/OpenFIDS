import { LitElement, html, css } from 'lit';
import { airports } from '../config/Airports.js';

export class FlightHeader extends LitElement {
  static properties = {
    airportCode: { type: String },
    viewType: { type: String }, // 'D' | 'A'
    isRefreshing: { type: Boolean },
    _timeStr: { state: true },
    _dateStr: { state: true }
  };

  constructor() {
    super();
    this.airportCode = 'TPE';
    this.viewType = 'D';
    this.isRefreshing = false;
    this._updateTime();
  }

  connectedCallback() {
    super.connectedCallback();
    this._clockInterval = setInterval(() => {
      this._updateTime();
    }, 500);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._clockInterval) {
      clearInterval(this._clockInterval);
    }
  }

  _updateTime() {
    const config = airports[this.airportCode?.toLowerCase() || 'tpe'];
    const offset = config?.utcOffset ?? 8;

    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTimeAtAirport = new Date(utc + (3600000 * offset));

    const year = localTimeAtAirport.getFullYear();
    const month = String(localTimeAtAirport.getMonth() + 1).padStart(2, '0');
    const day = String(localTimeAtAirport.getDate()).padStart(2, '0');
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const ddd = dayNames[localTimeAtAirport.getDay()];

    this._dateStr = `${year}/${month}/${day}(${ddd})`;
    this._timeStr = localTimeAtAirport.toLocaleTimeString('zh-TW', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  _handleSettingsClick() {
    this.dispatchEvent(new CustomEvent('open-settings', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const config = airports[this.airportCode?.toLowerCase() || 'tpe'];
    const codeStr = config ? config.code : 'TPE';
    const nameStr = config ? config.nameZH : '桃園國際機場';

    return html`
      <header>
        <div class="header-left">
          <h1>
            <span class="airport-code">${codeStr}</span>
            <span class="airport-name">${nameStr}</span>
          </h1>
          <span class="route-badge ${this.viewType === 'D' ? 'departure' : 'arrival'}">
            ${this.viewType === 'D' ? 'DEPARTURES / 出發' : 'ARRIVALS / 抵達'}
          </span>
        </div>
        <div class="header-right">
          ${this.isRefreshing ? html`<span class="refreshing-spinner">↻</span>` : ''}
          <div class="live-clock">
            <div class="clock-date">${this._dateStr}</div>
            <div class="clock-time">${this._timeStr}</div>
          </div>
          <button class="settings-btn" @click=${this._handleSettingsClick} aria-label="Settings" title="Open Settings">
            ⋮
          </button>
        </div>
      </header>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
      z-index: 30;
      flex: 0 0 auto;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid var(--fids-accent, #ffcc00);
      background: var(--fids-surface, #1a1f26);
      padding: 0.75rem 0.5rem;
      margin: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      min-width: 0;
    }

    h1 {
      margin: 0;
      font-size: 1.6rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--fids-accent, #ffcc00);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
    }

    .airport-code {
      font-weight: 800;
    }

    .airport-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--fids-text, #ffffff);
      opacity: 0.95;
    }

    .route-badge {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.25rem 0.55rem;
      border-radius: 4px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .route-badge.departure {
      background: rgba(249, 115, 22, 0.18);
      color: #fb923c;
      border: 1px solid rgba(249, 115, 22, 0.45);
    }

    .route-badge.arrival {
      background: rgba(59, 130, 246, 0.18);
      color: #93c5fd;
      border: 1px solid rgba(59, 130, 246, 0.45);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .refreshing-spinner {
      font-size: 1.2rem;
      color: var(--fids-accent, #ffcc00);
      animation: spin 1s linear infinite;
      display: inline-block;
    }

    .live-clock {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      line-height: 1.1;
      font-family: 'Roboto Mono', monospace;
      text-align: right;
    }

    .clock-date {
      font-size: 0.72rem;
      color: var(--fids-dim, #94a3b8);
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .clock-time {
      font-size: 0.95rem;
      color: var(--fids-accent, #ffcc00);
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .settings-btn, .fullscreen-btn, .theme-btn {
      background: transparent;
      border: 1px solid var(--fids-separator, rgba(255, 255, 255, 0.09));
      color: var(--fids-dim, #94a3b8);
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .settings-btn:hover, .fullscreen-btn:hover, .theme-btn:hover {
      border-color: var(--fids-accent, #ffcc00);
      color: var(--fids-accent, #ffcc00);
      background: rgba(255, 204, 0, 0.05);
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 640px) {
      .airport-name {
        display: none;
      }
      .clock-date {
        display: none;
      }
      h1 {
        font-size: 1.3rem;
      }
      .route-badge {
        font-size: 0.65rem;
        padding: 0.15rem 0.35rem;
      }
      header {
        padding: 0.5rem 0.35rem;
      }
      .header-left {
        gap: 0.4rem;
      }
    }

    @media (min-width: 1440px) {
      header {
        padding: 1.25rem 1rem;
        border-bottom: 3px solid var(--fids-accent, #ffcc00);
      }
      h1 {
        font-size: 2rem;
      }
      .airport-name {
        font-size: 1.4rem;
      }
      .route-badge {
        font-size: 0.95rem;
        padding: 0.35rem 0.7rem;
      }
      .clock-date {
        font-size: 0.95rem;
      }
      .clock-time {
        font-size: 1.35rem;
      }
      .refreshing-spinner {
        font-size: 1.5rem;
      }
      .settings-btn, .fullscreen-btn, .theme-btn {
        font-size: 1.5rem;
        padding: 0.3rem 0.8rem;
      }
    }

    @media (min-width: 2500px) {
      header {
        padding: 2rem 1.5rem;
        border-bottom: 5px solid var(--fids-accent, #ffcc00);
      }
      h1 {
        font-size: 3rem;
      }
      .airport-name {
        font-size: 2.2rem;
      }
      .route-badge {
        font-size: 1.6rem;
        padding: 0.6rem 1.2rem;
      }
      .clock-date {
        font-size: 1.6rem;
      }
      .clock-time {
        font-size: 2.4rem;
      }
      .refreshing-spinner {
        font-size: 2.5rem;
      }
      .settings-btn, .fullscreen-btn, .theme-btn {
        font-size: 2.5rem;
        padding: 0.5rem 1.2rem;
      }
    }
  `;
}

customElements.define('flight-header', FlightHeader);
