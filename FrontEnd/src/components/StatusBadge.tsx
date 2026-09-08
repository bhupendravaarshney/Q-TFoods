export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const tone =
    key.includes('held') || key.includes('validation') ? 'bad' :
    key.includes('approved') || key.includes('released') || key.includes('recorded') || key.includes('current') || key.includes('posted') ? 'ok' :
    key.includes('pending') || key.includes('review') || key.includes('progress') || key.includes('preview') || key.includes('provisional') ? 'warn' :
    'info';

  return <span className={`status status-${tone}`}>{status}</span>;
}
