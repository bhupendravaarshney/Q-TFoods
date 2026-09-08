export function DemoNotice({ message }: { message?: string }) {
  return (
    <div className="demo-notice">
      <b>PROTOTYPE / DEMO DATA</b>
      <span>{message ?? 'No live ERP, accounting, bank, tax, payroll or production posting is connected.'}</span>
    </div>
  );
}
