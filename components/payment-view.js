import { LitElement, css, html, nothing } from 'lit';
import QRCode from 'qrcode';
import { fmt } from '../utils.js';
import { buttonBaseStyles, cardStyles } from './shared-styles.js';

class SquirrelPaymentView extends LitElement {
  static styles = [
    buttonBaseStyles,
    cardStyles,
    css`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--cream);
      }

      .content {
        padding-bottom: calc(132px + env(safe-area-inset-bottom));
      }

      .actions-footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0 0 env(safe-area-inset-bottom);
        background: var(--cream);
        border-top: 1px solid var(--border);
        z-index: 10;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      .payment-header {
        text-align: center;
        margin-bottom: 24px;
      }

      .payment-header-label {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 4px;
      }

      .payment-total-amount {
        font-family: 'Fredoka One', cursive;
        font-size: 3.5rem;
        color: var(--red);
        line-height: 1;
      }

      .payment-instruction {
        font-size: 0.85rem;
        color: var(--muted);
        margin-top: 6px;
      }

      .payment-order-summary {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: center;
        margin-bottom: 20px;
      }

      .payment-order-tag {
        background: white;
        border: 1.5px solid var(--border);
        border-radius: 20px;
        padding: 5px 12px;
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--brown);
      }

      .payment-order-tag.donation {
        border-color: var(--green);
        color: var(--green);
      }

      .qr-grid {
        display: flex;
        gap: 14px;
        margin-bottom: 24px;
        justify-content: center;
      }

      .qr-panel {
        flex: 1;
        max-width: 180px;
        background: white;
        border: 2px solid var(--border);
        border-radius: 16px;
        padding: 16px 12px 14px;
        text-align: center;
      }

      .qr-panel-label {
        font-family: 'Fredoka One', cursive;
        font-size: 1.15rem;
        margin-bottom: 10px;
      }

      .qr-panel-label.venmo {
        color: var(--venmo);
      }
      .qr-panel-label.paypal {
        color: var(--paypal);
      }

      .qr-canvas-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .qr-canvas-wrap canvas,
      .qr-canvas-wrap img {
        max-width: 100%;
        height: auto !important;
        display: block;
      }

      .qr-warning {
        font-size: 0.75rem;
        color: var(--red);
        padding: 8px 4px;
      }

      .qr-handle {
        font-size: 0.72rem;
        color: var(--muted);
        margin-top: 8px;
        word-break: break-all;
      }

      .edit-order-btn {
        padding: 18px;
        background: var(--brown);
        color: white;
        border-radius: 0;
        font-family: 'Fredoka One', cursive;
        font-size: 1.25rem;
        touch-action: manipulation;
        transition: background 0.12s;
      }

      .edit-order-btn:active {
        background: #1a0e08;
      }

      .new-order-btn {
        padding: 18px;
        background: white;
        color: var(--brown);
        border-left: 1px solid rgba(0 0 0 / 0.12);
        border-radius: 0;
        font-family: 'Fredoka One', cursive;
        font-size: 1.25rem;
        touch-action: manipulation;
        transition:
          background 0.12s,
          color 0.12s;
      }

      .new-order-btn:active {
        background: var(--cream);
      }

      @media (max-width: 360px) {
        .qr-panel {
          padding: 12px 8px;
        }
      }
    `,
  ];

  static properties = {
    items: {},
    qty: {},
    donationValue: { type: Number },
    total: { type: Number },
    venmoUsername: {},
    paypalDonateUrl: {},
  };

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
      const el = this.renderRoot?.querySelector?.(elId);
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
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true }));
  }

  render() {
    const ordered = this.items.filter((i) => this.qty[i.id] > 0);
    const don = this.donationValue;

    return html`
      <div class="content">
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
        </div>
      </div>

      <div class="actions-footer" role="region" aria-label="Order actions">
        <div class="actions-grid">
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
