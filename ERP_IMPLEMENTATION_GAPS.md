# Q & T Foods ERP - Implementation Status and Remaining Work

Snapshot date: 2026-09-08

Latest verified checkpoint: the scoped `RET-UNSOLD` operational slice is complete and no longer carries the prototype banner. Vitest covers the case/evidence and approval/maker-checker workspaces, while a live Chromium test signs in as Sales, Operations, and Finance to complete creation, evidence upload, quarantine receipt, disposition, approval, outcome/loss posting, invoice/credit/tax/settlement treatment, and byte-for-byte evidence retrieval against isolated PostgreSQL, Redis, and private evidence storage. The browser run also exposed and verified a PostgreSQL idempotency-namespace length fix. Final verification passed with **51 backend tests / 434 assertions**, **4 frontend component tests**, **1 live browser E2E test**, the frontend production build, both Docker Compose validations, and a valid OpenAPI 1.8 contract with 16 existing style warnings. The next unchecked delivery is the database-backed work queue under the control foundation.

This document records what is functional, what is only partially connected, and what remains prototype/demo work. A screen should keep its `PROTOTYPE / DEMO DATA` label until it satisfies the completion checklist near the end of this document.

## Status legend

- **Implemented** - connected frontend and backend behavior is working and tested.
- **Partial** - some real behavior exists, but the screen or workflow is not complete end to end.
- **Prototype** - static/demo UI, empty API response, skeletal table, or no backend implementation.

## Executive snapshot

| Area | Current status | Evidence / limitation |
| --- | --- | --- |
| Login and session | Implemented for local ERP use | CSRF token, named login, session restore, expiry handling, logout, and login throttling are working. MFA, reset, invitations, and production identity integration are not implemented. |
| Company/plant context | Implemented | Only assigned active contexts are selectable; protected requests require a selected context. |
| Role navigation | Implemented | Sidebar screens come from backend permissions; unauthorised hashes are redirected. |
| Server authorisation | Implemented for current routes | Context, screen, and Unsold Return action permissions are enforced server-side. |
| `WRK-HOME` | Partial | Frontend calls the API, but the API returns two hard-coded tasks rather than database-backed approvals/exceptions. |
| `RET-UNSOLD` | Implemented operational slice | The scoped request-to-finance workflow, role hand-offs, inventory movements, maker-checker approval, Finance resolution, private evidence lifecycle, component tests, and live PostgreSQL-backed browser workflow pass. Cross-cutting production hardening remains tracked separately. |
| Other 67 business/admin screens | Prototype | They render the shared `ModulePage` with synthetic rows, KPIs, inert filters/open buttons, and a prototype alert for New. |
| Module read APIs | Prototype | 34 protected GET routes return only `{"data":[]}`. |
| Missing API surface | Prototype | 33 registered screens currently have no matching API route. |
| Database | Partial | Foundation, controls, stock, returns, locations, shipment-line reference data, invoice financials, an immutable return-finance ledger, and a retained evidence manifest exist. Fifteen other module tables remain minimal shells. No foreign-key declarations exist yet. |
| Tests | Partial across the full ERP | Backend: 51 tests / 434 assertions. Frontend: 4 component tests and 1 live multi-role Chromium E2E test pass with the production build/type-check. Coverage outside the implemented slice remains sparse. |
| Runtime | Local development ready | Docker app, PostgreSQL, and Redis run locally. Production secrets, TLS, workers, monitoring, backups, and deployment hardening remain. |

## Codex code-completion estimate

This is an implementation estimate for completing the repository code, database migrations, APIs, frontend behavior, automated tests, documentation, and a deployable UAT build.

**Estimated remaining total: 51-80 focused coding days (approximately 10-16 sequential working weeks).**

| Delivery block | Coding estimate |
| --- | ---: |
| Control foundation, real work queue, approvals, audit, users, and roles | 8-12 days |
| Master data and inventory | 10-15 days |
| Procurement and incoming quality | 8-12 days |
| Manufacturing, packing, traceability, and costing | 12-18 days |
| Sales, dispatch, returns, and core finance | 10-15 days |
| Finance supplement, scale, portal, and optimisation | 7-10 days |
| Cross-module regression, UAT fixtures, security hardening, and deployment verification | 8-12 days |

