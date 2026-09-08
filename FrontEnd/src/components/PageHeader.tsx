export function PageHeader({
  code,
  batch,
  title,
  description,
  onNew,
  onHistory,
  onExport,
}: {
  code: string;
  batch: string;
  title: string;
  description: string;
  onNew?: () => void;
  onHistory?: () => void;
  onExport?: () => void;
}) {
  return (
    <div className="page-head">
      <div>
        <div className="crumb">{code} · {batch}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {(onHistory || onExport || onNew) && (
        <div className="head-actions">
          {onHistory && <button className="secondary" onClick={onHistory}>History</button>}
          {onExport && <button className="secondary" onClick={onExport}>Export</button>}
          {onNew && <button className="primary" onClick={onNew}>+ New</button>}
        </div>
      )}
    </div>
  );
}
