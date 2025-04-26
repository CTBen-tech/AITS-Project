import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const data = { username, email, password };
    console.log("Registration Submitted:", data);
    try {
      // Add headers and configuration
      const response = await axios.post(
        "https://aits-project.onrender.com/api/register/",
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true // Important for CORS
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
      // Enhanced error logging
      console.error("Registration Error Details:", {
        message: error.message,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status
      });

      // More descriptive error message
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || error.message 
        || "Registration failed. Please try again later.";

      alert(`Registration failed: ${errorMessage}`);
    }
  };

  // Test connection when component mounts
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        await axios.options("https://aits-project.onrender.com/api/register/");
        console.log("Backend connection test successful");
      } catch (error) {
        console.error("Backend connection test failed:", error.message);
      }
    };
    testConnection();
  }, []);

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
