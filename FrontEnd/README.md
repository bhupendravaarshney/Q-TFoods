# Q & T FOODS LTD ERP + CRM Frontend

This React application now opens as a role-scoped ERP workspace rather than a catalogue of every prototype screen.

## ERP entry flow

1. `ACC-LOGIN` creates a server-side Laravel session using CSRF protection.
2. `ACC-CTX` shows only company and plant assignments authorised for that user.
3. The backend returns the roles and screen permissions for the selected context.
4. The application shell builds its navigation from those permissions and redirects unauthorised hashes to the user's home screen.
5. Backend middleware independently enforces the same context and screen access on API requests.
6. Logout, expired-session handling, and revoked-context recovery return the user to the appropriate gate.

## Local demo accounts

All local demo accounts use password `prototype`.

| Role | Email | Context |
| --- | --- | --- |
| Sales Manager | `demo.user@qtfoods.local` | Training Plant |
| Operations Manager | `operations.user@qtfoods.local` | Training Plant |
| Finance Reviewer | `finance.user@qtfoods.local` | Both plants |
| ERP Administrator | `admin.user@qtfoods.local` | Both plants |

These credentials are seeded development data and must not be used outside a local environment.

## Run

Start the backend first:

```bash
cd ../BackEnd
docker compose up -d --build app
```

Then start the frontend:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. During local development, Vite proxies `/api` to `http://127.0.0.1:8000`. Set `VITE_API_BASE_URL` only when the deployed API uses a different origin.

## Build

```bash
npm run build
```

## Automated tests

Run the Vitest component suite:

```bash
npm test
```

Install the Playwright browser once, then run the live multi-role workflow:

```bash
npm run test:e2e:install
npm run test:e2e
```

The browser suite requires Docker. It builds a separate backend at `127.0.0.1:18000`, starts the frontend at `127.0.0.1:4173`, migrates and seeds an isolated PostgreSQL database, and removes its PostgreSQL, Redis, and evidence volumes after the run. It never resets the normal development stack.

The work queue, authentication, context selection, and access control use the live backend. `RET-UNSOLD` has scoped customer/shipment/invoice/inventory lookups, a validated Sales create flow, a live recent-case detail workspace, role/state-aware Stores and Quality actions, a Finance reviewer inbox, and approved inventory outcome/loss posting. Its staged Finance UI separately confirms the source invoice, records net credit and tax treatment, and completes exactly one receivable adjustment, refund, or replacement while showing the immutable action and balance history. Existing-record, approval, finance, and evidence-upload commands send optimistic versions and idempotency keys. The case workspace can attach privately retained PDF/image/text evidence and shows its integrity hash, upload audit link, uploader, retention date, and authenticated download action. Vitest covers the case/evidence and approval/maker-checker workspaces; Playwright covers the live Sales-to-Operations-to-Finance hand-off and retained-file retrieval. The other registered module pages are still prototype views with demo data until their individual transaction APIs are implemented.

See [`../ERP_IMPLEMENTATION_GAPS.md`](../ERP_IMPLEMENTATION_GAPS.md) for the complete screen inventory, prioritised backlog, and definition of done.
