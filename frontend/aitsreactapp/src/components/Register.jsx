import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //loading error states

  const BASE_URL = process.env.REACT_APP_API_URL || "https://aits-project.onrender.com";

const getCSRFToken = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/csrf/`, {
      withCredentials: true, // Ensures cookies are sent
    });
    console.log("CSRF Token Retrieved:", response.data.csrfToken);
    return response.data.csrfToken; 
  } catch (error) {
    console.error("CSRF Token Retrieval Error:", error);
    return null;
  }
};


  

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
    console.log("Using API URL:", BASE_URL);

    // **Retrieve CSRF token before submitting the request**
    const csrfToken = await getCSRFToken();
    if (!csrfToken) {
      alert("Failed to retrieve CSRF token. Please try again.");
      setLoading(false);
      return;
    }

    const response = await axios.post(
      `${BASE_URL}/register/`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRFToken': csrfToken, // Include CSRF token
        },
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
        data: error.response?.data,
      });

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
