import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/Tasks.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({ status: '', title: '', sortBy: 'due_date', sortOrder: 'asc' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loadTasks(p = 1) {
    setLoading(true);
    try {
      const params = { page: p, limit, ...filters };
      const res = await api.get('/task/get-all-tasks', { params });
      setTasks(res.data.tasks || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks(1);
  }, [filters]);

  function onSearch(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    setFilters({
      ...filters,
      title: form.get('title') || '',
      status: form.get('status') || ''
    });
  }

  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete('/task/delete', { data: { id } });
      loadTasks(page);
    } catch (err) {
      alert('Delete failed');
    }
  }

  function goToEdit(t) {
    navigate(`/tasks/${t.id}/edit`);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2>Tasks</h2>
        <Link to="/tasks/new" className="btn">Create Task</Link>
      </div>

      <div className="card">
        <form onSubmit={onSearch} className="filters">
          <input name="title" placeholder="Search by title" className="input" style={{ maxWidth: 240 }} />
          <select name="status" className="input" style={{ maxWidth: 160 }}>
            <option value="">All statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>  
            <option value="DEFERRED">DEFERRED</option>
          </select>
          <button className="btn" type="submit">Apply</button>
        </form>

        {loading ? <div>Loading...</div> : (
          tasks.length === 0 ? <div className="small">No tasks</div> :
            tasks.map(t => (
              <div key={t.id} className="task-row">
                <div>
                  <strong>{t.title}</strong> <span className="small">({t.priority})</span>
                  <div className="small">{t.description}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="small">{t.status}</div>
                  <div style={{ marginTop: 6 }}>
                    <Link to={`/tasks/${t.id}`} style={{ marginRight: 8 }}>View</Link>
                    <button onClick={() => goToEdit(t)} className="btn secondary small">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="btn secondary" style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))
        )}

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="btn" disabled={page <= 1} onClick={() => loadTasks(page - 1)}>Prev</button>
          <div style={{ alignSelf: 'center' }}>Page {page} / {totalPages}</div>
          <button className="btn" disabled={page >= totalPages} onClick={() => loadTasks(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}