Some work overlaps, which is why the total range is lower than simply adding every maximum. The estimate assumes reuse of shared CRUD, workflow, permission, approval, audit, table, form, and testing infrastructure rather than implementing each of the 67 remaining screens independently.

An initial code-complete UAT build covering the control foundation, master data, inventory, and the completed `RET-UNSOLD` slice can be produced in approximately **15-22 focused coding days (3-5 sequential working weeks)**. The full 71-screen scope remains the 51-80 day estimate.

## What is currently functional

### Access flow

- `ACC-LOGIN`: CSRF-protected login using a named user and server-side session.
- `ACC-CTX`: authorised company/plant selection and context switching.
- Session restoration through `GET /api/v1/me`.
- Session expiry and revoked-context recovery in the frontend.
- Logout invalidates the backend session.
- Role-scoped screen lists and context-scoped action permissions.
- Current local roles: Sales Manager, Operations Manager, Finance Reviewer, and ERP Administrator.

### Shared backend controls

- Standard JSON error envelopes for authentication, authorisation, validation, conflict, and rate-limit errors.
- Idempotency support for Unsold Return creation, receipt, disposition, approval decisions, loss posting, every finance action, evidence upload, and the shared stock posting service.
- Maker-checker safeguard preventing self-approval.
- Audit-event and transactional-outbox writes for implemented commands.
- Stock movement service with row locking, positive-quantity checks, non-negative stock checks, company/plant consistency validation, idempotent transfers, and outbound issues.

### Unsold Return backend slice

- Paginated, filterable list constrained to the selected company/plant context.
- Scoped detail with return lines, resolved party/SKU/lot/position/invoice references, current approval, ordered status and stock histories, finance stage, balance, settlement, and immutable finance action history.
- Out-of-scope cases return not found, and reference enrichment cannot cross company/plant boundaries.
- Cascading customer, eligible shipment/invoice, shipment-line/SKU/lot, and return-quarantine-position lookups.
- Server validation treats customer, shipment, optional invoice, shipment line, SKU, lot, UOM, quantity, company, and plant as one reference chain.
- Frontend uses controlled inputs, client/server validation, live lookup states, a live list/detail workspace, and command forms shown only when both `allowed_actions` and record state permit them.
- Receipt, disposition, loss-post, invoice, credit, tax, and settlement commands require `If-Match` and `Idempotency-Key`; stale versions return conflict and exact retries return the first result.
- Physical receipt validates the selected active return-quarantine position against company, plant, SKU, lot, and UOM, then updates quarantine and shipment-return balances and writes an auditable stock movement transactionally.
- Finance reviewers have a company/plant-scoped approval inbox and disposition detail, guarded by a dedicated approval permission, source-version checks, and maker-checker separation.
- Approval records have their own optimistic version. Approval unlocks Finance posting without changing the submitted case version; rejection requires a reason and returns an incremented case to Quality quarantine for correction and resubmission.
- Approval atomically transfers positive restock, repack, and rework quantities from quarantine into the plant's configured released, repack-hold, and rework-hold positions. Missing or ambiguous outcome routing rolls the approval back.
- Finance loss posting issues only the approved destroyed quantity out of return quarantine in the same transaction as the loss event. Deterministic movement keys prevent duplicate stock on command replay.
- Return finance treatment is a versioned sequence of immutable actions: confirm the scoped posted/paid source invoice, post a positive net credit note, explicitly record tax treatment (including zero), then choose exactly one final settlement.
- Open invoices use a receivable adjustment that atomically reduces outstanding balance by net credit plus tax. Fully paid invoices permit either a refund reference or replacement authorisation; invalid and duplicate settlement paths are rejected.
- Every finance step has dedicated server permission enforcement, company/plant/customer/shipment scope validation, audit and outbox records, idempotent replay, unique non-invoice document references, and deterministic case-version ordering.
- Evidence files use a dedicated permission and non-public disk, strict MIME and 10 MiB limits, server-derived paths, SHA-256 integrity metadata, and seven-year server-controlled retention.
- Uploads are scoped, case-versioned, idempotent, and transactionally linked to audit/outbox records; case detail omits storage paths and exposes the uploader, retention, integrity, and upload-audit metadata.
- Downloads re-check company/plant/case/evidence scope, force attachment delivery with no-store/nosniff headers, and create a successful-access audit event.
- Component tests exercise retained-evidence metadata/upload permissions and approval decision/maker-checker behavior with mocked API boundaries.
- The Playwright workflow uses a disposable Docker project and real PostgreSQL runtime to verify the complete Sales-to-Operations-to-Finance browser hand-off, including the downloaded evidence bytes; test teardown removes all isolated data volumes.
- Create a return request.
- Record partial or complete physical receipt.
- Hold fully received goods in return quarantine state.
- Record disposition quantities and require them to equal received quantities.
- Request maker-checker approval for loss.
- Post only approved positive destroy quantities as both outbound stock and operational loss.
- Enforce the selected company/plant for every workflow action.
- Separate action authority:
  - Sales: create.
  - Operations: receive and disposition.
  - Finance: review dispositions, post approved loss, and complete invoice/value treatment.
  - ERP Admin: all workflow and approval actions, subject to maker-checker separation.
  - All four workflow roles: attach and retrieve case evidence under a separate evidence permission.

