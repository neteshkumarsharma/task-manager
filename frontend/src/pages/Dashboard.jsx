import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    deferred: 0,
  });
  const [recent, setRecent] = useState([]);

  async function loadStats() {
    try {
      const res = await api.get('/task/get-all-tasks', { params: { page: 1, limit: 1000 } });
      const tasks = res.data.tasks || [];
      const total = res.data.totalTasks || tasks.length;
      const completed = tasks.filter(t => t.status === 'COMPLETED').length;
      const pending = tasks.filter(t => t.status === 'PENDING').length;
      const deferred = tasks.filter(t => t.status === 'DEFERRED').length;
      setStats({ total, completed, pending, deferred });
      setRecent(tasks.slice(0, 6));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <>
      <h2>Overview</h2>
      <div className="grid" style={{ marginBottom: 12 }}>
        <div className="card">
          <h3>Total tasks</h3>
          <div style={{ fontSize: 28 }}>{stats.total}</div>
        </div>
        <div className="card">
          <h3>Completed</h3>
          <div style={{ fontSize: 28, color: 'green' }}>{stats.completed}</div>
        </div>
        <div className="card">
          <h3>Pending</h3>
          <div style={{ fontSize: 28, color: 'orange' }}>{stats.pending}</div>
        </div>
        <div className="card">
          <h3>Deferred</h3>
          <div style={{ fontSize: 28, color: 'yellow' }}>{stats.deferred}</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3>Recent tasks</h3>
          <Link to="/tasks/new" className="btn">New Task</Link>
        </div>
        {recent.length === 0 ? <p className="small">No tasks yet</p> : (
          recent.map(t => (
            <div key={t.id} className="task-row">
              <div>
                <strong>{t.title}</strong>
                <div className="small">{t.description}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="small">{t.status}</div>
                <Link to={`/tasks/${t.id}`} className="small">View</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}