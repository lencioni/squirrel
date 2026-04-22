# Squirrel Jam Food Order App

A mobile-friendly food ordering app for Squirrel Jam. Event workers use it to tally orders and show customers a Venmo or PayPal QR code to pay.

## Setup

```sh
pnpm install
```

## Development

```sh
pnpm dev
```

Opens a local dev server at `http://localhost:5173` with hot module replacement.

## Configuration

Edit [`config.js`](config.js) to customize the app for your event:

- **`venmoUsername`** — Venmo handle (without @)
- **`paypalDonateUrl`** — PayPal donation link base URL
- **`items`** — Menu items with `id`, `name`, `price` (USD), and `emoji`
- **`quickDonations`** — Amounts shown as quick-add donation buttons

## Deploying to GitHub Pages

1. Build the app:

   ```sh
   pnpm build
   ```

   This outputs static files to the `dist/` folder.

2. Push `dist/` to the `gh-pages` branch:

   ```sh
   pnpm run deploy
   ```
