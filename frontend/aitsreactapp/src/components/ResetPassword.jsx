import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL query parameter
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const resetToken = query.get('token');
    if (resetToken) {
      setToken(resetToken);
    } else {
      setMessage('Invalid or missing reset token.');
    }
  }, [location]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/password_reset/confirm/', {
        token: token,
        password: newPassword,
      });
      setMessage('Password reset successfully. You can now log in with your new password.');
      setTimeout(() => navigate('/'), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      console.error('Password reset failed', error);
      setMessage('Failed to reset password. The token may be invalid or expired.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-8 uppercase">
          Reset Your Password
        </h2>
        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* New Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Message */}
          {message && (
            <p
              className={`text-sm ${
                message.includes('Failed') ? 'text-red-500' : 'text-green-500'
              } text-center`}
            >
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;