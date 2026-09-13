# Q & T FOODS LTD ERP + CRM Backend

Laravel 13 modular-monolith backend for the Q & T FOODS manufacturing ERP.

## Implemented foundation

- PHP 8.5, PostgreSQL 18, and Redis runtime
- CSRF-protected, verified-email server-side authentication with a revocable logical device registry
- invitation-first onboarding, one-time password reset and email verification links stored only as hashes
- encrypted TOTP MFA, short-lived login challenges, and individually hashed one-use recovery codes
- self-service password/MFA/device controls plus scoped ERP-administrator invitation, verification, and device revocation
- operation- and identity-specific rate limits that avoid cross-user lockout behind a shared IP
- named users, roles, permissions, effective role assignments, companies, and plants
- mandatory authorised-context selection before business API access
- server-side screen and transaction-action permission middleware
- transactional audit, reliable outbox, idempotency, and maker-checker services
- scoped audit search/detail APIs with actor, request/correlation, outcome, date, command, and entity filters plus safe-diff inspection and permissioned inline/download evidence access
- PostgreSQL-safe outbox claiming, immutable delivery-attempt history, persisted acknowledgements, bounded exponential retries, stale-lock recovery, automatic/manual quarantine, optimistic operator replay, and an optional HMAC-signed HTTP transport
- versioned global/plant approval policies with supported Unsold Return and Purchase Requisition rule creation, contiguous quantity/value authority bands, immutable request snapshots, SLA deadlines, one-time escalation routing, temporary non-chainable delegation, and rejection/resubmission lineage
- lifecycle-safe company, plant, hierarchical-location, local-user, role, permission, and effective role-assignment administration with scoped reads, optimistic versions, idempotent writes, audit, and outbox records
- company-scoped party master data with immutable codes, organisation/individual identity, multiple operational roles, addresses, contacts, unique tax registrations, commercial terms, optimistic aggregate replacement, dependency-safe lifecycle transitions, and transactional audit/outbox records
- company-scoped brand/agreement, catalog-item/UOM, stock-bearing SKU/pack, recipe/BOM, production-route, and quality-specification aggregates with immutable codes, child ownership, scoped uniqueness, active-reference and positive-stock safeguards, optimistic lifecycle commands, and transactional audit/outbox records
- company-scoped inventory owners and traced lots with expiry/lifecycle evidence, a governed quality-status catalog, plant stock coordinates, and active reservation rows constrained by relational scope keys
- live stock, owner, lot, and movement-ledger list/detail APIs with filters, counters, lookups, reservation history, and server-derived available/blocked/reserved quantities
- row-locked, optimistic, idempotent stock reservation/release commands with overcommit, quality, expiry, lot, owner, audit, outbox, and projection-reconciliation safeguards
- versioned draft/post/cancel aggregates for issue, return, transfer, count, adjustment, expiry, and disposal, with deterministic stock locking, type-specific coordinate and quantity controls, linked immutable movements, and permissioned APIs
- versioned INR purchase-requisition headers and governed item lines with scoped draft/update/submit/cancel APIs, value-band approval routing, maker-checker decisions, rejection/resubmission lineage, linked work items, and transactional audit/outbox evidence; foreign currency remains blocked until FX normalization is governed
- approved-requisition RFQs with multi-supplier invitation, complete quote capture, server-ranked landed-value/delivery comparison, reasoned non-lowest/late award, and database-enforced source snapshots and approval ceilings
- awarded-quote purchase orders with exact requisition/RFQ/quote line identity, immutable commercial revision snapshots, quantity/ceiling-bounded amendments before or after issue, and reasoned cancellation
- plant-scoped gate entries and partial GRNs that lock remaining PO quantities, resolve traced purchase lots, receive stock into Quality Hold, and create incoming-QC work with immutable movement evidence
- all-line incoming-QC decisions that split held quantities into released/rejected positions, plus supplier returns constrained to rejected on-hand stock and posted as immutable outbound movements
- payable invoices with server-calculated tax, PO/accepted-GRN/price three-way matching, correctable match exceptions, maker-checker invoice approval, controlled single-supplier multi-invoice payment proposals, allocation, settlement status, and unique bank-statement reconciliation
- plant-scoped demand plans with time-phased manufactured-SKU lines, effective recipe/route release validation, immutable MRP recipe and inventory-netting snapshots, route-operation capacity schedules, and atomic FEFO material reservation/release under stock-position locks
- one-order-per-released-schedule-line production conversion with immutable recipe, route, material, and ordered-stage snapshots; versioned release/cancel/complete controls; exact row-locked reserved-material consumption; immutable issue, stage, output, audit, and outbox evidence; and reconciled good/loss/rework completion gates
- specification-snapshot lab samples with typed result evaluation, automatic failed-sample deviations and holds, reasoned CAPA/disposition and food-safety release controls, plus versioned SKU artwork/coding approval and retirement
- quality-gated packing into released finished stock with rendered coding and material-to-finished-lot genealogy; bidirectional trace, classified recall containment and stock blocking; and immutable versioned INR batch-cost snapshots with yield, unit-cost, material-usage, stage-time, and total variance
- governed lead qualification/conversion, versioned price lists and discount ceilings, finance-owned customer credit, contract commitments, server-priced/taxed sales orders, immutable revisions, cancellation, and third-party work lifecycle
- row-locked FEFO sales allocation and picking, exact-lot shipment/load/dispatch stock issue, atomic receivable creation, proof-of-delivery outcomes, shipment-line claims, returned-goods receipt, and credit/replacement/reject resolution
- scoped receivable ageing/exposure, atomic customer-receipt allocation, immutable balance transactions, and live order revenue/cost/margin reporting
- balanced general-ledger journals with posting/reversal/period-close controls; itemized expense maker-checker posting; overhead allocation; asset activation/depreciation/disposal; payroll snapshots/posting; and maintenance cost accounting
- masked bank identities plus deterministic SHA-256 AP-bank/GST exports with single-use source selection and receiving-system acknowledgements
- ledger-isolated finance simulations, maker-checker adjustments, mapped/validated legacy imports, line-reconciled opening balances, and immutable non-mutating support diagnostic snapshots
- private finance bill archive with MIME/size/retention validation, SHA-256 duplicate detection, scoped metadata, and authenticated MinIO/S3 retrieval
- effective-dated legal-entity consolidation groups, governed plant lanes and item/UOM mappings, dual-scope cross-company authority, independent source/destination acceptance, separate dispatch/receipt stock movements, in-transit evidence, and balanced maker-checker consolidation snapshots
- schema-wide PostgreSQL hardening for all current master and transaction tables with scoped/composite foreign keys, lifecycle/type/quantity/amount checks, uniqueness and partial indexes, ownership/party-consistency triggers, and an explicit polymorphic/transport-identifier allowlist
- persisted, role/company/plant-scoped approval/task/exception queue with live counters, ageing, deadlines, claim, manager assignment, completion, audit/outbox records, and exact workflow drill-through
- controlled `RET-UNSOLD` request-to-finance commands, scoped list/detail reads, status history, and cascading customer/shipment/invoice/SKU/lot/quarantine-position lookups
- required `If-Match` and idempotency controls on receipt, disposition, loss posting, invoice confirmation, net credit, tax review, final settlement, and evidence upload
- scoped physical receipt posting that updates shipment-return totals and return-quarantine stock with auditable stock movements
- scoped loss-disposition approval inbox/detail APIs with exact direct/delegated authority checks, maker-checker separation, policy/SLA/authority snapshots, optimistic approval versions, and idempotent approve/reject commands
- rejection returns the versioned case to Quality quarantine and links its corrected resubmission; approval atomically routes restock, repack, and rework quantities to configured plant positions and unlocks Finance loss posting
- Finance loss posting issues the approved destroyed quantity out of quarantine; case detail exposes the full receipt-to-outcome stock movement history
- dedicated Finance permission and immutable action history for source-invoice confirmation, net credit note, tax treatment, and exactly one final receivable adjustment, refund, or replacement
- open-invoice settlement atomically reduces the receivable balance; refund and replacement paths require a fully paid invoice
- dedicated evidence permission for private PDF/image/text upload and download across all return-workflow roles
- evidence uploads are MIME-restricted, size-limited, SHA-256 hashed, case-versioned, idempotent, audit/outbox linked, and assigned a server-controlled seven-year retention date
- scoped case detail exposes evidence integrity, retention, uploader, and upload-audit metadata without storage paths; successful no-store/nosniff downloads are also audited
- live evidence uses a private MinIO/S3 bucket provisioned by Compose; startup migrates any legacy private-volume objects and verifies their stored SHA-256 hashes before the application starts

