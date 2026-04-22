import happoCustom from 'happo/custom';
import '../main.js';

happoCustom.registerExample({
  component: 'SquirrelApp',
  variant: 'Order screen - empty',
  render: async () => {
    document.body.innerHTML = '';
    const el = document.createElement('squirrel-app');
    document.body.appendChild(el);
    await el.updateComplete;
  },
});

happoCustom.registerExample({
  component: 'SquirrelApp',
  variant: 'Order screen - with items',
  render: async () => {
    document.body.innerHTML = '';
    const el = document.createElement('squirrel-app');
    document.body.appendChild(el);
    el._qty = { brat: 2, pop: 1, water: 0, treat: 1 };
    await el.updateComplete;
  },
});

happoCustom.registerExample({
  component: 'SquirrelApp',
  variant: 'Order screen - with donation',
  render: async () => {
    document.body.innerHTML = '';
    const el = document.createElement('squirrel-app');
    document.body.appendChild(el);
    el._qty = { brat: 1, pop: 0, water: 0, treat: 0 };
    el._donation = '2.00';
    await el.updateComplete;
  },
});

happoCustom.init();
