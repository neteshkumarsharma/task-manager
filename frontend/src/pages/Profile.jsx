import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import '../styles/Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.get('/user/currentuser');
        if (mounted) {
          setProfile(res.data || null);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  function initials(name, fallback) {
    const parts = (name || fallback || '').trim().split(/\s+/);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  if (loading) return <div className="card profile-card">Loading profile...</div>;
  if (!profile) return <div className="card profile-card">No profile found.</div>;

  const joined = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : null;
  const displayName = profile.name || profile.username || 'Unknown';
  const handle = profile.username ? `@${profile.username}` : '';

  return (
    <div className="card profile-card" role="region" aria-label="User profile">
      <header className="profile-header">
        <div className="avatar-wrapper">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={`${displayName} avatar`} className="avatar-img" />
          ) : (
            <div className="avatar-fallback" aria-hidden="true">{initials(profile.name, profile.username)}</div>
          )}
        </div>

        <div className="profile-meta">
          <h2 className="profile-name">{displayName}</h2>
          {handle && <div className="profile-handle">{handle}</div>}
          <div className="profile-actions">
            <button className="btn" type="button" onClick={() => alert('Edit profile flow not implemented')}>
              Edit Profile
            </button>
            <button className="btn secondary" type="button" onClick={() => alert('Log out flow not implemented')}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <section className="profile-grid" aria-hidden={false}>
        <div className="profile-item">
          <div className="label">Email</div>
          <div className="value">{profile.email || <span className="muted">Not provided</span>}</div>
        </div>

        <div className="profile-item">
          <div className="label">Name</div>
          <div className="value">{profile.name || <span className="muted">Not provided</span>}</div>
        </div>

        <div className="profile-item">
          <div className="label">Age</div>
          <div className="value">{profile.age ?? <span className="muted">—</span>}</div>
        </div>

        <div className="profile-item">
          <div className="label">Gender</div>
          <div className="value">{profile.gender || <span className="muted">—</span>}</div>
        </div>

        <div className="profile-item">
          <div className="label">Assigned to</div>
          <div className="value">{profile.assigned_to || <span className="muted">—</span>}</div>
        </div>

        <div className="profile-item">
          <div className="label">Tasks</div>
          <div className="value">{profile.stats?.tasksCount ?? '—'}</div>
        </div>
      </section>

      <section className="profile-bio">
        <h3 className="section-title">About</h3>
        <p className={`bio ${bioExpanded ? 'expanded' : ''}`}>
          {profile.bio ? profile.bio : <span className="muted">No bio provided.</span>}
        </p>
        {profile.bio && profile.bio.length > 180 && (
          <button
            className="btn link small"
            type="button"
            onClick={() => setBioExpanded(v => !v)}
            aria-expanded={bioExpanded}
          >
            {bioExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </section>

      <footer className="profile-footer small muted">
        {joined ? `Member since ${joined}` : 'Member'}
      </footer>
    </div>
  );
}