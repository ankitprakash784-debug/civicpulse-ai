import { useEffect, useState } from 'react';
import './IssueStatus.css';

function IssueStatus() {
  const [complaints, setComplaints] = useState([]);
  const [complaintId, setComplaintId] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch real complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          'http://localhost:5050/api/complaints'
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || 'Failed to fetch complaints'
          );
        }

        setComplaints(data.data);
      } catch (err) {
        console.error('Complaints fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const searchId = complaintId.trim();

    const found = complaints.find(
      (complaint) => complaint.id === searchId
    );

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

  const getIssueName = (issueType) => {
    const issueMap = {
      pothole: '🕳️ Pothole',
      garbage: '🗑️ Garbage',
      broken_streetlight: '💡 Streetlight',
      water_leak: '🚰 Water Leakage',
      water_leakage: '🚰 Water Leakage',
      other: '🏙️ Other',
    };

    return issueMap[issueType] || '🏙️ Other';
  };

  return (
    <div className="status-container page-fade">
      <h1>Track Your Issue</h1>

      <form
        className="status-form"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Enter Complaint ID"
          value={complaintId}
          onChange={(e) =>
            setComplaintId(e.target.value)
          }
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {loading && (
        <p className="not-found">
          Loading complaints...
        </p>
      )}

      {error && (
        <p className="not-found">
          ❌ {error}
        </p>
      )}

      {notFound && !loading && (
        <p className="not-found">
          No complaint found with this ID.
        </p>
      )}

      {result && (
        <div className="complaint-card">
          <h2>
            {getIssueName(result.issueType)}
          </h2>

          <p>
            {result.description}
          </p>

          <p>
            <strong>Complaint ID:</strong>{' '}
            {result.id}
          </p>

          <p>
            <strong>Location:</strong>{' '}
            {result.location || 'Not provided'}
          </p>

          <p>
            <strong>Department:</strong>{' '}
            {result.department || 'Not assigned'}
          </p>

          <p>
            <strong>Priority:</strong>{' '}
            {result.priority || 'LOW'}
          </p>

          <p>
            <strong>Submitted On:</strong>{' '}
            {result.createdAt
              ? new Date(
                  result.createdAt
                ).toLocaleString()
              : 'Not available'}
          </p>

          <span
            className={getStatusClass(
              result.status
            )}
          >
            {result.status || 'Pending'}
          </span>
        </div>
      )}
    </div>
  );
}

export default IssueStatus;