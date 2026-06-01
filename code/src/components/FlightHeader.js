import { LitElement, html, css } from 'lit';

export class FlightHeader extends LitElement {
  static properties = {
    title: { type: String },
    isRefreshing: { type: Boolean },
    _timeStr: { state: true },
    _dateStr: { state: true }
  };

  constructor() {
    super();
    this.title = 'TPE FIDS';
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
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const ddd = dayNames[now.getDay()];
    this._dateStr = `${year}/${month}/${day}(${ddd})`;
    this._timeStr = now.toLocaleTimeString('zh-TW', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  render() {
    return html`
      <header>
        <h1>${this.title}</h1>
        <div class="header-right">
          ${this.isRefreshing ? html`<span class="refreshing-spinner">↻</span>` : ''}
          <div class="live-clock">
            <div class="clock-date">${this._dateStr}</div>
            <div class="clock-time">${this._timeStr}</div>
          </div>
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

    h1 {
      margin: 0;
      font-size: 1.8rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--fids-accent, #ffcc00);
      flex: 1 1 auto;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    @media (min-width: 1440px) {
      header {
        padding: 1.25rem 1rem;
        border-bottom: 3px solid var(--fids-accent, #ffcc00);
      }
      h1 {
        font-size: 2.2rem;
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
    }

    @media (min-width: 2500px) {
      header {
        padding: 2rem 1.5rem;
        border-bottom: 5px solid var(--fids-accent, #ffcc00);
      }
      h1 {
        font-size: 3.5rem;
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
    }
  `;
}

customElements.define('flight-header', FlightHeader);
