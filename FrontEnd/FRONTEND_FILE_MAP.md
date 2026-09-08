# Frontend File Map

## Pages

- `ACC-LOGIN` → `src/pages/ACC_LOGIN.tsx` — Secure Sign In
- `ACC-CTX` → `src/pages/ACC_CTX.tsx` — Company & Plant Context
- `WRK-HOME` → `src/pages/WRK_HOME.tsx` — Operations Control Room
- `ADM-ORG` → `src/pages/ADM_ORG.tsx` — Organisation Setup
- `ADM-LOC` → `src/pages/ADM_LOC.tsx` — Locations & Hierarchy
- `ADM-USER` → `src/pages/ADM_USER.tsx` — Users & Invitations
- `ADM-ROLE` → `src/pages/ADM_ROLE.tsx` — Roles & Permissions
- `ADM-RULE` → `src/pages/ADM_RULE.tsx` — Approval Rules
- `ADM-AUD` → `src/pages/ADM_AUD.tsx` — Audit & Evidence
- `ADM-INT` → `src/pages/ADM_INT.tsx` — Integrations
- `ADM-HELP` → `src/pages/ADM_HELP.tsx` — Help & Support
- `BI-REP` → `src/pages/BI_REP.tsx` — Reports
- `MD-PARTY` → `src/pages/MD_PARTY.tsx` — Parties
- `MD-BRAND` → `src/pages/MD_BRAND.tsx` — Brands & Agreements
- `MD-ITEM` → `src/pages/MD_ITEM.tsx` — Items & UOM
- `MD-SKU` → `src/pages/MD_SKU.tsx` — SKUs & Packs
- `PUR-REQ` → `src/pages/PUR_REQ.tsx` — Purchase Requisitions
- `PUR-RFQ` → `src/pages/PUR_RFQ.tsx` — RFQ & Comparison
- `PUR-PO` → `src/pages/PUR_PO.tsx` — Purchase Orders
- `INB-GATE` → `src/pages/INB_GATE.tsx` — Gate Entry
- `INB-GRN` → `src/pages/INB_GRN.tsx` — GRN / Receipt
- `QC-IN` → `src/pages/QC_IN.tsx` — Incoming QC
- `INB-RETURN` → `src/pages/INB_RETURN.tsx` — Supplier Returns
- `INV-STK` → `src/pages/INV_STK.tsx` — Stock & Lots
- `INV-ISS` → `src/pages/INV_ISS.tsx` — Issue / Return
- `INV-TRF` → `src/pages/INV_TRF.tsx` — Stock Transfers
- `INV-COUNT` → `src/pages/INV_COUNT.tsx` — Stock Counts
- `INV-EXP` → `src/pages/INV_EXP.tsx` — Expiry / Disposal
- `MD-REC` → `src/pages/MD_REC.tsx` — Recipes / BOM
- `MD-ROUTE` → `src/pages/MD_ROUTE.tsx` — Routes
- `MD-SPEC` → `src/pages/MD_SPEC.tsx` — Quality Standards
- `PLAN-DEM` → `src/pages/PLAN_DEM.tsx` — Demand
- `PLAN-MRP` → `src/pages/PLAN_MRP.tsx` — MRP
- `PLAN-SCH` → `src/pages/PLAN_SCH.tsx` — Production Schedule
- `PRO-ORDER` → `src/pages/PRO_ORDER.tsx` — Production Orders
- `PRO-STAGE` → `src/pages/PRO_STAGE.tsx` — Stage Execution
- `PRO-LOSS` → `src/pages/PRO_LOSS.tsx` — Yield / Loss / Rework
- `QC-LAB` → `src/pages/QC_LAB.tsx` — Lab & Samples
- `QC-SAFE` → `src/pages/QC_SAFE.tsx` — Safety / Deviations
- `PACK-ART` → `src/pages/PACK_ART.tsx` — Artwork & Coding
- `PACK-RUN` → `src/pages/PACK_RUN.tsx` — Packing Run
- `FG-LOT` → `src/pages/FG_LOT.tsx` — Finished Goods
- `TRACE-CASE` → `src/pages/TRACE_CASE.tsx` — Trace / Recall
- `COST-BATCH` → `src/pages/COST_BATCH.tsx` — Batch Cost
- `CRM-LEAD` → `src/pages/CRM_LEAD.tsx` — Enquiries & Leads
- `CRM-PRICE` → `src/pages/CRM_PRICE.tsx` — Pricing & Credit
- `CRM-ORDER` → `src/pages/CRM_ORDER.tsx` — Sales Orders
- `CON-WORK` → `src/pages/CON_WORK.tsx` — Third-Party Work
- `DSP-PICK` → `src/pages/DSP_PICK.tsx` — Allocation & Picking
- `DSP-LOAD` → `src/pages/DSP_LOAD.tsx` — Load & Dispatch
- `DSP-POD` → `src/pages/DSP_POD.tsx` — Delivery / POD
- `RET-CASE` → `src/pages/RET_CASE.tsx` — Returns & Claims
- `RET-UNSOLD` → `src/pages/RET_UNSOLD.tsx` — Unsold Sales Return & Loss
- `FIN-AR` → `src/pages/FIN_AR.tsx` — Receivables
- `BI-PROFIT` → `src/pages/BI_PROFIT.tsx` — Profitability
- `FIN-AP` → `src/pages/FIN_AP.tsx` — Payables
- `FIN-EXP` → `src/pages/FIN_EXP.tsx` — Expenses
- `FIN-GL` → `src/pages/FIN_GL.tsx` — Ledger & Period Close
- `COST-OH` → `src/pages/COST_OH.tsx` — Overheads
- `ASSET-REG` → `src/pages/ASSET_REG.tsx` — Assets
- `HR-PAY` → `src/pages/HR_PAY.tsx` — People & Payroll
- `ENG-MNT` → `src/pages/ENG_MNT.tsx` — Maintenance
- `SCALE-PLANT` → `src/pages/SCALE_PLANT.tsx` — Multi-Plant Control
- `PORTAL-EXT` → `src/pages/PORTAL_EXT.tsx` — Partner Portal
- `OPT-PLAN` → `src/pages/OPT_PLAN.tsx` — Optimisation
- `FIN-SIM` → `src/pages/FIN_SIM.tsx` — Simulation workspace
- `FIN-ADJ` → `src/pages/FIN_ADJ.tsx` — Finance adjustments
- `FIN-LEGACY` → `src/pages/FIN_LEGACY.tsx` — Historical import centre
- `FIN-ARCH` → `src/pages/FIN_ARCH.tsx` — Bill archive
- `FIN-OPEN` → `src/pages/FIN_OPEN.tsx` — Opening reconciliation
- `FIN-SUP` → `src/pages/FIN_SUP.tsx` — Audit/support

## Automated tests

- `src/components/UnsoldReturnCasePanel.test.tsx` - case evidence and permission component coverage
- `src/components/UnsoldReturnApprovalInbox.test.tsx` - approval and maker-checker component coverage
- `src/test/unsoldReturnFixtures.ts` - typed component fixtures
- `e2e/ret-unsold-handoff.spec.ts` - live Sales/Operations/Finance Chromium workflow
- `vitest.config.ts` and `playwright.config.ts` - component and browser runners
- `../BackEnd/docker-compose.e2e.yml` - disposable PostgreSQL/Redis/backend/evidence runtime

## Shared code

- `src/app/AppShell.tsx` — application shell and navigation
- `src/app/pageMap.ts` — screen-code → React component map
- `src/components/ModulePage.tsx` — shared operational module page
- `src/components/ScreenContract.tsx` — technical control reminder
- `src/data/screenRegistry.ts` — full screen registry
- `src/data/demoRows.ts` — demo records
- `src/api/client.ts` — production API-client pattern
- `src/styles/app.css` — complete responsive styles
