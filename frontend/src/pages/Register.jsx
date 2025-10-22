import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Register.css';

export default function Register() {
  const [payload, setPayload] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    age: '',
    gender: 'PREFER NOT TO SAY'
  });
  const [err, setErr] = useState('');
  const { register } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      await register(payload);
      alert('Registered. Please login.');
    } catch (error) {
      setErr(error?.response?.data?.message || 'Registration failed');
    }
  }

  function onChange(e) {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  }

  return (
    <div className="form card">
      <h2>Register</h2>
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <form onSubmit={handleSubmit}>
        <input name="username" className="input" placeholder="Username" value={payload.username} onChange={onChange} />
        <input name="name" className="input" placeholder="Full name" value={payload.name} onChange={onChange} />
        <input name="email" className="input" placeholder="Email" value={payload.email} onChange={onChange} />
        <input name="password" className="input" placeholder="Password" type="password" value={payload.password} onChange={onChange} />
        <input name="age" className="input" placeholder="Age" value={payload.age} onChange={onChange} />
        <select name="gender" className="input" value={payload.gender} onChange={onChange}>
          <option>MALE</option>
          <option>FEMALE</option>
          <option>PREFER NOT TO SAY</option>
        </select>
        <button className="btn" type="submit">Register</button>
      </form>
    </div>
  );
}