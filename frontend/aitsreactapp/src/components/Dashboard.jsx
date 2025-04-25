import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({ open: 0, in_progress: 0, resolved: 0 });
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [newIssue, setNewIssue] = useState({ title: '', description: '' });
  const [studentInfo, setStudentInfo] = useState({ name: 'Test Student', id: 'S12345' }); // Mock, replace with API call if available
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch issues and stats on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/issues/` : '/api/issues/',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const issuesData = response.data;
        setIssues(issuesData);
        setStats({
          open: issuesData.filter((i) => i.status === 'open').length,
          in_progress: issuesData.filter((i) => i.status === 'in_progress').length,
          resolved: issuesData.filter((i) => i.status === 'resolved').length,
        });
        // Optionally fetch student info from an endpoint like /api/user/
        // const userResponse = await axios.get('/api/user/', { headers: { Authorization: `Bearer ${token}` } });
        // setStudentInfo({ name: userResponse.data.name, id: userResponse.data.id });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
        if (error.response?.status === 401) navigate('/login'); // Token expired/invalid
      }
    };
    fetchData();
  }, [navigate]);

  // Submit new issue
  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/issues/create/` : '/api/issues/create/',
        newIssue,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssues([...issues, response.data]);
      setNewIssue({ title: '', description: '' });
      setStats((prev) => ({ ...prev, open: prev.open + 1 })); // Update stats
      alert('Issue submitted successfully!');
    } catch (error) {
      console.error('Failed to submit issue:', error);
      alert('Failed to submit issue.');
    }
  };

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    if (filter === 'all') return true;
    return issue.status.toLowerCase() === filter;
  });

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Student Issue Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard-container">
        {/* Profile Summary */}
        <section className="profile-summary">
          <h2>Welcome, {studentInfo.name}</h2>
          <p>Student ID: {studentInfo.id}</p>
        </section>

        {/* Stats */}
        <section className="stats-section">
          <div className="stat-card stat-open">
            <h3>Open Issues</h3>
            <p>{stats.open}</p>
          </div>
          <div className="stat-card stat-in-progress">
            <h3>In Progress</h3>
            <p>{stats.in_progress}</p>
          </div>
          <div className="stat-card stat-resolved">
            <h3>Resolved</h3>
            <p>{stats.resolved}</p>
          </div>
        </section>

        {/* New Issue Form */}
        <section className="new-issue-section">
          <h2>Report a New Issue</h2>
          <form onSubmit={handleIssueSubmit} className="issue-form">
            <input
              type="text"
              placeholder="Issue Title"
              value={newIssue.title}
              onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
              className="input-field"
              required
            />
            <textarea
              placeholder="Description"
              value={newIssue.description}
              onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
              className="textarea-field"
              required
            />
            <button type="submit" className="submit-button">Submit Issue</button>
          </form>
        </section>

        {/* Issues List */}
        <section className="issues-section">
          <h2>Your Issues</h2>
          <div className="filter-buttons">
            {['all', 'open', 'in_progress', 'resolved'].map((status) => (
              <button
                key={status}
                className={`filter-button ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
          {loading ? (
            <p>Loading issues...</p>
          ) : (
            <ul className="issues-list">
              {filteredIssues.length === 0 ? (
                <p>No issues found.</p>
              ) : (
                filteredIssues.map((issue) => (
                  <li key={issue.id} className="issue-item">
                    <h3>{issue.title}</h3>
                    <p>{issue.description}</p>
                    <span className={`status ${issue.status.toLowerCase()}`}>
                      {issue.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;