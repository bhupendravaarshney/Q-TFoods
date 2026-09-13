# Q & T Foods ERP - Implementation Status and Remaining Work

Snapshot date: 2026-09-13

Latest verified checkpoint: **P0, P1, P2, and all three P3 scale, external-partner, and optimisation slices are implemented end to end**. The governed flow now continues through effective-dated consolidation, mapped inter-plant/cross-company stock, an exact-tenant external workspace, and versioned optimisation scenarios derived from immutable released-demand, stock, material-shortage, and finalized-cost snapshots. Deterministic recommendations disclose their rationale and limitations, remain decision support rather than transaction execution, require independent human review, and retain versioned outcome evidence. Scope, action permissions, dual-context and exact-party authority, deterministic row locking, optimistic versions, idempotency, workflow gates, maker-checker separation, balanced-ledger rules, and transactional stock/audit/outbox evidence are enforced on the server. Final verification passed with **154 fast backend tests / 2,409 assertions plus 4 PostgreSQL relational-integrity tests / 15 assertions**, the focused **7-test / 206-assertion P2, 4-test / 84-assertion scale, 4-test / 73-assertion portal, and 4-test / 139-assertion optimisation suites on both SQLite and PostgreSQL**, **92 frontend component tests**, **17 live PostgreSQL/Redis/MinIO/Chromium E2E tests**, fresh PostgreSQL migrations and seeding through migration 031, the frontend production build/type-check, and a valid API v3.0 OpenAPI 3.1 contract with only the same 15 pre-existing style warnings.

This document records what is functional, what is only partially connected, and what remains prototype/demo work. A screen should keep its `PROTOTYPE / DEMO DATA` label until it satisfies the completion checklist near the end of this document.

## Status legend

- **Implemented** - connected frontend and backend behavior is working and tested.
- **Partial** - some real behavior exists, but the screen or workflow is not complete end to end.
- **Prototype** - static/demo UI, empty API response, skeletal table, or no backend implementation.

## Executive snapshot

| Area | Current status | Evidence / limitation |
| --- | --- | --- |
| Login and identity lifecycle | Implemented for local ERP use | CSRF/session login, verified-email gate, invitations, non-enumerating reset/verification requests, TOTP and one-use recovery codes, logical device inventory/revocation, expiry, logout, and operation/identity-specific throttling are working. External SSO/IdP integration and a production email transport remain deployment choices. |
| Company/plant context | Implemented | Only assigned active contexts are selectable; protected requests require a selected context. ERP administrators can create, edit, and lifecycle-manage companies and plants. |
| Role navigation | Implemented | Sidebar screens come from effective backend role permissions; unauthorised hashes are redirected. Custom role/permission administration is live. |
| Server authorisation | Implemented for current routes | Context, screen, administration, master-data, inventory, procurement/inbound/payables, manufacturing/quality/packing/trace/cost, order-to-cash/dispatch/claims/receivables, core/supplement finance, multi-plant transfer/consolidation, partner access/entitlements, optimisation planning, work-queue, and Unsold Return action permissions are enforced server-side. |
| `WRK-HOME` | Implemented operational slice | Persisted and scoped approvals/tasks/exceptions, policy-derived priority/deadline/authority, claim and manager assignment, non-approval completion, automatic approval closure, controlled escalation/unassignment, exact workflow drill-through, audit/outbox writes, component coverage, and live browser coverage are working. Additional module sources remain future work. |
| `RET-UNSOLD` | Implemented operational slice | The scoped request-to-finance workflow, role hand-offs, inventory movements, maker-checker approval, Finance resolution, private evidence lifecycle, component tests, and live PostgreSQL-backed browser workflow pass. Cross-cutting production hardening remains tracked separately. |
| Foundation/control administration | Implemented administration slice | `ADM-ORG`, `ADM-LOC`, `ADM-USER`, `ADM-ROLE`, `ADM-RULE`, `ADM-AUD`, and `ADM-INT` provide scoped administration and control operations with explicit action permissions, optimistic conflicts, idempotency, transactional audit/outbox evidence, component tests, and live browser journeys. |
| `MD-PARTY` | Implemented master-data slice | Company party list/detail/create/update/lifecycle APIs and a complete nested editor cover roles, addresses, contacts, tax registrations, commercial terms, dependency-safe transitions, scope, permission, optimistic, idempotency, audit/outbox, component, and live browser controls. |
| Product/manufacturing master data | Implemented master-data slice | `MD-BRAND`, `MD-ITEM`, `MD-SKU`, `MD-REC`, `MD-ROUTE`, and `MD-SPEC` provide relational nested aggregates, scoped CRUD/lifecycle APIs, dependency and uniqueness controls, live workspaces, and backend/component/browser coverage. |
| `INV-STK` | Implemented inventory-foundation and ledger slice | Four live registers expose scoped stock, owners, lots, and immutable movements; quality/expiry-derived availability; reservation and movement drill-through; lifecycle controls; and backend/component/browser coverage. |
| `INV-ISS`, `INV-TRF`, `INV-COUNT`, `INV-EXP` | Implemented inventory-operation slice | Versioned draft/post/cancel workspaces cover issue/return, transfer, count/adjustment, and expiry/disposal with permissioned commands, type-specific stock controls, linked ledger evidence, and backend/component/browser coverage. |
| `PUR-REQ` | Implemented procurement slice | Scoped, versioned requisition headers and costed lines; create/edit/submit/cancel; value-band maker-checker approval, rejection/resubmission, work-queue projection, immutable decision evidence, and backend/component/live browser coverage are working. |
| `PUR-RFQ`, `PUR-PO` | Implemented sourcing slice | Approved-requisition RFQs, governed supplier invitations, complete quote capture, ranked comparison, reasoned award, awarded-quote PO conversion, immutable amendments, issue/cancel controls, and source/ceiling database guards are live and tested. |
| `INB-GATE`, `INB-GRN`, `QC-IN`, `INB-RETURN` | Implemented inbound slice | Issued-PO arrivals, partial lot receipts into Quality Hold, complete accepted/rejected QC disposition, released/rejected stock movements, and quantity-safe supplier returns are live with scope, version, idempotency, audit/outbox, component, backend, and browser coverage. |
| `FIN-AP` | Implemented accounts-payable and integration slice | Tax-calculated supplier invoices, exact PO/accepted-GRN/price matching, maker-checker invoice/proposal approval, payment allocation/reconciliation, masked bank configuration, deterministic hashed AP/GST exports, single-use export controls, and acknowledgements are live and tested. |
| `PLAN-DEM`, `PLAN-MRP`, `PLAN-SCH` | Implemented manufacturing-planning slice | Versioned demand, effective-recipe MRP explosion, expiry-aware material netting, route-operation capacity snapshots, finite-capacity validation, and locked FEFO reservation/release are live with complete API, UI, database, component, backend, and browser coverage. |
| `PRO-ORDER`, `PRO-STAGE`, `PRO-LOSS`, `QC-LAB`, `QC-SAFE`, `PACK-ART`, `PACK-RUN`, `FG-LOT`, `TRACE-CASE`, `COST-BATCH` | Implemented manufacturing-execution slice | Schedule conversion, reserved issue, ordered execution, output/rework accounting, lab/deviation/hold release gates, governed artwork/coding, finished-stock receipt, bidirectional genealogy, recall containment, and immutable INR cost/variance snapshots are live with complete API, UI, database, component, backend, and browser coverage. |
| P2 commercial and dispatch | Implemented | `CRM-LEAD`, `CRM-PRICE`, `CRM-ORDER`, `CON-WORK`, `DSP-PICK`, `DSP-LOAD`, `DSP-POD`, `RET-CASE`, `FIN-AR`, and `BI-PROFIT` use live scoped registers, details, lookups, versioned commands, immutable evidence, stock/invoice posting, and tested cross-role workflows. |
| P2 core and supplement finance | Implemented | `FIN-EXP`, `FIN-GL`, `COST-OH`, `ASSET-REG`, `HR-PAY`, `ENG-MNT`, `FIN-SIM`, `FIN-ADJ`, `FIN-LEGACY`, `FIN-ARCH`, `FIN-OPEN`, and `FIN-SUP` are live, along with the new `FIN-AP` bank/statutory area. |
| `SCALE-PLANT` | Implemented first P3 scale slice | Effective-dated consolidation groups, governed same- and cross-company routes, mapped transfers, source approval, destination acceptance, separate dispatch/receipt stock posting, in-transit evidence, balanced consolidation snapshots, and live multi-context coverage are working. |
| `PORTAL-EXT` | Implemented P3 external-workspace slice | Effective partner identity grants, party-bound role assignment, exact customer-tenant isolation, explicit read/command entitlements, live orders/shipments/invoices/claims, private inbound/outbound document exchange, receipt-only acknowledgement, internal administration, and complete backend/component/browser coverage are working. |
| `OPT-PLAN` | Implemented P3 decision-support slice | Immutable versioned input snapshots, deterministic net-requirement recommendations, explicit limitations, source-staleness gates, independent approval/rejection, versioned outcomes, and completion evidence are live. Recommendations never execute stock, production, purchasing, or finance transactions. |
| Other 2 business/admin screens | Prototype | Only `ADM-HELP` and `BI-REP` still render the shared `ModulePage` demo behavior. |
| Missing API surface | Prototype | `ADM-HELP` and `BI-REP` have no matching live API route. |
| Database | Implemented through all delivered P3 slices; future shells remain | Migrations 026-031 add relational order-to-cash, core/supplement-finance, consolidation, partner-access/document, and optimisation plan/input/recommendation/review/outcome aggregates and harden their links to stock, demand/MRP, legal-entity, party, role, ledger, audit, and outbox data. Fresh PostgreSQL migration/seeding and the relational catalog/write-rejection suite pass. The two future-module shells remain intentionally minimal. |
| Tests | Implemented baseline through all delivered P3 slices | Backend: 154 fast SQLite tests / 2,409 assertions (with 4 PostgreSQL-only cases skipped) plus 4 PostgreSQL relational-integrity tests / 15 assertions; focused P2, scale, portal, and optimisation suites pass on both databases. Frontend: 92 component tests and all 17 live PostgreSQL/Redis/MinIO/Chromium E2E workflows pass together with the production build/type-check. The two prototype screens and broader production qualities remain outside this baseline. |
| Runtime | Local development ready | Docker runs the API, PostgreSQL, Redis, private MinIO evidence storage, a Redis queue worker, and a scheduler with health/dependency ordering. Production secrets, TLS, monitoring, backups, and deployment hardening remain. |

