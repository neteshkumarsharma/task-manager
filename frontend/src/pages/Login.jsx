import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { login } = useAuth();



  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      await login({ email, password });
    } catch (error) {
      setErr(error?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="form card">
      <h2>Login</h2>
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <form onSubmit={handleSubmit}>
        <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn" type="submit">Login</button>
      </form>
    </div>
  );
}