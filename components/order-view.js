import { LitElement, css, html, nothing } from 'lit';
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
      }

      .menu-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 22px;
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

      .donation-quick-row {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
      }

      .donation-quick-btn {
        flex: 1;
        padding: 11px 6px;
        border: 2px solid var(--green);
        border-radius: 10px;
        background: white;
        color: var(--green);
        font-weight: 800;
        font-size: 0.9rem;
        touch-action: manipulation;
        transition:
          background 0.1s,
          color 0.1s;
      }

      .donation-quick-btn:active {
        background: var(--green);
        color: white;
      }

      .donation-input-row {
        display: flex;
        gap: 8px;
        align-items: stretch;
      }

      .donation-input-wrap {
        display: flex;
        align-items: center;
        background: white;
        border: 2px solid var(--border);
        border-radius: 10px;
        overflow: hidden;
        transition: border-color 0.15s;
      }

      .donation-input-wrap:focus-within {
        border-color: var(--green);
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
      }

      .donation-input:focus {
        outline: none;
      }

      .donation-clear-btn {
        padding: 0 12px;
        background: transparent;
        color: var(--muted);
        font-weight: 700;
        font-size: 0.85rem;
        border: none;
        align-self: stretch;
        touch-action: manipulation;
      }

      .donation-clear-btn:active {
        color: var(--red);
      }

      .totals-section {
        margin-bottom: 14px;
      }

      .subtotal-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 4px;
        font-size: 0.85rem;
        color: var(--muted);
      }

      .total-bar {
        background: var(--brown);
        border-radius: 14px;
        padding: 14px 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 6px;
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
        border-radius: 14px;
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

  _renderOrderSummary() {
    const ordered = this.items.filter((i) => this.qty[i.id] > 0);
    const donation = this._donationValue;

    if (ordered.length === 0 && donation === 0) {
      return html`<div class="order-empty">No items yet — tap to add!</div>`;
    }

    return html`
      ${ordered.map(
        (item) => html`
          <div class="order-row">
            <div class="order-row-left">
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
    `;
  }

  _renderTotals() {
    const sub = this._subtotal;
    const don = this._donationValue;
    const tot = this._total;
    return html`
      ${don > 0 && sub > 0
        ? html`
            <div class="subtotal-row">
              <span>Subtotal</span><span>${fmt(sub)}</span>
            </div>
            <div class="subtotal-row">
              <span>Donation</span><span>+${fmt(don)}</span>
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
    return html`
      <div class="card">
        <p class="section-label">Menu</p>
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

        <p class="section-label">Order</p>
        <div class="order-summary">${this._renderOrderSummary()}</div>

        <p class="section-label">💚 Add a Donation</p>
        <div class="donation-section">
          <div class="donation-quick-row">
            ${this.quickDonations.map(
              (amt) => html`
                <button
                  class="donation-quick-btn"
                  @click=${() => this._emit('quick-donation-add', { amount: amt })}
                >
                  +$${amt}
                </button>
              `,
            )}
            <button class="donation-quick-btn" @click=${() => this._emit('round-up')}>
              Round Up
            </button>
          </div>
          <div class="donation-input-row">
            <div class="donation-input-wrap">
              <span class="donation-prefix">$</span>
              <input
                type="number"
                inputmode="decimal"
                class="donation-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                .value=${live(this.donation)}
                @input=${(e) => this._emit('donation-change', { value: e.target.value })}
              />
              <button
                class="donation-clear-btn"
                @click=${() => this._emit('donation-change', { value: '' })}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div class="totals-section">${this._renderTotals()}</div>

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