## Codex code-completion estimate

This is an implementation estimate for completing the repository code, database migrations, APIs, frontend behavior, automated tests, documentation, and a deployable UAT build.

**Estimated remaining total: 4-8 focused coding days (approximately 1-2 sequential working weeks).**

| Delivery block | Coding estimate |
| --- | ---: |
| Master data and inventory | Complete |
| Procurement and incoming quality | Complete |
| Manufacturing execution, quality, packing, traceability, and costing | Complete |
| Sales, dispatch, returns, and remaining core finance | Complete |
| Finance supplement | Complete |
| Reports and help | 2-4 days |
| Cross-module regression, UAT fixtures, security hardening, and deployment verification | 8-12 days |

Some work overlaps, which is why the total range is lower than simply adding every maximum. The estimate assumes reuse of the delivered CRUD, workflow, permission, audit, outbox, table, form, and testing infrastructure for the two remaining prototype screens.

The code-complete UAT baseline now covers P0, P1, P2, and all three P3 slices. Completing the full 71-screen functional scope requires the two remaining reporting/help screens plus the production-readiness work listed below.

## What is currently functional

### Access flow

- `ACC-LOGIN`: CSRF-protected named-user login, verified-email enforcement, and a short-lived TOTP/recovery-code challenge when MFA is enabled.
- Invitation acceptance, password reset, and email verification use expiring one-time links whose raw values are never persisted.
- Password-reset and verification requests return the same message for eligible and unknown accounts; local preview URLs are explicitly environment-gated and disabled by default.
- `ACC-CTX`: authorised company/plant selection and context switching.
- Session restoration through `GET /api/v1/me`.
- Session expiry, explicit device revocation, and revoked-context recovery in the frontend.
- Self-service security can change password, enrol/disable TOTP, replace recovery codes, list logical devices, revoke another device, or sign out the current device.
- Logout invalidates the backend session and revokes its logical device record.
- Role-scoped screen lists and context-scoped action permissions.
- Current local roles: Sales Manager, Operations Manager, Finance Reviewer, ERP Administrator, and the party-bound Partner Portal User.

### Shared backend controls

- Standard JSON error envelopes for authentication, authorisation, validation, conflict, and rate-limit errors.
- Idempotency support for approval-policy/delegation/escalation commands, purchase-requisition create/update/submit/cancel/approve/reject commands, Unsold Return creation, receipt, disposition, approval decisions, loss posting, every finance action, evidence upload, inventory-operation create/update/post/cancel commands, all demand/MRP/schedule and production/quality/packing/trace/cost commands, partner access/document/claim commands, optimisation scenario/review/outcome commands, and the shared stock posting service.
- Maker-checker safeguard preventing self-approval plus exact direct/delegated authority checks against the request's immutable permission snapshot.
- Audit-event and transactional-outbox writes for implemented commands, plus scoped operator search/detail workspaces for both control records.
- Reliable outbox delivery with PostgreSQL `SKIP LOCKED` claiming, stale-processing recovery, bounded exponential backoff, immutable attempt records, persisted receiver acknowledgements, and automatic/manual quarantine.
- A deterministic local log transport and an optional timeout-bounded, HMAC-signed HTTP transport that requires an explicit receiver acknowledgement before marking an event delivered.
- Private evidence stored through the S3-compatible filesystem adapter in a non-public MinIO bucket; legacy-volume migration verifies each manifest SHA-256 before startup continues.
- Stock movement service with row locking, positive-quantity checks, non-negative and unreserved-stock checks, company/plant/owner consistency validation, idempotent transfers, and outbound issues.

### Foundation administration

- `ADM-ORG` lists the selected organisation and its plants, exposes company/plant detail, and supports lifecycle-safe create and update commands. Creating a company atomically creates its first plant; new company and plant contexts grant the creating administrator effective `ERP_ADMIN` authority.
- `ADM-LOC` provides a filterable location tree for the active plant with create, edit, parent selection, location type, description, and active/inactive lifecycle controls. The backend rejects cycles, self-parenting, invalid cross-scope parents, unsafe type changes, and deactivation while active children or stock remain.
- `ADM-USER` provides filterable user detail, invitation-first provisioning with resend/revoke controls, controlled direct local provisioning with a write-only hashed temporary password, email/MFA/session state, verification resend, scoped device revocation, user lifecycle updates, and effective-dated role assignment create/update/deactivation for the active company and plant. Duplicate assignments and self-deactivation of the current assignment are rejected.
- `ADM-ROLE` separates immutable system authority from company-owned custom roles and permissions, supports custom role/permission lifecycle management, and provides a versioned permission matrix.
- Existing-record mutations require `If-Match`; every administration mutation requires an idempotency key and transactionally records audit and outbox evidence. Read and write scope is enforced on the server in addition to screen/action permission middleware.
- All four pages have live loading, empty, filtering, validation, success, failure, and conflict behavior with no demo rows or prototype actions.
- Five component tests cover the administration pages, seven backend administration feature tests cover scope, authority, lifecycle, idempotency, version conflicts, and protected records, and a PostgreSQL-backed Chromium journey accepts a real invitation before proving the newly provisioned authority at the next login.

### Party master data

- `MD-PARTY` exposes paginated company-scoped search by identity/contact/tax value plus status, kind, role, country, and ordering filters; detail returns the complete aggregate and server-authorised actions/transitions.
- Create/update atomically maintain immutable party code, legal/display identity, organisation/individual kind, one or more customer/supplier/carrier/service roles, up to 20 addresses, contacts, and tax registrations, and one commercial-terms record. Submitted child IDs are ownership-checked and preserved across replacement.
- Database constraints enforce company-scoped party and tax uniqueness, valid enums/dates/currency/credit, foreign keys, and at most one primary contact or primary address/tax record per type. Active parties require an address and reachable contact; downstream Unsold Return lookup and validation require an active `CUSTOMER` role.
- Lifecycle commands enforce explicit transitions and reasons. Deactivation is refused while any open Unsold Return, positive party-owned stock, or active party portal assignment exists; all existing-record commands use `If-Match`, and all mutations use idempotency plus transactional audit/outbox records tied to the active plant.
- The live nested editor has real counters, loading/empty/filter/pagination/detail/create/update/lifecycle, validation/conflict/error/success behavior, responsive styling, and loading-safe forms. Five party API feature tests, the downstream role-filter test, three component tests, and a PostgreSQL-backed Operations Manager Chromium journey cover the slice.

### Product, manufacturing, and quality master data

- `MD-BRAND`, `MD-ITEM`, `MD-SKU`, `MD-REC`, `MD-ROUTE`, and `MD-SPEC` expose paginated company-scoped lists, aggregate detail, resource filters and lookups, create/update commands, lifecycle transitions, summary counters, and server-authorised actions.
- The relational model separates catalog item families from the existing stock-bearing SKU identity used by inventory and Unsold Return. It adds brand agreements, item UOM conversions, SKU packs/default packs, recipe components, ordered route operations, and typed quality-specification parameters without breaking downstream stock references.
- Database foreign keys, compound scope keys, checks, partial/default-pack indexes, date and value rules, immutable business codes, child-ID ownership, company-unique agreement/barcode/pack values, active-parent completeness, and safe structural updates are enforced. Lifecycle commands block retirement while active dependants or positive SKU stock remain.
- Existing-record commands require `If-Match`; every mutation requires an idempotency key and atomically writes audit/outbox evidence in the active plant. Operations Manager and ERP Administrator receive explicit create, update, and lifecycle permissions for each screen.
- One responsive shared workspace supplies real loading, empty, search/filter/order/pagination, detail/new, nested add/remove/edit, validation, conflict, failure, success, and lifecycle behavior tailored to all six aggregate types. Seven backend feature tests, thirteen component tests, and a live Operations Manager Chromium journey cover the complete brand-to-quality-specification chain.

### Inventory foundation and operations

- `INV-STK` exposes separate paginated stock-position, owner, lot, and movement registers with scoped search, filters, ordering, detail, counters, and reference lookups. Stock detail includes its complete reservation history; owner and lot detail include active-plant quality totals; movement detail links the source operation, coordinates, quantities, actor, audit event, and posting time.
- Inventory owners distinguish mandatory company ownership from active party ownership. Lots retain immutable internal identity plus SKU, supplier, origin, manufacture/expiry dates, lifecycle evidence, and dependency-safe status transitions.
- Quality statuses are a governed catalog. Available and blocked stock are derived from physical quantity, active reservations, quality reservability, lot status, and expiry; reserved quantity is a locked projection that must reconcile to active reservation rows.
- Reservation/release commands lock the position and reservation, prevent blocked/expired/inactive-owner stock and overcommitment, require `If-Match` and idempotency keys, increment the affected versions, and atomically write audit/outbox evidence. Downstream stock posting refuses to consume reserved quantity or transfer between different owners.
- `INV-ISS` covers available-stock issue and controlled return into `RETURN_QUARANTINE`; `INV-TRF` preserves SKU, lot, owner, UOM, and quality across plant positions; `INV-COUNT` snapshots quantity/version and posts variance or an explicitly directed adjustment; `INV-EXP` moves a complete expired position to `EXPIRED` or disposes only blocked, expired, or inactive-lot stock.
- Inventory operations persist a versioned header and ordered lines through `DRAFT`, `POSTED`, or `CANCELLED`. Create/update/post/cancel commands enforce screen and action permission, active company/plant scope, idempotency, optimistic versions, deterministic row locking, one-use position coordinates, and transactional links to immutable movements, audit events, and outbox messages.
- Responsive stock and operation workspaces supply real loading, empty, filtering, pagination, detail, draft editing, post/cancel, history, validation, conflict, failure, and success states without demo rows. The foundation remains covered by six backend tests / 93 assertions, four component tests, and its browser journey; the transaction slice adds six backend tests / 94 assertions, six component tests, and a PostgreSQL-backed Operations Manager journey that posts all seven operation types.

