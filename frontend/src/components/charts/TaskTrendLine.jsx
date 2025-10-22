import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import ChartJS from './ChartSetup';

function toMonthKey(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
}

export default function TaskTrendLine({ tasks = [], months = 6 }) {
  const { labels, countsCompleted, countsCreated } = useMemo(() => {

    const map = new Map();

    tasks.forEach((t) => {
      let key = 'Unknown';
      if (t.due_date) {
        const d = new Date(t.due_date);
        if (!isNaN(d)) key = toMonthKey(d);
      }
      if (!map.has(key)) map.set(key, { total: 0, completed: 0 });
      const entry = map.get(key);
      entry.total += 1;
      if (t.status === 'COMPLETED') entry.completed += 1;
    });

    const monthKeys = [...map.keys()].filter((k) => k !== 'Unknown').sort();
    const unknownIncluded = map.has('Unknown') ? ['Unknown'] : [];

    let labels = monthKeys;
    if (monthKeys.length > months) {
      labels = monthKeys.slice(-months);
    }

    labels = [...labels, ...unknownIncluded];

    const countsCreated = labels.map((k) => map.get(k)?.total || 0);
    const countsCompleted = labels.map((k) => map.get(k)?.completed || 0);

    return { labels, countsCompleted, countsCreated };
  }, [tasks, months]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Created (by due month)',
        data: countsCreated,
        borderColor: '#2b6cb0',
        backgroundColor: 'rgba(43,108,176,0.08)',
        tension: 0.25,
        fill: true,
      },
      {
        label: 'Completed',
        data: countsCompleted,
        borderColor: '#48bb78',
        backgroundColor: 'rgba(72,187,120,0.08)',
        tension: 0.25,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="card" style={{ minHeight: 260 }}>
      <h3>Task trends</h3>
      <div style={{ height: 220 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}