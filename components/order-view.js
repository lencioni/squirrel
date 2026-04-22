import { LitElement, html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';
import { fmt } from '../utils.js';
import './menu-item.js';

class SquirrelOrderView extends LitElement {
  static properties = {
    items: {},
    qty: {},
    donation: {},
    quickDonations: {},
  };

  createRenderRoot() {
    return this;
  }

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
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, detail }));
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
                @qty-change=${(e) => this._emit('qty-change', e.detail)}
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