### Manufacturing planning

- `PLAN-DEM` provides a plant-scoped, paginated demand-plan register, summary counters, manufactured-SKU lookups, complete versioned header/line detail, and create/update/release/reasoned-cancel commands. Lines time-phase forecast, firm, or safety-stock demand inside the plan horizon, and release requires each selected output SKU to have an effective active recipe and active production route.
- `PLAN-MRP` converts one released demand plan into immutable planned-order and material-requirement snapshots. It explodes the effective recipe using output quantity, yield, component waste, and governed UOM conversion; nets each requirement chronologically against only active company-owned, reservable, non-expired stock; allocates the snapshot in FEFO order without double-counting stock across demands; and reports shortages explicitly.
- `PLAN-SCH` turns selected MRP planned orders into a versioned finite-capacity schedule. Route operations are expanded with setup/run-time snapshots, work-centre loads are aggregated for the horizon, and release is rejected when supplied capacity is missing or overloaded or when any active material requirement remains short.
- Schedule release locks eligible stock positions in deterministic FEFO order, creates linked planning and stock reservations, and updates the stock reserved projection atomically. Cancelling a released schedule locks and releases those links exactly once, restores the projection, and leaves auditable reservation history; cancelling MRP or demand is blocked while an active downstream record exists.
- All three workspaces implement live loading, empty, filter/order/pagination, detail/new/edit, validation, conflict, failure, success, allowed-action, capacity, material, and reservation-history states without demo records. Dedicated action permissions, selected company/plant scope, optimistic `If-Match`, idempotency keys, and transactional audit/outbox writes protect every command. Four backend tests / 109 assertions pass on SQLite and PostgreSQL, three component tests cover each workspace, and a live Operations Manager Chromium journey verifies demand release through MRP, capacity scheduling, FEFO reservation, and cancellation rollback.

### Manufacturing execution, quality, packing, traceability, and costing

- `PRO-ORDER` converts each released schedule line at most once into a versioned production order with immutable recipe, route, material, and ordered-stage snapshots. Release validates the active source chain; material issue locks the reserved FEFO positions, consumes only the linked quantities, records immutable issue and stock-movement evidence, and advances the batch into process.
- `PRO-STAGE` enforces route order and records separate immutable start/completion events, actual minutes, operators, notes, and optimistic stage versions. `PRO-LOSS` records positive good, loss, and rework events with reason controls; open rework must be resolved as recovered or scrapped, and order completion requires all stages complete, issued materials, output reconciliation, and no open rework.
- `QC-LAB` snapshots the effective specification and its parameters onto a production-batch sample, evaluates typed results on completion, and automatically raises a deviation plus a quality hold on failure. `QC-SAFE` manages reasoned deviation dispositions and typed food-safety holds; batch release requires a passed latest sample, no open deviation, and no active hold.
- `PACK-ART` versions SKU-specific artwork/coding templates through draft, approval, and reasoned retirement, while enforcing one approved revision per SKU. `PACK-RUN` accepts only a completed, quality-released batch and matching approved artwork, renders controlled lot coding, then atomically creates the finished lot, released stock position/movement, and material-to-finished-lot genealogy.
- `FG-LOT` exposes the finished-lot, stock, packing, production, input-lot, and recall context. `TRACE-CASE` traverses lot genealogy in both directions, opens a classified recall over the connected lot set, blocks affected on-hand stock and marks finished lots/batches recalled, and retains closure evidence without silently releasing containment.
- `COST-BATCH` finalizes an immutable INR snapshot from actual material issues and stage minutes, with planned/actual material and conversion costs, yield, cost per good unit, material-usage variance, stage-time variance, and total variance. Duplicate batch snapshots increment a separate snapshot version instead of rewriting prior evidence.
- All ten workspaces use live scoped registers/details/lookups and server-returned allowed actions, with loading, empty, filter, validation, conflict, failure, and success states. Twenty-five dedicated action permissions, `If-Match` on existing-record mutations, idempotency keys on every command, database workflow/shape constraints, row locking, and transactional stock/audit/outbox writes protect the chain. Two backend tests / 153 assertions pass on both SQLite and PostgreSQL; ten component tests and one complete PostgreSQL/Redis/MinIO/Chromium journey cover all ten screens.

### Purchase requisitions

- `PUR-REQ` exposes a plant-scoped, paginated register with search, status, requester, required-date, and ordering filters; counters; active item/UOM lookups; complete header/line detail; current approval and decision evidence; and server-authorised actions.
- A requisition is a versioned aggregate of an immutable business number plus purpose, requester, required date, notes, and ordered item/UOM/quantity/unit-cost lines. The server validates active scoped references and compatible item UOMs, calculates each line amount and the INR estimated total, and prevents direct total drift with database guards. This slice is deliberately INR-only so a value cannot be compared with an INR authority threshold before an explicit FX policy exists.
- Lifecycle is enforced as `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`, or `CANCELLED`. Draft/rejected records can be edited and submitted; draft/rejected/approved records can be reason-cancelled; submitted records are locked pending a reviewer decision. Every existing-record command requires `If-Match`, every mutation requires an idempotency key, and audit/outbox evidence is written in the same transaction.
- Submission resolves the selected plant's `PURCHASE_REQUISITION_APPROVAL` rule by `ESTIMATED_TOTAL`: values below INR 100,000 require standard authority and higher values require high-value authority. Rule/version, band, metric, permissions, deadlines, and submission lineage are snapshotted immutably.
- Approval and reasoned rejection enforce exact direct/delegated authority, active company/plant scope, source and approval versions, and maker-checker separation. They close the linked `WRK-HOME` item atomically; rejected requisitions remain correctable and a new submission points back to the rejected approval request.
- Three PostgreSQL consistency triggers protect line/header scope, item/UOM identity, totals, and approval linkage from invalid direct writes. The rollback removes requisition approval/work evidence safely before dropping the slice, legacy headers are deterministically backfilled, and repeated seeding preserves live/versioned policies and pending approvals rather than overwriting them.
- The responsive workspace provides real loading, empty, filter, pagination, detail/new, line add/remove/edit, calculated totals, version conflict, validation, create/update/submit/cancel, reviewer inbox, approval/rejection and decision evidence, corrected-payload idempotency-key rotation, error, and success behavior. Seven backend tests / 113 assertions pass on both SQLite and PostgreSQL; five component tests and a live Operations-to-Finance PostgreSQL/Redis/MinIO/Chromium journey cover the end-to-end slice.

### RFQ, supplier comparison, and purchase orders

- `PUR-RFQ` exposes a plant-scoped register and complete sourcing detail with approved-unsourced-requisition and active-supplier lookups, status/search/date/order filters, source lines, invited-supplier state, complete quote payloads, and a server-ranked commercial comparison.
- Draft creation copies every approved requisition line, quantity, item/UOM identity, required date, currency, and approval ceiling. At least two active company suppliers are required; a non-cancelled sourcing event locks upstream requisition cancellation and prevents a second active RFQ for the same requirement.
- Issuance freezes the invited supplier set. Quote capture requires every RFQ line exactly once and calculates subtotal, freight, other charges, discount, and landed total on the server. Quotes can be corrected while the event remains issued. Awarding validates invitation and quote identity, validity, the approved ceiling, and requires explicit evidence when the selected quote is not lowest or misses the required date.
- `PUR-PO` converts only the awarded supplier quote, copying its source identities, line quantities/prices, commercial values, and delivery commitment into an initial immutable revision. One active order is allowed per awarded RFQ; cancelling it makes the award eligible for a replacement PO without rewriting its sourcing evidence.
- Draft and issued POs can be amended through a full replacement payload. Each line remains linked through quote, RFQ, requisition, item, and UOM; quantity cannot exceed the sourced amount; calculated order total cannot exceed the immutable approved requisition ceiling; every accepted amendment appends a complete immutable revision snapshot.
- RFQ and PO commands enforce company/plant scope, dedicated action permissions, lifecycle state, optimistic `If-Match`, idempotency, and transactional audit/outbox evidence. Deferred PostgreSQL triggers revalidate exact source snapshots, line/header totals, quote/award identity, approved ceilings, and PO lineage even for direct database writes.
- Both responsive workspaces provide live loading, empty, filtering, pagination, detail/new/edit, quote entry, ranked selection, award/reason, PO creation, amendment history, issue/cancel, validation/conflict/failure/success behavior, and no demo rows. Seven backend tests / 169 assertions pass on SQLite and PostgreSQL, six component tests cover the command payloads and version progression, and the live Chromium journey continues the approved requisition through two quotes, award, PO revision, issue, and cancellation.

### Inbound receiving and incoming quality

