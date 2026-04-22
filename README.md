# Squirrel Jam Food Order App

View the app at [lencioni.github.io/squirrel](https://lencioni.github.io/squirrel/).

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

Deploys automatically on pushes to `main` via GitHub Actions (GitHub Pages “GitHub Actions” source).