## Why most screens still say Prototype

Sixty-seven page files are wrappers around `FrontEnd/src/components/ModulePage.tsx`. That shared component deliberately uses:

- `FrontEnd/src/data/demoRows.ts` instead of an API;
- generated KPI values;
- a `Prototype action only` alert for New;
- filter and Open buttons without business behavior;
- no create/edit/detail forms or persistence.

`RET-UNSOLD` is a custom implemented page rather than a `ModulePage` wrapper. Sales, Stores, Quality, approval/rejection/resubmission, outcome inventory movements, loss posting, downstream invoice/credit/tax/settlement actions, private retained evidence handling, component tests, and the live multi-role browser workflow are connected. Its prototype banner has been removed. The remaining 67 business/admin pages still use static prototype behavior.

## Screen/API inventory

### Implemented and partial screens

| Screen | Status | What works | What remains |
| --- | --- | --- | --- |
| `WRK-HOME` | Partial | Authenticated API request and role/context-gated display | Persisted task model; approvals, exceptions, ageing, deadlines, drill-through, assignment, completion, and real counters |
| `RET-UNSOLD` | Implemented operational slice | Scoped list/detail/status, evidence, stock and finance histories plus lookups; relational validation; state-aware Sales/Stores/Quality/Finance forms; reviewer inbox and approve/reject/resubmit flow; idempotent and versioned commands; quarantine receipt and approved outcome movements; separate finance actions; private retained evidence lifecycle; component and live multi-role browser tests | Cross-cutting production hardening and broader ERP integration, tracked below |

### Prototype screens with protected but empty GET APIs (34)

These routes are authorised correctly but currently return `{"data":[]}`.

| Area | Screen codes |
| --- | --- |
| Foundation/Admin (6) | `ADM-ORG`, `ADM-USER`, `ADM-ROLE`, `ADM-RULE`, `ADM-AUD`, `ADM-INT` |
| Master/Procurement/Inventory (11) | `MD-PARTY`, `MD-BRAND`, `MD-ITEM`, `MD-REC`, `PUR-REQ`, `PUR-PO`, `INB-GRN`, `QC-IN`, `INV-STK`, `INV-TRF`, `INV-COUNT` |
| Manufacturing/Quality (5) | `PLAN-MRP`, `PRO-ORDER`, `PRO-STAGE`, `FG-LOT`, `TRACE-CASE` |
| Sales/Dispatch (4) | `CRM-LEAD`, `CRM-ORDER`, `DSP-LOAD`, `DSP-POD` |
| Finance (5) | `FIN-AR`, `FIN-AP`, `FIN-GL`, `FIN-SIM`, `FIN-LEGACY` |
| Scale (3) | `SCALE-PLANT`, `PORTAL-EXT`, `OPT-PLAN` |

### Prototype screens with no current API route (33)

