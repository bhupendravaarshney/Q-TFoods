export function ScreenContract() {
  return (
    <aside className="panel focus-card">
      <div className="eyebrow">SCREEN CONTRACT</div>
      <h3>Trusted-service rules</h3>
      <p>
        The page assists workflow presentation. The backend must re-check current actor,
        company/plant/party scope, state/version, independent authority and applicable
        stock/Quality/period rules at commit.
      </p>
      <ul>
        <li>Action + scope + state + authority.</li>
        <li>Loading, empty, invalid, denied, held, stale and recovery states.</li>
        <li>Explicit UOM, currency and time context where relevant.</li>
        <li>Idempotency keys for retriable posting commands.</li>
        <li>Audit + evidence + outbox lineage.</li>
      </ul>
      <div className="callout">
        A successful screen save is not proof of an external financial or provider acknowledgement.
      </div>
    </aside>
  );
}
