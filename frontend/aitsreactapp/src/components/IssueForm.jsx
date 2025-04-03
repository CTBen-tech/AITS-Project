import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function IssueForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:8000/api/issues/',
      { title, description, category, priority },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate('/issues');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Submit an Issue</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
}

export default IssueForm;