import { useEffect, useState } from "react";

function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [beforePhoto, setBeforePhoto] = useState(null);
const [afterPhoto, setAfterPhoto] = useState(null);

const [beforePhotoPreview, setBeforePhotoPreview] = useState(null);
const [afterPhotoPreview, setAfterPhotoPreview] = useState(null);

const [verificationResult, setVerificationResult] = useState(null);
  const [aiVerified, setAiVerified] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState("");
useEffect(() => {
  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      setReportsError("");

      const response = await fetch(
        "http://localhost:5050/api/complaints"
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch complaints"
        );
      }

      const formattedReports = result.data.map((complaint) => ({
        id: complaint.id,
        photoUrl: complaint.photoUrl || null,
        issue: getIssueLabel(complaint.issueType),
        location: complaint.location || "Location not provided",
        priority: complaint.priorityScore || 0,
        priorityLevel: complaint.priority || "LOW",
        status: complaint.status || "Pending",
        department: complaint.department,
        description: complaint.description,
        severity: complaint.severity,
        safetyRisk: complaint.safetyRisk,
        confidence: complaint.confidence,
        complaintText: complaint.complaintText,
        createdAt: complaint.createdAt,
      }));

      setReports(formattedReports);
    } catch (error) {
      console.error("Reports fetch error:", error);
      setReportsError(error.message);
    } finally {
      setLoadingReports(false);
    }
  };

  fetchReports();
}, []);

