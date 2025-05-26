import React, { useState } from 'react';
import "../styles/login.css";

const API_URL = process.env.REACT_APP_API_URL;
// ✅ CSRF token getter using plain JavaScript
function getCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));
  return cookieValue ? decodeURIComponent(cookieValue.split('=')[1]) : null;
}

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'student',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      alert('All fields are required.');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      alert('Please enter a valid email address.');
      return false;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return false;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      
const response = await fetch(`${API_URL}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! You may now log in.');
        setFormData({
          username: '',
          email: '',
          role: 'student',
          password: '',
          confirmPassword: '',
        });
      } else {
        if (data.username) {
          alert(`Username error: ${data.username[0]}`);
        } else if (data.email) {
          alert(`Email error: ${data.email[0]}`);
        } else if (data.detail) {
          alert(`Server error: ${data.detail}`);
        } else {
          alert('Registration failed. Please check your inputs.');
        }
      }
    } catch (error) {
      alert(`Network or server error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Left side - image + caption */}
        <div className="register-image-section">
          <div className="overlay">
            <div className="register-header">
              <span className="logo">AMU</span>
              <button className="back-button">Back to website ➜</button>
            </div>
            <div className="image-caption">
              <h2>Capturing Moments, Creating Memories</h2>
              <div className="dots">
                <span className="dot active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - form */}
        <div className="register-form-section">
          <div className="form-container">
            <h2>Create an account</h2>
            <p>
              Already have an account? <a href="#">Log in</a>
            </p>
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="name-fields">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={formData.username}
          onChange={handleChange}
        />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={formData.email}
          onChange={handleChange}
        />
        <select
          name="role"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          <option value="registrar">Registrar</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <label className="checkbox-label">
                <input type="checkbox" />
                I agree to the <a href="#">Terms & Conditions</a>
              </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
     </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
