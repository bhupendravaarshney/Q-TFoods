import { randomUUID } from 'node:crypto';
import { expect, test, type Page } from '@playwright/test';

const CUSTOMER = '00000000-0000-4000-8000-000000000501';
const ITEM = '00000000-0000-4000-8000-000000000601';
const CONTRACT = '00000000-0000-4000-8000-000000002501';
const EXPENSE_ACCOUNT = '00000000-0000-4000-8000-000000002013';
const REVENUE_ACCOUNT = '00000000-0000-4000-8000-000000002011';

test('P2 runs order-to-cash, finance simulation, private archive, and diagnostics through live workspaces', async ({ page }) => {
  test.setTimeout(420_000);
  await loginAndSelect(page, 'demo.user@qtfoods.local');

  await openP2Module(page, 'CRM-LEAD', 'Leads & Enquiries');
  await page.getByRole('button', { name: '+ New', exact: true }).click();
  await submitJson(page, 'New lead', {
    lead_number: 'E2E-P2-LEAD-001',
    customer_party_id: CUSTOMER,
    company_name: 'North Market Distributor',
    contact_name: 'P2 Browser Desk',
    contact_email: 'p2-browser@north-market.example',
    contact_phone: null,
    source: 'DIRECT',
    enquiry_date: '2026-09-14',
    expected_close_date: '2026-09-24',
    estimated_value: '25000',
    notes: 'Playwright P2 commercial journey.',
  });
  await expect(page.getByRole('status')).toContainText('New lead completed (NEW)');
  await searchAndOpen(page, 'Leads & Enquiries', 'E2E-P2-LEAD-001');
  await page.getByRole('button', { name: 'Qualify', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Lead qualified');
  await page.getByRole('button', { name: 'Convert', exact: true }).click();
  await submitJson(page, 'Convert lead', { customer_party_id: CUSTOMER });
  await expect(page.getByRole('status')).toContainText('Convert lead completed (CONVERTED)');
  const lead = first(await apiGet<P2List>(page, '/api/v1/sales/leads?q=E2E-P2-LEAD-001'));

  await openP2Module(page, 'CRM-ORDER', 'Sales Orders');
  await page.getByRole('button', { name: '+ New', exact: true }).click();
  await submitJson(page, 'New sales order', {
    order_number: 'E2E-P2-SO-001',
    customer_party_id: CUSTOMER,
    sales_lead_id: lead.id,
    sales_contract_id: CONTRACT,
    sales_price_list_id: null,
    order_date: '2026-09-14',
    requested_delivery_date: '2026-09-18',
    notes: 'Contract-backed browser order.',
    lines: [{ item_id: ITEM, uom_code: 'PACK', quantity: '2', discount_percent: '0' }],
  });
  await expect(page.getByRole('status')).toContainText('New sales order completed (DRAFT)');
  await searchAndOpen(page, 'Sales Orders', 'E2E-P2-SO-001');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Sales order confirmed');
  const order = first(await apiGet<P2List>(page, '/api/v1/sales/orders?q=E2E-P2-SO-001'));

  const allocation = await apiPost<P2Command>(page, `/api/v1/dispatch/orders/${order.id}/allocations`, {
    allocation_number: 'E2E-P2-ALLOC-001',
  }, Number(order.record_version));
  await apiPost(page, `/api/v1/dispatch/allocations/${allocation.data.id}/pick`, {}, 1);
  const shipment = await apiPost<P2Command>(page, '/api/v1/dispatch/shipments', {
    shipment_number: 'E2E-P2-SHP-001',
    sales_allocation_id: allocation.data.id,
    carrier_name: 'Q&T Contract Logistics',
    vehicle_number: 'MH01E2E2001',
    driver_name: 'P2 Browser Driver',
    notes: 'Sealed browser-test load.',
  });
  await apiPost(page, `/api/v1/dispatch/shipments/${shipment.data.id}/load`, {}, 1);
  const dispatched = await apiPost<P2Command>(page, `/api/v1/dispatch/shipments/${shipment.data.id}/dispatch`, {
    invoice_number: 'E2E-P2-INV-001',
  }, 2);
  const shipmentDetail = await apiGet<{ data: { lines: Array<{ id: string }> } }>(page, `/api/v1/dispatch/shipments/${shipment.data.id}`);
  await apiPost(page, `/api/v1/dispatch/shipments/${shipment.data.id}/pod`, {
    proof_number: 'E2E-P2-POD-001',
    outcome: 'DELIVERED',
    receiver_name: 'North Market Receiving',
    event_at: '2026-09-14T12:00:00Z',
    failure_reason: null,
    notes: 'Delivery accepted.',
  }, 3);
  const claim = await apiPost<P2Command>(page, '/api/v1/sales/customer-claims', {
    claim_number: 'E2E-P2-CLM-001',
    shipment_id: shipment.data.id,
    claim_type: 'DAMAGE',
    requested_resolution: 'CREDIT',
    reason: 'One delivered pack had transit damage.',
    lines: [{ shipment_line_id: shipmentDetail.data.lines[0]!.id, quantity: '1' }],
  });
  await apiPost(page, `/api/v1/sales/customer-claims/${claim.data.id}/resolve`, {
    resolution_type: 'CREDIT',
    credit_amount: '118',
    notes: 'Commercial credit approved from the governed claim.',
  }, 1);
  const receivable = await apiGet<{ data: { outstanding_amount: string | number } }>(page, `/api/v1/finance/receivables/${dispatched.data.invoice_id}`);
  const outstanding = String(receivable.data.outstanding_amount);
  await apiPost(page, '/api/v1/finance/receivables/collections', {
    receipt_number: 'E2E-P2-RCPT-001',
    customer_party_id: CUSTOMER,
    receipt_date: '2026-09-14',
    payment_method: 'BANK',
    bank_reference: 'E2E-P2-BANK-001',
    total_amount: outstanding,
    allocations: [{ invoice_id: dispatched.data.invoice_id, amount: outstanding }],
  });

  const commercialScreens: Array<[string, string]> = [
    ['CRM-LEAD', 'Leads & Enquiries'],
    ['CRM-PRICE', 'Pricing, Credit & Contracts'],
    ['CRM-ORDER', 'Sales Orders'],
    ['CON-WORK', 'Third-party Work'],
    ['DSP-PICK', 'Allocation & Picking'],
    ['DSP-LOAD', 'Loading & Dispatch'],
    ['DSP-POD', 'Proof of Delivery'],
    ['RET-CASE', 'Customer Claims & Returns'],
    ['FIN-AR', 'Receivables & Collections'],
    ['BI-PROFIT', 'Order Profitability'],
  ];
  for (const [code, heading] of commercialScreens) await openP2Module(page, code, heading);
  await page.getByLabel('Order Profitability search').fill('E2E-P2-SO-001');
  await expect(page.locator('.p2-register tbody')).toContainText('E2E-P2-SO-001');

  await logout(page);
  await loginAndSelect(page, 'finance.user@qtfoods.local');

  await openP2Module(page, 'FIN-SIM', 'Finance Simulation');
  await page.getByRole('button', { name: '+ New', exact: true }).click();
  await submitJson(page, 'New simulation', {
    simulation_number: 'E2E-P2-SIM-001',
    name: 'P2 browser margin scenario',
    description: 'An isolated browser-entered finance scenario.',
    as_of_date: '2026-09-14',
    lines: [
      { account_id: REVENUE_ACCOUNT, description: 'Projected revenue', debit_amount: '0', credit_amount: '1000', assumption: 'Contract sales delivered.' },
      { account_id: EXPENSE_ACCOUNT, description: 'Projected expense', debit_amount: '200', credit_amount: '0', assumption: 'Incremental selling cost.' },
    ],
  });
  await expect(page.getByRole('status')).toContainText('New simulation completed (DRAFT)');
  await searchAndOpen(page, 'Finance Simulation', 'E2E-P2-SIM-001');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Simulation run completed with no ledger effect');

  await openP2Module(page, 'FIN-ARCH', 'Private Bill Archive');
  await page.getByRole('button', { name: '+ New', exact: true }).click();
  await page.getByLabel('Archive document number').fill('E2E-P2-DOC-001');
  await page.getByLabel('Archive document date').fill('2026-09-14');
  await page.getByLabel('Archive retain until').fill('2033-09-14');
  await page.getByLabel('Notes').fill('Private P2 archive browser evidence.');
  await page.getByLabel('Archive private document').setInputFiles({
    name: 'e2e-p2-private-bill.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 P2 browser private bill'),
  });
  await page.getByRole('button', { name: 'Upload privately' }).click();
  await expect(page.getByRole('status')).toContainText('Document archived with verified private metadata (ARCHIVED)');
  await page.getByLabel('Archive search').fill('E2E-P2-DOC-001');
  await openRow(page, 'E2E-P2-DOC-001');
  await expect(page.locator('.p2-checksum')).toHaveText(/^[a-f0-9]{64}$/);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download private document' }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('e2e-p2-private-bill.pdf');

  await openP2Module(page, 'FIN-SUP', 'Finance Support & Diagnostics');
  await page.getByRole('button', { name: '+ New', exact: true }).click();
  await submitJson(page, 'New support & diagnostics', {
    case_number: 'E2E-P2-FS-001',
    category: 'RECONCILIATION',
    severity: 'HIGH',
    subject: 'P2 browser diagnostic request',
    description: 'Capture finance counters without mutating ledger records.',
  });
  await expect(page.getByRole('status')).toContainText('New support & diagnostics completed (OPEN)');
  await searchAndOpen(page, 'Finance Support & Diagnostics', 'E2E-P2-FS-001');
  await page.getByRole('button', { name: 'Diagnose', exact: true }).click();
  await submitJson(page, 'Capture diagnostic snapshot', { notes: 'Browser verification captured the immutable counters.' });
  await expect(page.getByRole('status')).toContainText('Capture diagnostic snapshot completed (DIAGNOSED)');
  await searchAndOpen(page, 'Finance Support & Diagnostics', 'E2E-P2-FS-001');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await submitJson(page, 'Close finance support case', { resolution_notes: 'P2 browser diagnostics verified.' });
  await expect(page.getByRole('status')).toContainText('Close finance support case completed (CLOSED)');

  const financeScreens: Array<[string, string]> = [
    ['FIN-EXP', 'Employee Expenses'],
    ['FIN-GL', 'General Ledger & Period Close'],
    ['COST-OH', 'Overhead Allocation'],
    ['ASSET-REG', 'Fixed Asset Register'],
    ['HR-PAY', 'Payroll Posting'],
    ['ENG-MNT', 'Maintenance Accounting'],
    ['FIN-SIM', 'Finance Simulation'],
    ['FIN-ADJ', 'Finance Adjustments'],
    ['FIN-LEGACY', 'Historical Import'],
    ['FIN-ARCH', 'Private Bill Archive'],
    ['FIN-OPEN', 'Opening Balance Reconciliation'],
    ['FIN-SUP', 'Finance Support & Diagnostics'],
  ];
  for (const [code, heading] of financeScreens) await openP2Module(page, code, heading);

  await openModule(page, 'FIN-AP', 'Accounts Payable');
  await page.getByRole('button', { name: 'Bank & statutory integrations' }).click();
  await expect(page.getByRole('heading', { name: 'Payables Bank & Statutory Integrations' })).toBeVisible();
  await expect(page.locator('.p2-live-notice')).toBeVisible();
  await expect(page.getByText('PROTOTYPE / DEMO DATA')).toHaveCount(0);
});

type P2List = { data: Array<{ id: string; record_version?: number }> };
type P2Command = { data: { id: string; record_version: number; invoice_id?: string } };

function first(result: P2List) {
  const record = result.data[0];
  if (!record) throw new Error('Expected the P2 register to contain a matching record.');
  return record;
}

async function openP2Module(page: Page, code: string, heading: string): Promise<void> {
  await openModule(page, code, heading);
  await expect(page.locator('.p2-live-notice')).toBeVisible();
  await expect(page.getByText('PROTOTYPE / DEMO DATA')).toHaveCount(0);
}

async function openModule(page: Page, code: string, heading: string): Promise<void> {
  const navigation = page.getByRole('navigation', { name: 'Main menu' });
  await navigation.getByRole('button', { name: new RegExp(code) }).click();
  await expect(page.getByRole('heading', { name: heading })).toBeVisible();
}

async function submitJson(page: Page, label: string, body: unknown): Promise<void> {
  await page.getByLabel(`${label} command payload`).fill(JSON.stringify(body, null, 2));
  await page.getByRole('button', { name: 'Submit command' }).click();
}

async function searchAndOpen(page: Page, title: string, text: string): Promise<void> {
  await page.getByLabel(`${title} search`).fill(text);
  await openRow(page, text);
}

async function openRow(page: Page, text: string): Promise<void> {
  const row = page.locator('.requisition-table tbody tr').filter({ hasText: text });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'Open' }).click();
}

