import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import '../styles/TaskDetail.css';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [deletingIds, setDeletingIds] = useState(new Set());

  async function load() {
    try {
      const res = await api.get('/task', { params: { id } });
      setTask(res.data);
      const cRes = await api.get(`/comment/${id}/comments`);
      setComments(cRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function submitComment(e) {
    e.preventDefault();
    if (!commentContent.trim()) return;
    try {
      await api.post('/comment/create', { content: commentContent, author: 'Me', taskId: id });
      setCommentContent('');
      await load();
    } catch (err) {
      alert('Failed to add comment');
    }
  }

  async function toggleStatus() {
    if (!task) return;
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.post('/task/update', { id: task.id, status: newStatus });
      await load();
    } catch (err) {
      alert('Failed to update status');
    }
  }

  async function deleteComment(commentId) {
    if (!commentId) return;
    if (!window.confirm('Delete this comment? This action cannot be undone.')) return;

    setDeletingIds(prev => {
      const next = new Set(prev);
      next.add(commentId);
      return next;
    });

    try {
      await api.delete('/comment', { data: { id: commentId } });
      await load();
    } catch (err) {
      console.error('Failed to delete comment', err);
      alert(err?.response?.data?.error || err.message || 'Failed to delete comment');
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  }

  if (!task) return <div className="card">Loading task...</div>;

  return (
    <div className="card">
      <h2>{task.title}</h2>
      <div className="small">Priority: {task.priority} | Due: {task.due_date} | Status: {task.status}</div>
      <p>{task.description}</p>

      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={toggleStatus}>
          Mark as {task.status === 'COMPLETED' ? 'Pending' : 'Completed'}
        </button>
      </div>

      <hr />
      <h3>Comments</h3>
      <form onSubmit={submitComment}>
        <textarea
          value={commentContent}
          onChange={e => setCommentContent(e.target.value)}
          placeholder="Add a comment"
          className="input"
        />
        <button className="btn" type="submit">Add comment</button>
      </form>

      <div style={{ marginTop: 12 }}>
        {comments.length === 0 ? (
          <div className="small">No comments</div>
        ) : (
          comments.map(c => (
            <div key={c.id} style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600 }}>
                  {c.author} <span className="small"> — {new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <div>{c.content}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <button
                  className="btn secondary"
                  onClick={() => { navigator.clipboard?.writeText(c.content || '').catch(()=>{}); alert('Comment copied'); }}
                  type="button"
                >
                  Copy
                </button>

                <button
                  className="btn danger"
                  onClick={() => deleteComment(c.id)}
                  disabled={deletingIds.has(c.id)}
                  aria-disabled={deletingIds.has(c.id)}
                  type="button"
                >
                  {deletingIds.has(c.id) ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}