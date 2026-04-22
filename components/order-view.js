import { LitElement, css, html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { fmt } from '../utils.js';
import { buttonBaseStyles, cardStyles, sectionLabelStyles } from './shared-styles.js';
import './menu-item.js';

class SquirrelOrderView extends LitElement {
  static styles = [
    buttonBaseStyles,
    cardStyles,
    sectionLabelStyles,
    css`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--cream);
      }

      .content {
        padding-bottom: calc(88px + env(safe-area-inset-bottom));
      }

      .pay-footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0 0 env(safe-area-inset-bottom);
        background: var(--cream);
        border-top: 1px solid var(--border);
        z-index: 10;
      }

      .menu-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 22px;
      }

      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }

      .order-summary {
        background: var(--white);
        border: 1px solid var(--border);
        border-radius: 14px;
        margin-bottom: 22px;
        overflow: hidden;
      }

      .order-empty {
        padding: 16px;
        text-align: center;
        color: var(--muted);
        font-style: italic;
        font-size: 0.9rem;
      }

      .order-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 14px;
        border-bottom: 1px solid #f0e6da;
        font-size: 0.95rem;
      }

      .order-row:last-child {
        border-bottom: none;
      }

      .order-row-left {
        display: flex;
        align-items: baseline;
        gap: 4px;
      }

      .order-row-emoji {
        font-size: 1.05rem;
        line-height: 1;
      }

      .order-row-name {
        font-weight: 800;
      }

      .order-row-meta {
        font-size: 0.78rem;
        color: var(--muted);
      }

      .order-row-price {
        font-weight: 700;
      }

      .order-row.donation .order-row-name {
        color: var(--green);
      }

      .donation-section {
        margin-bottom: 22px;
      }

      .donation-controls {
        background: white;
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 0;
        display: grid;
        gap: 0;
        overflow: hidden;
      }

      .donation-controls.has-donation {
        border-color: var(--green);
        background: #f2fff6;
      }

      .donation-quick-row {
        display: flex;
        gap: 0;
        background: var(--border);
      }

      .donation-quick-btn {
        flex: 1;
        padding: 11px 6px;
        border: none;
        background: transparent;
        color: var(--brown);
        font-weight: 800;
        font-size: 0.9rem;
        touch-action: manipulation;
        transition: background 0.1s;
      }

      .donation-quick-btn:active {
        background: rgba(0 0 0 / 0.06);
      }

      .donation-quick-btn:focus {
        outline: none;
      }

      .donation-quick-btn:focus-visible {
        /* Inset ring so it doesn't get clipped by the row/container */
        box-shadow: inset 0 0 0 3px var(--focus-ring);
      }

      .donation-quick-btn + .donation-quick-btn {
        border-left: 1px solid rgba(0 0 0 / 0.12);
      }

      .donation-controls.has-donation .donation-quick-row {
        background: var(--green);
      }

      .donation-controls.has-donation .donation-quick-btn {
        color: white;
      }

      .donation-controls.has-donation .donation-quick-btn:active {
        background: rgba(255 255 255 / 0.16);
      }

      .donation-controls.has-donation .donation-quick-btn + .donation-quick-btn {
        border-left-color: rgba(255 255 255 / 0.22);
      }

      .donation-input-row {
        display: flex;
        gap: 8px;
        align-items: stretch;
        padding: 10px;
      }

      .donation-input-wrap {
        display: flex;
        align-items: center;
        background: transparent;
        border-radius: 10px;
        overflow: hidden;
      }

      .donation-prefix {
        padding: 0 10px;
        font-weight: 800;
        color: var(--muted);
        font-size: 1rem;
        flex-shrink: 0;
      }

      .donation-input {
        flex: 1;
        padding: 11px 4px;
        border: none;
        font: inherit;
        font-size: 1rem;
        font-weight: 700;
        color: inherit;
        background: transparent;
        min-width: 0;
        text-align: left;
      }

      .donation-input:focus {
        outline: none;
      }

      /* Hide number steppers/spinners for a cleaner donation field */
      .donation-input[type='number'] {
        appearance: textfield;
        -moz-appearance: textfield;
      }

      .donation-input[type='number']::-webkit-outer-spin-button,
      .donation-input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .total-bar {
        background: var(--brown);
        padding: 14px 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #f0e6da;
      }

      .total-label {
        font-family: 'Fredoka One', cursive;
        font-size: 1.05rem;
        color: rgba(255 255 255 / 0.75);
      }

      .total-amount {
        font-family: 'Fredoka One', cursive;
        font-size: 2rem;
        color: white;
      }

      .pay-btn {
        width: 100%;
        padding: 18px;
        background: var(--red);
        color: white;
        border-radius: 0;
        font-family: 'Fredoka One', cursive;
        font-size: 1.25rem;
        letter-spacing: 0.5px;
        transition: background 0.12s;
        touch-action: manipulation;
      }

      .pay-btn:active:not(:disabled) {
        background: var(--dark-red);
      }

      .pay-btn:disabled {
        background: #ccc;
        color: #fff;
        cursor: default;
      }
    `,
  ];

  static properties = {
    items: {},
    qty: {},
    donation: {},
    quickDonations: {},
  };

  get _donationValue() {
    const v = parseFloat(this.donation);
    return isFinite(v) && v > 0 ? parseFloat(v.toFixed(2)) : 0;
  }

  get _subtotal() {
    return this.items.reduce((s, i) => s + this.qty[i.id] * i.price, 0) / 100;
  }

  get _total() {
    return this._subtotal + this._donationValue;
  }

  _emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
  }

  _formatDonationString(raw) {
    const v = String(raw ?? '').trim();
    if (v === '') return '';

    // Keep an in-progress trailing decimal (e.g. "1.") so typing isn't jarring.
    if (/^\d+\.$/.test(v)) return v;

    // Ensure whole-dollar and one-decimal values stay in x.xx form.
    if (/^\d+$/.test(v)) return `${v}.00`;
    if (/^\d+\.\d$/.test(v)) return `${v}0`;

    // For other numeric inputs, clamp to two decimals when parseable.
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) return v;
    return n.toFixed(2);
  }

  _renderOrderSummary() {
    const ordered = this.items.filter((i) => this.qty[i.id] > 0);
    const donation = this._donationValue;
    const tot = this._total;

    if (ordered.length === 0 && donation === 0) {
      return html`<div class="order-empty">No items yet — tap to add!</div>`;
    }

    return html`
      ${ordered.map(
        (item) => html`
          <div class="order-row">
            <div class="order-row-left">
              <span class="order-row-emoji">${item.emoji}</span>
              <span class="order-row-name">${item.name}</span>
              <span class="order-row-meta">× ${this.qty[item.id]}</span>
            </div>
            <span class="order-row-price">${fmt(this.qty[item.id] * item.price / 100)}</span>
          </div>
        `,
      )}
      ${donation > 0
        ? html`
            <div class="order-row donation">
              <div class="order-row-left">
                <span class="order-row-name">💚 Donation</span>
              </div>
              <span class="order-row-price">${fmt(donation)}</span>
            </div>
          `
        : nothing}
      <div class="total-bar">
        <span class="total-label">Total</span>
        <span class="total-amount">${fmt(tot)}</span>
      </div>
    `;
  }

  render() {
    const quickDonations = [...(this.quickDonations ?? [])].sort((a, b) => b - a);
    const totalIsWholeDollar = Math.round(this._total * 100) % 100 === 0;
    const showRoundUp = this._subtotal > 0 && !totalIsWholeDollar;
    return html`
      <div class="content">
        <div class="card">
          <p class="section-label sr-only">Menu</p>
          <div class="menu-grid">
            ${this.items.map(
              (item) => html`
                <squirrel-menu-item
                  .item=${item}
                  .qty=${this.qty[item.id]}
                ></squirrel-menu-item>
              `,
            )}
          </div>

          <p class="section-label">💚 Add a Donation</p>
          <div class="donation-section">
            <div
              class=${classMap({ 'donation-controls': true, 'has-donation': this._donationValue > 0 })}
            >
              <div class="donation-input-row">
                <div class="donation-input-wrap">
                  <span class="donation-prefix">$</span>
                  <input
                    type="number"
                    inputmode="decimal"
                    class="donation-input"
                    placeholder="0.00"
                    min="0"
                    step="1.00"
                    .value=${live(this.donation)}
                    @input=${(e) => this._emit('donation-change', { value: e.target.value })}
                    @change=${(e) =>
                      this._emit('donation-change', {
                        value: this._formatDonationString(e.target.value),
                      })}
                    @blur=${(e) =>
                      this._emit('donation-change', {
                        value: this._formatDonationString(e.target.value),
                      })}
                  />
                </div>
              </div>
              <div class="donation-quick-row">
                ${quickDonations.map(
                  (amt) => html`
                    <button
                      class="donation-quick-btn"
                      @click=${() => this._emit('quick-donation-add', { amount: amt })}
                    >
                      +$${amt}
                    </button>
                  `,
                )}
                ${showRoundUp
                  ? html`<button class="donation-quick-btn" @click=${() => this._emit('round-up')}>
                      Round Up
                    </button>`
                  : nothing}
              </div>
            </div>
          </div>

          <p class="section-label">Order</p>
          <div class="order-summary">${this._renderOrderSummary()}</div>
        </div>
      </div>

      <div class="pay-footer" role="region" aria-label="Payment">
        <button
          class="pay-btn"
          ?disabled=${this._total === 0}
          @click=${() => this._emit('show-payment')}
        >
          Show Payment QR →
        </button>
      </div>
    `;
  }
}

customElements.define('squirrel-order-view', SquirrelOrderView);
