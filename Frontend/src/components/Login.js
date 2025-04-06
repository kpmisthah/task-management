import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const API_URL = 'http://localhost:3000';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false); // toggle between login/signup
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? 'signup' : 'login';

    try {
      const res = await axios.post(`${API_URL}/auth/${endpoint}`, { username, password });
      const token = isSignup ? res.data.access_token : res.data.access_token;
      onLogin(token);
      setError('');
    } catch (err) {
      setError(
        isSignup ? 'Signup failed. Username may already exist.' : 'Invalid credentials'
      );
    }
  };

  return (
    <div className="form-container">
      <p className="title">{isSignup ? 'Create Account' : 'Welcome back'}</p>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isSignup && (
          <p className="page-link">
            <span className="page-link-label">Forgot Password?</span>
          </p>
        )}
        <button className="form-btn">{isSignup ? 'Sign up' : 'Log in'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="sign-up-label">
        {isSignup ? 'Already have an account?' : 'Don’t have an account?'}{' '}
        <span
          className="sign-up-link"
          onClick={() => setIsSignup(!isSignup)}
          style={{ cursor: 'pointer', color: '#007bff' }}
        >
          {isSignup ? 'Log in' : 'Sign up'}
        </span>
      </p>
    </div>
  );
}

export default Login;
