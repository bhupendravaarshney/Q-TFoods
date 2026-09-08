import type { ScreenDefinition } from '../types/screen';

export const screenRegistry: ScreenDefinition[] = [
  {
    "code": "ACC-LOGIN",
    "title": "Secure Sign In",
    "area": "Foundation / Admin",
    "batch": "B04",
    "description": "Named user authentication with secure session and MFA-ready flow."
  },
  {
    "code": "ACC-CTX",
    "title": "Company & Plant Context",
    "area": "Foundation / Admin",
    "batch": "B04",
    "description": "Choose only the authorised company and plant context before protected work."
  },
  {
    "code": "WRK-HOME",
    "title": "Operations Control Room",
    "area": "Foundation / Admin",
    "batch": "B04",
    "description": "Role-aware work queue, approvals, exceptions, freshness and drill-through."
  },
  {
    "code": "ADM-ORG",
    "title": "Organisation Setup",
    "area": "Foundation / Admin",
    "batch": "B04",
    "description": "Organisation Setup workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "ADM-LOC",
    "title": "Locations & Hierarchy",
    "area": "Foundation / Admin",
    "batch": "B04",
    "description": "Locations & Hierarchy workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "ADM-USER",
    "title": "Users & Invitations",
    "area": "Foundation / Admin",
    "batch": "B04",
    "description": "Users & Invitations workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "ADM-ROLE",
    "title": "Roles & Permissions",
    "area": "Foundation / Admin",
    "batch": "B04",
    "description": "Roles & Permissions workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "ADM-RULE",
    "title": "Approval Rules",
    "area": "Foundation / Admin",
    "batch": "B04",
    "description": "Approval Rules workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "ADM-AUD",
    "title": "Audit & Evidence",
    "area": "Foundation / Admin",
    "batch": "B04",
    "description": "Search audit events by request, actor, scope, entity, outcome and evidence."
  },
  {
    "code": "ADM-INT",
    "title": "Integrations",
    "area": "Foundation / Admin",
    "batch": "B04",
    "description": "Integration endpoints, outbox events, acknowledgements, retries and quarantine."
  },
  {
    "code": "ADM-HELP",
    "title": "Help & Support",
    "area": "Foundation / Admin",
    "batch": "B04",
    "description": "Help & Support workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "BI-REP",
    "title": "Reports",
    "area": "Foundation / Admin",
    "batch": "B04",
    "description": "Controlled read models with filters, cutoff, freshness and export metadata."
  },
  {
    "code": "MD-PARTY",
    "title": "Parties",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Parties workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "MD-BRAND",
    "title": "Brands & Agreements",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Brands & Agreements workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "MD-ITEM",
    "title": "Items & UOM",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Items & UOM workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "MD-SKU",
    "title": "SKUs & Packs",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "SKUs & Packs workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "PUR-REQ",
    "title": "Purchase Requisitions",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Purchase Requisitions workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "PUR-RFQ",
    "title": "RFQ & Comparison",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "RFQ & Comparison workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "PUR-PO",
    "title": "Purchase Orders",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Purchase Orders workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "INB-GATE",
    "title": "Gate Entry",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Gate Entry workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "INB-GRN",
    "title": "GRN / Receipt",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "GRN / Receipt workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "QC-IN",
    "title": "Incoming QC",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Incoming QC workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "INB-RETURN",
    "title": "Supplier Returns",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Supplier Returns workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "INV-STK",
    "title": "Stock & Lots",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Stock & Lots workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "INV-ISS",
    "title": "Issue / Return",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Issue / Return workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "INV-TRF",
    "title": "Stock Transfers",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Stock Transfers workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "INV-COUNT",
    "title": "Stock Counts",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Stock Counts workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "INV-EXP",
    "title": "Expiry / Disposal",
    "area": "Master / Procurement / Stock",
    "batch": "B05-B07",
    "description": "Expiry / Disposal workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "MD-REC",
    "title": "Recipes / BOM",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Recipes / BOM workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "MD-ROUTE",
    "title": "Routes",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Routes workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "MD-SPEC",
    "title": "Quality Standards",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Quality Standards workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "PLAN-DEM",
    "title": "Demand",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Demand workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "PLAN-MRP",
    "title": "MRP",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "MRP workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "PLAN-SCH",
    "title": "Production Schedule",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Production Schedule workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "PRO-ORDER",
    "title": "Production Orders",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Production Orders workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "PRO-STAGE",
    "title": "Stage Execution",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Stage Execution workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "PRO-LOSS",
    "title": "Yield / Loss / Rework",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Yield / Loss / Rework workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "QC-LAB",
    "title": "Lab & Samples",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Lab & Samples workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "QC-SAFE",
    "title": "Safety / Deviations",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Safety / Deviations workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "PACK-ART",
    "title": "Artwork & Coding",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Artwork & Coding workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "PACK-RUN",
    "title": "Packing Run",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Packing Run workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "FG-LOT",
    "title": "Finished Goods",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Finished Goods workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "TRACE-CASE",
    "title": "Trace / Recall",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Trace / Recall workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "COST-BATCH",
    "title": "Batch Cost",
    "area": "Manufacturing / Quality",
    "batch": "B08-B12",
    "description": "Batch Cost workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "CRM-LEAD",
    "title": "Enquiries & Leads",
    "area": "Sales / Dispatch",
    "batch": "B13-B17",
    "description": "Enquiries & Leads workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "CRM-PRICE",
    "title": "Pricing & Credit",
    "area": "Sales / Dispatch",
    "batch": "B13-B17",
    "description": "Pricing & Credit workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "CRM-ORDER",
    "title": "Sales Orders",
    "area": "Sales / Dispatch",
    "batch": "B13-B17",
    "description": "Sales Orders workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "CON-WORK",
    "title": "Third-Party Work",
    "area": "Sales / Dispatch",
    "batch": "B13-B17",
    "description": "Third-Party Work workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "DSP-PICK",
    "title": "Allocation & Picking",
    "area": "Sales / Dispatch",
    "batch": "B13-B17",
    "description": "Allocation & Picking workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "DSP-LOAD",
    "title": "Load & Dispatch",
    "area": "Sales / Dispatch",
    "batch": "B13-B17",
    "description": "Load & Dispatch workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "DSP-POD",
    "title": "Delivery / POD",
    "area": "Sales / Dispatch",
    "batch": "B13-B17",
    "description": "Delivery / POD workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "RET-CASE",
    "title": "Returns & Claims",
    "area": "Sales / Dispatch",
    "batch": "B13-B17",
    "description": "Returns & Claims workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "RET-UNSOLD",
    "title": "Unsold Sales Return & Loss",
    "area": "Sales / Dispatch",
    "batch": "B16",
    "description": "Sales-initiated return of unsold market stock, physical return receipt, Quality disposition and controlled loss recognition."
  },
  {
    "code": "FIN-AR",
    "title": "Receivables",
    "area": "Sales / Dispatch",
    "batch": "B13-B17",
    "description": "Receivables workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "BI-PROFIT",
    "title": "Profitability",
    "area": "Sales / Dispatch",
    "batch": "B13-B17",
    "description": "Profitability workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "FIN-AP",
    "title": "Payables",
    "area": "Finance / Support",
    "batch": "B18-B21",
    "description": "Payables workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "FIN-EXP",
    "title": "Expenses",
    "area": "Finance / Support",
    "batch": "B18-B21",
    "description": "Expenses workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "FIN-GL",
    "title": "Ledger & Period Close",
    "area": "Finance / Support",
    "batch": "B18-B21",
    "description": "Ledger & Period Close workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "COST-OH",
    "title": "Overheads",
    "area": "Finance / Support",
    "batch": "B18-B21",
    "description": "Overheads workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "ASSET-REG",
    "title": "Assets",
    "area": "Finance / Support",
    "batch": "B18-B21",
    "description": "Assets workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "HR-PAY",
    "title": "People & Payroll",
    "area": "Finance / Support",
    "batch": "B18-B21",
    "description": "People & Payroll workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "ENG-MNT",
    "title": "Maintenance",
    "area": "Finance / Support",
    "batch": "B18-B21",
    "description": "Maintenance workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "SCALE-PLANT",
    "title": "Multi-Plant Control",
    "area": "Scale",
    "batch": "B22-B24",
    "description": "Multi-Plant Control workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "PORTAL-EXT",
    "title": "Partner Portal",
    "area": "Scale",
    "batch": "B22-B24",
    "description": "Partner-isolated workspace with explicit entitlements and no implicit internal approval."
  },
  {
    "code": "OPT-PLAN",
    "title": "Optimisation",
    "area": "Scale",
    "batch": "B22-B24",
    "description": "Forecasts and recommendations with versioned inputs, limitations and human review."
  },
  {
    "code": "FIN-SIM",
    "title": "Simulation workspace",
    "area": "Finance Supplement",
    "batch": "Supplement",
    "description": "Completely isolated training/simulation data with zero live posting."
  },
  {
    "code": "FIN-ADJ",
    "title": "Finance adjustments",
    "area": "Finance Supplement",
    "batch": "Supplement",
    "description": "Finance Adjustments workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "FIN-LEGACY",
    "title": "Historical import centre",
    "area": "Finance Supplement",
    "batch": "Supplement",
    "description": "Staged historical bill import with mapping, validation and reconciliation."
  },
  {
    "code": "FIN-ARCH",
    "title": "Bill archive",
    "area": "Finance Supplement",
    "batch": "Supplement",
    "description": "Bill Archive workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "FIN-OPEN",
    "title": "Opening reconciliation",
    "area": "Finance Supplement",
    "batch": "Supplement",
    "description": "Opening Reconciliation workflow with server-authoritative scope, state, version, approval and audit."
  },
  {
    "code": "FIN-SUP",
    "title": "Audit/support",
    "area": "Finance Supplement",
    "batch": "Supplement",
    "description": "Finance Audit / Support workflow with server-authoritative scope, state, version, approval and audit."
  }
];
