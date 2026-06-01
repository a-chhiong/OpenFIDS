import { LitElement, html, css } from 'lit';

export class FlightMarquee extends LitElement {
  static properties = {
    text: { type: String },
    statusClass: { type: String }
  };

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      max-width: 100%;
      overflow: hidden;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: var(--fids-row-badge-padding, 0.25rem 0.55rem);
      border-radius: 5px;
      font-size: var(--fids-row-font-badge, 0.72rem);
      font-weight: 700;
      letter-spacing: 0.3px;
      overflow: hidden;
      max-width: 100%;
      box-sizing: border-box;
    }

    .marquee-content {
      display: flex;
      white-space: nowrap;
      overflow: hidden;
      max-width: 100%;
    }

    .marquee-text {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      flex-shrink: 0;
    }

    .status-badge.marquee-active .marquee-content {
      overflow: visible;
      animation: merry-go-round var(--marquee-duration, 6s) linear infinite;
    }

    .status-badge.marquee-active .marquee-text {
      text-overflow: clip;
      max-width: none;
    }

    @keyframes merry-go-round {
      0% { transform: translateX(0); }
      100% { transform: translateX(var(--marquee-dist)); }
    }

    .status-ontime    { color: var(--fids-success, #10b981); background: rgba(16,185,129,0.15); }
    .status-delayed   { color: var(--fids-warning, #f59e0b); background: rgba(245,158,11,0.15); }
    .status-cancelled { color: var(--fids-danger, #ef4444);  background: rgba(239,68,68,0.15); text-decoration: line-through; }
    .status-estimated { color: var(--fids-text, #ffffff);    background: rgba(255,255,255,0.1); }
  `;

  constructor() {
    super();
    this.text = '';
    this.statusClass = '';
    this._resizeObserver = null;
  }

  connectedCallback() {
    super.connectedCallback();
    // Use ResizeObserver for responsive resizing without window listener
    this._resizeObserver = new ResizeObserver(() => this._checkMarquee());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  firstUpdated() {
    if (this._resizeObserver) {
      this._resizeObserver.observe(this.renderRoot.querySelector('.status-badge'));
    }
    // Wait for layout to settle completely before measuring
    setTimeout(() => this._checkMarquee(), 50);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('text') || changedProperties.has('statusClass')) {
      // Measure again if data updates
      setTimeout(() => this._checkMarquee(), 50);
    }
  }

  _checkMarquee() {
    const badge = this.renderRoot.querySelector('.status-badge');
    const content = this.renderRoot.querySelector('.marquee-content');
    const textSpan = this.renderRoot.querySelector('.marquee-text');
    const cloneSpan = this.renderRoot.querySelector('.marquee-text.clone');
    if (!badge || !content || !textSpan || !cloneSpan) return;

    // Reset state to accurately measure scrollWidth
    badge.classList.remove('marquee-active');
    cloneSpan.style.display = 'none';
    content.style.removeProperty('--marquee-dist');
    // Temporarily halt animation to ensure clean measurement
    content.style.animation = 'none';

    // Must check if we have a valid width to measure
    if (badge.clientWidth === 0) return;

    // Remove max-width constraint temporarily to get the raw unclipped pixel width of the text
    textSpan.style.maxWidth = 'none';
    const trueTextWidth = textSpan.offsetWidth;
    textSpan.style.maxWidth = ''; // restore

    // We must compare against content.clientWidth because badge.clientWidth includes padding!
    // If the text is wider than the content area, it's visually clipped and needs to scroll.
    if (trueTextWidth > content.clientWidth) {
      // 1. Activate marquee to remove max-width constraints on the text
      badge.classList.add('marquee-active');
      
      // 2. Show the clone so we can measure the seamless loop distance
      cloneSpan.style.display = 'inline-block';
      
      // 3. Measure offset (this forces a synchronous layout calculation, which restarts the animation!)
      const dist = cloneSpan.offsetLeft - textSpan.offsetLeft;
      
      content.style.setProperty('--marquee-dist', `-${dist}px`);
      // Balanced dynamic duration: roughly 30px per second
      const duration = Math.max(4, dist / 30); 
      content.style.setProperty('--marquee-duration', `${duration}s`);
    }
    
    // Clear the temporary halt so CSS can take over
    content.style.animation = '';
  }

  render() {
    return html`
      <span class="status-badge ${this.statusClass}">
        <span class="marquee-content">
          <span class="marquee-text">${this.text || '--'}</span>
          <span class="marquee-text clone" style="padding-left: 2rem; display: none;">${this.text || '--'}</span>
        </span>
      </span>
    `;
  }
}

customElements.define('flight-marquee', FlightMarquee);
