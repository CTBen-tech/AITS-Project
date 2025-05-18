import React, { useState } from "react";
import axios from "axios";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://aits-project.onrender.com/api/token/", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshtoken", response.data.refresh);
      localStorage.setItem("role", response.data.role); // Store role
      console.log("Tokens set:", localStorage.getItem("token"));
      console.log("Role:", response.data.role);

      // Navigate based on role
      switch (response.data.role) {
        case 'student':
          navigate("/student", { replace: true });
          break;
        case 'registrar':
          navigate("/registrar", { replace: true });
          break;
        case 'lecturer':
          navigate("/lecturer", { replace: true });
          break;
        default:
          navigate("/dashboard", { replace: true });
      }
      alert("Login successful");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data || error.message,
        error.response?.status
      );
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://aits-project.onrender.com/api/password_reset/",
        {
          email: resetEmail,
        }
      );
      console.log("Password reset response:", response);
      setResetMessage("A password reset link has been sent to your email.");
    } catch (error) {
      console.error("Password reset failed:", error);
      setResetMessage(
        "Failed to send reset link. Please check your email and try again."
      );
    }
  };

  return (
    <div className="login-page">
      <h2 className="login-title">AITS</h2>
      <div className="login-container">
        <h2 className="login-title">Log Into Your Account</h2>
        <form onSubmit={handleLogin} className="login-form">
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
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            <div
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <div className="forgot-password">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="forgot-password-button"
            >
              Forgot Password?
            </button>
          </div>
          <button type="submit" className="signin-button">
            <FaArrowRight />
            Sign in
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register Here</Link>
          <button onClick={() => navigate("/register")}>
            Switch to Register
          </button>
        </p>
      </div>
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
                    resetMessage.includes("Failed") ? "error" : "success"
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