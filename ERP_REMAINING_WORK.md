# Q & T Foods ERP - Remaining Work

Snapshot date: 2026-09-15

## Current position

Repository implementation is complete for the agreed UAT scope: all 71 routed screens are live, role-scoped navigation and API access are fail closed, the sidebar uses user-friendly business names instead of visible screen codes, the backend and frontend test baselines pass, the production-oriented images and recovery tooling build, and the repository-owned CI security, dependency, load, and active-DAST gates pass.

What remains is primarily target-platform commissioning, organisational control, and independent assurance. This document is the concise handoff view; [`ERP_IMPLEMENTATION_GAPS.md`](ERP_IMPLEMENTATION_GAPS.md) remains the detailed evidence record.

The unchecked boxes in the detailed tracker's "Completion definition for each screen delivery" section are a reusable standard for future screens. They are not unfinished work on the current 71-screen scope.

## Required before production approval

### 1. Approve and provision the target platform

- [ ] Name the service owner, platform owner, security owner, database owner, recovery owner, and on-call owner.
- [ ] Provision the production Linux/Docker platform, image registry, durable storage, public frontend/API DNS, and HTTPS routing.
- [ ] Confirm that only the gateway is publicly reachable; PostgreSQL, Redis, and MinIO must remain private.
- [ ] Decide whether the current single-host baseline meets the approved availability objective. If it does not, design and test the required high-availability and geographic-failure architecture.
- [ ] Retain immutable application, gateway, and recovery image tags for rollback.

Completion evidence: approved architecture and ownership record, reachable HTTPS frontend/API, private dependency checks, successful liveness/readiness probes, and a recorded availability-risk decision.

### 2. Provision production configuration, secrets, and email delivery

- [ ] Store the Laravel application key, PostgreSQL password, Redis password, separate MinIO root/application credentials, SMTP credentials, metrics token, and applicable outbox/alert signing secrets in the target secret manager.
- [ ] Establish access control, rotation, break-glass access, and audit ownership for every secret.
- [ ] Replace every placeholder and example domain in the production environment without committing the resulting file.
- [ ] Configure a TLS-capable production email service and verify invitation, email-verification, and password-reset delivery.
- [ ] Decide whether the implemented local identity lifecycle is acceptable for launch or enterprise IdP/SSO is an additional requirement.
- [ ] Run `php artisan qt:deployment:verify` from the release image and resolve every failure without weakening the production environment policy.

Completion evidence: successful deployment-policy output, secret-manager inventory and rotation record, and received end-to-end identity emails with preview links disabled.

### 3. Enforce repository governance

- [ ] Protect `main` and require the stable `Required quality gate` check.
- [ ] Restrict force pushes, deletion, and bypass authority according to the organisation's change policy.
- [ ] Assign owners for pull-request failures, weekly scheduled quality runs, CodeQL/Trivy findings, and Dependabot updates.

Completion evidence: exported or reviewed branch/ruleset configuration plus one successful pull-request run of the required aggregate check.

### 4. Connect production observability and incident response

- [ ] Ship JSON container logs to the approved collector without multiline transformation and index request, correlation, trace, and span identifiers.
- [ ] Scrape the protected Prometheus endpoint over HTTPS and configure dashboards, retention, and scrape-failure alerts.
- [ ] Route `operational_alert` events to the approved paging service and named on-call rota.
- [ ] Tune thresholds from production-like measurements.
- [ ] Test alert firing, duplicate suppression, renotification, recovery notification, and receiver failure before accepting live traffic.

Completion evidence: searchable correlated request/audit/outbox trail, working dashboards, paging receipts, tested alert lifecycle, retention approval, and a named incident owner.

### 5. Operate and approve backup and recovery

- [ ] Approve RPO, RTO, retention, geographic recovery needs, and named recovery decision-makers.
- [ ] Schedule backups no less frequently than the approved RPO and monitor missed/failed jobs externally.
- [ ] Store verified copies on encrypted, access-restricted, immutable off-host storage under a separate backup identity.
- [ ] Protect Caddy certificate/configuration state separately from application snapshots.
- [ ] Run the documented restore against isolated target infrastructure, including exact object restoration, Redis invalidation, and queue/outbox reconciliation.
- [ ] Measure the target drill against the approved RPO/RTO and close every defect before launch.

Completion evidence: snapshot ID and manifest, checksum output, immutable off-host version identifier, restore timings, application verification output, named approvals, corrective actions, and next drill date. Follow [`BackEnd/docs/RECOVERY_RUNBOOK.md`](BackEnd/docs/RECOVERY_RUNBOOK.md).

### 6. Complete independent security assurance