- `INB-GATE` records an issued-PO vehicle arrival with immutable company, plant, supplier, and purchase-order identity; supports scoped search/detail, create/update, and reasoned cancellation; and exposes only state- and permission-valid actions.
- `INB-GRN` supports partial receipts against the remaining ordered quantity. Draft lines select an open PO line, active Quality Hold and released locations, internal/supplier lot identities, manufacture/expiry dates, and received quantity. Posting atomically creates or reuses the compatible lot and stock coordinates, moves material into Quality Hold, clears the gate, advances PO receipt status, and creates one incoming-quality task.
- `QC-IN` requires accepted plus rejected quantity to equal every inspected receipt line. Completion locks the source positions, transfers accepted stock to the selected released location and rejected stock to governed `REJECTED` positions, stores line-level outcome/reason evidence, completes the GRN, and updates PO receipt progress.
- `INB-RETURN` permits only rejected, on-hand stock from completed incoming QC. Draft create/update, post, and reasoned cancel commands preserve one supplier per return, reject duplicate or over-returned quality lines, and post deterministic outbound supplier-return movements.
- All commands enforce selected company/plant scope, dedicated screen/action permissions, active source references, lifecycle transitions, optimistic versions, idempotency, deterministic locks, and transactional stock, audit, and outbox evidence. The four responsive workspaces include real registers, counters, lookups, filters, detail, forms, validation/conflict/error/success states, and history with no demo data.
- Three procure-to-pay backend tests / 161 assertions cover partial receipt, QC split, supplier return, over-receipt/scope/permission controls, and the downstream finance chain on SQLite and PostgreSQL. Four inbound component tests and the live multi-role Chromium journey cover the operator path.

### Accounts payable

- `FIN-AP` provides separate payable-invoice, payment-proposal, and supplier-payment registers with scoped search/status filters, counters, complete detail, allocations, reconciliation evidence, eligible issued-PO lookups, and server-authorised actions.
- Draft payable invoices copy their supplier and PO identity from the selected order. The server calculates line net/tax/gross values and header totals in INR; exact three-way matching compares invoice quantity with accepted, uninvoiced GRN quantity and invoice unit price with the PO price, returning correctable line-level exceptions when either differs.
- Only matched invoices can be maker-checker approved. Draft payment proposals reserve uncommitted approved balances, can combine multiple invoices only for one supplier, and require a different approver. Execution revalidates every balance under lock, records one governed bank/UPI/cheque payment and immutable allocations, and advances invoices to partially or fully paid without overpayment.
- Reconciliation accepts a company-unique statement reference, links immutable reconciliation evidence, and version-transitions the payment from `POSTED` to `RECONCILED`. Invoice/proposal cancellation is state-safe and refuses to bypass an active payment chain.
- Every mutation is scoped, permissioned, optimistic where record-specific, idempotent, audited, and outbox-backed. Three AP component tests cover invoice match/approval and proposal/payment interactions; the live Chromium flow proves Finance maker failures, ERP Administrator approval, execution, invoice settlement, and bank reconciliation against the real stack.

### Approval governance

- `ADM-RULE` exposes the protected global fallback plus company and selected-plant policies in deterministic resolution order; system policy is readable but immutable, while local definitions use optimistic versions and idempotent commands. The register and new-policy editor support both governed Purchase Requisition and Unsold Return rule types, including a missing policy on a newly created plant.
- Authority bands start at zero, use contiguous `[minimum, maximum)` ranges, and end in one unbounded band. Every band selects its initial approval permission, escalation permission, work priority, due SLA, and escalation SLA.
- Unsold Return uses total destroyed base quantity as its authority metric; Purchase Requisition uses the server-calculated INR estimated total. Submission snapshots the resolved rule/version, band, value/UOM, initial/escalation permissions, and deadlines so later policy edits never rewrite pending control evidence.
- Effective-dated plant delegations require the delegator to hold the authority directly, reject self/overlapping delegation, never traverse a delegation chain, and stop immediately on revocation, expiry, user deactivation, permission deactivation, or loss of the delegator's direct authority.
- Due pending approvals escalate once to the snapshotted permission, become urgent and unassigned in `WRK-HOME`, increment their approval version, and emit audit and outbox evidence.
- Decisions persist whether authority was direct or delegated and the delegation identifier when applicable. Rejected Unsold Return cases return to Quality quarantine; rejected purchase requisitions return to an editable state. Corrected approval requests retain both submission number and rejected-request lineage.
- Four component tests cover the live rule/delegation/escalation workspace and creation of a missing requisition policy; seven backend feature tests / 83 assertions pass on SQLite and PostgreSQL and cover scope, supported rule types, versioning, idempotency, authority bands, delegation/revocation/no-chain behavior, escalation, and resubmission; a PostgreSQL-backed Chromium journey proves policy versioning and delegated session authority.

### Audit and integration operations

- `ADM-AUD` provides paginated, company/plant-scoped search across command, entity, actor, outcome, request/correlation identifiers, free text, date range, and event order, with live aggregate counters and lookup filters.
- Audit detail resolves actor and scope metadata, renders only the persisted safe diff, links qualifying Unsold Return evidence, and never returns object-storage disks or paths.
- Evidence access requires a dedicated action permission, revalidates audit/evidence/company/plant linkage and object existence, supports protected inline viewing or download with no-store/nosniff/CSP headers, and records each successful view as a new audit event.
- `ADM-INT` exposes scoped delivery counters, due age, queue/transport/evidence runtime configuration, searchable outbox records, full event payload, safe transport response metadata, current lock state, receiver acknowledgement, and immutable attempt history.
- Operators with distinct action permissions can synchronously process a bounded scoped batch, retry a failed/quarantined event, or quarantine a pending/retrying event with a reason. Commands are idempotent, version checked where record-specific, audited, and outbox backed.
- The scheduled global processor claims due events safely across concurrent PostgreSQL workers, recovers stale claims, persists successful acknowledgements, backs failures off exponentially, and automatically quarantines events after the configured maximum attempts.
- Docker Compose provisions PostgreSQL, Redis, a private MinIO bucket, migration service, API, Redis queue worker, and scheduler with health/dependency ordering. The scheduler enqueues outbox delivery every minute; a synchronous Artisan command remains available for recovery or diagnostics.
- Five backend feature tests cover audit scope/evidence security, action authority, delivery/acknowledgement, retry/quarantine policy, optimistic/idempotent operator commands, and scoped processing. Three component tests cover the two workspaces, and the live browser journey verifies an audited administration command through delivery acknowledgement and attempt history.

### Identity lifecycle

- Invitation creation atomically creates an `INVITED` user and initial plant assignment. Acceptance chooses the first password, verifies the address, activates the user, and consumes the link; resend rotates the token and revoke disables the pending account.
- Invitation, reset, and verification bearer values contain 256 bits of randomness and are persisted only as SHA-256 hashes with explicit expiry, use, and revocation timestamps.
- Password-reset and verification-request responses do not reveal whether an eligible account exists. Successful password reset verifies control of the mailbox and revokes every recorded device session.
- TOTP uses a standard `otpauth://` enrolment URI, an encrypted 160-bit secret, a short setup/challenge lifetime, bounded attempts, and eight high-entropy recovery codes retained only as keyed hashes and consumed once.
- Logical device records capture the user, IP, user agent, last-seen/expiry state, and revocation evidence without retaining the Laravel session identifier or cookie. Users manage their own devices and authorised ERP administrators can review/revoke devices only for users in the selected plant.
- Email changes clear verification and revoke active devices; account deactivation also revokes outstanding identity links and sessions. Directly provisioned local accounts are administrator-verified for the current local workflow.
- Separate rate-limit buckets key login by normalised email, MFA by challenge, link consumption by token, recovery email by address/operation, and authenticated security changes by user/operation; this avoids cross-user lockout behind a shared IP.
- Eight backend identity feature tests, six focused frontend identity/security tests, and two identity-aware browser journeys cover invitation rotation/acceptance, reset, verification, password change, TOTP, one-use recovery, permission checks, and self/admin device revocation.

### Work queue operational slice

- Persisted `APPROVAL`, `TASK`, and `EXCEPTION` work items with priority, assignee, permission, source/target, deadline, completion, and optimistic-version fields.
- Company/plant scope, required permission, and ownership are applied before queue rows or counters are returned; managers can see and reassign all visible scoped work.
- Pending Unsold Return and Purchase Requisition approvals create a queue projection in the same transaction, and approval/rejection closes it in the decision transaction.
- Live open, assigned-to-me, approval, exception, unassigned, high-priority, and overdue counters plus type, ownership, overdue, text, and ordering filters.
- Claim, manager assignment/unassignment, and task/exception completion commands require `If-Match` and `Idempotency-Key` and transactionally emit audit and outbox records.
- Approval work cannot be manually completed; the underlying maker-checker decision remains authoritative.
- The frontend provides live loading, empty, failure, filtering, ageing, deadline, owner, claim, completion, and record-level drill-through behavior.
- Three component tests cover counters/drill-through, claiming, and completion; live multi-role Chromium journeys prove exact drill-through/closure for Unsold Return and Finance queue visibility/closure for Purchase Requisition.

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
- Evidence files use a dedicated permission and a private MinIO/S3 disk, strict MIME and 10 MiB limits, server-derived paths, SHA-256 integrity metadata, and seven-year server-controlled retention.
- Uploads are scoped, case-versioned, idempotent, and transactionally linked to audit/outbox records; case detail omits storage paths and exposes the uploader, retention, integrity, and upload-audit metadata.
- Downloads re-check company/plant/case/evidence scope, force attachment delivery with no-store/nosniff headers, and create a successful-access audit event.
- Component tests exercise retained-evidence metadata/upload permissions and approval decision/maker-checker behavior with mocked API boundaries.
- The Playwright workflow uses a disposable Docker project and real PostgreSQL/Redis/MinIO runtime to verify the complete Sales-to-Operations-to-Finance browser hand-off, including the downloaded object bytes; test teardown removes all isolated data volumes.
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

### External partner portal

