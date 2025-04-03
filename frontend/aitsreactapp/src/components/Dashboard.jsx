import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({ open: 0, in_progress: 0, resolved: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/issues/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const issues = response.data;
      setStats({
        open: issues.filter((i) => i.status === 'open').length,
        in_progress: issues.filter((i) => i.status === 'in_progress').length,
        resolved: issues.filter((i) => i.status === 'resolved').length,
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 rounded">
          <h3>Open Issues</h3>
          <p className="text-2xl">{stats.open}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded">
          <h3>In Progress</h3>
          <p className="text-2xl">{stats.in_progress}</p>
        </div>
        <div className="p-4 bg-green-100 rounded">
          <h3>Resolved</h3>
          <p className="text-2xl">{stats.resolved}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;