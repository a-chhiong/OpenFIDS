import { LitElement, html, css } from 'lit';

export class FlightPagination extends LitElement {
  static properties = {
    currentPage: { type: Number },
    pageCount: { type: Number },
    flightCount: { type: Number },
    isAutoFlipEnabled: { type: Boolean },
    isFullscreen: { type: Boolean }
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.pageCount = 1;
    this.flightCount = 0;
    this.isAutoFlipEnabled = true;
    this.isFullscreen = false;
  }

  _emitPage(page) {
    const normalized = Math.min(Math.max(1, page), Math.max(1, this.pageCount));
    this.dispatchEvent(new CustomEvent('page-changed', {
      detail: { page: normalized },
      bubbles: true,
      composed: true
    }));
  }

  _toggleAutoFlip() {
    this.dispatchEvent(new CustomEvent('autoflip-toggle', {
      bubbles: true,
      composed: true
    }));
  }

  _toggleFullscreen() {
    this.dispatchEvent(new CustomEvent('fullscreen-toggle', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const pageCount = Math.max(1, this.pageCount);
    return html`
      <div class="pagination-bar" role="navigation" aria-label="flight page navigation">
        <div class="flight-count-display">
          ${this.flightCount} FLIGHTS
        </div>

        <div class="pager-controls">
          <button @click="${() => this._emitPage(1)}" ?disabled="${this.currentPage <= 1}">⏮</button>
          <button @click="${() => this._emitPage(this.currentPage - 1)}" ?disabled="${this.currentPage <= 1}">◀</button>

          <input type="range"
            min="1"
            max="${pageCount}"
            .value="${String(this.currentPage)}"
            @input="${(e) => this._emitPage(Number(e.target.value))}"
            aria-label="Select flight page"
          />

          <button @click="${() => this._emitPage(this.currentPage + 1)}" ?disabled="${this.currentPage >= pageCount}">▶</button>
          <button @click="${() => this._emitPage(pageCount)}" ?disabled="${this.currentPage >= pageCount}">⏭</button>
          
          <span class="page-indicator">${this.currentPage} / ${pageCount}</span>
        </div>

        <div class="right-controls">
          <div class="divider"></div>
          <button @click="${this._toggleAutoFlip}" class="autoflip-btn ${this.isAutoFlipEnabled ? 'active' : ''}" title="${this.isAutoFlipEnabled ? 'Pause Auto-flip' : 'Start Auto-flip'}">
            ${this.isAutoFlipEnabled ? html`⏸` : html`▶`}
          </button>
          <button @click="${this._toggleFullscreen}" class="fullscreen-toggle-btn ${this.isFullscreen ? 'active' : ''}" title="${this.isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}">
            ⛶
          </button>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      flex: 0 0 auto;
      width: 100%;
      box-sizing: border-box;
      z-index: 20;
    }

    .pagination-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-top: 1px solid var(--fids-separator, rgba(255, 255, 255, 0.09));
      color: var(--fids-dim);
      font-size: 0.75rem;
      background: var(--fids-surface-2);
      min-height: 38px;
    }

    .flight-count-display {
      font-weight: 800;
      color: var(--fids-accent, #ffcc00);
      font-family: 'Roboto Mono', monospace;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      flex-shrink: 0;
      min-width: 90px;
    }

    .pager-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-grow: 1;
      justify-content: center;
    }

    .right-controls {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      gap: 0.5rem;
    }

    .pagination-bar button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      color: inherit;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 700;
      font-size: 1rem;
      line-height: 1;
      transition: all 0.2s ease;
      padding: 0;
      flex-shrink: 0;
    }

    .pagination-bar button:hover:not(:disabled) {
      background: rgba(255,255,255,0.15);
      color: var(--fids-accent);
      border-color: var(--fids-accent);
      transform: scale(1.1);
    }

    .page-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-weight: 700;
      min-width: 80px;
      justify-content: center;
    }

    .pagination-bar input[type="range"] {
      flex-grow: 1;
      margin: 0 0.5rem;
      max-width: 200px;
      background: linear-gradient(90deg, var(--fids-accent), var(--fids-accent));
      cursor: pointer;
    }

    .divider {
      width: 1px;
      height: 16px;
      background: var(--fids-separator);
      margin: 0 0.25rem;
      flex-shrink: 0;
    }

    .autoflip-btn, .fullscreen-toggle-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 5px !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      transition: all 0.3s ease;
      white-space: nowrap;
      opacity: 0.5;
      filter: grayscale(0.8);
      color: var(--fids-dim) !important;
      padding: 0 !important;
    }

    .autoflip-btn:hover, .fullscreen-toggle-btn:hover {
      opacity: 1;
      filter: grayscale(0);
      color: var(--fids-text) !important;
      border-color: var(--fids-separator) !important;
      background: rgba(255, 255, 255, 0.05) !important;
    }

    .autoflip-btn.active, .fullscreen-toggle-btn.active {
      opacity: 0.7;
      filter: grayscale(0.2);
      color: var(--fids-accent) !important;
      border-color: rgba(255, 204, 0, 0.2) !important;
    }

    .autoflip-btn.active:hover, .fullscreen-toggle-btn.active:hover {
      opacity: 1;
      filter: grayscale(0);
      border-color: var(--fids-accent) !important;
      background: rgba(255, 204, 0, 0.1) !important;
    }

    .pagination-bar button:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    @media (max-width: 640px) {
      .pagination-bar {
        font-size: 0.68rem;
        gap: 0.3rem;
        padding: 0.25rem 0.4rem;
      }
      .flight-count-display {
        min-width: unset;
      }
      .pagination-bar button {
        width: 26px;
        height: 26px;
        font-size: 0.85rem;
      }
      .page-indicator {
        min-width: 50px;
      }
      .pagination-bar input[type="range"] {
        display: none;
      }
      .autoflip-btn, .fullscreen-toggle-btn {
        width: 26px;
        height: 26px;
      }
      .divider {
        margin: 0 0.15rem;
      }
    }

    @media (min-width: 1440px) {
      .pagination-bar {
        font-size: 0.85rem;
        padding: 0.25rem 0.75rem;
        min-height: 40px;
        gap: 0.4rem;
      }
      .flight-count-display {
        font-size: 0.9rem;
        min-width: 110px;
      }
      .pagination-bar button {
        width: 30px;
        height: 30px;
        font-size: 1rem;
        border-radius: 5px;
      }
      .page-indicator {
        min-width: 110px;
      }
      .pagination-bar input[type="range"] {
        max-width: 240px;
      }
      .divider {
        height: 18px;
      }
      .autoflip-btn, .fullscreen-toggle-btn {
        width: 30px;
        height: 30px;
        border-radius: 5px !important;
      }
    }

    @media (min-width: 2500px) {
      .pagination-bar {
        font-size: 1.1rem;
        padding: 0.35rem 0.75rem;
        min-height: 50px;
        gap: 0.6rem;
      }
      .flight-count-display {
        font-size: 1.3rem;
        min-width: 160px;
      }
      .pagination-bar button {
        width: 38px;
        height: 38px;
        font-size: 1.2rem;
        border-radius: 6px;
      }
      .page-indicator {
        min-width: 140px;
      }
      .pagination-bar input[type="range"] {
        max-width: 340px;
      }
      .divider {
        height: 24px;
      }
      .autoflip-btn, .fullscreen-toggle-btn {
        width: 38px;
        height: 38px;
        border-radius: 6px !important;
      }
    }
  `;
}

customElements.define('flight-pagination', FlightPagination);
