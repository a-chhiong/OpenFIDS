import { LitElement, html, css } from 'lit';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/dialog/dialog.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/select/select.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/option/option.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/button/button.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/icon/icon.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/components/input/input.js';
import { airports } from '../config/Airports.js';

export class FlightSettingsDialog extends LitElement {
  static properties = {
    open: { type: Boolean },
    viewType: { type: String }, // 'D' | 'A'
    startHourOffset: { type: Number },
    endHourOffset: { type: Number },
    airportCode: { type: String }, // 'TPE' | 'KHH' | 'RMQ'
    routeType: { type: String }, // 'intl' | 'dom'
    themeMode: { type: String }, // 'dark' | 'light' | 'auto'
    
    // Internal draft state
    _draftAirportCode: { state: true },
    _draftViewType: { state: true },
    _draftRouteType: { state: true },
    _draftThemeMode: { state: true },
    _draftStartHourOffset: { state: true },
    _draftEndHourOffset: { state: true },
    _draftTdxClientId: { state: true },
    _draftTdxClientSecret: { state: true }
  };

  static styles = css`
    :host {
      display: block;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
      padding: 0.5rem 0;
    }

    @media (min-width: 480px) {
      .form-grid {
        grid-template-columns: 1fr 1fr;
      }
      .full-width {
        grid-column: span 2;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--fids-dim, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .range-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .button-group {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    sl-button {
      flex: 1;
    }

    /* Customize Shoelace dialog inside our shadow root if needed */
    sl-dialog::part(panel) {
      background: var(--fids-surface, #1a1f26);
      color: var(--fids-text, #ffffff);
      border: 1px solid var(--fids-separator, rgba(255, 255, 255, 0.09));
      border-radius: 8px;
    }

    sl-dialog::part(title) {
      font-weight: 700;
      color: var(--fids-text, #ffffff);
    }

    sl-dialog::part(close-button) {
      color: var(--fids-dim, #94a3b8);
    }

    sl-select::part(combobox) {
      background-color: var(--fids-surface-2, #242b35);
      border-color: var(--fids-separator, rgba(255, 255, 255, 0.09));
      color: var(--fids-text, #ffffff);
    }
  `;

  updated(changedProperties) {
    if (changedProperties.has('open') && this.open) {
      // Initialize/reset draft state to current values when dialog opens
      this._draftAirportCode = this.airportCode;
      this._draftViewType = this.viewType;
      this._draftRouteType = this.routeType;
      this._draftThemeMode = this.themeMode;
      this._draftStartHourOffset = this.startHourOffset;
      this._draftEndHourOffset = this.endHourOffset;
      this._draftTdxClientId = localStorage.getItem('openfids_tdx_client_id') || '';
      this._draftTdxClientSecret = localStorage.getItem('openfids_tdx_client_secret') || '';
    }
  }

