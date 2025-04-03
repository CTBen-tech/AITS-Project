import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles.css'; // Import the new styles.css

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.access);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/password_reset/', {
        email: resetEmail,
      });
      setResetMessage('A password reset link has been sent to your email.');
    } catch (error) {
      console.error('Password reset failed', error);
      setResetMessage('Failed to send reset link. Please check your email and try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Title */}
        <h2 className="login-title">Log Into Your Account</h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          {/* Email or Username Field */}
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Email or User name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Password Field */}
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            <div
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="forgot-password-button"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button type="submit" className="signin-button">
            <FaArrowRight />
            Sign in
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Reset Your Password</h3>
            <form onSubmit={handleForgotPassword} className="modal-form">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              {resetMessage && (
                <p
                  className={`modal-message ${
                    resetMessage.includes('Failed') ? 'error' : 'success'
                  }`}
                >
                  {resetMessage}
                </p>
              )}
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="modal-button cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="modal-button submit">
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;