async function apiGet<T>(page: Page, path: string): Promise<T> {
  const result = await page.evaluate(async (requestPath) => {
    const response = await fetch(requestPath, { credentials: 'include', headers: { Accept: 'application/json' } });
    return { ok: response.ok, status: response.status, body: await response.json() };
  }, path);
  if (!result.ok) throw new Error(`GET ${path} failed (${result.status}): ${JSON.stringify(result.body)}`);
  return result.body as T;
}

async function apiPost<T = unknown>(page: Page, path: string, body: unknown, version?: number): Promise<T> {
  const csrf = await apiGet<{ data: { csrf_token: string } }>(page, '/api/v1/auth/csrf');
  const result = await page.evaluate(async ({ requestPath, payload, token, idempotencyKey, expectedVersion }) => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token,
      'Idempotency-Key': idempotencyKey,
    };
    if (expectedVersion !== undefined) headers['If-Match'] = String(expectedVersion);
    const response = await fetch(requestPath, {
      method: 'POST', credentials: 'include', headers, body: JSON.stringify(payload),
    });
    return { ok: response.ok, status: response.status, body: await response.json() };
  }, { requestPath: path, payload: body, token: csrf.data.csrf_token, idempotencyKey: randomUUID(), expectedVersion: version });
  if (!result.ok) throw new Error(`POST ${path} failed (${result.status}): ${JSON.stringify(result.body)}`);
  return result.body as T;
}

async function loginAndSelect(page: Page, email: string): Promise<void> {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('prototype');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: /Training Plant/ }).click();
}

async function logout(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
}
