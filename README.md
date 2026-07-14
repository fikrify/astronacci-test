# Voucher Seat Assignment

A web application for an airline promotional campaign. Crew members enter the flight details and the app assigns **3 random, non-repeating seats** that are valid for the selected aircraft, storing the result so the same flight can never be assigned vouchers twice on the same date.

- **Backend:** Laravel 13 (PHP 8.3) REST API
- **Frontend:** React 19 + TypeScript + Tailwind CSS, served through Inertia.js
- **Database:** SQLite (`database/vouchers.db`)

The React app and the Laravel API are one deployable served from the same origin (Inertia), so no CORS configuration is required. See [Project structure](#project-structure) for where each part lives.

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
# 1. Install dependencies
composer install
npm install

# 2. Configure the environment
cp .env.example .env
php artisan key:generate

# 3. Create the SQLite database and run the migrations
touch database/vouchers.db
php artisan migrate
```

By default the app reads and writes `database/vouchers.db`. To store the database elsewhere, set an absolute path in `.env`:

```dotenv
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/vouchers.db
```

---

## Running the app

```bash
# Terminal 1 — Laravel API + page server
php artisan serve

# Terminal 2 — Vite dev server (React hot reload)
npm run dev
```

Open <http://localhost:8000>.

For a single command that runs both, plus the queue listener and logs:

```bash
composer run dev
```

To serve a production build instead of the Vite dev server:

```bash
npm run build
php artisan serve
```

---

## Docker

```bash
docker compose up --build
```

The container installs dependencies, builds the frontend, creates the SQLite database, runs the migrations and serves the app on <http://localhost:8000>. The database lives in a named volume, so it survives restarts.

---

## Tests

```bash
php artisan test
```

Covers the seat generator (seat maps per aircraft, uniqueness, invalid aircraft), both API endpoints (happy path, duplicate rejection, validation, the unique-constraint race), the home page, and architecture rules.

Other quality gates:

```bash
vendor/bin/pint          # PHP formatting
vendor/bin/phpstan analyse   # Static analysis (Larastan, level max)
npm run lint:check       # ESLint
npm run types:check      # TypeScript
```

---

## API

Both endpoints are defined in `routes/api.php` and validated by Form Request classes.

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

**Error responses**

| Status | When | Body |
| --- | --- | --- |
| `409 Conflict` | The flight already has vouchers on that date | `{ "success": false, "message": "Vouchers have already been generated for flight ID102 on 2025-07-12." }` |
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

`vouchers` table (see `database/migrations/*_create_vouchers_table.php`):

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
app/
├── Exceptions/          # VoucherAlreadyGenerated, InsufficientSeats (render their own JSON)
├── Http/
│   ├── Controllers/     # VoucherController — check + generate
│   ├── Requests/        # Form Requests with custom error messages
│   └── Resources/       # API Resources for consistent JSON
├── Models/              # Voucher
└── Services/            # SeatGeneratorService — seat maps and random selection
database/
├── factories/
└── migrations/
resources/js/            # React frontend
├── components/          # VoucherForm, VoucherResultModal, form fields
├── hooks/               # useVoucherGenerator — drives check → generate
└── pages/               # Inertia page components
routes/
└── api.php              # POST /api/check, POST /api/generate
tests/
├── Feature/
└── Unit/
```

---

## How the frontend flow works

1. The crew fills in name, ID, flight number, flight date and aircraft type.
2. **Generate** first calls `POST /api/check`.
3. If `exists` is `false`, it calls `POST /api/generate` and shows the 3 seats.
4. If `exists` is `true`, it shows an error explaining that this flight already has vouchers for that date.

Field-level validation errors from the API are rendered under the relevant input; everything else surfaces in the result dialog.