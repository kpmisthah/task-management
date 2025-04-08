import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

const API_URL = 'http://localhost:3000';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Add animation trigger after component mounts
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? 'signup' : 'login';
    
    try {
      const res = await axios.post(`${API_URL}/auth/${endpoint}`, { username, password });
      const token = res.data.access_token;
      onLogin(token);
      setError('');
    } catch (err) {
      setError(
        isSignup ? 'Signup failed. Username may already exist.' : 'Invalid credentials'
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-container">
      <div className={`welcome-container ${isLoaded ? 'loaded' : ''}`}>
        {!isSignup ? (
          <div className="welcome-animation">
            <div className="welcome-text">
              <span className="welcome-word">Welcome</span>
              <span className="welcome-word">Back</span>
            </div>
            <div className="welcome-decoration">
              <div className="decoration-line"></div>
              <div className="decoration-circle"></div>
            </div>
          </div>
        ) : (
          <p className="title">Create Account</p>
        )}
      </div>
      
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="button" 
            className="password-toggle-btn"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
        {!isSignup && (
          <p className="page-link">
            <span className="page-link-label">Forgot Password?</span>
          </p>
        )}
        <button className="form-btn">{isSignup ? 'Sign up' : 'Log in'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="sign-up-label">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
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