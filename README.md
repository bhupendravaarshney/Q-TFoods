# Q & T Foods ERP + CRM

The repository contains the Laravel backend in [`BackEnd`](BackEnd/README.md) and the React frontend in [`FrontEnd`](FrontEnd/README.md).

All 71 routed screens are implemented through the complete master-data, inventory, procure-to-pay, manufacturing, order-to-cash, dispatch, claims, finance, multi-plant, partner, optimisation, controlled-reporting, and help/support workflows. See [`ERP_IMPLEMENTATION_GAPS.md`](ERP_IMPLEMENTATION_GAPS.md) for the verified functional baseline and remaining production-readiness work.

A fail-closed, TLS-terminating single-host production baseline with structured telemetry, protected metrics, dependency readiness, trace propagation, scheduled operational alerts, and a tested PostgreSQL/MinIO/Redis recovery profile is documented in [`BackEnd/docs/PRODUCTION_DEPLOYMENT.md`](BackEnd/docs/PRODUCTION_DEPLOYMENT.md) and [`BackEnd/docs/RECOVERY_RUNBOOK.md`](BackEnd/docs/RECOVERY_RUNBOOK.md). It intentionally does not replace organisation-specific secret management, external collector/paging onboarding, scheduled encrypted off-host custody, target-infrastructure drills, or disaster-recovery approval.

Repository CI/CD quality controls are documented in [`quality/README.md`](quality/README.md). The SHA- and digest-pinned workflow audits locked dependencies, runs the complete backend/frontend/browser suites, scans supported source and workflow languages, scans the repository and all production image targets, and exercises authenticated k6 load plus ZAP active API security against disposable infrastructure. Configure branch protection to require its stable `Required quality gate` check.