const getIssueLabel = (issueType) => {
  const issueMap = {
    pothole: "🕳️ Pothole",
    garbage: "🗑️ Garbage",
    broken_streetlight: "💡 Streetlight",
    water_leak: "🚰 Water Leakage",
    water_leakage: "🚰 Water Leakage",
    other: "🏙️ Other",
  };

  return issueMap[issueType] || "🏙️ Other";
};
  return (
    <div className="reports-page">

      <div className="page-title">
        <div>
          <h2>All Reports</h2>

          <p>
            View and manage all reported civic issues
          </p>
        </div>
      </div>
      {/* SEARCH & FILTER */}
      <div className="report-filters">

        <input
          type="text"
          placeholder="🔍 Search issue or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="status-filter">

  <button
    className="status-filter-button"
    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
  >
    <span className="filter-icon">⚱</span>

    <span>
      {statusFilter === "All" ? "All Status" : statusFilter}
    </span>

    <span className="filter-arrow">
      {showStatusDropdown ? "⌃" : "⌄"}
    </span>
  </button>

  {showStatusDropdown && (
    <div className="custom-dropdown">

      <button
        className={statusFilter === "All"
          ? "dropdown-option active-option"
          : "dropdown-option"}
        onClick={() => {
          setStatusFilter("All");
          setShowStatusDropdown(false);
        }}
      >
        <span>▦</span>
        All Status
        {statusFilter === "All" && <strong>✓</strong>}
      </button>

      <button
        className={statusFilter === "Pending"
          ? "dropdown-option active-option"
          : "dropdown-option"}
        onClick={() => {
          setStatusFilter("Pending");
          setShowStatusDropdown(false);
        }}
      >
        <span>◷</span>
        Pending
        {statusFilter === "Pending" && <strong>✓</strong>}
      </button>

      <button
        className={statusFilter === "In Progress"
          ? "dropdown-option active-option"
          : "dropdown-option"}
        onClick={() => {
          setStatusFilter("In Progress");
          setShowStatusDropdown(false);
        }}
      >
        <span>↻</span>
        In Progress
        {statusFilter === "In Progress" && <strong>✓</strong>}
      </button>

      <button
        className={statusFilter === "Resolved"
          ? "dropdown-option active-option"
          : "dropdown-option"}
        onClick={() => {
          setStatusFilter("Resolved");
          setShowStatusDropdown(false);
        }}
      >
        <span>✓</span>
        Resolved
        {statusFilter === "Resolved" && <strong>✓</strong>}
      </button>

    </div>
  )}

</div>

      </div>

      <div className="all-reports">
{loadingReports && (
  <p style={{ padding: "20px" }}>
    Loading reports...
  </p>
)}

{reportsError && (
  <p style={{ padding: "20px" }}>
    ❌ {reportsError}
  </p>
)}

        <div className="report-header">
          <span>Issue</span>
          <span>Location</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Action</span>
        </div>


        {reports
  .filter((report) =>
    report.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.location.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((report) =>
    statusFilter === "All" || report.status === statusFilter
  )
  .map((report) => (

          <div className="report-item" key={report.id}>

            <span>
              {report.issue}
            </span>

            <span>
              {report.location}
            </span>

            <span
  className={`priority-badge ${
    report.priorityLevel?.toLowerCase() || "low"
  }`}
>
  {report.priorityLevel || "Low"}
</span>

            <span className="status">
              {report.status}
            </span>

           <button
             className="details-button"
             onClick={() => {
               setSelectedReport(report);
               setUpdatedStatus(report.status);
          }}
        >
          View Details
         </button>
          </div>

        ))}

      </div>
{selectedReport && (
  <div className="details-panel">

    <div className="details-header">

      <h2>Issue Details</h2>

      <button
        className="close-button"
        onClick={() => setSelectedReport(null)}
      >
        ✕
      </button>

    </div>


    <div className="details-content">

      <h3>{selectedReport.issue}</h3>
{selectedReport.photoUrl && (
  <div style={{ marginTop: "20px", marginBottom: "20px" }}>
    <h3>📸 Citizen Report Photo</h3>

    <img
      src={`http://localhost:5050${selectedReport.photoUrl}`}
      alt="Citizen reported issue"
      style={{
        width: "100%",
        maxWidth: "500px",
        maxHeight: "350px",
        objectFit: "cover",
        borderRadius: "12px",
        border: "1px solid #ddd",
        display: "block",
      }}
    />
  </div>
)}
      <div className="issue-summary-cards">

  <div className="issue-summary-card">
    <div className="summary-icon location-icon">
      📍
    </div>

    <div className="summary-content">
      <span>Location</span>
      <strong>{selectedReport.location}</strong>
    </div>
  </div>

  <div className="issue-summary-card">
    <div className="summary-icon priority-icon">
      📊
    </div>

    <div className="summary-content">
      <span>Priority</span>
      <strong>{selectedReport.priority}</strong>
    </div>
  </div>

  <div className="issue-summary-card">
    <div className="summary-icon department-icon">
      🏢
    </div>

    <div className="summary-content">
      <span>Department</span>

      <strong>
        {selectedReport.issue.includes("Pothole")
          ? "Road Department"
          : selectedReport.issue.includes("Garbage")
          ? "Sanitation Department"
          : selectedReport.issue.includes("Streetlight")
          ? "Electrical Department"
          : "Water Department"}
      </strong>
    </div>
  </div>

</div>

      <div className="status-update">
        <strong>Status:</strong>

        <select
          value={updatedStatus}
          onChange={(e) => setUpdatedStatus(e.target.value)}
       >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
     </select>
</div>
<button
  className="save-status-button"
  onClick={async () => {
    try {
      const response = await fetch(
        `http://localhost:5050/api/complaints/${selectedReport.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: updatedStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update status"
        );
      }

      // Update report list in UI
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === selectedReport.id
            ? {
                ...report,
                status: updatedStatus,
              }
            : report
        )
      );

      // Update selected report
      setSelectedReport((prevReport) => ({
        ...prevReport,
        status: updatedStatus,
      }));

      alert("✅ Status updated successfully!");
    } catch (error) {
      console.error("Status update error:", error);
      alert(`❌ Failed to update status: ${error.message}`);
    }
  }}
>
  ✓ Save Status
</button>

      
      <div className="ai-verification">
  <h3>🤖 AI Resolution Verification</h3>

  <div className="verification-photos">

    <div className="photo-box">
  {beforePhotoPreview ? (
    <img
      src={beforePhotoPreview}
      alt="Before issue"
      className="verification-image"
    />
  ) : (
    <div className="photo-placeholder">
      📷
    </div>
  )}

  <h4>Before Photo</h4>
  <p>Original issue photo</p>

  <label className="photo-upload-button">
    📤 Upload Before Photo
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
  const file = e.target.files[0];

  if (file) {
    setBeforePhoto(file);
    setBeforePhotoPreview(URL.createObjectURL(file));
    setAiVerified(false);
    setVerificationResult(null);
  }
}}
    />
  </label>
</div>

    <div className="photo-box">
  {afterPhotoPreview ? (
    <img
      src={afterPhotoPreview}
      alt="After issue"
      className="verification-image"
    />
  ) : (
    <div className="photo-placeholder">
      📷
    </div>
  )}

  <h4>After Photo</h4>
  <p>Repair completion photo</p>

  <label className="photo-upload-button">
    📤 Upload After Photo
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
  const file = e.target.files[0];

  if (file) {
    setAfterPhoto(file);
    setAfterPhotoPreview(URL.createObjectURL(file));
    setAiVerified(false);
    setVerificationResult(null);
  }
}}
    />
  </label>
</div>

  </div>

 <div className="verification-result">
  <span>Verification Status</span>

  {verificationResult ? (
  <div className="ai-success-result">
    <strong>
      {verificationResult.resolved &&
      verificationResult.sameIssue
        ? "✅ Verified"
        : "❌ Not Resolved"}
    </strong>

    <p>{verificationResult.reason}</p>

    <small>
      AI Confidence:{" "}
      {Math.round(
        verificationResult.confidence * 100
      )}
      %
    </small>

    <small>
      Before Severity:{" "}
      {verificationResult.beforeSeverity}/5
    </small>

    <small>
      After Severity:{" "}
      {verificationResult.afterSeverity}/5
    </small>
  </div>
) : (
  <strong>⏳ Waiting for AI Verification</strong>
)}
</div>
 <button
  className={`verify-button ${
    aiVerified ? "verification-complete" : ""
  }`}
  onClick={async () => {
    try {
      setAiLoading(true);
      setAiVerified(false);
      setVerificationResult(null);

      const formData = new FormData();

      formData.append("beforeImage", beforePhoto);
      formData.append("afterImage", afterPhoto);

      const response = await fetch(
        "http://localhost:5050/api/verify-resolution",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "AI verification failed"
        );
      }

      console.log("AI Verification Result:", result);

      setVerificationResult(result.data);

      if (
        result.data.resolved &&
        result.data.sameIssue &&
        selectedReport?.id
      ) {
        const statusResponse = await fetch(
          `http://localhost:5050/api/complaints/${selectedReport.id}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "Resolved",
            }),
          }
        );

        const statusResult = await statusResponse.json();

        if (!statusResponse.ok || !statusResult.success) {
          throw new Error(
            statusResult.message ||
              "Failed to update complaint status"
          );
        }

        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === selectedReport.id
              ? {
                  ...report,
                  status: "Resolved",
                }
              : report
          )
        );

        setSelectedReport((prevReport) => ({
          ...prevReport,
          status: "Resolved",
        }));

        setUpdatedStatus("Resolved");
        setAiVerified(true);
      }
    } catch (error) {
      console.error("AI verification error:", error);

      alert(`❌ Verification failed: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  }}
  disabled={
    !beforePhoto ||
    !afterPhoto ||
    aiLoading ||
    aiVerified
  }
>
  {aiLoading
    ? "⏳ AI is analyzing..."
    : aiVerified
    ? "✅ Verification Completed"
    : "🤖 Run AI Verification"}
</button>
</div>

      <div className="issue-timeline">

  <h3>Issue Timeline</h3>
  <div className="current-status">
  <span>Current Status</span>

  <strong>
    {selectedReport.status === "Resolved"
      ? "🟢 Resolved"
      : selectedReport.status === "In Progress"
      ? "🟠 Work In Progress"
      : "🟡 Pending"}
  </strong>
</div>

  <div className="timeline">

    <div className="timeline-item completed">
      <div className="timeline-dot">✓</div>

      <div className="timeline-content">
        <strong>Report Submitted</strong>
        <span>Citizen reported the issue</span>
        <small>10:42 AM</small>
      </div>
    </div>


    <div className="timeline-item completed">
      <div className="timeline-dot">✓</div>

      <div className="timeline-content">
        <strong>AI Analysis Completed</strong>
        <span>Issue detected and priority calculated</span>
        <small>10:43 AM</small>
      </div>
    </div>


    <div className="timeline-item completed">
      <div className="timeline-dot">✓</div>

      <div className="timeline-content">
        <strong>Assigned to Department</strong>
        <span>Road Department assigned</span>
        <small>10:45 AM</small>
      </div>
    </div>


    <div
  className={`timeline-item ${
    selectedReport.status === "In Progress" ||
    selectedReport.status === "Resolved"
      ? "completed"
      : "active"
  }`}
>
  <div className="timeline-dot">
    {selectedReport.status === "Resolved" ? "✓" : "●"}
  </div>

  <div className="timeline-content">
    <strong>Work In Progress</strong>
    <span>Department is working on the issue</span>
    <small>
      {selectedReport.status === "Pending"
        ? "Pending"
        : "Completed"}
    </small>
  </div>
</div>

<div
  className={`timeline-item ${
    selectedReport.status === "Resolved"
      ? "completed"
      : ""
  }`}
>
  <div className="timeline-dot">
    {selectedReport.status === "Resolved" ? "✓" : "○"}
  </div>

  <div className="timeline-content">
    <strong>Resolution Submitted</strong>
    <span>
      {selectedReport.status === "Resolved"
        ? "Repair completion submitted"
        : "Waiting for repair completion"}
    </span>
    <small>
      {selectedReport.status === "Resolved"
        ? "Completed"
        : "Pending"}
    </small>
  </div>
</div>

<div
  className={`timeline-item ${
    selectedReport.status === "Resolved"
      ? "completed"
      : ""
  }`}
>
  <div className="timeline-dot">
    {selectedReport.status === "Resolved" ? "✓" : "○"}
  </div>

  <div className="timeline-content">
    <strong>AI Verification</strong>
    <span>
      {selectedReport.status === "Resolved"
        ? "Before/after photos verified by AI"
        : "Before/after photos will be verified"}
    </span>
    <small>
      {selectedReport.status === "Resolved"
        ? "Verified"
        : "Pending"}
    </small>
  </div>
</div>

  </div>

</div>

    </div>

  </div>
)}
    </div>
  );
}

export default Reports;