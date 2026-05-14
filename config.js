export const CONFIG = {
  // Venmo handle (without @)
  venmoUsername: 'PrairieCreekMN',

  // PayPal donation base URL — amount is appended as &amount=XX.XX
  paypalDonateUrl:
    'https://www.paypal.com/donate?token=DH2_t0QmuavhWFHKfkQElb3zZQ9W-sNdcr1YoXMxWSHivZ17PoSdryKiaXWL3nQ08TU9K0q2rXPo5dTX',

  // Menu items
  // price is in cents (e.g. 50 = $0.50, 500 = $5.00)
  items: [
    {
      id: 'meal',
      name: 'Meal deal',
      description: 'Dog & chips',
      price: 500,
      emoji: '🌭',
    },
    { id: 'treats', name: 'Treats', price: 100, emoji: '🍪' },
    { id: 'chips', name: 'Chips', price: 100, emoji: '🍟' },
    { id: 'beverages', name: 'Beverages', price: 100, emoji: '🥤' },
  ],

  // Quick-add donation button amounts (in whole dollars)
  quickDonations: [1, 2, 5],
};