| Area | Screen codes |
| --- | --- |
| Foundation/Admin (3) | `ADM-LOC`, `ADM-HELP`, `BI-REP` |
| Master/Procurement/Inventory (6) | `MD-SKU`, `PUR-RFQ`, `INB-GATE`, `INB-RETURN`, `INV-ISS`, `INV-EXP` |
| Manufacturing/Quality (10) | `MD-ROUTE`, `MD-SPEC`, `PLAN-DEM`, `PLAN-SCH`, `PRO-LOSS`, `QC-LAB`, `QC-SAFE`, `PACK-ART`, `PACK-RUN`, `COST-BATCH` |
| Sales/Dispatch (5) | `CRM-PRICE`, `CON-WORK`, `DSP-PICK`, `RET-CASE`, `BI-PROFIT` |
| Finance/Support (5) | `FIN-EXP`, `COST-OH`, `ASSET-REG`, `HR-PAY`, `ENG-MNT` |
| Finance Supplement (4) | `FIN-ADJ`, `FIN-ARCH`, `FIN-OPEN`, `FIN-SUP` |

## Remaining work by capability

### P0 - Finish one complete operational slice

Finish `RET-UNSOLD` before expanding all modules:

- [x] Add scoped list and detail endpoints with pagination, filters, and status history.
- [x] Connect the frontend to real customer, shipment, invoice, SKU, lot, and return-position lookups.
- [x] Replace demo inputs with validated controlled forms.
- [x] Show actions according to `allowed_actions` and the record's current state.
- [x] Connect Sales create, Stores receive, Quality disposition, and Finance loss-post actions.
  - Finance loss-post remains unavailable until an authorised reviewer approves the disposition.
- [x] Add approval inbox/detail/approve/reject APIs and UI with reviewer authority checks.
- [x] Add optimistic version checks (`If-Match`) to every implemented existing-record state-changing command.
- [x] Add idempotency to receive, disposition, approval decision, and loss posting, not only creation.
- [x] Validate return stock positions and post physical quarantine movements.
- [x] Post separate stock movements for restock, repack, rework, and destruction outcomes.
- [x] Add credit note, refund/replacement, invoice, tax, and receivable treatment as separate finance actions.
  - Verified with six permissioned finance endpoints, an immutable finance ledger, invoice balance updates, a staged UI, and regression coverage.
- [x] Add evidence/attachment upload, retrieval, retention, and audit linkage.
  - Verified with a dedicated permission, private persistent Docker volume, MIME/size controls, SHA-256 metadata, seven-year retain-until policy, scoped and audited upload/download endpoints, case UI/history, OpenAPI 1.8 validation, 51 backend tests / 434 assertions, and a passing frontend production build.
- [x] Add frontend component tests and a browser E2E test covering the multi-role hand-off.
  - Verified with 4 Vitest component tests for case/evidence and approval/maker-checker behavior plus 1 Playwright Chromium workflow across Sales, Operations, and Finance. The E2E stack fresh-seeds isolated PostgreSQL/Redis/private evidence storage, completes every current workflow stage, verifies retained download bytes, and deletes its volumes on teardown.

### P0 - Complete the control foundation

- [ ] Replace the hard-coded work queue with database-backed approvals, assigned work, exceptions, and overdue items.
- [ ] Implement Organisation, Plant/Location, User, Role, Permission, and Role Assignment CRUD.
- [ ] Implement invitations, password reset, email verification, session/device administration, and MFA.
- [ ] Implement configurable approval rules, authority limits, delegation, escalation, and rejection/resubmission.
- [ ] Implement the Audit search/detail API and evidence viewer.
- [ ] Add an outbox worker, retry policy, acknowledgements, dead-letter/quarantine handling, and operator UI.
- [ ] Add queue-worker and scheduler services to Docker/deployment configuration.
- [ ] Migrate the live private evidence disk from its persistent local Docker volume to MinIO/object storage; the API is disk-agnostic, but the S3 adapter and bucket provisioning are not wired.

### P1 - Master data and inventory

- [ ] Parties, addresses, contacts, tax details, commercial terms, and status lifecycle.
- [ ] Brands, agreements, items, SKUs, packs, UOM conversions, recipes, routes, and specifications.
- [ ] Location hierarchy, owners, lots, expiry, quality status, blocked/available/reserved stock.
- [ ] Stock enquiry read model, movement history, issue/return, transfer, count, adjustment, expiry, and disposal workflows.
- [ ] Database foreign keys, check constraints, and uniqueness rules for all master and transaction relationships.
- [ ] Expose the existing stock posting service through permissioned commands after scope validation.