- `PORTAL-EXT` resolves internal administrators separately from external identities. An external session requires an active party-bound `PARTNER_PORTAL` role assignment and an effective access grant for the exact selected company and plant.
- Internal administrators can create, update, and reason-revoke grants. The service rejects internal ERP identities, duplicate active user/party/context grants, invalid effective periods, and incomplete entitlement combinations; revocation deactivates the linked role assignment atomically.
- External orders, shipments, invoices, claims, claimable shipment lines, and documents are always filtered to the grant's exact customer party. A missing record entitlement is deliberately indistinguishable from an absent or cross-tenant record.
- Nine explicit entitlements independently govern record visibility, claim creation, private document upload/download, and acknowledgement. Server action permissions remain a second mandatory authority layer.
- Outbound internal publication and inbound partner upload accept only PDF, PNG, JPEG, CSV, or text files up to 20 MiB on the private object disk. The database retains direction, type, size, MIME, SHA-256, optional exact-tenant business link, creator, lifecycle, and immutable event metadata without exposing storage paths.
- Only an available outbound document can be acknowledged by its tenant. Acknowledgement records a versioned receipt reference and event; it never changes or approves an order, invoice, claim, or other internal workflow. Internal users may withdraw only unacknowledged outbound documents.
- Partner claim submission revalidates the exact tenant shipment and line before entering the existing controlled claim workflow.
- Migration 030, the live internal/external workspace, 4 backend tests / 73 assertions on SQLite and PostgreSQL, 2 component tests, and a PostgreSQL/Redis/MinIO/Chromium internal-to-partner hand-off cover grant isolation, entitlement denial, cross-tenant denial, private bytes, checksums, uploads, downloads, claims, revocation, and receipt-only acknowledgement.

### Optimisation planning

- `OPT-PLAN` captures each scenario as an immutable, checksummed input version tied to an exact released demand-plan version. The snapshot records eligible and excluded stock, the latest matching MRP material shortages, and the latest finalized unit cost available for each demand line; revising inputs creates a new version without rewriting prior recommendations or reviews.
- A deterministic, identified net-requirements heuristic allocates eligible stock before recommending residual production, with safety target, due/start dates, priority, estimated proxy cost, and plain-language rationale. First-class limitations disclose heuristic scope, service assumptions, cost gaps, capacity non-reservation, material shortages, excluded stock, and stale sources rather than presenting the result as an unconstrained optimum.
- Submission revalidates the exact released source and is blocked when it changed. Independent Finance approval or rejection is immutable and maker-checker protected; Operations records versioned recommendation outcomes and can complete a plan only after every recommendation has an outcome.
- Recommendations are decision support only: generation, approval, and completion do not create stock movements, production orders, purchase requisitions, schedules, journals, or other execution transactions.
- Migration 031, ten scoped API routes, the live permission-aware workspace, 4 backend tests / 139 assertions on SQLite and PostgreSQL, 3 component tests, and a live PostgreSQL/Redis/MinIO/Chromium Operations-to-Finance-to-Operations journey cover input history, deterministic recommendations, limitation visibility, stale-source rejection, independent review, versioned outcomes, and controlled completion.

## Why two screens still say Prototype

Two page files remain wrappers around `FrontEnd/src/components/ModulePage.tsx`. That shared component deliberately uses:

- `FrontEnd/src/data/demoRows.ts` instead of an API;
- generated KPI values;
- a `Prototype action only` alert for New;
- filter and Open buttons without business behavior;
- no create/edit/detail forms or persistence.

Every P0, P1, P2, and delivered P3 page is now custom implemented and has no prototype banner. Only `ADM-HELP` and `BI-REP` retain static prototype behavior.

## Screen/API inventory

### Implemented and partial screens

