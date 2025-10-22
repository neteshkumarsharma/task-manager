import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartJS from './ChartSetup';

export default function PerformanceMetrics({ tasks = [] }) {
  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    const dates = tasks
      .map((t) => (t.due_date ? new Date(t.due_date) : null))
      .filter((d) => d instanceof Date && !isNaN(d))
      .sort((a, b) => a - b);

    let tasksPerWeek = 0;
    if (dates.length >= 2) {
      const spanMs = dates[dates.length - 1] - dates[0];
      const spanWeeks = Math.max(spanMs / (7 * 24 * 3600 * 1000), 1);
      tasksPerWeek = +(total / spanWeeks).toFixed(1);
    } else {
      tasksPerWeek = +(total).toFixed(1);
    }

    const priorityCounts = tasks.reduce((acc, t) => {
      const p = t.priority || 'MEDIUM';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});

    return { total, completed, completionRate, tasksPerWeek, priorityCounts };
  }, [tasks]);

  const priorities = ['HIGH', 'MEDIUM', 'LOW'];
  const priorityValues = priorities.map((p) => metrics.priorityCounts[p] || 0);

  const barData = {
    labels: priorities,
    datasets: [
      {
        label: 'Tasks',
        data: priorityValues,
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
      },
    ],
  };

  const barOptions = { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } };

  return (
    <div className="card">
      <h3>Performance</h3>
      <div className="grid" style={{ gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 140 }}>
            <div className="small">Total tasks</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{metrics.total}</div>
          </div>
          <div style={{ minWidth: 140 }}>
            <div className="small">Completion rate</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{metrics.completionRate}%</div>
          </div>
          <div style={{ minWidth: 160 }}>
            <div className="small">Avg tasks / week</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{metrics.tasksPerWeek}</div>
          </div>
        </div>

        <div style={{ minHeight: 160 }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}