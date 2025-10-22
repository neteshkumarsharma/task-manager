import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false); 
  const navigate = useNavigate();

  async function loadCurrentUser() {
    try {
      const res = await api.get('/user/currentuser');
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    loadCurrentUser();
  }, []);

  async function login(credentials) {
    await api.post('/user/login', credentials);
    await loadCurrentUser();
    navigate('/dashboard');
  }

  async function register(payload) {
    await api.post('/user/create', payload);
    navigate('/login');
  }

  async function logout() {
    try {
      await api.post('/user/logout');
    } catch (err) {
    }
    setUser(null);
    navigate('/login');
  }

  return (
    <AuthContext.Provider value={{ user, loaded, login, register, logout, checkAuthLoaded: loaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}