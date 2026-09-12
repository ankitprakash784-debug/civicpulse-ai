import { useState } from 'react';
import './IssueStatus.css';

// Dummy data — backend connect hone ke baad ye API se aayega
const dummyComplaints = {
  'CP1001': {
    category: 'Pothole',
    description: 'Large pothole near main market road',
    location: 'MG Road, Sector 5',
    status: 'In Progress',
    submittedOn: '2026-09-05',
  },
  'CP1002': {
    category: 'Garbage',
    description: 'Garbage not collected for a week',
    location: 'Green Park Colony',
    status: 'Resolved',
    submittedOn: '2026-09-01',
  },
};

function IssueStatus() {
  const [complaintId, setComplaintId] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = dummyComplaints[complaintId.trim().toUpperCase()];
    if (found) {
      setResult(found);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Resolved') return 'status resolved';
    if (status === 'In Progress') return 'status in-progress';
    return 'status pending';
  };

  return (
    <div className="status-container page-fade">
      <h1>Track Your Issue</h1>
      <form className="status-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter Complaint ID (e.g. CP1001)"
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {notFound && (
        <p className="not-found">No complaint found with this ID.</p>
      )}

      {result && (
        <div className="complaint-card">
          <h2>{result.category}</h2>
          <p>{result.description}</p>
          <p><strong>Location:</strong> {result.location}</p>
          <p><strong>Submitted On:</strong> {result.submittedOn}</p>
          <span className={getStatusClass(result.status)}>{result.status}</span>
        </div>
      )}
    </div>
  );
}

export default IssueStatus;