import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import TaskManager from './components/TaskManager';
import './App.css';

const API_URL = 'http://localhost:3000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      checkStatus();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/auth/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data); // { userId, username, role }
    } catch (err) {
      setToken('');
      localStorage.removeItem('token');
    }
    setLoading(false);
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager PRO</h1>
        {token && user && (
          <div className="user-panel">
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className="role-badge">{user.role}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>
      
      <main className="app-content">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : token && user ? (
          <TaskManager token={token} user={user} />
        ) : (
          <div className="login-container">
            <Login onLogin={handleLogin} />
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Task Manager PRO © 2025</p>
      </footer>
    </div>
  );
}

export default App;