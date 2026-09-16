export function PageHeader({
  code,
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
  function openNewEntry() {
    onNew?.();

    if (typeof window.matchMedia !== 'function' || !window.matchMedia('(max-width: 1100px)').matches) return;

    window.setTimeout(() => {
      const editor = document.querySelector<HTMLElement>(
        '#erp-main-content .requisition-editor, #erp-main-content .admin-editor, #erp-main-content .inventory-operation-editor'
      );
      if (!editor) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      editor.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }, 0);
  }

  return (
    <div className="page-head" data-screen-code={code}>
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {(onHistory || onExport || onNew) && (
        <div className="head-actions">
          {onHistory && <button className="secondary" type="button" onClick={onHistory}>History</button>}
          {onExport && <button className="secondary" type="button" onClick={onExport}>Export</button>}
          {onNew && <button className="primary" type="button" onClick={openNewEntry}>+ New</button>}
        </div>
      )}
    </div>
  );
}
