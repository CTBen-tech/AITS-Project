import React, { useState } from 'react';

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
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
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
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={formData.username}
          onChange={handleChange}
        />
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
