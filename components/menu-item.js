import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { fmt } from '../utils.js';

class SquirrelMenuItem extends LitElement {
  static properties = {
    item: {},
    qty: { type: Number },
  };

  createRenderRoot() {
    return this;
  }

  _dispatch(delta) {
    this.dispatchEvent(
      new CustomEvent('qty-change', {
        bubbles: true,
        detail: { id: this.item.id, delta },
      }),
    );
  }

  render() {
    const { item, qty } = this;
    return qty === 0
      ? html`<div class="menu-item" @click=${() => this._dispatch(1)}>
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