| Screen | Status | What works | What remains |
| --- | --- | --- | --- |
| `ADM-ORG` | Implemented administration slice | Scoped company/plant overview and detail; create, edit, and lifecycle controls; initial-plant creation; automatic creator authority; versioned/idempotent/audited commands; component/backend/browser coverage | External legal-entity onboarding and statutory configuration remain deployment/finance extensions |
| `ADM-LOC` | Implemented administration slice | Scoped hierarchical list and detail; filters; create/edit/deactivate; parent/type validation; cycle, child, and stock safeguards; versioned/idempotent/audited commands; component/backend/browser coverage | Cross-plant orchestration is live in `SCALE-PLANT`; scanner-directed warehouse tasks remain an integration extension |
| `ADM-USER` | Implemented administration and identity slice | Invitation/direct provisioning; acceptance/resend/revoke; verified-email and MFA state; self/admin device inventory and revocation; password reset/change; TOTP and recovery codes; active/inactive lifecycle; effective-dated assignments; scoped permissions; audit/outbox, component/backend/browser coverage | External enterprise IdP/SSO and bulk identity federation |
| `ADM-ROLE` | Implemented administration slice | Custom role and permission list/detail/create/update/lifecycle; permission matrix sync; immutable system records; scope, version, idempotency, audit, and outbox controls; component/backend/browser coverage | Additional module-specific action permissions are added as their workflows are delivered |
| `ADM-RULE` | Implemented control slice | Protected fallback and editable plant policies; Unsold Return and Purchase Requisition policy creation; versioned contiguous authority bands; SLA/deadline routing; temporary non-chainable delegation/revocation; due escalation; immutable request snapshots; direct/delegated decision evidence; backend, component, and live browser coverage | Additional rule types and authority metrics are added with their corresponding implemented workflows |
| `ADM-AUD` | Implemented control slice | Scoped immutable-event search, counters and filters; request/correlation/actor/scope detail; safe-diff rendering; linked private evidence view/download with dedicated permission and access audit; backend, component, and live browser coverage | Broader module evidence types and export/reporting are added with their corresponding workflows |
| `ADM-INT` | Implemented control slice | Scoped outbox monitoring, runtime health, payload/response/ack/attempt drill-through; bounded processing; versioned/idempotent retry and reasoned quarantine; backend, component, and live browser coverage | Additional external transports and partner-specific replay procedures are deployment/integration work |
| `MD-PARTY` | Implemented master-data slice | Company-scoped list/detail/filter/create/update/status APIs; immutable identity code; roles, addresses, contacts, tax and commercial aggregate; downstream customer credit/contracts; dependency-safe lifecycle; version/idempotency/audit/outbox controls; backend/component/live browser coverage | External party federation and bulk onboarding remain integration work; governed partner transactions are live in `PORTAL-EXT` |
| `MD-BRAND` | Implemented master-data slice | Scoped brand aggregate and agreement editor; party, date, currency, commitment, code/number uniqueness and dependency-safe lifecycle controls; version/idempotency/audit/outbox; backend/component/browser coverage | Wider commercial reporting remains future reporting work |
| `MD-ITEM` | Implemented master-data slice | Catalog item-family aggregate; brand, type, base UOM, shelf-life, lot-control and conversion management; safe structural/lifecycle rules; full API/UI/test coverage plus sales, allocation, dispatch, manufacturing, and optimisation integration | Multi-echelon and substitution planning remain future extensions |
| `MD-SKU` | Implemented master-data slice | Stock-bearing SKU and pack aggregate; item inheritance, barcode/default-pack uniqueness, positive-stock retirement guard, sales allocation, dispatch, optimisation input, and downstream identity compatibility; full API/UI/test coverage | Statistical demand sensing and multi-echelon policies remain future extensions |
| `MD-REC` | Implemented manufacturing master slice | Versioned recipe/BOM aggregate with output, yield, dates, ordered unique components, UOMs, active-reference and self-consumption rules; full API/UI/test coverage and production snapshot integration | Alternate formula/substitution policy and advanced recipe optimisation remain future work |
| `MD-ROUTE` | Implemented manufacturing master slice | Versioned production-route aggregate with item target, ordered operations, work centres, timings, instructions and active-reference rules; full API/UI/test coverage plus capacity and stage-execution integration | Alternate routing, equipment telemetry, and advanced sequencing remain future work |
| `MD-SPEC` | Implemented quality master slice | Item/SKU-targeted specification aggregate with effective dates, sampling plan and typed numeric/text/boolean parameters and ranges; full API/UI/test coverage plus immutable lab-sample evaluation | Instrument integration, statistical trend analysis, and wider inbound/field sampling remain future work |
| `INV-STK` | Implemented inventory-foundation and ledger slice | Scoped stock/owner/lot/movement registers and detail; expiry/quality-derived available, blocked, and reserved quantities; owner/lot create, edit, lifecycle; locked reserve/release projection; filterable movement evidence; version/idempotency/audit/outbox controls; backend/component/live browser coverage | Broader cross-module stock integration remains with each transaction family |
| `INV-ISS` | Implemented inventory-operation slice | Scoped issue/return list, detail, lookups, draft create/update, post/cancel; available-stock and return-quarantine rules; deterministic locks; version/idempotency/audit/outbox and movement evidence; backend/component/browser coverage; production issues share the governed stock ledger | Dispatch, maintenance, and other future-module issue sources remain to be integrated |
| `INV-TRF` | Implemented inventory-operation slice | Scoped transfer list, detail, lookups, draft create/update, post/cancel; compatible source/target identity and quality controls; deterministic locks and complete posting evidence; backend/component/browser coverage | Cross-plant route/dispatch orchestration is implemented separately in `SCALE-PLANT`; scanner/carrier integration remains external work |
| `INV-COUNT` | Implemented inventory-operation slice | Scoped count/adjustment list, detail, lookups, draft create/update, post/cancel; stale snapshot rejection, signed variance, directed gain/loss, and complete posting evidence; backend/component/browser coverage | Scheduled count programmes and approval thresholds remain future control work |
| `INV-EXP` | Implemented inventory-operation slice | Scoped expiry/disposal list, detail, lookups, draft create/update, post/cancel; expired-lot/full-position and blocked-stock safeguards; complete posting evidence; backend/component/browser coverage | Disposal approvals and financial write-off integration remain with later workflows |
| `PUR-REQ` | Implemented procurement slice | Scoped register/detail/lookups and INR costed-line aggregate; create/edit/submit/cancel; calculated estimated total; standard/high-value maker-checker approval; reasoned rejection and immutable resubmission lineage; work-queue projection/closure; version/idempotency/audit/outbox and database consistency controls; backend/component/live browser coverage | FX-normalized multi-currency policy remains future treasury work |
| `PUR-RFQ` | Implemented sourcing slice | Approved-requisition conversion; exact source-line snapshots; governed multi-supplier invitation; issue and complete quote capture; server-ranked landed-value/delivery comparison; reasoned non-lowest/late award; approval-ceiling and active-source guards; version/idempotency/audit/outbox; backend/component/live browser coverage | External supplier delivery/acknowledgement transport remains integration work |
| `PUR-PO` | Implemented sourcing slice | Awarded-quote conversion; immutable source identities and initial revision; complete quantity/price/commercial amendments before or after issue; approved-ceiling controls; issue and reasoned cancellation; revision history; version/idempotency/audit/outbox; backend/component/live browser coverage | Supplier-facing portal and automated order acknowledgements remain integration work; customer document exchange is live in `PORTAL-EXT` |
| `INB-GATE` | Implemented inbound slice | Scoped issued-PO arrival register/detail; create/update/reasoned cancel; supplier and PO source preservation; consumed-gate state; version/idempotency/audit/outbox controls; backend/component/browser coverage | Weighbridge, ASN, and external carrier integration |
| `INB-GRN` | Implemented inbound slice | Partial/open-quantity GRNs; governed lot and hold/released locations; draft edit/post/cancel; Quality Hold receipt posting; automatic QC task and PO/gate progress; backend/component/browser coverage | External barcode/scanner and ASN document ingestion |
| `QC-IN` | Implemented incoming-quality slice | Pending-task register/detail; exact inspected-quantity disposition; accepted/rejected stock split; reasoned rejection; receipt and PO progress; version/idempotency/audit/outbox controls; backend/component/browser coverage | Formal inbound sample/LIMS integration remains a future extension; current `QC-LAB` scope is production batches |
| `INB-RETURN` | Implemented supplier-return slice | Rejected-stock eligibility; one-supplier draft aggregate; quantity/duplicate guards; edit/post/reasoned cancel; deterministic outbound movement and full evidence; backend/component/browser coverage | Supplier acknowledgement and debit-note document exchange |
| `FIN-AP` | Implemented accounts-payable and integration slice | Payable invoice/tax calculation; PO/accepted-GRN/price match; maker-checker invoice/proposal approval; payment allocation and reconciliation; masked bank-account administration; deterministic SHA-256 AP-bank/GST exports; one-use selection and acknowledgement; backend/component/browser coverage | Production bank connector, institution-specific signing/file formats, and cash-position treasury integration |
| `PLAN-DEM` | Implemented manufacturing-planning slice | Scoped demand-plan register/detail/lookups; time-phased line editor; effective recipe/route validation; versioned create/update/release/cancel; idempotency/audit/outbox; backend/component/browser coverage; immutable released versions feed `OPT-PLAN` | Statistical forecast ingestion and automatic sales-order demand remain future extensions |
| `PLAN-MRP` | Implemented manufacturing-planning slice | Released-demand conversion; effective-recipe, yield/waste and UOM explosion; chronological expiry-aware FEFO stock netting; immutable planned-order/material snapshots; shortage visibility; cancel controls; downstream production-order conversion; backend/component/browser coverage | Purchase-requisition recommendations and advanced planning policies remain future work |
| `PLAN-SCH` | Implemented manufacturing-planning slice | Selected-order scheduling; route-operation and work-centre load snapshots; finite-capacity/material release guards; deterministic locked FEFO reservation and exact cancellation rollback; downstream release/execution chain; backend/component/browser coverage | `OPT-PLAN` provides governed stock/production decision support; capacity sequencing, rescheduling, and drag/drop dispatching remain future work |
| `PRO-ORDER` | Implemented production-order slice | One-order-per-schedule-line conversion; immutable recipe/route/material/stage snapshots; release, locked FEFO issue, completion/cancellation gates; stock/audit/outbox evidence; backend/component/browser coverage | Split/merge batches, subcontracting, and equipment/OEE integration |
| `PRO-STAGE` | Implemented stage-execution slice | Route-sequenced start/complete controls; actual-time/operator/note capture; immutable stage events; optimistic versions; backend/component/browser coverage | Machine/scanner telemetry, downtime capture, and electronic work instructions |
| `PRO-LOSS` | Implemented yield/loss/rework slice | Good/loss/rework event capture; reason requirements; recovered/scrapped rework resolution; reconciled yield and completion gates; backend/component/browser coverage | Configurable loss approvals and separate financial write-off posting |
| `QC-LAB` | Implemented lab-quality slice | Effective-specification snapshot; typed result entry and automatic evaluation; failed-sample deviation/hold creation; backend/component/browser coverage | Instrument/LIMS integration, signatures, certificates, and statistical trending |
| `QC-SAFE` | Implemented food-safety slice | Deviation resolution with disposition/root cause/CAPA; typed batch holds; release controls requiring passed lab, resolved deviations, and released holds; backend/component/browser coverage | Full CAPA programme, regulatory notifications, and external certification workflows |
| `PACK-ART` | Implemented artwork slice | SKU-specific versioned coding templates; create/update/approve/reasoned-retire lifecycle; one approved revision per SKU; backend/component/browser coverage | Binary artwork assets, proof rendering, external approval, and e-signatures |
| `PACK-RUN` | Implemented packing slice | Quality-released batch and approved-artwork validation; rendered coding; completion into traced finished lot, stock and genealogy; backend/component/browser coverage | Printer/scanner/line integration, serialization, and pallet/license-plate handling |
| `FG-LOT` | Implemented finished-goods slice | Finished-lot register/detail with production, packing, artwork, released stock, input genealogy, recall context, and downstream FEFO sales allocation/shipment linkage; backend/component/browser coverage | Scanner-directed warehouse tasks and pallet/license-plate handling |
| `TRACE-CASE` | Implemented trace/recall slice | Bidirectional lot traversal; classified recall creation over connected lots; on-hand blocking, recall state, affected-lot evidence, and reasoned closure; backend/component/browser coverage | Customer/distribution tracing, notification execution, recovery/disposal actions, and regulatory reporting |
| `COST-BATCH` | Implemented batch-cost slice | Immutable versioned INR snapshots; planned/actual material and conversion costs; yield and unit cost; material-usage, stage-time, and total variance; backend/component/browser coverage | Standard-cost maintenance, cost-centre pools, GL posting, and period variance settlement |
| `WRK-HOME` | Implemented operational slice | Persisted, scoped approvals/tasks/exceptions; policy-derived priority/deadline/authority; live counters and filters; ageing/deadlines; claim, manager assignment and completion controls; transactional approval projection/closure and escalation; exact drill-through; backend, component, and live browser coverage | Additional module sources, tracked under the wider control foundation |
| `RET-UNSOLD` | Implemented operational slice | Scoped list/detail/status, evidence, stock and finance histories plus lookups; relational validation; state-aware Sales/Stores/Quality/Finance forms; reviewer inbox and approve/reject/resubmit flow; idempotent and versioned commands; quarantine receipt and approved outcome movements; separate finance actions; private retained evidence lifecycle; component and live multi-role browser tests | Cross-cutting production hardening and broader ERP integration, tracked below |
| `CRM-LEAD`, `CRM-PRICE`, `CRM-ORDER`, `CON-WORK` | Implemented commercial slice | Lead qualification/conversion/closure; versioned price lists and discounts; finance-owned credit limit/hold control; customer contracts and consumption; priced orders, credit enforcement, immutable revisions, cancellation, and third-party work lifecycle | External CRM channels and e-signatures remain integration work; governed customer exchange is live in `PORTAL-EXT` |
| `DSP-PICK`, `DSP-LOAD`, `DSP-POD`, `RET-CASE` | Implemented dispatch and claims slice | Locked FEFO lot reservation, pick evidence, controlled shipment/load/dispatch, exact stock issue and receivable creation, POD outcome, shipment-line claims, returned-goods receipt, credit/replacement/reject resolution, audit/outbox evidence | Carrier/route/scanner integrations and automated customer notifications |
| `FIN-AR`, `BI-PROFIT` | Implemented receivables/reporting slice | Open/settled invoice register, ageing, customer exposure, atomic receipt allocation, immutable balance transactions, and order revenue/cost/margin read model | Bank-statement ingestion and broader configurable BI reporting |
| `FIN-EXP`, `FIN-GL`, `COST-OH`, `ASSET-REG`, `HR-PAY`, `ENG-MNT` | Implemented core-finance slice | Itemized taxed expenses with maker-checker posting; balanced journals, reversal and period close; overhead allocation; asset activation/depreciation/disposal; employee/payroll snapshots and posting; maintenance cost journals | Statutory payroll engine, fixed-asset tax books, and external maintenance/telemetry integrations |
| `FIN-SIM`, `FIN-ADJ`, `FIN-LEGACY`, `FIN-ARCH`, `FIN-OPEN`, `FIN-SUP` | Implemented finance-supplement slice | Ledger-isolated simulations; maker-checker adjustments; staged mapped legacy batches; checksum-verified private object archive; line-level opening reconciliation/posting; immutable non-mutating diagnostic snapshots and resolutions | Production retention operations, bulk import tooling, and external archival/compliance connectors |
| `SCALE-PLANT` | Implemented first P3 scale slice | Effective-dated legal-entity groups; same- and cross-company plant routes with explicit item/UOM mappings and dual-scope authority; versioned transfer create/update/submit/source approve/destination accept/dispatch/receive/cancel; separate source issue and destination receipt movements with in-transit evidence; balanced exchange-rate and elimination snapshots with independent finalization; audit/outbox, backend/component/browser coverage | Automated intercompany invoicing, statutory tax, transfer-pricing, and production FX-rate integrations remain finance/integration extensions |
| `PORTAL-EXT` | Implemented P3 partner slice | Effective external identity grants and party-bound assignments; exact company/plant/customer tenant isolation; nine explicit visibility/command entitlements; live commercial record drill-through; private inbound/outbound document upload/download with SHA-256 metadata and optional exact-tenant links; receipt-only acknowledgement and controlled withdrawal; external claim creation; version/idempotency/audit/outbox controls; backend/component/browser coverage | Enterprise customer federation/SSO, automated notifications, bulk onboarding, and external transport integrations |
| `OPT-PLAN` | Implemented P3 optimisation slice | Released-demand-bound immutable input versions and checksums; eligible/excluded stock, material-shortage and finalized-cost snapshots; deterministic stock/production recommendations with rationale and explicit limitations; stale-source submission gate; independent maker-checker review; versioned outcomes and completion evidence; no automatic execution/posting; backend/component/browser coverage | Solver-backed capacity sequencing, purchasing automation, stochastic forecasting, and automated execution remain future extensions |

