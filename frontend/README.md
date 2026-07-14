# Voucher Frontend

React 19 + TypeScript + Vite + Tailwind CSS single page app for the voucher seat assignment campaign. It talks to the Laravel API in [`../backend`](../backend) over HTTP — there is no server rendering here.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open <http://localhost:5173>. The API must be running at the origin set in `VITE_API_URL` (default `http://localhost:8000`), and that origin must list this one in its `FRONTEND_URL` so CORS passes.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type check, then build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Oxlint |
| `npm run types:check` | TypeScript only |

## Structure

```
src/
├── components/     # VoucherForm, VoucherResultModal, Modal, form fields
├── hooks/          # useVoucherGenerator — drives check → generate
├── lib/            # api.ts (fetch client), aircraft.ts, utils.ts
├── types/          # request/response shapes
├── App.tsx         # the page
└── main.tsx        # entry point
```

`src/lib/api.ts` is the only place that knows about the API. It throws `ValidationFailed` for a 422 with an `errors` bag (rendered under the inputs) and `RequestFailed` for anything else, including an unreachable server (rendered in the result dialog).
