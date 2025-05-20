import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

useEffect(() => {
  const BASE_URL = process.env.REACT_APP_API_URL || "https://aits-project.onrender.com";
  axios.get(`${BASE_URL}/register/`, { withCredentials: true }).catch(() => {});
}, []);

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //loading error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    const data = { username, email, password };
    console.log("Registration Submitted:", data);

    try {
      const BASE_URL = process.env.REACT_APP_API_URL || "https://aits-project.onrender.com";
      const DJANGO_URL = process.env.REACT_APP_DJANGO_URL || "http://127.0.0.1:8000";

      console.log("Using Django Backend URL:", DJANGO_URL);
      console.log("Using API URL:", BASE_URL); // Debug log

      const response = await axios.post(
        `${BASE_URL}/register/`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "X-CSRFToken": getCookie("csrftoken"), // Uncomment if CSRF is enforced
          },
          // Remove withCredentials if not using cookies
           withCredentials: true
        }
      );

      console.log("Registration Success:", response.data);
      alert("Registration successful! Please login.");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (error) {
      console.error("Registration Error Details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });

      // Set more user-friendly error message
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        "Unable to connect to the server. Please try again later."
      );

      alert(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
