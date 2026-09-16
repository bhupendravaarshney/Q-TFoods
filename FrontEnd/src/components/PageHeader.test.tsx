import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('presents business wording without internal screen or delivery codes', () => {
    render(<PageHeader code="FIN-GL" batch="P2 operational" title="General ledger" description="Review journals and accounting periods." />);

    expect(screen.getByRole('heading', { name: 'General ledger' })).toBeVisible();
    expect(screen.getByText('Review journals and accounting periods.')).toBeVisible();
    expect(screen.queryByText(/FIN-GL|P2 operational/)).not.toBeInTheDocument();
  });

  it('reveals the entry panel after New is selected in a compact layout', async () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('max-width'),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    function Harness() {
      const [open, setOpen] = useState(false);

      return <main id="erp-main-content">
        <PageHeader code="PUR-REQ" batch="P1" title="Purchase requisitions" description="Create governed requests." onNew={() => setOpen(true)} />
        {open && <aside className="requisition-editor" ref={(element) => {
          if (element) Object.defineProperty(element, 'scrollIntoView', { configurable: true, value: scrollIntoView });
        }}>New requisition form</aside>}
      </main>;
    }

    render(<Harness />);
    await userEvent.setup().click(screen.getByRole('button', { name: '+ New' }));

    expect(screen.getByText('New requisition form')).toBeVisible();
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' }));
  });
});
