import { LitElement, html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import QRCode from 'qrcode';
import { CONFIG } from './config.js';

const fmt = (n) => '$' + n.toFixed(2);

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

  // ── Computed ───────────────────────────────────────────────────────────────
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

  // ── Actions ────────────────────────────────────────────────────────────────
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

  async _showPayment() {
    this._view = 'payment';
    await this.updateComplete;

    const amountStr = this._total.toFixed(2);
    const don = this._donationValue;
    const parts = CONFIG.items
      .filter((i) => this._qty[i.id] > 0)
      .map((i) => `${this._qty[i.id]}x${i.name}`);
    if (don > 0) parts.push(`+$${don.toFixed(2)}donation`);
    const note = parts.join(',');

    const panelWidth = Math.min(180, (window.innerWidth - 32 - 14) / 2);
    const size = Math.floor(panelWidth - 28);
    const sharedOpts = { width: size, errorCorrectionLevel: 'M', margin: 1 };

    const renderQR = async (elId, color, text) => {
      const el = this.querySelector(elId);
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, text, {
        ...sharedOpts,
        color: { dark: color, light: '#ffffff' },
      });
      el.innerHTML = '';
      el.appendChild(canvas);
    };

    await Promise.all([
      renderQR(
        '#venmo-qr',
        '#008CFF',
        `https://venmo.com/${CONFIG.venmoUsername}?txn=pay&amount=${amountStr}&note=${note}`,
      ),
      renderQR(
        '#paypal-qr',
        '#003087',
        `${CONFIG.paypalDonateUrl}&amount=${amountStr}`,
      ),
    ]);
  }

  _editOrder() {
    this._view = 'order';
  }

  _newOrder() {
    this._qty = Object.fromEntries(CONFIG.items.map((i) => [i.id, 0]));
    this._donation = '';
    this._view = 'order';
  }

  // ── Templates ──────────────────────────────────────────────────────────────
  _menuItem(item) {
    const q = this._qty[item.id];
    return q === 0
      ? html` <div class="menu-item" @click=${() => this._changeQty(item.id, 1)}>
          <span class="menu-item-emoji">${item.emoji}</span>
          <span class="menu-item-name">${item.name}</span>
          <span class="menu-item-price">${fmt(item.price / 100)} each</span>
        </div>`
      : html` <div class=${classMap({ 'menu-item': true, 'has-qty': true })}>
          <span class="menu-item-emoji">${item.emoji}</span>
          <span class="menu-item-name">${item.name}</span>
          <span class="menu-item-price">${fmt(item.price / 100)} each</span>
          <div class="menu-item-controls">
            <button
              class="qty-btn"
              @click=${(e) => {
                e.stopPropagation();
                this._changeQty(item.id, -1);
              }}
            >
              −
            </button>
            <span class="qty-value">${q}</span>
            <button
              class="qty-btn"
              @click=${(e) => {
                e.stopPropagation();
                this._changeQty(item.id, 1);
              }}
            >
              +
            </button>
          </div>
          <div class="menu-item-badge">${q}</div>
        </div>`;
  }

  _orderSummary() {
    const ordered = CONFIG.items.filter((i) => this._qty[i.id] > 0);
    const donation = this._donationValue;

    if (ordered.length === 0 && donation === 0) {
      return html`<div class="order-empty">No items yet — tap to add!</div>`;
    }

    return html` ${ordered.map(
      (item) =>
        html` <div class="order-row">
          <div class="order-row-left">
            <span class="order-row-name">${item.name}</span>
            <span class="order-row-meta">× ${this._qty[item.id]}</span>
          </div>
          <span class="order-row-price"
            >${fmt(this._qty[item.id] * item.price)}</span
          >
        </div>`,
    )}
    ${donation > 0
      ? html` <div class="order-row donation">
          <div class="order-row-left">
            <span class="order-row-name">💚 Donation</span>
          </div>
          <span class="order-row-price">${fmt(donation)}</span>
        </div>`
      : nothing}`;
  }

  _totals() {
    const sub = this._subtotal;
    const don = this._donationValue;
    const tot = this._total;
    return html` ${don > 0 && sub > 0
        ? html` <div class="subtotal-row">
              <span>Subtotal</span><span>${fmt(sub)}</span>
            </div>
            <div class="subtotal-row">
              <span>Donation</span><span>+${fmt(don)}</span>
            </div>`
        : nothing}
      <div class="total-bar">
        <span class="total-label">Total</span>
        <span class="total-amount">${fmt(tot)}</span>
      </div>`;
  }

  _orderView() {
    return html` <div class="card">
      <p class="section-label">Menu</p>
      <div class="menu-grid">
        ${CONFIG.items.map((item) => this._menuItem(item))}
      </div>

      <p class="section-label">Order</p>
      <div class="order-summary">${this._orderSummary()}</div>

      <p class="section-label">💚 Add a Donation</p>
      <div class="donation-section">
        <div class="donation-quick-row">
          ${CONFIG.quickDonations.map(
            (amt) =>
              html` <button
                class="donation-quick-btn"
                @click=${() => this._addQuickDonation(amt)}
              >
                +$${amt}
              </button>`,
          )}
          <button class="donation-quick-btn" @click=${this._roundUp}>
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
              .value=${live(this._donation)}
              @input=${(e) => {
                this._donation = e.target.value;
              }}
            />
            <button
              class="donation-clear-btn"
              @click=${() => {
                this._donation = '';
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div class="totals-section">${this._totals()}</div>

      <button
        class="pay-btn"
        ?disabled=${this._total === 0}
        @click=${this._showPayment}
      >
        Show Payment QR →
      </button>
    </div>`;
  }

  _paymentView() {
    const ordered = CONFIG.items.filter((i) => this._qty[i.id] > 0);
    const don = this._donationValue;
    return html` <div class="card">
      <div class="payment-header">
        <div class="payment-header-label">Total Due</div>
        <div class="payment-total-amount">${fmt(this._total)}</div>
        <div class="payment-instruction">Customer scans to pay</div>
      </div>

      <div class="payment-order-summary">
        ${ordered.map(
          (item) =>
            html` <span class="payment-order-tag">
              ${item.emoji} ${this._qty[item.id]} × ${item.name}
            </span>`,
        )}
        ${don > 0
          ? html` <span class="payment-order-tag donation"
              >💚 Donation ${fmt(don)}</span
            >`
          : nothing}
      </div>

      <div class="qr-grid">
        <div class="qr-panel">
          <div class="qr-panel-label venmo">Venmo</div>
          <div class="qr-canvas-wrap" id="venmo-qr"></div>
          <div class="qr-handle">@${CONFIG.venmoUsername}</div>
        </div>
        <div class="qr-panel">
          <div class="qr-panel-label paypal">PayPal</div>
          <div class="qr-canvas-wrap" id="paypal-qr"></div>
          <div class="qr-handle">paypal.com/donate</div>
        </div>
      </div>

      <div class="payment-actions">
        <button class="edit-order-btn" @click=${this._editOrder}>
          ← Edit Order
        </button>
        <button class="new-order-btn" @click=${this._newOrder}>New Order</button>
      </div>
    </div>`;
  }

  render() {
    return html` <div class="header">
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
      ${this._view === 'order' ? this._orderView() : this._paymentView()}`;
  }
}

customElements.define('squirrel-app', SquirrelApp);