### P1 - Procure-to-pay

- [ ] Requisition, approval, RFQ, supplier comparison, PO, amendments, and cancellation.
- [ ] Gate entry, GRN, partial receipts, incoming QC, rejection, supplier return, and stock posting.
- [ ] Three-way match, payable invoice, taxes, payment proposal, payment, and reconciliation.

### P1 - Manufacturing and quality

- [ ] Demand plan, MRP, capacity schedule, and material reservation.
- [ ] Production order release, material issue, stage execution, yield/loss/rework, and completion.
- [ ] Lab samples/results, deviations, food-safety holds, release, artwork/coding, packing, and finished-goods lots.
- [ ] Full lot genealogy, trace, recall, batch costing, and variance analysis.

### P2 - Order-to-cash and finance

- [ ] Lead/enquiry, price lists, discounts, credit control, contracts, sales orders, and amendments.
- [ ] Allocation, picking, loading, dispatch, POD, claims, returns, replacements, and credits.
- [ ] Receivables, collections, ageing, profitability, payables, expenses, journals, and period close.
- [ ] Overheads, assets, depreciation, payroll posting, and maintenance accounting.
- [ ] Finance adjustments, historical import, bill archive, opening reconciliation, and support/audit tools.

### P3 - Scale and optimisation

- [ ] Multi-plant configuration, consolidation, inter-plant movements, and cross-company controls.
- [ ] Partner portal identity, tenant isolation, entitlements, document exchange, and acknowledgements.
- [ ] Forecast/optimisation input versioning, recommendations, limitations, human approval, and outcome tracking.

## Production-readiness gaps

- [ ] Replace development application key, demo accounts, database passwords, and MinIO credentials.
- [ ] Disable `APP_DEBUG`, restrict exposed database/Redis ports, and separate development seeders.
- [ ] Enforce HTTPS, secure/same-site cookies, trusted hosts/proxies, and an explicit production CORS policy.
- [ ] Add database foreign keys, check constraints, retention rules, and migration rollback/recovery procedures.
- [x] Add PostgreSQL-backed integration coverage for the critical `RET-UNSOLD` slice; the 51-test backend feature suite continues to use in-memory SQLite for fast isolation.
- [ ] Add a real simultaneous-transaction test for stock locking; the current stock test executes commands sequentially.
- [ ] Add route-wide authorisation matrix tests for every role, context, state, and action.
- [x] Add baseline frontend component and live browser E2E coverage for `RET-UNSOLD`.
- [ ] Expand frontend unit/component/browser coverage to other screens and add automated accessibility checks.
- [ ] Add structured logs, metrics, traces, request/correlation IDs, alerting, and audit monitoring.
- [ ] Add backup/restore tests, disaster recovery, queue recovery, and outbox replay procedures.
- [ ] Add performance, load, security, dependency, and penetration-test gates in CI/CD.

## Completion definition for each screen

Remove the prototype label from a screen only when all applicable items are complete:

- [ ] Database schema has required fields, foreign keys, constraints, indexes, and lifecycle/status rules.
- [ ] List, detail, create, update, and workflow command APIs exist where applicable.
- [ ] Every query and command is constrained to the selected company/plant/party scope.
- [ ] Screen and action permissions are enforced on the server, not only hidden in the UI.
- [ ] State transitions, maker-checker rules, authority limits, and optimistic versions are enforced.
- [ ] Mutating commands are idempotent and transactionally write audit/outbox records.
- [ ] The frontend uses APIs and contains real loading, empty, validation, conflict, and failure states.
- [ ] Buttons, filters, drill-through, exports, and history controls perform their stated action.
- [ ] No `demoRows`, synthetic KPIs, hard-coded business records, or prototype alerts remain.
- [ ] Backend tests, frontend tests, and at least one end-to-end role/context workflow pass.
- [ ] API documentation and the screen-to-endpoint map match the implementation.

## Recommended next delivery

The next milestone should begin the **control foundation** by replacing the hard-coded `WRK-HOME` response with persisted, company/plant-scoped approvals, assigned work, exceptions, and overdue items. Connect real counters, ageing, assignment, completion, and drill-through in the frontend, then proceed to Organisation, Plant/Location, User, Role, Permission, and Role Assignment CRUD before broad module development.
