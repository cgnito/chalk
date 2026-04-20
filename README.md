# chalk

### section 1: project overview

**chalk** is a school fee management platform for Nigerian schools and families. it addresses the gap between informal fee tracking (spreadsheets, paper receipts, and fragmented bank transfers) and the need for a single, auditable place to see what each student owes, what has been paid, and whether a payment actually cleared.

schools get a private dashboard to manage students and classes. parents use a public portal tied to the school’s slug (for example `yoursite.com/royal-academy`) to look up a child by a **string student id** (such as `STU-001`) and pay fees securely. the innovation is end-to-end flow in one product: lookup by human-readable id, card payment through a major local gateway, automatic verification against the gateway, and immediate updates to balances and payment status—without the school manually reconciling every transfer.

### section 2: technical execution & architecture

**stack**

- **frontend:** next.js (react, app router, client-side portal and dashboard)
- **backend:** fastapi with **sqlmodel** over sqlite by default (configurable via `DATABASE_URL`)
- **payments:** **interswitch** webpay via **inline checkout** (`webpayCheckout` on the browser, qa script url by default)

**backend architecture**

- **school** and **student** are core entities. each **student** has a unique string `student_id` (e.g. `STU-001`) used on the parent portal, and an integer primary key used internally.
- **payment** rows link to the student through `student_pk_id` (integer fk), store `school_id`, amount in **naira**, payer email, status (`pending` / `success` / `failed`), and a **`reference`** string that must match the **transaction reference** sent to interswitch.

**transaction references**

- the client generates an interswitch-compliant reference (alphanumeric, max **15** characters per gateway rules). the **initiate** endpoint validates it, stores a **pending** `Payment` with the same `reference`, returns `txn_ref` and `amount_kobo` so the popup uses identical values.
- after checkout, **verify** loads the payment by `reference`, calls interswitch’s **get transaction** api with the same reference and amount in **kobo**, and on success marks the payment successful and sets the student’s payment status to paid.

**repository layout**

this submission is a **monorepo**: frontend code lives in `frontend/`, backend in `backend/`. if judges expect separate urls, the same backend can be published as its own repo; there is no author-owned backend-only url in this codebase yet.

**backend repository link:** `https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME` (replace with your public github url; backend root inside the repo is `backend/`).

### section 3: api integration & interswitch

**inline webpay**

the frontend loads interswitch’s inline script (`NEXT_PUBLIC_ISW_CHECKOUT_SCRIPT`, defaulting to the **qa** host). when a parent pays, the app calls `webpayCheckout` with merchant code, pay item id, mode `TEST`, **txn_ref**, **amount** (integer **kobo**), currency `566` (ngn), customer email, and **`site_redirect_url`** set to `String(window.location.origin)` so redirects always match the current deployment (local, staging, or production).

**handshake flow**

1. **initiation:** `POST /payments/initiate/{external_student_id}` with amount (naira), email, and `txn_ref`. the server resolves the student by **case-insensitive** `student_id`, creates a pending payment, returns `amount_kobo` and echoes `txn_ref`.
2. **kobo conversion:** amounts are stored in naira in the database; both the gateway and verification call use `round(naira * 100)` to kobo so they stay aligned.
3. **verification:** `GET /payments/verify/{txn_ref}` calls interswitch `gettransaction.json` with merchant code, transaction reference, and amount in kobo; response code `00` approves the payment and updates the student record.

**test credentials for judging**

live merchant credentials were not available in time for the buildathon window. the project is **wired for interswitch’s test / qa environment**: default qa script url, `TEST` mode in checkout, qa api base for verification (`ISW_API_BASE`), and documented test merchant / pay item defaults consistent with the inline demo. swap env vars for production when live keys are issued.

### section 4: user experience (ux)

**student lookup**

parents open the school’s public url, enter a **string student id** (same format the school uses, e.g. `STU-001`). the app searches with case normalization so minor typing differences still match. the profile shows fee balance context; opening pay starts the flow for that student only.

**payment modal and feedback**

the modal collects email and amount (with balance context), calls initiate, then opens the interswitch overlay. **loading** state disables the primary button; **errors** from validation or the api show inline. after the gateway returns success codes, the client calls **verify**; on approval the page reloads so balances and status reflect the new payment. failed verification shows a clear message instead of silently succeeding.

### section 5: setup and installation

**prerequisites:** node.js 18+, python 3.11+ (recommended), pip.

**backend**

```text
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --app-dir .
```

serve from the `backend` directory so the default sqlite path `sqlite:///./app/chalk.db` resolves correctly.

**frontend**

```text
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

**required environment variables (names only; never commit real secrets)**

backend (`backend/.env`):

- `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES` — jwt signing
- `DATABASE_URL` — optional; defaults to sqlite under `backend/app/`
- `BASE_URL` or `CORS_ORIGINS` — public api url or comma-separated browser origins for cors
- `ISW_MERCHANT_CODE`, `ISW_PAY_ITEM_ID`, `ISW_CLIENT_ID`, `ISW_SECRET`, `ISW_API_BASE` — interswitch (test defaults exist for merchant/pay item; sign with real secrets when available)

frontend (`frontend/.env.local`):

- `NEXT_PUBLIC_API_URL` — backend origin, no trailing slash
- `NEXT_PUBLIC_ISW_CHECKOUT_SCRIPT` — optional override for the inline script url
