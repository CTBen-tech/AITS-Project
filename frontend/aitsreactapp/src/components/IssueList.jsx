import { useState, useEffect } from 'react';
import axios from 'axios';

function IssueList() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/issues/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues(response.data);
    };
    fetchIssues();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Issues</h2>
      <ul className="space-y-4">
        {issues.map((issue) => (
          <li key={issue.id} className="p-4 bg-white rounded shadow">
            <h3 className="text-lg">{issue.title}</h3>
            <p>{issue.description}</p>
            <p>Status: {issue.status}</p>
            <p>Priority: {issue.priority}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IssueList;