### Prototype screens with protected but empty GET APIs (0)

None. `OPT-PLAN` now uses scoped list/detail and versioned command APIs instead of the former placeholder response.

### Prototype screens with no current API route (2)

| Area | Screen codes |
| --- | --- |
| Foundation/Admin (2) | `ADM-HELP`, `BI-REP` |

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
  - Verified with a dedicated permission, private MinIO bucket, MIME/size controls, SHA-256 metadata, seven-year retain-until policy, scoped and audited upload/download endpoints, case and audit-viewer UI/history, API v3.0 validation, the 154-test fast backend regression profile, and a passing frontend production build.
- [x] Add frontend component tests and a browser E2E test covering the multi-role hand-off.
  - Verified with 4 Vitest component tests for case/evidence and approval/maker-checker behavior plus 1 Playwright Chromium workflow across Sales, Operations, and Finance. The E2E stack fresh-seeds isolated PostgreSQL/Redis/MinIO storage, completes every current workflow stage, verifies retained download bytes, and deletes its volumes on teardown.

### P0 - Complete the control foundation

- [x] Replace the hard-coded work queue with database-backed approvals, assigned work, exceptions, and overdue items.
  - Verified with a constrained/indexed work-item projection, permission/ownership/scope filtering, live summary counters and ageing, versioned/idempotent/audited claim-assignment-completion commands, automatic approval closure, three component tests, five backend tests, and the live Finance browser hand-off.
- [x] Implement Organisation, Plant/Location, User, Role, Permission, and Role Assignment CRUD.
  - Verified with lifecycle-safe create/read/update/deactivation APIs, relational schema hardening, scope and action permission checks, optimistic versions, idempotent audit/outbox-backed commands, four live administration pages, four component tests, seven backend feature tests, and a PostgreSQL-backed browser journey that provisions and verifies a restricted user.
- [x] Implement invitations, password reset, email verification, session/device administration, and MFA.
  - Verified with one-time hashed/expiring token stores, anti-enumeration responses, invitation rotation and acceptance, verification-gated login, all-device reset revocation, encrypted TOTP, keyed one-use recovery codes, self/admin logical-device controls, dedicated permissions and rate limits, eight backend tests, six focused component tests, and live PostgreSQL/Redis/Chromium invitation and MFA journeys.
- [x] Implement configurable approval rules, authority limits, delegation, escalation, and rejection/resubmission.
  - Verified with protected-global/plant-override resolution, versioned contiguous authority bands, immutable request/SLA snapshots, exact direct or effective-delegated decision checks, revocation and no-chain controls, one-time urgent escalation, resubmission lineage, seven backend feature tests, three component tests, and a live delegated-authority Chromium journey.
- [x] Implement the Audit search/detail API and evidence viewer.
  - Verified with indexed scoped search, complete event/scope/actor/request/correlation detail, safe-diff-only rendering, storage-path redaction, permissioned private inline/download delivery, successful-access audit recording, five backend control-operation tests, three frontend control-operation tests, and the live administration-event browser journey.
- [x] Add an outbox worker, retry policy, acknowledgements, dead-letter/quarantine handling, and operator UI.
  - Verified with PostgreSQL `SKIP LOCKED` claims, stale-lock recovery, immutable delivery attempts, persisted receiver acknowledgements, bounded exponential retries, automatic quarantine, versioned/idempotent manual retry/quarantine, scoped batch processing, log and signed-HTTP transports, `ADM-INT`, and backend/component/browser coverage.
- [x] Add queue-worker and scheduler services to Docker/deployment configuration.
  - Verified with long-running Redis worker and Laravel scheduler Compose services, explicit health/dependency ordering, the per-minute non-overlapping delivery job, a synchronous recovery command, both normal/E2E Compose validation, service-health inspection, and schedule/command smoke tests.
- [x] Migrate the live private evidence disk from its persistent local Docker volume to MinIO/object storage.
  - Verified with the Flysystem S3 adapter, private MinIO bucket provisioning, API-transparent live disk configuration, a read-only legacy-volume copier that checks every manifest SHA-256 and fails startup on missing/corrupt objects, and retained-byte retrieval in the real E2E stack.

### P1 - Master data and inventory

- [x] Parties, addresses, contacts, tax details, commercial terms, and status lifecycle.
  - Verified with relational aggregate tables and PostgreSQL constraints/indexes; company-scoped filter/detail/create/update/lifecycle APIs; child ownership, active-data, tax uniqueness, downstream customer-role and safe-deactivation rules; explicit action permissions; optimistic/idempotent/audit/outbox controls; a live responsive editor; five focused party feature tests, one downstream role test, three component tests, and the Operations Manager browser journey.
- [x] Brands, agreements, items, SKUs, packs, UOM conversions, recipes, routes, and specifications.
  - Verified with eleven relational aggregate/child tables plus the stock-bearing SKU extension, PostgreSQL constraints/indexes and rollback-safe legacy backfill; six scoped list/detail/create/update/lifecycle API families; immutable codes, child ownership, unique agreements/barcodes/packs, active-reference completeness, positive-stock and dependency safeguards; explicit action permissions; optimistic/idempotent/audit/outbox controls; six live responsive workspaces; seven backend tests / 125 assertions, thirteen component tests, and the Operations Manager brand-to-specification Chromium journey.
- [x] Location hierarchy with scoped parents, type/lifecycle rules, cycle prevention, and stock/active-child deactivation safeguards.
- [x] Inventory owners, lots, expiry, quality status, and blocked/available/reserved stock.
  - Verified with relational owner, lot, quality-status, position, and reservation constraints/backfills; three scoped registers and detail APIs; server-derived availability; locked, versioned, idempotent reserve/release projections; lifecycle/dependency controls; explicit action permissions; audit/outbox evidence; four component tests; six backend tests / 93 assertions; PostgreSQL rollback/reapply/repeated-seed reconciliation; and the Operations Manager Chromium journey.
- [x] Stock enquiry read model with owner, lot, location, quality, expiry, quantity, and reservation-history drill-through.
- [x] Movement history, issue/return, transfer, count, adjustment, expiry, and disposal workflows.
  - Verified with relational versioned operation headers/lines; scoped list/detail/lookups and draft create/update/post/cancel APIs for four screens; deterministic row locks; reservation, owner, lot, quality, expiry, coordinate, count-snapshot, and quantity safeguards; immutable movement/audit/outbox linkage; six backend tests / 94 assertions; six component tests; and a live PostgreSQL/Chromium journey posting all seven operation types and drilling into their ledger evidence.
- [x] Database foreign keys, check constraints, and uniqueness rules for all current master and transaction relationships.
  - Verified by rollback-safe migrations 020-031. Implemented company, plant, party, catalog/SKU/UOM, owner/lot/position, approval, procure-to-pay, manufacturing, shipment/order/claim/receivable, ledger/expense/overhead/asset/payroll/maintenance, finance-import/archive/opening/support, consolidation group/route/transfer/run, partner grant/entitlement/document/event, optimisation plan/input/recommendation/review/outcome, work, audit, and outbox chains use scoped/composite foreign keys plus lifecycle, enum, quantity, amount, balance, source-snapshot, workflow-shape, uniqueness, partial-index, and consistency-trigger controls. Four PostgreSQL-only tests / 15 assertions audit every relational identifier against the explicit polymorphic/transport allowlist and representative invalid writes. Fresh migration/seeding through 031, the 154-test / 2,409-assertion backend regression, 92 component tests, production build, and all 17 browser workflows pass.
- [x] Expose the existing stock posting service through permissioned commands after scope validation.
  - Verified with explicit `CREATE`, `UPDATE`, `POST`, and `CANCEL` permissions for `INV-ISS`, `INV-TRF`, `INV-COUNT`, and `INV-EXP`; active-context and resource-boundary enforcement; optimistic and idempotent commands; and locked issue, receive, move, count-variance, adjustment, expiry, and disposal posting paths.

### P1 - Procure-to-pay

- [x] Purchase requisition, value-band approval, reasoned rejection/resubmission, and controlled draft/rejected/approved requisition cancellation.
  - Verified with a relational header/line aggregate and three PostgreSQL guards; scoped list/detail/lookups; calculated INR totals and rejection of unnormalized foreign currency; draft/edit/submit/cancel commands; standard/high-value immutable approval snapshots; maker-checker direct/delegated approve/reject decisions; work-item projection/closure; version/idempotency/audit/outbox controls; rollback and reseed preservation; seven backend tests / 113 assertions on SQLite and PostgreSQL; five component tests; and a live Operations-to-Finance browser journey.
- [x] RFQ, supplier comparison, PO, amendments, and PO cancellation.
  - Verified with seven relational sourcing tables/expansions, composite source identities, approval-ceiling and active-source guards, scoped register/detail/create/update/issue/quote/award/cancel/amend APIs, two live workspaces, explicit action permissions, optimistic/idempotent/audit/outbox controls, immutable PO revision snapshots, seven backend tests / 169 assertions on SQLite and PostgreSQL, six component tests, API v3.0 documentation, and the live requisition-to-cancelled-PO Chromium chain.
- [x] Gate entry, GRN, partial receipts, incoming QC, rejection, supplier return, and stock posting.
  - Verified with gate, receipt-line, incoming-quality-line, supplier-return header/line tables plus lot/position/PO/receipt/QC expansions; scoped registers/details/lookups and create/update/post/complete/cancel commands; open-order quantity, lot/location, inspected-total, rejected-stock and one-supplier controls; deterministic row locking and stock movements; version/idempotency/audit/outbox evidence; four component tests; the focused backend suite; and the live issued-PO-to-return Chromium flow.
