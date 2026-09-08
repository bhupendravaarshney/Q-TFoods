# Q & T FOODS LTD ERP + CRM Backend

Laravel 13 modular-monolith backend for the Q & T FOODS manufacturing ERP prototype.

## Implemented foundation

- PHP 8.5, PostgreSQL 18, and Redis runtime
- CSRF-protected, server-side session authentication
- named users, roles, permissions, effective role assignments, companies, and plants
- mandatory authorised-context selection before business API access
- server-side screen and transaction-action permission middleware
- transactional audit, outbox, idempotency, and maker-checker services
- role-aware work queue endpoint
- controlled `RET-UNSOLD` request-to-finance commands, scoped list/detail reads, status history, and cascading customer/shipment/invoice/SKU/lot/quarantine-position lookups
- required `If-Match` and idempotency controls on receipt, disposition, loss posting, invoice confirmation, net credit, tax review, final settlement, and evidence upload
- scoped physical receipt posting that updates shipment-return totals and return-quarantine stock with auditable stock movements
- scoped loss-disposition approval inbox/detail APIs with permission checks, maker-checker separation, optimistic approval versions, and idempotent approve/reject commands
- rejection returns the versioned case to Quality quarantine for corrected disposition; approval atomically routes restock, repack, and rework quantities to configured plant positions and unlocks Finance loss posting
- Finance loss posting issues the approved destroyed quantity out of quarantine; case detail exposes the full receipt-to-outcome stock movement history
- dedicated Finance permission and immutable action history for source-invoice confirmation, net credit note, tax treatment, and exactly one final receivable adjustment, refund, or replacement
- open-invoice settlement atomically reduces the receivable balance; refund and replacement paths require a fully paid invoice
- dedicated evidence permission for private PDF/image/text upload and download across all return-workflow roles
- evidence uploads are MIME-restricted, size-limited, SHA-256 hashed, case-versioned, idempotent, audit/outbox linked, and assigned a server-controlled seven-year retention date
- scoped case detail exposes evidence integrity, retention, uploader, and upload-audit metadata without storage paths; successful no-store/nosniff downloads are also audited
- Docker retains local evidence on a dedicated private volume; the environment-selected disk keeps later object-storage migration isolated from the API

The selected company and plant are authoritative. Business requests cannot substitute a different scope, and later return workflow actions, approvals, invoice treatment, and evidence access are constrained to the same active context and reference chain. Existing return cases and approval requests must be mutated with their current record versions; safe replays return the original result rather than recording a decision, stock movement, loss, credit, tax review, settlement, or attachment twice.

## Local ERP flow

1. Fetch `GET /api/v1/auth/csrf`.
2. Sign in with `POST /api/v1/auth/login`.
3. Inspect the authorised contexts returned with the session.
4. Select one with `POST /api/v1/contexts/select`.
5. Use protected business APIs. The session context and screen permissions are checked on the server.
6. Sign out with `POST /api/v1/auth/logout`.

All mutating session endpoints require the returned CSRF token in `X-CSRF-TOKEN`.

## Local demo accounts

All accounts use password `prototype`.

| Role | Email |
| --- | --- |
| Sales Manager | `demo.user@qtfoods.local` |
| Operations Manager | `operations.user@qtfoods.local` |
| Finance Reviewer | `finance.user@qtfoods.local` |
| ERP Administrator | `admin.user@qtfoods.local` |

The container seeds these accounts at startup. They are development-only credentials.

## Run with Docker

```bash
docker compose up -d --build app
```

The application migrates and seeds PostgreSQL before serving at `http://localhost:8000`. Health is available at `http://localhost:8000/api/health`.

Run the isolated test suite with:

```bash
docker compose run --rm --no-deps app composer test
```

The frontend also owns a live Chromium integration test that runs this backend against disposable PostgreSQL, Redis, and evidence volumes:

```bash
cd ../FrontEnd
npm run test:e2e
```

Its dedicated `docker-compose.e2e.yml` project is reset and removed automatically, so it does not modify the normal development database or evidence volume.

The Compose key and service passwords are local-development values. Override them before using this stack in any shared environment.

## Delivery status

The foundation flow and unsold-return vertical slice are functional. Most other module endpoints currently return empty starter responses, and their frontend pages intentionally retain demo data until each module's transaction logic is delivered.

API references:

- `docs/openapi.yaml`
- `docs/frontend-backend-endpoint-map.json`
- `../ERP_IMPLEMENTATION_GAPS.md`
