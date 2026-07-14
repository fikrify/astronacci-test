# Voucher Seat Assignment

A web application for an airline promotional campaign. Crew members enter the flight details and the app assigns **3 random, non-repeating seats** that are valid for the selected aircraft, storing the result so the same flight can never be assigned vouchers twice on the same date.

The repository holds two deployables:

| Folder | What it is |
| --- | --- |
| [`backend/`](backend) | Laravel 13 (PHP 8.3) REST API, SQLite database |
| [`frontend/`](frontend) | React 19 + TypeScript + Tailwind CSS single page app (Vite) |

They are served from different origins and talk over HTTP, so the API allows the SPA's origin through CORS (`FRONTEND_URL` on the backend, `VITE_API_URL` on the frontend).

---

## Prerequisites

| Tool | Version |
| --- | --- |
| PHP | 8.3+ (with the `pdo_sqlite` extension) |
| Composer | 2.x |
| Node.js | 20+ |
| npm | 10+ |

---

## Setup

```bash
# Backend — API on http://localhost:8000
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/vouchers.db
php artisan migrate
php artisan serve

# Frontend — SPA on http://localhost:5173 (second terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open <http://localhost:5173>.

By default the API reads and writes `backend/database/vouchers.db` — that path is the fallback in `backend/config/database.php`, so no `.env` entry is needed. To store the database elsewhere, set an absolute path in `backend/.env`:

```dotenv
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/vouchers.db
```

---

## Docker

```bash
docker compose up --build
```

Two containers: the API on <http://localhost:8000> (SQLite in a named volume, so it survives restarts) and the SPA behind nginx on <http://localhost:5173>. The API origin is baked into the frontend bundle at build time through the `VITE_API_URL` build argument in `docker-compose.yml`.

---

## Tests

```bash
cd backend && php artisan test
```

Covers the seat generator (seat maps per aircraft, uniqueness, invalid aircraft), both API endpoints (happy path, duplicate rejection, validation, the unique-constraint race), and architecture rules.

Other quality gates:

```bash
cd backend
vendor/bin/pint             # PHP formatting
vendor/bin/phpstan analyse  # Static analysis (Larastan, level 7)

cd frontend
npm run lint                # Oxlint
npm run types:check         # TypeScript
```

---

## API

Both endpoints are defined in `backend/routes/api.php` and validated by Form Request classes.

### `POST /api/check`

Reports whether a flight already has vouchers on a date.

```json
// Request
{ "flightNumber": "GA102", "date": "2025-07-12" }

// Response — 200 OK
{ "exists": true }
```

### `POST /api/generate`

Generates 3 unique random seats for the aircraft, persists the record, and returns the seats.

```json
// Request
{
  "name": "Sarah",
  "id": "98123",
  "flightNumber": "ID102",
  "date": "2025-07-12",
  "aircraft": "Airbus 320"
}

// Response — 201 Created
{ "success": true, "seats": ["3B", "7C", "14D"] }
```

**Error responses** — both endpoints

| Status | When | Body |
| --- | --- | --- |
| `409 Conflict` | `/api/generate` only: the flight already has vouchers on that date | `{ "success": false, "message": "Vouchers have already been generated for flight ID102 on 2025-07-12." }` |
| `422 Unprocessable Entity` | Validation failed | `{ "message": "…", "errors": { "aircraft": ["The aircraft type must be one of: ATR, Airbus 320, Boeing 737 Max."] } }` |

Duplicates are blocked twice over: the controller checks before writing, and a composite unique index on `flight_number + flight_date` catches concurrent requests that slip past the check. Both paths return the same `409`.

---

## Seat layout

| Aircraft type | Rows | Seats per row | Total seats |
| --- | --- | --- | --- |
| ATR | 1–18 | A, C, D, F | 72 |
| Airbus 320 | 1–32 | A, B, C, D, E, F | 192 |
| Boeing 737 Max | 1–32 | A, B, C, D, E, F | 192 |

Generated seats are always valid for the selected aircraft — an ATR never yields a `B` or `E` seat.

---

## Database schema

`vouchers` table (see `backend/database/migrations/*_create_vouchers_table.php`):

| Column | Type | Notes |
| --- | --- | --- |
| `id` | BIGINT | Primary key, auto increment |
| `crew_name` | VARCHAR | Not null |
| `crew_id` | VARCHAR | Not null |
| `flight_number` | VARCHAR | Not null, unique with `flight_date` |
| `flight_date` | VARCHAR | Not null, stored as `YYYY-MM-DD` |
| `aircraft_type` | VARCHAR | Not null |
| `seat1` `seat2` `seat3` | VARCHAR | Not null |
| `created_at` `updated_at` | TIMESTAMP | Managed by Laravel |

The `Voucher` model exposes the three seat columns as a single `seats` array attribute, so application code reads and writes `['3B', '7C', '14D']` while the table keeps the required column layout.

---

## Project structure

```
backend/
├── app/
│   ├── Exceptions/          # VoucherAlreadyGenerated, InsufficientSeats (render their own JSON)
│   ├── Http/
│   │   ├── Controllers/     # VoucherController — check + generate
│   │   ├── Requests/        # Form Requests with custom error messages
│   │   └── Resources/       # API Resources for consistent JSON
│   ├── Models/              # Voucher
│   └── Services/            # SeatGeneratorService — seat maps and random selection
├── database/                # migrations, factories
├── routes/api.php           # POST /api/check, POST /api/generate
└── tests/                   # Feature + Unit (Pest)
frontend/
└── src/
    ├── components/          # VoucherForm, VoucherResultModal, form fields
    ├── hooks/               # useVoucherGenerator — drives check → generate
    ├── lib/                 # api.ts (fetch client), aircraft.ts, utils.ts
    └── App.tsx              # the page
```

---

## How the frontend flow works

The crew fills in one form:

| Field | Input | Notes |
| --- | --- | --- |
| Crew Name | Text | Required |
| Crew ID | Text | Required |
| Flight Number | Text | Required, e.g. `GA102` |
| Flight Date | Date picker | Required, `DD-MM-YYYY` |
| Aircraft Type | Dropdown | `ATR`, `Airbus 320`, `Boeing 737 Max` |

Pressing **Generate**:

1. Calls `POST /api/check`.
2. If `exists` is `false`, calls `POST /api/generate` and shows the 3 seats.
3. If `exists` is `true`, shows an error explaining that this flight already has vouchers for that date.

Field-level validation errors from the API are rendered under the relevant input; everything else surfaces in the result dialog.