- [x] Three-way match, payable invoice, taxes, payment proposal, payment, and reconciliation.
  - Verified with payable lines, proposal/line, payment/allocation and reconciliation tables; server-calculated INR net/tax/gross totals; exact accepted-GRN quantity and PO-price matching; correctable exceptions; maker-checker invoice and proposal approvals; single-supplier, multi-invoice balance reservation; overpayment and duplicate-bank-reference safeguards; full/partial settlement and immutable reconciliation; three component tests; API v3.0; 3 backend tests / 161 assertions on SQLite and PostgreSQL; and the live Finance-to-Administrator-to-Finance browser chain.

### P1 - Manufacturing and quality

- [x] Demand plan, MRP, capacity schedule, and material reservation.
  - Verified with ten relational planning tables plus a scoped stock-reservation identity; plant-scoped list/detail/lookups and lifecycle APIs for `PLAN-DEM`, `PLAN-MRP`, and `PLAN-SCH`; effective recipe/route and UOM validation; yield/waste explosion; chronological, expiry-aware FEFO inventory netting; immutable order/material/operation/capacity snapshots; finite-capacity and shortage release guards; deterministic stock locks; atomic planning/stock reservation linkage and exact cancellation rollback; explicit action permissions, optimistic versions, idempotency, audit, and outbox controls; three live responsive workspaces; an API v3.0 contract and endpoint map; 4 backend tests / 109 assertions on SQLite and PostgreSQL; 3 component tests; and the live Operations Manager Chromium journey.
- [x] Production order release, material issue, stage execution, yield/loss/rework, and completion.
  - Verified with schedule-line conversion into immutable recipe/route/material/stage snapshots; versioned release/cancel/complete commands; deterministic FEFO consumption of the exact planning reservations; immutable stock/material/stage/output evidence; ordered stage gates; good/loss/rework accounting and recovery/scrap resolution; database workflow constraints; live `PRO-ORDER`, `PRO-STAGE`, and `PRO-LOSS` workspaces; focused backend, component, and browser coverage.
- [x] Lab samples/results, deviations, food-safety holds, release, artwork/coding, packing, and finished-goods lots.
  - Verified with immutable specification/result snapshots and typed evaluation; automatic failed-sample deviation/hold creation; reasoned CAPA/disposition and food-safety hold release; enforced production quality gates; versioned artwork approval/retirement and rendered coding; packing completion into released stock plus finished-lot evidence; live `QC-LAB`, `QC-SAFE`, `PACK-ART`, `PACK-RUN`, and `FG-LOT` workspaces; focused backend, component, and browser coverage.
- [x] Full lot genealogy, trace, recall, batch costing, and variance analysis.
  - Verified with bidirectional material-to-finished-lot traversal; classified recall cases over the connected lot set; transactional on-hand stock blocking and recalled batch/lot state; reasoned case closure; immutable versioned INR cost snapshots based on material issues and stage actuals; yield, per-good-unit cost, material-usage, stage-time, and total variance; live `TRACE-CASE` and `COST-BATCH` workspaces. Migration 025 adds 16 relational execution tables and expands the three existing production/stage/finished-lot shells; 2 backend tests / 153 assertions pass on SQLite and PostgreSQL, 10 component tests pass, and one live Chromium journey proves all ten execution screens plus their planning hand-off.

### P2 - Order-to-cash and finance

- [x] Lead/enquiry, price lists, discounts, credit control, contracts, sales orders, and amendments.
  - Verified with migration 026 relational aggregates; scoped registers/details/lookups; lead lifecycle and immutable events; versioned price/contract lines; finance-owned customer limit/hold/terms; contract consumption; server-priced/taxed order totals; credit checks; immutable revisions; dedicated permissions; optimistic/idempotent/audit/outbox controls; and live `CRM-LEAD`, `CRM-PRICE`, `CRM-ORDER`, and `CON-WORK` workspaces.
- [x] Allocation, picking, loading, dispatch, POD, claims, returns, replacements, and credits.
  - Verified with deterministic FEFO selection and row-locked reservations; exact picked-lot shipment lines; load/dispatch stock posting; atomic receivable creation; POD completion/failure evidence; shipment-line quantity-safe claims; receive/credit/replacement/reject outcomes; balance transactions; and the live Sales Manager browser journey.
- [x] Receivables, collections, ageing, profitability, expenses, journals, and period close; extend implemented payables with treasury/bank and statutory integrations.
  - Verified with live ageing/exposure and profitability read models; atomic customer-receipt allocation; balanced journal/post/reverse controls; closed-period rejection; taxed expense maker-checker posting; masked bank identities; deterministic SHA-256 AP-bank/GST exports with single-use source selection and acknowledgements; and complete API v3.0 mapping.
- [x] Overheads, assets, depreciation, payroll posting, and maintenance accounting.
  - Verified with governed overhead pools/allocations, balanced target journals, fixed-asset activation and straight-line depreciation evidence, employee accounting profiles and immutable payroll snapshots, independent approval/posting, and maintenance release/completion cost journals.
- [x] Finance adjustments, historical import, bill archive, opening reconciliation, and support/audit tools.
  - Verified with maker-checker balanced adjustments; mapped/validated legacy batches; line-level opening reconciliation; ledger-isolated simulations; checksum/deduplication/MIME/size/retention controlled private MinIO uploads and authenticated downloads; immutable diagnostic snapshots; migrations 026-028; 7 backend tests / 206 assertions on SQLite and PostgreSQL; 4 P2 component tests; and the full 14-test browser suite.

### P3 - Scale and optimisation

- [x] Multi-plant configuration, consolidation, inter-plant movements, and cross-company controls.
  - Verified with migration 029's nine relational group/member/route/mapping/transfer/line/consolidation tables; effective membership; exact source/destination context visibility and dual-scope cross-company authority; forced cross-company acceptance and commercial controls; explicit item/UOM conversion; independent source approval and destination acceptance; execution-time stock revalidation and deterministic locks; separate outbound/inbound movement evidence; balanced ledger snapshots, exchange rates, eliminations, and independent finalization; version/idempotency/audit/outbox controls; the live `SCALE-PLANT` workspace; 4 backend tests / 84 assertions on SQLite and PostgreSQL; 2 component tests; and a live two-context Chromium hand-off.
- [x] Partner portal identity, tenant isolation, entitlements, document exchange, and acknowledgements.
  - Verified with migration 030's access-grant, entitlement, private-document, and document-event tables; party-bound external role assignment; exact company/plant/customer resolution; nine explicit record/action entitlements; cross-tenant not-found behavior; live order/shipment/invoice/claim drill-through; controlled external claim creation; private 20 MiB inbound/outbound object exchange with MIME, checksum, metadata, and single exact-tenant business links; versioned receipt-only acknowledgement and withdrawal rules; idempotency/audit/outbox controls; the dual-mode `PORTAL-EXT` workspace; 4 backend tests / 73 assertions on SQLite and PostgreSQL; 2 component tests; and a live internal-publish-to-external-download/acknowledgement Chromium hand-off.
- [x] Forecast/optimisation input versioning, recommendations, limitations, human approval, and outcome tracking.
  - Verified with migration 031's plan, immutable input-version/line, recommendation/limitation, review, and outcome tables; exact released-demand version/checksum binding; stock, MRP-shortage, and finalized-cost snapshots; deterministic net-requirement recommendations with rationale and explicit uncertainty/constraint disclosures; changed-source submission rejection; independent maker-checker approval/rejection; versioned outcomes and all-outcomes completion gate; scope, permission, optimistic, idempotency, audit, and outbox controls; the live `OPT-PLAN` workspace; 4 backend tests / 139 assertions on SQLite and PostgreSQL; 3 component tests; and a live Operations-to-Finance-to-Operations Chromium journey. Recommendations remain non-posting decision support.

## Production-readiness gaps

- [ ] Replace development application key, demo accounts, database passwords, and MinIO credentials.
- [ ] Disable `APP_DEBUG`, restrict exposed database/Redis ports, and separate development seeders.
- [ ] Enforce HTTPS, secure/same-site cookies, trusted hosts/proxies, and an explicit production CORS policy.
- [ ] Maintain production data-retention plus backup/rollback/recovery procedures; current master/transaction foreign-key, check, and uniqueness hardening and the populated migration rollback/reapply verification are complete.
- [x] Add PostgreSQL-backed integration coverage for foundation, identity, controls, master data, inventory, procure-to-pay, manufacturing, `WRK-HOME`, `RET-UNSOLD`, all P2 commercial/finance slices, and all three P3 slices. Four PostgreSQL-only tests / 15 assertions audit relational integrity while the 154-test fast backend profile / 2,409 assertions uses SQLite for isolation. The focused P2, scale, portal, and optimisation suites pass directly on both databases with 7 tests / 206 assertions, 4 tests / 84 assertions, 4 tests / 73 assertions, and 4 tests / 139 assertions respectively.
- [ ] Add a real simultaneous-transaction test for stock locking; the current stock test executes commands sequentially.
- [ ] Add route-wide authorisation matrix tests for every role, context, state, and action.
- [x] Add baseline frontend component and live browser E2E coverage for foundation administration, approval governance, audit/outbox operations, party/product masters, inventory, procure-to-pay, manufacturing/quality/packing/trace/cost, all P2 commercial/finance screens, all three P3 scale/partner/optimisation slices, `WRK-HOME`, and `RET-UNSOLD`.
- [ ] Expand frontend unit/component/browser coverage to the two remaining prototype screens and add automated accessibility checks.
- [ ] Add structured logs, metrics, traces, request/correlation IDs, alerting, and audit monitoring.
- [ ] Add backup/restore tests, disaster recovery, queue recovery, and outbox replay procedures.
- [ ] Add performance, load, security, dependency, and penetration-test gates in CI/CD.

## Completion definition for each future screen

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

P0, P1, P2, and all three P3 slices are complete. Continue with **live `BI-REP` reporting and `ADM-HELP` support content**, then close the production-readiness controls above.