  render() {
    const activeAirportKey = this._draftAirportCode?.toLowerCase() || 'tpe';
    const config = airports[activeAirportKey];
    const hasDomestic = !!(config && config.apiEndpoints && config.apiEndpoints.dom_D && config.apiEndpoints.dom_A);
    const hasIntl = !!(config && config.apiEndpoints && (config.apiEndpoints.intl_D || config.apiEndpoints.intl_A));

    return html`
      <sl-dialog 
        label="SETTINGS / 系統設定" 
        .open=${this.open} 
        @sl-request-close=${this._handleRequestClose}
      >
        <div class="form-grid">
          <!-- Airport selection -->
          <div class="form-group">
            <label>Airport / 機場</label>
            <sl-select 
              .value="${activeAirportKey}" 
              @sl-change=${this._handleAirportChange}
            >
              ${Object.entries(airports).map(([key, config]) => html`
                <sl-option value="${key}">${config.code} - ${config.nameZH}</sl-option>
              `)}
            </sl-select>
          </div>

          <!-- Direction selection -->
          <div class="form-group">
            <label>Direction / 起降</label>
            <sl-select 
              .value="${this._draftViewType || 'D'}" 
              @sl-change=${this._handleViewTypeChange}
            >
              <sl-option value="D">DEPARTURES / 出發</sl-option>
              <sl-option value="A">ARRIVALS / 抵達</sl-option>
            </sl-select>
          </div>

          <!-- Route category -->
          <div class="form-group">
            <label>Route / 航線類型</label>
            <sl-select 
              .value="${this._draftRouteType || 'intl'}" 
              @sl-change=${this._handleRouteTypeChange}
            >
              <sl-option value="intl" ?disabled=${!hasIntl}>INTL. / 國際線</sl-option>
              <sl-option value="dom" ?disabled=${!hasDomestic}>DOME. / 國內線</sl-option>
            </sl-select>
          </div>

          <!-- Theme switcher -->
          <div class="form-group">
            <label>Theme / 顯示模式</label>
            <sl-select 
              .value="${this._draftThemeMode || 'auto'}" 
              @sl-change=${this._handleThemeChange}
            >
              <sl-option value="dark">DARK / 深色</sl-option>
              <sl-option value="light">LIGHT / 淺色</sl-option>
              <sl-option value="auto">AUTO / 自動</sl-option>
            </sl-select>
          </div>

          <!-- Time range offsets -->
          <div class="form-group full-width">
            <label>Time Range / 時間範圍 (Hours Offset)</label>
            <div class="range-group">
              <sl-select 
                .value="${String(this._draftStartHourOffset ?? -1)}" 
                @sl-change=${this._handleStartHourChange}
              >
                ${[-6, -4, -3, -2, -1, 0, 1, 2, 3].map(h => html`
                  <sl-option value="${String(h)}">${h >= 0 ? `+${h}` : h} hr</sl-option>
                `)}
              </sl-select>
              <sl-select 
                .value="${String(this._draftEndHourOffset ?? 6)}" 
                @sl-change=${this._handleEndHourChange}
              >
                ${[1, 2, 3, 4, 6, 8, 10, 12, 24].map(h => html`
                  <sl-option value="${String(h)}">${h >= 0 ? `+${h}` : h} hr</sl-option>
                `)}
              </sl-select>
            </div>
          </div>

          <!-- TDX Credentials section (Optional) -->
          <div class="form-group full-width" style="margin-top: 0.5rem; border-top: 1px solid var(--fids-separator, rgba(255, 255, 255, 0.09)); padding-top: 1rem;">
            <label style="color: var(--fids-accent, #ffcc00); font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">
              TDX API Credentials (Optional / 提升限額)
            </label>
            <p style="font-size: 0.72rem; color: var(--fids-dim, #94a3b8); margin: 0 0 0.75rem 0; line-height: 1.3;">
              To lift the 20-req/day guest limit, enter your client keys from <a href="https://tdx.transportdata.tw/" target="_blank" style="color: var(--fids-accent, #ffcc00); text-decoration: underline;">TDX Portal</a>.
            </p>
            <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem;">
              <sl-input 
                label="Client ID / 帳號" 
                placeholder="e.g. your-client-id" 
                .value="${this._draftTdxClientId || ''}" 
                @sl-input=${(e) => this._draftTdxClientId = e.target.value}
                style="--sl-input-background-color: var(--fids-surface-2, #242b35); --sl-input-border-color: var(--fids-separator, rgba(255, 255, 255, 0.09)); --sl-input-color: #fff; --sl-input-label-color: var(--fids-dim);"
              ></sl-input>
              <sl-input 
                label="Client Secret / 密碼" 
                type="password" 
                password-toggle 
                placeholder="e.g. your-client-secret" 
                .value="${this._draftTdxClientSecret || ''}" 
                @sl-input=${(e) => this._draftTdxClientSecret = e.target.value}
                style="--sl-input-background-color: var(--fids-surface-2, #242b35); --sl-input-border-color: var(--fids-separator, rgba(255, 255, 255, 0.09)); --sl-input-color: #fff; --sl-input-label-color: var(--fids-dim);"
              ></sl-input>
            </div>
          </div>

        </div>

        <sl-button slot="footer" variant="default" @click=${this._handleCancel}>
          Cancel / 取消
        </sl-button>
        <sl-button slot="footer" variant="primary" @click=${this._handleConfirm}>
          Confirm / 確定
        </sl-button>
      </sl-dialog>
    `;
  }

  _handleRequestClose(e) {
    this.dispatchEvent(new CustomEvent('close-dialog', { bubbles: true, composed: true }));
  }

  _handleCancel() {
    this.dispatchEvent(new CustomEvent('close-dialog', { bubbles: true, composed: true }));
  }

  _handleConfirm() {
    localStorage.setItem('openfids_tdx_client_id', this._draftTdxClientId || '');
    localStorage.setItem('openfids_tdx_client_secret', this._draftTdxClientSecret || '');

    // Invalidate cached token when credentials change
    localStorage.removeItem('openfids_tdx_access_token');
    localStorage.removeItem('openfids_tdx_token_expiry');

    this.dispatchEvent(new CustomEvent('confirm-settings', {
      detail: {
        airportCode: this._draftAirportCode,
        viewType: this._draftViewType,
        routeType: this._draftRouteType,
        themeMode: this._draftThemeMode,
        startHourOffset: this._draftStartHourOffset,
        endHourOffset: this._draftEndHourOffset
      },
      bubbles: true,
      composed: true
    }));
  }

  _handleAirportChange(e) {
    const key = e.target.value;
    this._draftAirportCode = key.toUpperCase();
    
    // Auto fallback for domestic / international if not supported by new airport
    const config = airports[key];
    const hasDomestic = !!(config && config.apiEndpoints && config.apiEndpoints.dom_D && config.apiEndpoints.dom_A);
    const hasIntl = !!(config && config.apiEndpoints && (config.apiEndpoints.intl_D || config.apiEndpoints.intl_A));

    if (!hasDomestic && this._draftRouteType === 'dom') {
      this._draftRouteType = 'intl';
    } else if (!hasIntl && this._draftRouteType === 'intl') {
      this._draftRouteType = 'dom';
    }
  }

  _handleViewTypeChange(e) {
    this._draftViewType = e.target.value;
  }

  _handleRouteTypeChange(e) {
    this._draftRouteType = e.target.value;
  }

  _handleThemeChange(e) {
    this._draftThemeMode = e.target.value;
  }

  _handleStartHourChange(e) {
    this._draftStartHourOffset = parseInt(e.target.value, 10);
  }

  _handleEndHourChange(e) {
    this._draftEndHourOffset = parseInt(e.target.value, 10);
  }

}

customElements.define('flight-settings-dialog', FlightSettingsDialog);
