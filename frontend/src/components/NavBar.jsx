import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import '../styles/NavBar.css';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  useEffect(() => {
    function onDocumentClick(e) {
      if (!open) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    function onKeyDown(e) {
      if (e.key === 'Escape' && open) setOpen(false);
    }

    document.addEventListener('mousedown', onDocumentClick);
    document.addEventListener('touchstart', onDocumentClick);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
      document.removeEventListener('touchstart', onDocumentClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="left">
        <Link to="/dashboard" className="brand">TaskManager</Link>
      </div>

      <button
        ref={toggleRef}
        type="button"
        className={`nav-toggle ${open ? 'open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen((s) => !s)}
      >
        <span className="hamburger" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path className="line line1" d="M3 6h18" />
            <path className="line line2" d="M3 12h18" />
            <path className="line line3" d="M3 18h18" />
          </svg>
        </span>
      </button>

      <div
        id="main-navigation"
        ref={menuRef}
        className={`menu ${open ? 'show' : ''}`}
        role="menu"
      >
        <div className="menu-left" role="none">
          <Link to="/dashboard" className="menu-link" onClick={() => setOpen(false)} role="menuitem">Dashboard</Link>
          <Link to="/tasks" className="menu-link" onClick={() => setOpen(false)} role="menuitem">Tasks</Link>
          <Link to="/analytics" className="menu-link" onClick={() => setOpen(false)} role="menuitem">Analytics</Link>
        </div>

        <div className="menu-right" role="none">
          <ThemeToggle small />
          {user ? (
            <>
              <span className="user-greeting">Hi, {user.username || user.name}</span>
              <Link to="/profile" className="menu-link" onClick={() => setOpen(false)} role="menuitem">Profile</Link>
              <button className="btn small-ghost" type="button" onClick={() => { setOpen(false); handleLogout(); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="menu-link" onClick={() => setOpen(false)} role="menuitem">Login</Link>
              <Link to="/register" className="menu-link" onClick={() => setOpen(false)} role="menuitem">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}