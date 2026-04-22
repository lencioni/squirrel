import { LitElement, css, html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { fmt } from '../utils.js';

class SquirrelMenuItem extends LitElement {
  _prevQty;

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
      padding: 14px 10px 58px;
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

    .menu-item-title-row {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 8px;
    }

    .menu-item-name {
      font-weight: 800;
      font-size: 1rem;
    }

    .menu-item-price {
      font-size: 0.78rem;
      color: var(--muted);
    }

    .menu-item-badge {
      position: absolute;
      top: -12px;
      right: -12px;
      background: var(--red);
      color: white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 0.9rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .menu-item-badge.bump {
      animation: badge-bump 220ms cubic-bezier(0.22, 1.2, 0.36, 1);
    }

    @keyframes badge-bump {
      0% {
        transform: scale(1);
      }
      45% {
        transform: scale(1.25);
      }
      75% {
        transform: scale(0.96);
      }
      100% {
        transform: scale(1);
      }
    }

    .menu-item-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-top: 0;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      border-radius: 0 0 14px 14px;
      background: var(--border);
    }

    .qty-btn {
      flex: 1;
      height: 50px;
      border: none;
      background: transparent;
      color: var(--brown);
      font-size: 1.4rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      touch-action: manipulation;
    }

    .qty-btn:active {
      background: rgba(255 255 255 / 0.16);
    }

    .qty-btn:focus {
      outline: none;
    }

    .qty-btn:focus-visible {
      /* Use an inset ring so it isn't clipped by the footer container */
      box-shadow: inset 0 0 0 3px var(--focus-ring);
    }

    .qty-btn.plus {
      border-left: 1px solid rgba(0 0 0 / 0.12);
    }

    .menu-item.has-qty .menu-item-controls {
      background: var(--red);
    }

    .menu-item.has-qty .qty-btn {
      color: white;
    }

    .menu-item.has-qty .qty-btn.plus {
      border-left-color: rgba(255 255 255 / 0.22);
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
    _badgeBump: { state: true },
  };

  updated() {
    // Ensure the host itself has an accessible name/role, since many tools
    // (and some accessibility serializers) don't reliably surface shadow text.
    if (!this.item) return;

    const qty = this.qty ?? 0;
    const price = fmt(this.item.price / 100);

    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', `${this.item.name}, ${price} each, quantity ${qty}`);

    if (this.qty !== undefined && this.qty !== null) {
      // Trigger a short bump animation whenever the displayed quantity changes.
      // (Skip the initial render where there is no previous value.)
      const prev = this._prevQty;
      if (typeof prev === 'number' && prev !== qty) {
        this._badgeBump = false;
        requestAnimationFrame(() => {
          this._badgeBump = true;
          window.setTimeout(() => {
            this._badgeBump = false;
          }, 240);
        });
      }
      this._prevQty = qty;
    }
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
    return html`<div class=${classMap({ 'menu-item': true, 'has-qty': qty > 0 })}>
      <span class="menu-item-emoji">${item.emoji}</span>
      <div class="menu-item-title-row">
        <span class="menu-item-name">${item.name}</span>
        <span class="menu-item-price">${fmt(item.price / 100)} each</span>
      </div>
      <div class="menu-item-controls">
        <button
          class="qty-btn minus"
          @click=${() => this._dispatch(-1)}
        >
          −
        </button>
        <button
          class="qty-btn plus"
          @click=${() => this._dispatch(1)}
        >
          +
        </button>
      </div>
      ${qty > 0
        ? html`<div class=${classMap({ 'menu-item-badge': true, bump: this._badgeBump })}>
            ${qty}
          </div>`
        : nothing}
    </div>`;
  }
}

customElements.define('squirrel-menu-item', SquirrelMenuItem);
