import { useState } from 'react';
import './AdminDashboard.css';

// Dummy data — backend connect hone ke baad ye API se aayega
const initialComplaints = [
  {
    id: 'CP1001',
    category: 'Pothole',
    description: 'Large pothole near main market road',
    location: 'MG Road, Sector 5',
    status: 'In Progress',
    submittedOn: '2026-09-05',
  },
  {
    id: 'CP1002',
    category: 'Garbage',
    description: 'Garbage not collected for a week',
    location: 'Green Park Colony',
    status: 'Resolved',
    submittedOn: '2026-09-01',
  },
  {
    id: 'CP1003',
    category: 'Broken Streetlight',
    description: 'Streetlight not working for 3 days',
    location: 'Sector 12 Park',
    status: 'Pending',
    submittedOn: '2026-09-08',
  },
];

function AdminDashboard() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [filter, setFilter] = useState('All');

  const handleStatusChange = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const filteredComplaints =
    filter === 'All'
      ? complaints
      : complaints.filter((c) => c.category === filter);

  const getStatusClass = (status) => {
    if (status === 'Resolved') return 'status resolved';
    if (status === 'In Progress') return 'status in-progress';
    return 'status pending';
  };

  return (
    <div className="admin-container page-fade">
      <h1>Admin Dashboard</h1>

      <div className="filter-bar">
        <label htmlFor="filter">Filter by Category:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pothole">Pothole</option>
          <option value="Garbage">Garbage</option>
          <option value="Broken Streetlight">Broken Streetlight</option>
          <option value="Water Leakage">Water Leakage</option>
        </select>
      </div>

      <div className="complaints-list">
        {filteredComplaints.length === 0 && (
          <p>No complaints found for this category.</p>
        )}

        {filteredComplaints.map((c) => (
          <div className="admin-card" key={c.id}>
            <div className="admin-card-header">
              <h2>{c.category}</h2>
              <span className={getStatusClass(c.status)}>{c.status}</span>
            </div>
            <p>{c.description}</p>
            <p><strong>ID:</strong> {c.id}</p>
            <p><strong>Location:</strong> {c.location}</p>
            <p><strong>Submitted On:</strong> {c.submittedOn}</p>

            <label htmlFor={`status-${c.id}`}>Update Status:</label>
            <select
              id={`status-${c.id}`}
              value={c.status}
              onChange={(e) => handleStatusChange(c.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;