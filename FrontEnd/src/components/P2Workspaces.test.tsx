import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErpSessionContext } from '../app/ErpSessionContext';
import type { ErpSession } from '../types/session';
import { CommercialP2Workspace, commercialP2Configs, type CommercialP2Code } from './CommercialP2Workspaces';
import { FinanceArchiveWorkspace } from './FinanceArchiveWorkspace';
import { FinanceP2Workspace, PayablesIntegrationWorkspace, financeP2Configs, type FinanceP2Code } from './FinanceP2Workspaces';

const api = vi.hoisted(() => ({ listP2: vi.fn(), getP2: vi.fn(), commandP2: vi.fn(), uploadP2: vi.fn(), downloadP2: vi.fn() }));
vi.mock('../api/p2Operations', () => api);

describe('P2 commercial and finance workspaces', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    api.listP2.mockResolvedValue(emptyWorkspace());
    api.commandP2.mockResolvedValue({ id: 'result-1', status: 'POSTED', record_version: 2 });
    api.uploadP2.mockResolvedValue({ id: 'document-1', status: 'ARCHIVED', record_version: 1 });
  });

  it('renders every P2 screen from live workspace configuration with no prototype surface', async () => {
    for (const code of Object.keys(commercialP2Configs) as CommercialP2Code[]) {
      const view = renderPage(<CommercialP2Workspace screen={code} />);
      expect(await screen.findByRole('heading', { level: 1, name: commercialP2Configs[code].title })).toBeInTheDocument();
      expect(screen.queryByText(/prototype action only/i)).not.toBeInTheDocument();
      view.unmount();
    }
    for (const code of Object.keys(financeP2Configs) as FinanceP2Code[]) {
      const view = renderPage(<FinanceP2Workspace screen={code} />);
      expect(await screen.findByRole('heading', { level: 1, name: financeP2Configs[code].title })).toBeInTheDocument();
      expect(screen.queryByText(/prototype action only/i)).not.toBeInTheDocument();
      view.unmount();
    }
    const payables = renderPage(<PayablesIntegrationWorkspace />);
    expect(await screen.findByRole('heading', { level: 1, name: 'Payables Bank & Statutory Integrations' })).toBeInTheDocument();
    payables.unmount();
    expect(api.listP2).toHaveBeenCalledTimes(22);
  });

  it('executes a record action with its optimistic version and reloads detail', async () => {
    const user = userEvent.setup();
    const lead = { id: 'lead-1', lead_number: 'LEAD-UI-001', company_name: 'North Market', contact_name: 'Commercial Desk', enquiry_date: '2026-09-13', estimated_value: '25000', status: 'NEW', record_version: 1, allowed_actions: ['QUALIFY'] };
    api.listP2.mockResolvedValue({ ...emptyWorkspace(), data: [lead] });
    api.getP2.mockResolvedValue(lead);
    renderPage(<CommercialP2Workspace screen="CRM-LEAD" />);
    await user.click(await screen.findByRole('button', { name: 'Open' }));
    await user.click(await screen.findByRole('button', { name: 'Qualify' }));
    await waitFor(() => expect(api.commandP2).toHaveBeenCalledWith('/api/v1/sales/leads/lead-1/qualify', {}, 1));
    expect(await screen.findByText('Lead qualified.')).toBeInTheDocument();
  });

  it('creates an allocation from a live eligible order and forwards its source version', async () => {
    const user = userEvent.setup();
    api.listP2.mockResolvedValue({ ...emptyWorkspace(), lookups: { orders: [{ id: 'order-1', order_number: 'SO-UI-001', record_version: 7 }] }, allowed_actions: ['ALLOCATE'] });
    renderPage(<CommercialP2Workspace screen="DSP-PICK" />);
    await user.click(await screen.findByRole('button', { name: '+ New' }));
    await user.click(screen.getByRole('button', { name: 'Submit command' }));
    await waitFor(() => expect(api.commandP2).toHaveBeenCalledWith('/api/v1/dispatch/orders/order-1/allocations', expect.objectContaining({ allocation_number: expect.stringMatching(/^ALLOC-/) }), 7));
  });

  it('uploads an archive document as multipart private evidence', async () => {
    const user = userEvent.setup();
    api.listP2.mockResolvedValue({ ...emptyWorkspace(), summary: { count: 0, size_bytes: 0 }, lookups: { document_types: ['SUPPLIER_INVOICE'] }, allowed_actions: ['UPLOAD'] });
    renderPage(<FinanceArchiveWorkspace />);
    await user.click(await screen.findByRole('button', { name: '+ New' }));
    const file = new File(['%PDF-1.4 private bill'], 'supplier-bill.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText('Archive private document'), file);
    await user.click(screen.getByRole('button', { name: 'Upload privately' }));
    await waitFor(() => expect(api.uploadP2).toHaveBeenCalledTimes(1));
    const body = api.uploadP2.mock.calls[0][1] as FormData;
    expect(api.uploadP2.mock.calls[0][0]).toBe('/api/v1/finance/archive');
    expect(body.get('file')).toBe(file);
    expect(body.get('document_type')).toBe('SUPPLIER_INVOICE');
    expect(await screen.findByText(/Document archived with verified private metadata/)).toBeInTheDocument();
  });
});

function renderPage(node: React.ReactNode) { return render(<ErpSessionContext.Provider value={session()}>{node}</ErpSessionContext.Provider>); }
function emptyWorkspace() { return { data: [], meta: { total: 0 }, summary: { count: 0 }, lookups: {}, allowed_actions: [] }; }
function session(): ErpSession { return { user: { id: 'user-1', name: 'ERP Administrator', email: 'admin@example.com' }, roles: ['ERP_ADMIN'], allowed_screens: [], allowed_actions: [], contexts: [], selected_context: { company_id: 'company-1', company_name: 'Q & T Foods', plant_id: 'plant-1', plant_name: 'Training Plant' } }; }
