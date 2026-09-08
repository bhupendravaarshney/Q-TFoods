import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErpSessionContext } from '../app/ErpSessionContext';
import {
  CASE_ID,
  makeEvidenceUploadResult,
  makeSession,
  makeUnsoldReturnDetail,
  makeUnsoldReturnLookups,
} from '../test/unsoldReturnFixtures';
import { UnsoldReturnCasePanel } from './UnsoldReturnCasePanel';

const apiMocks = vi.hoisted(() => ({
  getUnsoldReturn: vi.fn(),
  getUnsoldReturnLookups: vi.fn(),
  uploadUnsoldReturnEvidence: vi.fn(),
  downloadUnsoldReturnEvidence: vi.fn(),
}));

vi.mock('../api/unsoldReturns', async () => {
  const actual = await vi.importActual<typeof import('../api/unsoldReturns')>(
    '../api/unsoldReturns'
  );

  return {
    ...actual,
    ...apiMocks,
  };
});

describe('UnsoldReturnCasePanel', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    apiMocks.getUnsoldReturn.mockResolvedValue(makeUnsoldReturnDetail());
    apiMocks.getUnsoldReturnLookups.mockResolvedValue(makeUnsoldReturnLookups());
    apiMocks.uploadUnsoldReturnEvidence.mockResolvedValue(makeEvidenceUploadResult());
  });

  it('shows retained evidence and uploads a versioned audit attachment', async () => {
    const user = userEvent.setup();
    const onChanged = vi.fn();

    render(
      <ErpSessionContext.Provider
        value={makeSession(['ACTION:RET-UNSOLD:EVIDENCE'])}
      >
        <UnsoldReturnCasePanel
          caseId={CASE_ID}
          refreshToken={0}
          onClose={vi.fn()}
          onChanged={onChanged}
        />
      </ErpSessionContext.Provider>
    );

    await screen.findByRole('heading', { name: /RET-11111111/ });
    expect(screen.getByText('distributor-confirmation.txt')).toBeInTheDocument();
    expect(screen.getByText(/SHA-256 9f86d081884c/)).toBeInTheDocument();
    expect(screen.getByText('UNSOLD_RETURN_7Y')).toBeInTheDocument();

    const file = new File(['quality hand-off note'], 'quality-note.txt', {
      type: 'text/plain',
    });
    await user.selectOptions(screen.getByLabelText('Evidence category'), 'QUALITY_REPORT');
    await user.upload(screen.getByLabelText('File'), file);
    await user.type(screen.getByLabelText('Evidence note'), 'QA hand-off');
    await user.click(screen.getByRole('button', { name: 'Attach evidence' }));

    await waitFor(() => {
      expect(apiMocks.uploadUnsoldReturnEvidence).toHaveBeenCalledWith(
        CASE_ID,
        {
          category: 'QUALITY_REPORT',
          file,
          notes: 'QA hand-off',
        },
        4,
        expect.any(String)
      );
    });
    expect(onChanged).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent(
      /quality-note\.txt attached and retained through/
    );
  });

  it('keeps evidence mutation unavailable without the evidence permission', async () => {
    render(
      <ErpSessionContext.Provider value={makeSession([])}>
        <UnsoldReturnCasePanel
          caseId={CASE_ID}
          refreshToken={0}
          onClose={vi.fn()}
          onChanged={vi.fn()}
        />
      </ErpSessionContext.Provider>
    );

    await screen.findByRole('heading', { name: /RET-11111111/ });
    expect(
      screen.queryByRole('button', { name: 'Attach evidence' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download' })).toBeDisabled();
  });
});
