# Hotel Bill Generator

A lightweight React and Vite bill generator. Bill details stay in the browser; there is no server or saved bill history.

## Run locally

```bash
npm install
npm run dev
```

## Create a bill

Fill in the invoice, customer, and room/service fields. Add or remove charge rows as needed. The bill preview updates as you type.

The invoice number uses `SBRDDMMYYYY-<suffix>`. The discount is calculated on the subtotal, then the editable tax rate (default 5%) is calculated on the discounted taxable amount. GSTIN defaults to `08EFDPK8886Q1Z9` and FSSAI defaults to `22225022000276`; both can be edited in the form.

The preview shows Customer Copy and Office Copy. Use **Print / Save PDF** and choose **Save as PDF** in the browser's print dialog. Set paper size to A4 and orientation to landscape; both copies are arranged side-by-side on one page.

## Bill images

The Vite app imports the provided images from `src/assets/`:

- `src/assets/swaad-logo.jpeg` — restaurant logo
- `src/assets/upi-qr.jpeg` — UPI QR code

## Build and lint

```bash
npm run lint
npm run build
```
