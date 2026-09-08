export function KpiCards({ code, batch }: { code: string; batch: string }) {
  return (
    <div className="kpi-grid">
      <div className="kpi"><span>Open</span><b>{3 + (code.length % 5)}</b><small>current demo scope</small></div>
      <div className="kpi"><span>Pending review</span><b>{1 + (code.length % 4)}</b><small>exact source version</small></div>
      <div className="kpi"><span>Exceptions</span><b>{code.charCodeAt(0) % 3}</b><small>held / stale / invalid</small></div>
      <div className="kpi"><span>Control batch</span><b className="compact">{batch}</b><small>{code}</small></div>
    </div>
  );
}
