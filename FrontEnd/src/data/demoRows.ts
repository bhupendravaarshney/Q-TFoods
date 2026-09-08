import type { DemoRow } from '../types/screen';

export const demoRows: Record<string, DemoRow[]> = {
  "Foundation / Admin": [
    {
      "id": "DEMO-TASK-001",
      "description": "Approve configuration change",
      "status": "In review",
      "owner": "Administrator",
      "control": "Today"
    },
    {
      "id": "DEMO-AUD-002",
      "description": "Denied cross-scope request",
      "status": "Recorded",
      "owner": "Audit",
      "control": "Request ref"
    },
    {
      "id": "DEMO-INT-003",
      "description": "Integration acknowledgement pending",
      "status": "Pending",
      "owner": "Technology",
      "control": "2 min"
    },
    {
      "id": "DEMO-REP-004",
      "description": "Control room snapshot",
      "status": "Current",
      "owner": "Management",
      "control": "As of now"
    }
  ],
  "Master / Procurement / Stock": [
    {
      "id": "DEMO-PO-001",
      "description": "Purchase order partial receipt",
      "status": "In review",
      "owner": "Purchase",
      "control": "Today"
    },
    {
      "id": "DEMO-GRN-002",
      "description": "GRN awaiting incoming QC",
      "status": "Held",
      "owner": "Stores / Quality",
      "control": "Today"
    },
    {
      "id": "DEMO-LOT-003",
      "description": "Released training lot",
      "status": "Released",
      "owner": "Stores",
      "control": "40 kg free"
    },
    {
      "id": "DEMO-COUNT-004",
      "description": "Count variance review",
      "status": "Pending",
      "owner": "Stores / Finance",
      "control": "Tomorrow"
    }
  ],
  "Manufacturing / Quality": [
    {
      "id": "DEMO-BATCH-001",
      "description": "Training production order",
      "status": "In progress",
      "owner": "Production",
      "control": "Stage 3/5"
    },
    {
      "id": "DEMO-QC-002",
      "description": "Required process result",
      "status": "Held",
      "owner": "Quality",
      "control": "Review today"
    },
    {
      "id": "DEMO-RWK-003",
      "description": "Rework source",
      "status": "Pending",
      "owner": "Quality",
      "control": "10 kg"
    },
    {
      "id": "DEMO-COST-004",
      "description": "Batch cost version",
      "status": "Provisional",
      "owner": "Costing",
      "control": "Late input open"
    }
  ],
  "Sales / Dispatch": [
    {
      "id": "DEMO-SO-001",
      "description": "Sales order with partial fulfilment",
      "status": "Approved",
      "owner": "Sales",
      "control": "1,050 packs"
    },
    {
      "id": "DEMO-LOAD-002",
      "description": "Load awaiting independent check",
      "status": "Pending",
      "owner": "Dispatch",
      "control": "Today"
    },
    {
      "id": "DEMO-POD-003",
      "description": "Partial POD",
      "status": "In review",
      "owner": "Logistics",
      "control": "20 rejected"
    },
    {
      "id": "DEMO-AR-004",
      "description": "Open customer balance",
      "status": "Open",
      "owner": "Finance",
      "control": "INR 13,300"
    }
  ],
  "Finance / Support": [
    {
      "id": "DEMO-AP-001",
      "description": "Supplier invoice match",
      "status": "In review",
      "owner": "Finance",
      "control": "INR 22,000"
    },
    {
      "id": "DEMO-BANK-002",
      "description": "Bank reconciliation",
      "status": "Pending",
      "owner": "Finance",
      "control": "INR 60,000"
    },
    {
      "id": "DEMO-ASSET-003",
      "description": "Depreciation preview",
      "status": "Preview",
      "owner": "Finance",
      "control": "INR 10,000"
    },
    {
      "id": "DEMO-MNT-004",
      "description": "Maintenance work order",
      "status": "Open",
      "owner": "Engineering",
      "control": "Equipment hold"
    }
  ],
  "Scale": [
    {
      "id": "DEMO-TR-001",
      "description": "Inter-plant transfer",
      "status": "In review",
      "owner": "Operations",
      "control": "300 kg"
    },
    {
      "id": "DEMO-EVENT",
      "description": "Integration reconciliation",
      "status": "Pending",
      "owner": "Technology",
      "control": "100 keys"
    },
    {
      "id": "DEMO-FORECAST",
      "description": "Forecast candidate",
      "status": "Awaiting review",
      "owner": "Planning",
      "control": "10% WAPE"
    },
    {
      "id": "DEMO-BENEFIT",
      "description": "Improvement pilot",
      "status": "Draft",
      "owner": "Owner",
      "control": "Baseline pending"
    }
  ],
  "Finance Supplement": [
    {
      "id": "SIM-001",
      "description": "Linked simulation scenario",
      "status": "SIMULATION",
      "owner": "Finance",
      "control": "Zero live effect"
    },
    {
      "id": "DEMO-LEGACY",
      "description": "Historical import batch",
      "status": "Validation",
      "owner": "Finance",
      "control": "Archive only"
    },
    {
      "id": "DEMO-OPEN",
      "description": "Opening-item reconciliation",
      "status": "Pending",
      "owner": "Controller",
      "control": "Cutoff controlled"
    },
    {
      "id": "DEMO-ADJ",
      "description": "Supported finance adjustment",
      "status": "Draft",
      "owner": "Finance",
      "control": "Evidence required"
    }
  ]
};
