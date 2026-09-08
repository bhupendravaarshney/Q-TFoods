import type { ScreenDefinition } from '../types/screen';
import { demoRows } from '../data/demoRows';
import { DemoNotice } from './DemoNotice';
import { KpiCards } from './KpiCards';
import { PageHeader } from './PageHeader';
import { ScreenContract } from './ScreenContract';
import { StatusBadge } from './StatusBadge';

export function ModulePage({ screen }: { screen: ScreenDefinition }) {
  const rows = demoRows[screen.area] ?? demoRows['Foundation / Admin'];

  return (
    <>
      <PageHeader
        code={screen.code}
        batch={screen.batch}
        title={screen.title}
        description={screen.description}
        onNew={() => alert('Prototype action only.')}
      />
      <DemoNotice />
      <KpiCards code={screen.code} batch={screen.batch} />

      <div className="module-grid">
        <section className="panel">
          <div className="toolbar">
            <input placeholder="Search ID, source, owner, status" />
            <select defaultValue="all">
              <option value="all">All statuses</option>
              <option value="active">Active / approved</option>
              <option value="pending">Pending / review</option>
              <option value="held">Held / exception</option>
            </select>
            <button className="secondary">Filters</button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Record</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Control</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id}>
                    <td>
                      <span className="link">{row.id}</span>
                      <small>v{index + 1}.0 · demo</small>
                    </td>
                    <td>
                      <b>{row.description}</b>
                      <small>{screen.title}</small>
                    </td>
                    <td><StatusBadge status={row.status} /></td>
                    <td>{row.owner}</td>
                    <td>{row.control}</td>
                    <td><button className="secondary">Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ScreenContract />
      </div>
    </>
  );
}
