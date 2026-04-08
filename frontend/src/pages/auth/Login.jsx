import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import './Login.css';
import logo from '../../assets/ccs-logo.png';
import bgImage from '../../assets/bg.jpg';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      const response = await axios.post('/api/auth/login', credentials);
      const data = response.data;
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('userRole', data.role);

      if (onLogin) onLogin(data.role, data.requiresPasswordChange);
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'An error occurred during login. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="login-overlay"></div>
      
      <div className="login-container">
        
        <div className="login-form-panel">
          <div className="login-header-brand">
             <img src={logo} alt="CCS Logo" className="login-brand-logo" />
             <div className="brand-text-container">
               <h1 className="brand-title">Pamantasan ng Cabuyao</h1>
               <p className="brand-subtitle">College of Computing Studies</p>
             </div>
          </div>
          
          <div className="login-form-container">
            <h2 className="welcome-text">Welcome Back!</h2>
            <p className="subtitle-text">Login to your account to continue</p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="userId">User ID</label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={credentials.userId}
                  onChange={handleChange}
                  placeholder="Enter User ID"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    required
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" disabled={isLoading} />
                  Remember Me
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
