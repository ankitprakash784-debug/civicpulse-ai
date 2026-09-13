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

  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState('');
  const handleStatusChange = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };
  // =========================
  // AI RESOLUTION VERIFICATION
  // =========================

  const handleVerifyResolution = async () => {
    if (!beforeImage || !afterImage) {
      setVerificationError(
        'Please upload both before and after images.'
      );
      return;
    }

    setVerificationLoading(true);
    setVerificationResult(null);
    setVerificationError('');

    try {
      const uploadData = new FormData();

      uploadData.append('beforeImage', beforeImage);
      uploadData.append('afterImage', afterImage);

      const response = await fetch(
        'http://localhost:5050/api/verify-resolution',
        {
          method: 'POST',
          body: uploadData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
          'Resolution verification failed'
        );
      }

      console.log(
        'Resolution Verification Result:',
        result.data
      );

      setVerificationResult(result.data);
      // Automatically mark selected complaint as Resolved
      // when AI confirms that the issue is actually fixed.
      if (
        result.data.resolved &&
        result.data.sameIssue &&
        selectedComplaintId
      ) {
        setComplaints((prev) =>
          prev.map((complaint) =>
            complaint.id === selectedComplaintId
              ? {
                  ...complaint,
                  status: 'Resolved',
                }
              : complaint
          )
        );
      }
    } catch (err) {
      console.error(
        'Resolution Verification Error:',
        err
      );

      setVerificationError(
        err.message ||
        'Unable to verify resolution.'
      );

    } finally {
      setVerificationLoading(false);
    }
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
      {/* =========================
          RESOLUTION VERIFICATION
          ========================= */}

      <div className="verification-card">

        <h2>AI Resolution Verification</h2>
        <label htmlFor="verificationComplaint">
          Select Complaint
        </label>

        <select
          id="verificationComplaint"
          value={selectedComplaintId}
          onChange={(e) => {
            setSelectedComplaintId(e.target.value);
            setVerificationResult(null);
            setVerificationError('');
          }}
        >
          <option value="">
            -- Select Complaint --
          </option>

          {complaints.map((complaint) => (
            <option
              key={complaint.id}
              value={complaint.id}
            >
              {complaint.id} — {complaint.category}
            </option>
          ))}
        </select>
        <p>
          Upload the original issue photo and the
          after-repair photo to verify whether the
          issue has actually been resolved.
        </p>

        <div className="verification-upload-grid">

          <div className="verification-upload">
            <label htmlFor="beforeImage">
              Before Repair Photo
            </label>

            <input
              type="file"
              id="beforeImage"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setBeforeImage(file);
                  setVerificationResult(null);
                  setVerificationError('');
                }
              }}
            />

            {beforeImage && (
              <p>
                Selected: {beforeImage.name}
              </p>
            )}
          </div>


          <div className="verification-upload">
            <label htmlFor="afterImage">
              After Repair Photo
            </label>

            <input
              type="file"
              id="afterImage"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setAfterImage(file);
                  setVerificationResult(null);
                  setVerificationError('');
                }
              }}
            />

            {afterImage && (
              <p>
                Selected: {afterImage.name}
              </p>
            )}
          </div>

        </div>


        {verificationError && (
          <div className="verification-error">
            {verificationError}
          </div>
        )}


        <button
          type="button"
          className="verify-resolution-btn"
          onClick={handleVerifyResolution}
          disabled={verificationLoading}
        >
          {verificationLoading
            ? 'Verifying with AI...'
            : 'Verify Resolution with AI'}
        </button>

      </div>
            {/* =========================
          VERIFICATION RESULT
          ========================= */}

      {verificationResult && (
        <div className="verification-result-card">

          <div className="verification-result-header">
            <span>
              {verificationResult.resolved ? '✅' : '❌'}
            </span>

            <h2>
              {verificationResult.resolved
                ? 'Issue Resolved'
                : 'Issue Not Resolved'}
            </h2>
          </div>

          <div className="verification-result-grid">

            <div>
              <span>Issue Type</span>
              <strong>
                {verificationResult.issueType}
              </strong>
            </div>

            <div>
              <span>Confidence</span>
              <strong>
                {(verificationResult.confidence * 100).toFixed(0)}%
              </strong>
            </div>

            <div>
              <span>Before Severity</span>
              <strong>
                {verificationResult.beforeSeverity}/5
              </strong>
            </div>

            <div>
              <span>After Severity</span>
              <strong>
                {verificationResult.afterSeverity}/5
              </strong>
            </div>

            <div>
              <span>Before Safety Risk</span>
              <strong>
                {verificationResult.beforeSafetyRisk}/5
              </strong>
            </div>

            <div>
              <span>After Safety Risk</span>
              <strong>
                {verificationResult.afterSafetyRisk}/5
              </strong>
            </div>

            <div>
              <span>Same Issue</span>
              <strong>
                {verificationResult.sameIssue ? 'Yes' : 'No'}
              </strong>
            </div>

          </div>

          <div className="verification-reason">

            <span>AI Verification Reason</span>

            <p>
              {verificationResult.reason}
            </p>

          </div>

        </div>
      )}
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