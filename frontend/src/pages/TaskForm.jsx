import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/TaskForm.css';

export default function TaskForm({ isEdit }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'PENDING',
    priority: 'MEDIUM',
    due_date: '',
    tags: '',
    assigned_to: ''
  });

  useEffect(() => {
    if (isEdit && id) {
      loadTask();
    }
  }, [isEdit, id]);

  async function loadTask() {
    try {
      const res = await api.get('/task', { params: { id } });
      setTask(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.post('/task/update', { id: task.id, status: task.status });
        navigate(`/tasks/${task.id}`);
      } else {
        await api.post('/task/create', task);
        navigate('/tasks');
      }
    } catch (err) {
      alert('Save failed: ' + (err?.response?.data?.message || err.message));
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setTask(s => ({ ...s, [name]: value }));
  }

  return (
    <div className="card form">
      <h2>{isEdit ? 'Edit Task' : 'Create Task'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" className="input" placeholder="Title" value={task.title} onChange={onChange} required />
        <textarea name="description" className="input" placeholder="Description" value={task.description} onChange={onChange} required />
        <select name="priority" className="input" value={task.priority} onChange={onChange}>
          <option>HIGH</option>
          <option>MEDIUM</option>
          <option>LOW</option>
        </select>
        <select name="status" className="input" value={task.status} onChange={onChange}>
          <option>PENDING</option>
          <option>COMPLETED</option>
        </select>
        <input name="due_date" className="input" placeholder="Due date (YYYY-MM-DD)" value={task.due_date} onChange={onChange} />
        <input name="tags" className="input" placeholder="Tags (comma separated)" value={task.tags} onChange={onChange} />
        <input name="assigned_to" className="input" placeholder="Assigned to" value={task.assigned_to} onChange={onChange} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" type="submit">{isEdit ? 'Save' : 'Create'}</button>
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}