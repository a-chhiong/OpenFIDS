import { LitElement, html, css } from 'lit';

export class FlightPagination extends LitElement {
  static properties = {
    currentPage: { type: Number },
    pageCount: { type: Number },
    isAutoFlipEnabled: { type: Boolean }
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.pageCount = 1;
    this.isAutoFlipEnabled = true;
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

  render() {
    const pageCount = Math.max(1, this.pageCount);
    return html`
      <div class="pagination-bar" role="navigation" aria-label="flight page navigation">
        <button @click="${() => this._emitPage(1)}" ?disabled="${this.currentPage <= 1}">⏮</button>
        <button @click="${() => this._emitPage(this.currentPage - 1)}" ?disabled="${this.currentPage <= 1}">◀</button>

        <span>${this.currentPage} / ${pageCount}</span>

        <input type="range"
          min="1"
          max="${pageCount}"
          .value="${String(this.currentPage)}"
          @input="${(e) => this._emitPage(Number(e.target.value))}"
          aria-label="Select flight page"
        />

        <button @click="${() => this._emitPage(this.currentPage + 1)}" ?disabled="${this.currentPage >= pageCount}">▶</button>
        <button @click="${() => this._emitPage(pageCount)}" ?disabled="${this.currentPage >= pageCount}">⏭</button>

        <div class="divider"></div>

        <button @click="${this._toggleAutoFlip}" class="autoflip-btn ${this.isAutoFlipEnabled ? 'active' : ''}" title="${this.isAutoFlipEnabled ? 'Pause Auto-flip' : 'Start Auto-flip'}">
          ${this.isAutoFlipEnabled ? html`⏸` : html`▶`}
        </button>
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
      gap: 0.5rem;
      align-items: center;
      padding: 0.25rem 0.5rem;
      border-top: 1px solid rgba(0,0,0,0.08);
      color: var(--fids-dim);
      font-size: 0.75rem;
      flex-wrap: nowrap;
      justify-content: center;
      overflow-x: auto;
      background: var(--fids-surface-2);
      min-height: 38px;
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

    .pagination-bar button.active {
      background: rgba(255,255,255,0.2);
      color: var(--fids-accent);
    }

    .pagination-bar span {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-weight: 700;
      min-width: 90px;
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

    .autoflip-btn {
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

    .autoflip-btn:hover {
      opacity: 1;
      filter: grayscale(0);
      color: var(--fids-text) !important;
      border-color: var(--fids-separator) !important;
      background: rgba(255, 255, 255, 0.05) !important;
    }

    .autoflip-btn.active {
      opacity: 0.7;
      filter: grayscale(0.2);
      color: var(--fids-accent) !important;
      border-color: rgba(255, 204, 0, 0.2) !important;
    }

    .autoflip-btn.active:hover {
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
        padding: 0.35rem;
      }
      .pagination-bar button {
        width: 28px;
        height: 28px;
        font-size: 0.9rem;
      }
      .pagination-bar span { display: none; }
      .pagination-bar input[type="range"] { max-width: 100px; }
      .autoflip-btn { 
        width: 28px; 
        height: 28px; 
      }
      .divider { margin: 0 0.1rem; }
    }

    @media (min-width: 1200px) {
      .pagination-bar {
        font-size: 0.85rem;
        padding: 0.25rem 0.5rem;
        min-height: 40px;
        gap: 0.4rem;
      }
      .pagination-bar button {
        width: 30px;
        height: 30px;
        font-size: 1rem;
        border-radius: 5px;
      }
      .pagination-bar span {
        min-width: 110px;
      }
      .pagination-bar input[type="range"] {
        max-width: 240px;
      }
      .divider {
        height: 18px;
      }
      .autoflip-btn {
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
      .pagination-bar button {
        width: 38px;
        height: 38px;
        font-size: 1.2rem;
        border-radius: 6px;
      }
      .pagination-bar span {
        min-width: 140px;
      }
      .pagination-bar input[type="range"] {
        max-width: 340px;
      }
      .divider {
        height: 24px;
      }
      .autoflip-btn {
        width: 38px;
        height: 38px;
        border-radius: 6px !important;
      }
    }
  `;
}

customElements.define('flight-pagination', FlightPagination);
