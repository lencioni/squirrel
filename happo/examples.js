import happoCustom from 'happo/custom';
import '../main.js';
import { CONFIG } from '../config.js';

const emptyQty = Object.fromEntries(CONFIG.items.map((i) => [i.id, 0]));

const examples = [
  // SquirrelApp
  {
    component: 'SquirrelApp',
    tag: 'squirrel-app',
    variant: 'Order screen - empty',
  },
  {
    component: 'SquirrelApp',
    tag: 'squirrel-app',
    variant: 'Order screen - with items',
    props: { _qty: { brat: 2, pop: 1, water: 0, treat: 1 } },
  },
  {
    component: 'SquirrelApp',
    tag: 'squirrel-app',
    variant: 'Order screen - with donation',
    props: { _qty: { brat: 1, pop: 0, water: 0, treat: 0 }, _donation: '2.00' },
  },

  // SquirrelMenuItem
  {
    component: 'SquirrelMenuItem',
    tag: 'squirrel-menu-item',
    variant: 'qty 0',
    props: { item: CONFIG.items[0], qty: 0 },
  },
  {
    component: 'SquirrelMenuItem',
    tag: 'squirrel-menu-item',
    variant: 'qty > 0',
    props: { item: CONFIG.items[0], qty: 2 },
  },

  // SquirrelOrderView
  {
    component: 'SquirrelOrderView',
    tag: 'squirrel-order-view',
    variant: 'empty',
    props: {
      items: CONFIG.items,
      qty: emptyQty,
      donation: '',
      quickDonations: CONFIG.quickDonations,
    },
  },
  {
    component: 'SquirrelOrderView',
    tag: 'squirrel-order-view',
    variant: 'with items',
    props: {
      items: CONFIG.items,
      qty: { brat: 2, pop: 1, water: 0, treat: 1 },
      donation: '',
      quickDonations: CONFIG.quickDonations,
    },
  },
  {
    component: 'SquirrelOrderView',
    tag: 'squirrel-order-view',
    variant: 'with donation',
    props: {
      items: CONFIG.items,
      qty: { brat: 1, pop: 0, water: 0, treat: 0 },
      donation: '2.00',
      quickDonations: CONFIG.quickDonations,
    },
  },

  // SquirrelPaymentView
  {
    component: 'SquirrelPaymentView',
    tag: 'squirrel-payment-view',
    variant: 'with items',
    props: {
      items: CONFIG.items,
      qty: { brat: 2, pop: 1, water: 0, treat: 1 },
      donationValue: 0,
      total: 12.0,
      venmoUsername: CONFIG.venmoUsername,
      paypalDonateUrl: CONFIG.paypalDonateUrl,
    },
  },
  {
    component: 'SquirrelPaymentView',
    tag: 'squirrel-payment-view',
    variant: 'with items and donation',
    props: {
      items: CONFIG.items,
      qty: { brat: 1, pop: 0, water: 0, treat: 0 },
      donationValue: 2.0,
      total: 7.0,
      venmoUsername: CONFIG.venmoUsername,
      paypalDonateUrl: CONFIG.paypalDonateUrl,
    },
  },
];

for (const { component, tag, variant, props = {} } of examples) {
  happoCustom.registerExample({
    component,
    variant,
    render: async () => {
      document.body.innerHTML = '';
      const el = document.createElement(tag);
      document.body.appendChild(el);
      Object.assign(el, props);
      await el.updateComplete;
    },
  });
}

happoCustom.init();