The selected company and plant are authoritative. Business requests cannot substitute a different scope. Master data, stock, procure-to-pay, manufacturing, work/approval, order-to-cash, dispatch, claims, receivables, core/supplement finance, multi-plant transfer/consolidation, return treatment, and private evidence/archive commands are all constrained to the same active context and reference chain. Existing-record commands require the current optimistic version where applicable, and safe idempotent replays return the original command result instead of duplicating aggregate replacements, transitions, reservations, stock/ledger movements, approvals, settlements, exports, or attachments.

## Local ERP flow

1. Fetch `GET /api/v1/auth/csrf`.
2. Sign in with `POST /api/v1/auth/login`; complete `POST /api/v1/auth/mfa/challenge` when requested.
3. Inspect the authorised contexts returned with the session.
4. Select one with `POST /api/v1/contexts/select`.
5. Use protected business APIs. The session context, logical device, and screen permissions are checked on the server.
6. Manage password, TOTP/recovery codes, and devices under `/api/v1/auth/*` as needed.
7. Sign out with `POST /api/v1/auth/logout`, which revokes the current logical device record.

All mutating session endpoints require the returned CSRF token in `X-CSRF-TOKEN`.

## Local demo accounts

All accounts use password `prototype`.

| Role | Email |
| --- | --- |
| Sales Manager | `demo.user@qtfoods.local` |
| Operations Manager | `operations.user@qtfoods.local` |
| Finance Reviewer | `finance.user@qtfoods.local` |
| ERP Administrator | `admin.user@qtfoods.local` |
| North Market Partner Portal | `partner.user@qtfoods.local` |

