import React, { useState, useEffect } from 'react';
import './Login.css';
import logo from '../assets/ccs-logo.png';
import connectsLogo from '../assets/ConneCts.png';
import background from '../assets/ccs-background.png';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Force strip the dark-theme from the entire page upon rendering the Login
  useEffect(() => {
    document.body.classList.remove('dark-theme');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Backend-ready simulation
    try {
      // Simulate API call
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // const data = await response.json();
      
      setTimeout(() => {
        // Temporary mock users
        const mockUsers = {
          'admin': { password: 'password123', role: 'Admin' },
          'faculty': { password: 'password123', role: 'Faculty' },
          'student': { password: 'password123', role: 'Student' }
        };

        const user = mockUsers[credentials.userId];

        if (user && user.password === credentials.password) {
          // Trigger the App-level login state update which will redirect to /dashboard
          if (onLogin) onLogin(user.role);
        } else {
          setError('Invalid User ID or password. Try: admin, faculty, or student (Password: password123)');
        }
        setIsLoading(false);
      }, 1000);

    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left" style={{ backgroundImage: `url(${background})` }}>
        <div className="login-overlay"></div>
      </div>
      
      <div className="login-right">
        <div className="login-header">
          <div className="login-brand">
            <img src={logo} alt="CCS Logo" className="login-logo" />
            <div className="login-brand-text">
              <h2>Pamantasan ng Cabuyao</h2>
              <h3>College of Computing Studies</h3>
            </div>
          </div>
          <img src={connectsLogo} alt="ConneCtS" className="connects-logo" />
        </div>

        {error && <div className="login-error">{error}</div>}

        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={credentials.userId}
              onChange={handleChange}
              placeholder="Enter your User ID"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" disabled={isLoading} />
              Remember me
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