- [ ] Commission an authorised independent penetration test against the approved target environment.
- [ ] Give the assessor the application boundaries, roles, APIs, partner-tenant model, file exchange, and administrative workflows needed for meaningful authenticated testing.
- [ ] Remediate findings, retest fixes, and formally approve residual risk.
- [ ] Re-run the retained ZAP observations through the production HTTPS gateway: intentional readable `XSRF-TOKEN`, development-server `X-Powered-By`, secure-response `X-Content-Type-Options`, generic-probe content types/404s, and informational authentication/session discovery.

Completion evidence: final independent report, remediation/retest record, production-gateway scan artifacts, and signed residual-risk acceptance with no unapproved release-blocking finding.

### 7. Complete production-like capacity and resilience testing

- [ ] Define realistic concurrency, transaction mix, file sizes, data volume, peak periods, background-job load, and service objectives with business owners.
- [ ] Run capacity, sustained-load, spike, and relevant dependency-failure tests on production-like infrastructure.
- [ ] Measure API latency/error rate, database and Redis behavior, object-storage throughput, queue/outbox lag, resource saturation, recovery, and dropped work.
- [ ] Remediate bottlenecks and update CI k6 thresholds when measured service objectives differ from the current smoke profile.
- [ ] Record the supported operating envelope and scaling/runbook triggers.

Completion evidence: approved workload model, raw results, capacity limit, service objectives, remediation/retest record, and named approval.

### 8. Complete release commissioning and approval

- [ ] Run the production Compose/configuration preflight, build all release targets, and execute the full quality workflow against the release commit.
- [ ] Configure production companies, plants, users, roles, policies, integrations, and opening/import data through an approved cutover process where required.
- [ ] Have business owners execute and sign off representative high-risk workflows, including approvals, inventory posting, production/quality release, dispatch/returns, finance posting, partner isolation, reports, and evidence retrieval.
- [ ] Rehearse rollback using immutable images and confirm schema compatibility.
- [ ] Assemble the deployment, security, capacity, observability, backup/recovery, and business-acceptance evidence into one go-live decision record.

Completion evidence: signed release checklist and go-live approval with owners, timestamps, release tag, rollback tag, known limitations, and accepted risks.

## Deferred product and integration extensions

These are described in the detailed screen inventory but are not defects in the current implemented scope. Promote an item into required work only when a contract, regulation, or approved business requirement makes it necessary.

| Area | Deferred examples |
| --- | --- |
| Identity, administration, and support | Enterprise IdP/SSO, bulk identity/party onboarding, external service-desk and knowledge-authoring integration, additional rule types, audit exports, and partner-specific transports. |
| Warehouse, procurement, and logistics | Scanner/barcode tasks, weighbridge and ASN ingestion, carrier/route integration, supplier acknowledgements/debit notes, printer/line integration, serialization, pallets, and license plates. |
| Planning, manufacturing, and quality | Statistical forecasting, automatic order demand, multi-echelon/substitution planning, solver-backed sequencing, alternate recipes/routes, OEE/machine telemetry, LIMS/instrument integration, electronic instructions/signatures, certificates, full CAPA, and regulatory workflows. |
| Commercial, finance, and reporting | External CRM/e-signatures, bank connectors/statements and treasury, statutory payroll and asset tax books, standard-cost/GL settlement, intercompany tax/invoicing/transfer pricing, scheduled/custom analytics, and external archival/compliance connectors. |
| Customer and partner automation | Enterprise federation, automated notifications, bulk partner onboarding, supplier-facing workflows, carrier/customer exchange, and additional external document transports. |

## Recommended execution order

1. Assign owners and approve the target architecture, availability objective, RPO, and RTO.
2. Enable branch protection and failure ownership before accepting further release changes.
3. Provision infrastructure, secrets, DNS/TLS, SMTP, and release configuration.
4. Deploy the release candidate and connect observability, paging, and scheduled immutable backups.
5. Complete target recovery, independent penetration, capacity, resilience, and business-acceptance exercises.
6. Remediate and retest findings, then approve the evidence-backed production release.

## Ongoing after launch

- [ ] Triage every required/scheduled quality-gate failure and dependency update.
- [ ] Rotate secrets and review access on the approved schedule.
- [ ] Monitor readiness, alerts, queue/outbox age, failed jobs, audit-context coverage, storage, and capacity trends.
- [ ] Verify backups continuously and run an isolated recovery exercise at least quarterly and after material persistence changes.
- [ ] Reassess penetration, capacity, recovery, and availability controls after material architecture or trust-boundary changes.
- [ ] Keep the OpenAPI contract, DAST surface, runbooks, permissions matrix, and deferred-extension decisions aligned with each release.
