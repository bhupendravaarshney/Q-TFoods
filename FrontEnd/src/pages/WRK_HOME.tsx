import { useEffect, useState } from 'react';
import { apiRequest, type ApiError } from '../api/client';
import { PageHeader } from '../components/PageHeader';

type WorkTask = {
  id: string;
  title: string;
  priority: string;
  owner: string;
};

export default function WRK_HOME() {
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiRequest<{ data: WorkTask[] }>('/api/v1/work/tasks')
      .then((response) => {
        if (active) setTasks(response.data);
      })
      .catch((caught: ApiError) => {
        if (active) setError(caught.message ?? 'Unable to load the work queue.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <>
      <PageHeader code="WRK-HOME" batch="B04" title="My ERP workspace" description="Your role-authorised queue for the currently selected company and plant." />
      <div className="live-notice"><span></span><b>Connected to ERP services</b> Navigation and API access are enforced by the active role and context.</div>
      <div className="kpi-grid">
        <div className="kpi"><span>Assigned work</span><b>{loading ? '—' : tasks.length}</b><small>current role and plant</small></div>
        <div className="kpi"><span>High priority</span><b>{loading ? '—' : tasks.filter((task) => task.priority === 'HIGH').length}</b><small>requires attention</small></div>
        <div className="kpi"><span>Session scope</span><b className="compact">Active</b><small>server validated</small></div>
        <div className="kpi"><span>Data source</span><b className="compact">Live API</b><small>not the screen catalogue</small></div>
      </div>
      <section className="panel">
        <div className="panel-head"><h3>Priority work</h3><span>Role-aware queue</span></div>
        <div className="panel-body">
          {loading && <div className="empty-state">Loading your work queue…</div>}
          {error && <div className="form-error" role="alert"><span>{error}</span></div>}
          {!loading && !error && tasks.map((task) => (
            <div className="task-row" key={task.id}>
              <div><b>{task.title}</b><small>{task.id} · {task.owner}</small></div>
              <span className={`status ${task.priority === 'HIGH' ? 'status-warn' : 'status-info'}`}>{task.priority}</span>
            </div>
          ))}
          {!loading && !error && !tasks.length && <div className="empty-state">You have no assigned work in this context.</div>}
        </div>
      </section>
    </>
  );
}
