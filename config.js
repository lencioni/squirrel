export const CONFIG = {
  // Venmo handle (without @)
  venmoUsername: 'PrairieCreekMN',

  // PayPal donation base URL — amount is appended as &amount=XX.XX
  paypalDonateUrl:
    'https://www.paypal.com/donate?token=DH2_t0QmuavhWFHKfkQElb3zZQ9W-sNdcr1YoXMxWSHivZ17PoSdryKiaXWL3nQ08TU9K0q2rXPo5dTX',

  // Menu items
  // price is in cents (e.g. 50 = $0.50, 500 = $5.00)
  items: [
    { id: 'brat', name: 'Brat', price: 500, emoji: '🌭' },
    { id: 'pop', name: 'Pop', price: 200, emoji: '🥤' },
    { id: 'water', name: 'Water', price: 100, emoji: '💧' },
    { id: 'treat', name: 'Treat', price: 300, emoji: '🍪' },
  ],

  // Quick-add donation button amounts (in whole dollars)
  quickDonations: [1, 2, 5],
};
