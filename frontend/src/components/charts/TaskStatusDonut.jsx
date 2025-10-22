import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartJS from './ChartSetup';

export default function TaskStatusDonut({ tasks = [] }) {
  const counts = tasks.reduce(
    (acc, t) => {
      const s = t.status || 'PENDING';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    { COMPLETED: 0, PENDING: 0, DEFERRED: 0 }
  );

  const data = {
    labels: ['Completed', 'Pending', 'Deferred'],
    datasets: [
      {
        data: [counts.COMPLETED, counts.PENDING, counts.DEFERRED],
        backgroundColor: ['#48bb78', '#f59e0b', '#6c5ed6ff'],
        hoverBackgroundColor: ['#34d399', '#f97316', '#6c5ed6ff'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="card">
      <h3>Tasks by Status</h3>
      <Doughnut data={data} />
    </div>
  );
}