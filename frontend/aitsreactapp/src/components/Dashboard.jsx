import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({ open: 0, in_progress: 0, resolved: 0 });
  const [form, setForm] = useState({ title: "", status: "open" });
  const [message, setMessage] = useState("");
  console.log("Dashboard: rendered");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/issues/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const issues = response.data;
      setStats({
        open: issues.filter((i) => i.status === "open").length,
        in_progress: issues.filter((i) => i.status === "in_progress").length,
        resolved: issues.filter((i) => i.status === "resolved").length,
      });
    };
    fetchStats();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/issues/",
        {
          title: form.title,
          status: form.status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Issue submitted successfully");
      setForm({ title: "", status: "open" });
    } catch (error) {
      console.error("Error submitting issue:", error);
      setMessage("Failed to submit issue");
    }
  };

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
      <div className="issue-form-container">
        <h3>Submit New Academic Issue</h3>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit} className="issue-form">
          <input
            type="text"
            placeholder="Enter issue title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <button type="submit">Submit Issue</button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
