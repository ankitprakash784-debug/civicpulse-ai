import { useState } from "react";

function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
    const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setCurrentLocation({
          latitude,
          longitude,
        });

        setLocationLoading(false);

        console.log("Current Location:", latitude, longitude);
      },
      (error) => {
        console.error("Location Error:", error);

        setLocationLoading(false);

        alert(
          "Unable to get your current location. Please allow location access."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null); 
  const [aiVerified, setAiVerified] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [reports, setReports] = useState([
    {
      id: 1,
      issue: "🕳️ Pothole",
      location: "Main Road",
      priority: 92,
      status: "Pending",
    },
    {
      id: 2,
      issue: "🗑️ Garbage",
      location: "Sector 15",
      priority: 67,
      status: "In Progress",
    },
    {
      id: 3,
      issue: "💡 Streetlight",
      location: "Market Road",
      priority: 54,
      status: "Resolved",
    },
    {
      id: 4,
      issue: "🚰 Water Leakage",
      location: "Sector 12",
      priority: 81,
      status: "Pending",
    },
  ]);

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

           <span className="location-cell">
            {report.location}

            <button
              className="location-button"
              onClick={getCurrentLocation}
              title="Get current location"
            >
              {locationLoading ? "⏳" : "📍"}
            </button>
          </span>

            <span
  className={`priority-badge ${
    report.priority >= 80
      ? "high"
      : report.priority >= 50
      ? "medium"
      : "low"
  }`}
>
  {report.priority >= 80
    ? "High"
    : report.priority >= 50
    ? "Medium"
    : "Low"}
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
  onClick={() => {
    setReports(
      reports.map((report) =>
        report.id === selectedReport.id
          ? { ...report, status: updatedStatus }
          : report
      )
    );

    setSelectedReport({
      ...selectedReport,
      status: updatedStatus,
    });
  }}
>
  ✓ Save Status
</button>

      
      <div className="ai-verification">
  <h3>🤖 AI Resolution Verification</h3>

  <div className="verification-photos">

    <div className="photo-box">
  {beforePhoto ? (
    <img
      src={beforePhoto}
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
          setBeforePhoto(URL.createObjectURL(file));
        }
      }}
    />
  </label>
</div>

    <div className="photo-box">
  {afterPhoto ? (
    <img
      src={afterPhoto}
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
          setAfterPhoto(URL.createObjectURL(file));
        }
      }}
    />
  </label>
</div>

  </div>

 <div className="verification-result">
  <span>Verification Status</span>

  {aiVerified ? (
    <div className="ai-success-result">
      <strong>✅ Verified</strong>
      <p>Issue appears to be successfully resolved.</p>
      <small>AI Confidence: 94%</small>
    </div>
  ) : (
    <strong>⏳ Waiting for AI Verification</strong>
  )}
</div>
 <button
  className={`verify-button ${aiVerified ? "verification-complete" : ""}`}
  onClick={() => {
    setAiLoading(true);
    setAiVerified(false);

    setTimeout(() => {
      setAiLoading(false);
      setAiVerified(true);
    }, 2000);
  }}
  disabled={!beforePhoto || !afterPhoto || aiLoading || aiVerified}
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
  <strong>🟠 Work In Progress</strong>
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


    <div className="timeline-item active">
      <div className="timeline-dot">●</div>

      <div className="timeline-content">
        <strong>Work In Progress</strong>
        <span>Department is working on the issue</span>
        <small>12:20 PM</small>
      </div>
    </div>


    <div className="timeline-item">
      <div className="timeline-dot">○</div>

      <div className="timeline-content">
        <strong>Resolution Submitted</strong>
        <span>Waiting for repair completion</span>
        <small>Pending</small>
      </div>
    </div>


    <div className="timeline-item">
      <div className="timeline-dot">○</div>

      <div className="timeline-content">
        <strong>AI Verification</strong>
        <span>Before/after photos will be verified</span>
        <small>Pending</small>
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