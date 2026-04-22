import { LitElement, html, nothing } from 'lit';
import QRCode from 'qrcode';
import { fmt } from '../utils.js';

class SquirrelPaymentView extends LitElement {
  static properties = {
    items: {},
    qty: {},
    donationValue: { type: Number },
    total: { type: Number },
    venmoUsername: {},
    paypalDonateUrl: {},
  };

  createRenderRoot() {
    return this;
  }

  async updated() {
    await this._renderQRCodes();
  }

  async _renderQRCodes() {
    const amountStr = this.total.toFixed(2);
    const don = this.donationValue;
    const parts = this.items
      .filter((i) => this.qty[i.id] > 0)
      .map((i) => `${this.qty[i.id]}x${i.name}`);
    if (don > 0) parts.push(`+$${don.toFixed(2)}donation`);
    const note = parts.join(',');

    const panelWidth = Math.min(180, (window.innerWidth - 32 - 14) / 2);
    const size = Math.floor(panelWidth - 28);
    const sharedOpts = { width: size, errorCorrectionLevel: 'M', margin: 1 };

    const renderQR = async (elId, color, text) => {
      const el = this.querySelector(elId);
      if (!el) return;
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
        `https://venmo.com/${this.venmoUsername}?txn=pay&amount=${amountStr}&note=${note}`,
      ),
      renderQR('#paypal-qr', '#003087', `${this.paypalDonateUrl}&amount=${amountStr}`),
    ]);
  }

  _emit(type) {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true }));
  }

  render() {
    const ordered = this.items.filter((i) => this.qty[i.id] > 0);
    const don = this.donationValue;

    return html`
      <div class="card">
        <div class="payment-header">
          <div class="payment-header-label">Total Due</div>
          <div class="payment-total-amount">${fmt(this.total)}</div>
          <div class="payment-instruction">Customer scans to pay</div>
        </div>

        <div class="payment-order-summary">
          ${ordered.map(
            (item) => html`
              <span class="payment-order-tag">
                ${item.emoji} ${this.qty[item.id]} × ${item.name}
              </span>
            `,
          )}
          ${don > 0
            ? html`<span class="payment-order-tag donation">💚 Donation ${fmt(don)}</span>`
            : nothing}
        </div>

        <div class="qr-grid">
          <div class="qr-panel">
            <div class="qr-panel-label venmo">Venmo</div>
            <div class="qr-canvas-wrap" id="venmo-qr"></div>
            <div class="qr-handle">@${this.venmoUsername}</div>
          </div>
          <div class="qr-panel">
            <div class="qr-panel-label paypal">PayPal</div>
            <div class="qr-canvas-wrap" id="paypal-qr"></div>
            <div class="qr-handle">paypal.com/donate</div>
          </div>
        </div>

        <div class="payment-actions">
          <button class="edit-order-btn" @click=${() => this._emit('edit-order')}>
            ← Edit Order
          </button>
          <button class="new-order-btn" @click=${() => this._emit('new-order')}>
            New Order
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('squirrel-payment-view', SquirrelPaymentView);