The container seeds these accounts at startup. They are development-only credentials.

## Run with Docker

```bash
docker compose up -d --build
```

Compose health-checks PostgreSQL, Redis, and MinIO, creates a non-public object bucket used by the scoped evidence and finance-archive prefixes, runs migrations/seeding and the integrity-checked legacy-evidence migration once, then starts the API, Redis queue worker, and scheduler. The scheduler enqueues an outbox-delivery batch every minute; the worker consumes the `outbox` and `default` queues. The API serves at `http://localhost:8000`, health is available at `http://localhost:8000/api/health`, and the local MinIO console is available at `http://localhost:9001`.

For a synchronous operational probe or recovery batch, run:

```bash
docker compose exec app php artisan qt:outbox:process --limit=50
```

Run the isolated test suite with:

```bash
docker compose run --rm --no-deps app composer test
```

The fast profile uses SQLite and skips the four PostgreSQL catalog/write-rejection checks in `MasterTransactionRelationalIntegrityTest`. Run those against a prepared E2E PostgreSQL database with `vendor/bin/phpunit -c phpunit.pgsql.xml`; the live Playwright setup below builds and seeds that disposable database automatically.

The verified P2 baseline is 7 feature tests / 206 assertions on both SQLite and PostgreSQL; the focused multi-plant scale, partner-portal, and optimisation suites are respectively 4 tests / 84 assertions, 4 tests / 73 assertions, and 4 tests / 139 assertions on both databases. The complete fast suite is 154 tests / 2,409 assertions, and the PostgreSQL relational-integrity suite is 4 tests / 15 assertions.

The frontend also owns live Chromium integration tests that run this backend against disposable PostgreSQL, Redis, and MinIO volumes:

```bash
cd ../FrontEnd
npm run test:e2e
```

Its dedicated `docker-compose.e2e.yml` project is reset and removed automatically, so it does not modify the normal development database or MinIO volume.

The Compose key, service passwords, log mailer, and identity preview links are local-development values. Configure SMTP, set `QT_IDENTITY_PREVIEW_LINKS=false`, rotate secrets, and enable TLS before using this stack in any shared environment.

## Delivery status

The complete local identity/control foundation, master data, inventory, procure-to-pay, manufacturing/quality/packing/trace/cost, unsold-return, order-to-cash/dispatch/claims/receivables, core/supplement finance, and all three P3 slices are functional. The portal includes party-bound external identity grants, exact tenant/entitlement enforcement, live commercial records and claims, and private checksum-backed document exchange with receipt-only acknowledgement. Optimisation captures immutable released-demand/stock/shortage/cost input versions, generates deterministic recommendations with explicit limitations, requires independent review, and records versioned outcomes without executing transactions. Only two pages remain deliberate prototypes: `ADM-HELP` and `BI-REP`.

API references:

- `docs/openapi.yaml`
- `docs/frontend-backend-endpoint-map.json`
- `../ERP_IMPLEMENTATION_GAPS.md`
