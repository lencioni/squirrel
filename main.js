import { LitElement, html } from 'lit';
import { CONFIG } from './config.js';
import './components/order-view.js';
import './components/payment-view.js';

class SquirrelApp extends LitElement {
  static properties = {
    _qty: { state: true },
    _donation: { state: true },
    _view: { state: true },
    _logoFailed: { state: true },
  };

  constructor() {
    super();
    this._qty = Object.fromEntries(CONFIG.items.map((i) => [i.id, 0]));
    this._donation = '';
    this._view = 'order';
    this._logoFailed = false;
  }

  createRenderRoot() {
    return this; // light DOM — styles.css applies normally
  }

  get _donationValue() {
    const v = parseFloat(this._donation);
    return isFinite(v) && v > 0 ? parseFloat(v.toFixed(2)) : 0;
  }

  get _subtotal() {
    return CONFIG.items.reduce((s, i) => s + this._qty[i.id] * i.price, 0) / 100;
  }

  get _total() {
    return this._subtotal + this._donationValue;
  }

  _changeQty(id, delta) {
    this._qty = { ...this._qty, [id]: Math.max(0, this._qty[id] + delta) };
  }

  _addQuickDonation(amount) {
    const current = parseFloat(this._donation) || 0;
    this._donation = (current + amount).toFixed(2);
  }

  _roundUp() {
    if (this._subtotal === 0) return;
    const needed =
      Math.ceil(this._subtotal + this._donationValue) -
      this._subtotal -
      this._donationValue;
    if (needed > 0) this._donation = (this._donationValue + needed).toFixed(2);
  }

  _showPayment() {
    this._view = 'payment';
  }

  _editOrder() {
    this._view = 'order';
  }

  _newOrder() {
    this._qty = Object.fromEntries(CONFIG.items.map((i) => [i.id, 0]));
    this._donation = '';
    this._view = 'order';
  }

  render() {
    return html`
      <div class="header">
        ${this._logoFailed
          ? html`<div class="header-squirrel">🐿️</div>`
          : html`<div class="header-logo">
              <img
                src="logo.svg"
                alt="Squirrel Jam"
                @error=${() => {
                  this._logoFailed = true;
                }}
              />
            </div>`}
      </div>
      ${this._view === 'order'
        ? html`<squirrel-order-view
            .items=${CONFIG.items}
            .qty=${this._qty}
            .donation=${this._donation}
            .quickDonations=${CONFIG.quickDonations}
            @qty-change=${(e) => this._changeQty(e.detail.id, e.detail.delta)}
            @donation-change=${(e) => {
              this._donation = e.detail.value;
            }}
            @quick-donation-add=${(e) => this._addQuickDonation(e.detail.amount)}
            @round-up=${this._roundUp}
            @show-payment=${this._showPayment}
          ></squirrel-order-view>`
        : html`<squirrel-payment-view
            .items=${CONFIG.items}
            .qty=${this._qty}
            .donationValue=${this._donationValue}
            .total=${this._total}
            .venmoUsername=${CONFIG.venmoUsername}
            .paypalDonateUrl=${CONFIG.paypalDonateUrl}
            @edit-order=${this._editOrder}
            @new-order=${this._newOrder}
          ></squirrel-payment-view>`}
    `;
  }
}

customElements.define('squirrel-app', SquirrelApp);
