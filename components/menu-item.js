import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { fmt } from '../utils.js';

class SquirrelMenuItem extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    button {
      font: inherit;
    }

    .menu-item {
      background: var(--white);
      border: 2px solid var(--border);
      border-radius: 16px;
      padding: 14px 10px 12px;
      text-align: center;
      height: 100%;
      user-select: none;
      position: relative;
      transition:
        border-color 0.12s,
        background 0.12s,
        transform 0.1s;
      -webkit-tap-highlight-color: transparent;
    }

    .menu-item.has-qty {
      border-color: var(--red);
      background: #fff4f1;
    }

    .menu-item-tap-area {
      display: block;
      cursor: pointer;
    }

    .menu-item-emoji {
      font-size: 2.2rem;
      display: block;
      margin-bottom: 4px;
      line-height: 1;
    }

    .menu-item-name {
      font-weight: 800;
      font-size: 1rem;
      display: block;
    }

    .menu-item-price {
      font-size: 0.78rem;
      color: var(--muted);
      display: block;
      margin-top: 2px;
    }

    .menu-item-badge {
      position: absolute;
      top: -9px;
      right: -9px;
      background: var(--red);
      color: white;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      font-size: 0.8rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .menu-item-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 10px;
    }

    .qty-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid var(--red);
      background: white;
      color: var(--red);
      font-size: 1.3rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      flex-shrink: 0;
      touch-action: manipulation;
    }

    .qty-btn:active {
      background: var(--red);
      color: white;
    }

    .qty-value {
      font-weight: 800;
      font-size: 1.1rem;
      min-width: 22px;
      text-align: center;
    }

    @media (max-width: 360px) {
      .menu-item-emoji {
        font-size: 1.8rem;
      }
    }
  `;

  static properties = {
    item: {},
    qty: { type: Number },
  };

  updated() {
    // Ensure the host itself has an accessible name/role, since many tools
    // (and some accessibility serializers) don't reliably surface shadow text.
    if (!this.item) return;

    const qty = this.qty ?? 0;
    const price = fmt(this.item.price / 100);

    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', `${this.item.name}, ${price} each, quantity ${qty}`);
  }

  _dispatch(delta) {
    this.dispatchEvent(
      new CustomEvent('qty-change', {
        bubbles: true,
        composed: true,
        detail: { id: this.item.id, delta },
      }),
    );
  }

  render() {
    const { item, qty } = this;
    return qty === 0
      ? html`<div
          class="menu-item"
          role="button"
          tabindex="0"
          aria-label=${`${item.name}, ${fmt(item.price / 100)} each`}
          @click=${() => this._dispatch(1)}
          @keydown=${(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this._dispatch(1);
            }
          }}
        >
          <span class="menu-item-emoji">${item.emoji}</span>
          <span class="menu-item-name">${item.name}</span>
          <span class="menu-item-price">${fmt(item.price / 100)} each</span>
        </div>`
      : html`<div class=${classMap({ 'menu-item': true, 'has-qty': true })}>
          <span class="menu-item-emoji">${item.emoji}</span>
          <span class="menu-item-name">${item.name}</span>
          <span class="menu-item-price">${fmt(item.price / 100)} each</span>
          <div class="menu-item-controls">
            <button
              class="qty-btn"
              @click=${(e) => {
                e.stopPropagation();
                this._dispatch(-1);
              }}
            >
              −
            </button>
            <span class="qty-value">${qty}</span>
            <button
              class="qty-btn"
              @click=${(e) => {
                e.stopPropagation();
                this._dispatch(1);
              }}
            >
              +
            </button>
          </div>
          <div class="menu-item-badge">${qty}</div>
        </div>`;
  }
}

customElements.define('squirrel-menu-item', SquirrelMenuItem);
