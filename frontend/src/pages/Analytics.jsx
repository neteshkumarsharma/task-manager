import React, { useEffect, useState } from 'react';
import api from '../api';
import TaskStatusDonut from '../components/charts/TaskStatusDonut';
import TaskTrendLine from '../components/charts/TaskTrendLine';
import PerformanceMetrics from '../components/charts/PerformanceMetrics';
import '../styles/Analytics.css';

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    setLoading(true);
    try {
      const res = await api.get('/task/get-all-tasks', { params: { page: 1, limit: 1000 } });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Failed load tasks for analytics', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      <h2>Analytics & Reports</h2>
      {loading ? (
        <div className="card">Loading analytics…</div>
      ) : (
        <div className="grid cols-2" style={{ gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <PerformanceMetrics tasks={tasks} />
            <TaskTrendLine tasks={tasks} months={6} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <TaskStatusDonut tasks={tasks} />
            <div className="card">
              <h3>Raw data (sample)</h3>
              <div className="small">
                Showing up to {Math.min(tasks.length, 20)} tasks (most recent from API response).
              </div>
              <div style={{ marginTop: 8 }}>
                {tasks.slice(0, 20).map((t) => (
                  <div key={t.id} className="task-row">
                    <div>
                      <strong>{t.title}</strong>
                      <div className="small">{t.description}</div>
                    </div>
                    <div className="small" style={{ textAlign: 'right' }}>
                      {t.status} • {t.priority} • {t.due_date || '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}