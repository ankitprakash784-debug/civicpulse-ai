import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
function MapCenterUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 12);
    }
  }, [center, map]);

  return null;
}

const complaintMarker = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 34px;
      height: 34px;
      border-radius: 50% 50% 50% 0;
      background: #0f172a;
      border: 3px solid #60a5fa;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.35);
    ">
      <span style="
        transform: rotate(45deg);
        font-size: 16px;
      ">📍</span>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

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
  const getPriorityLevel = (score) => {
  const numericScore = Number(score) || 0;

  if (numericScore >= 400) return "CRITICAL";
  if (numericScore >= 250) return "HIGH";
  if (numericScore >= 100) return "MEDIUM";
  return "LOW";
};

const issueBreakdown = reports.reduce((acc, report) => {
  const issue = report.issue || "Other";

  acc[issue] = (acc[issue] || 0) + 1;

  return acc;
}, {});

const departmentBreakdown = reports.reduce((acc, report) => {
  const department =
    report.department || "General Civic Department";

  acc[department] = (acc[department] || 0) + 1;

  return acc;
}, {});

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
        priorityLevel: getPriorityLevel(complaint.priorityScore),
        status: complaint.status || "Pending",
        department: complaint.department,
        description: complaint.description,
        severity: complaint.severity,
        safetyRisk: complaint.safetyRisk,
        confidence: complaint.confidence,
        complaintText: complaint.complaintText,
        createdAt: complaint.createdAt,

        latitude: Number(complaint.latitude),
        longitude: Number(complaint.longitude),
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
const totalReports = reports.length;

const pendingReports = reports.filter(
  (report) => report.status === "Pending"
).length;

const inProgressReports = reports.filter(
  (report) => report.status === "In Progress"
).length;

const resolvedReports = reports.filter(
  (report) => report.status === "Resolved"
).length;

const highPriorityReports = reports.filter(
  (report) =>
    report.priorityLevel === "HIGH" ||
    report.priorityLevel === "CRITICAL"
).length;
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
      {/* DASHBOARD STATS */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  }}
>
  <div
    style={{
      background: "#fff",
      borderRadius: "14px",
      padding: "20px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}
  >
    <div style={{ fontSize: "28px" }}>📋</div>
    <div
      style={{
        fontSize: "14px",
        color: "#6b7280",
        marginTop: "8px",
      }}
    >
      Total Reports
    </div>
    <strong
      style={{
        display: "block",
        fontSize: "30px",
        marginTop: "4px",
      }}
    >
      {totalReports}
    </strong>
  </div>

  <div
    style={{
      background: "#fff",
      borderRadius: "14px",
      padding: "20px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}
  >
    <div style={{ fontSize: "28px" }}>🟡</div>
    <div
      style={{
        fontSize: "14px",
        color: "#6b7280",
        marginTop: "8px",
      }}
    >
      Pending
    </div>
    <strong
      style={{
        display: "block",
        fontSize: "30px",
        marginTop: "4px",
      }}
    >
      {pendingReports}
    </strong>
  </div>

  <div
    style={{
      background: "#fff",
      borderRadius: "14px",
      padding: "20px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}
  >
    <div style={{ fontSize: "28px" }}>🔴</div>
    <div
      style={{
        fontSize: "14px",
        color: "#6b7280",
        marginTop: "8px",
      }}
    >
      High Priority
    </div>
    <strong
      style={{
        display: "block",
        fontSize: "30px",
        marginTop: "4px",
      }}
    >
      {highPriorityReports}
    </strong>
  </div>

  <div
    style={{
      background: "#fff",
      borderRadius: "14px",
      padding: "20px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}
  >
    <div style={{ fontSize: "28px" }}>🟢</div>
    <div
      style={{
        fontSize: "14px",
        color: "#6b7280",
        marginTop: "8px",
      }}
    >
      Resolved
    </div>
    <strong
      style={{
        display: "block",
        fontSize: "30px",
        marginTop: "4px",
      }}
    >
      {resolvedReports}
    </strong>
  </div>
</div>
{/* PRIORITY BREAKDOWN */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  }}
>
  {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((level) => {
    const count = reports.filter(
      (report) => report.priorityLevel === level
    ).length;

    return (
      <div
        key={level}
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#6b7280",
            marginBottom: "8px",
          }}
        >
          {level} PRIORITY
        </div>

        <div
          style={{
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          {count}
        </div>
      </div>
    );
  })}
</div>
{/* ISSUE & DEPARTMENT BREAKDOWN */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "24px",
  }}
>
  {/* ISSUE BREAKDOWN */}
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      padding: "22px",
    }}
  >
    <h3 style={{ marginTop: 0, marginBottom: "18px" }}>
      📊 Issue Breakdown
    </h3>

    {Object.entries(issueBreakdown).map(([issue, count]) => (
      <div
        key={issue}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 0",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <span style={{ fontWeight: "600" }}>
          {issue}
        </span>

        <span style={{ fontWeight: "700", fontSize: "18px" }}>
          {count}
        </span>
      </div>
    ))}
  </div>

  {/* DEPARTMENT BREAKDOWN */}
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      padding: "22px",
    }}
  >
    <h3 style={{ marginTop: 0, marginBottom: "18px" }}>
      🏢 Department Breakdown
    </h3>

    {Object.entries(departmentBreakdown).map(
      ([department, count]) => (
        <div
          key={department}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <span style={{ fontWeight: "600" }}>
            {department}
          </span>

          <span
            style={{
              fontWeight: "700",
              fontSize: "18px",
            }}
          >
            {count}
          </span>
        </div>
      )
    )}
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
{/* CIVIC COMPLAINT MAP */}
{(() => {
  const mappedReports = reports.filter(
    (report) =>
      Number.isFinite(report.latitude) &&
      Number.isFinite(report.longitude)
  );

  const mapCenter =
    mappedReports.length > 0
      ? [
          mappedReports.reduce(
            (sum, report) => sum + report.latitude,
            0
          ) / mappedReports.length,
          mappedReports.reduce(
            (sum, report) => sum + report.longitude,
            0
          ) / mappedReports.length,
        ]
      : [28.6139, 77.209];

  return (
    <div
      style={{
        marginBottom: "24px",
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 8px 25px rgba(15, 23, 42, 0.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "20px",
            }}
          >
            🗺️ Civic Issue Map
          </h3>

          <p
            style={{
              margin: "5px 0 0",
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            Live complaint locations from citizen GPS data
          </p>
        </div>

        <span
          style={{
            background: "#eff6ff",
            color: "#2563eb",
            padding: "7px 12px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          📍 {mappedReports.length} mapped reports
        </span>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{
          height: "420px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <MapCenterUpdater center={mapCenter} />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mappedReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={complaintMarker}
          >
            <Popup>
              <div style={{ minWidth: "190px" }}>
                <strong style={{ fontSize: "15px" }}>
                  {report.issue}
                </strong>

                <p style={{ margin: "8px 0 4px" }}>
                  📍 {report.location}
                </p>

                <p style={{ margin: "4px 0" }}>
                  📊 Priority:{" "}
                  <strong>{report.priorityLevel}</strong>
                </p>

                <p style={{ margin: "4px 0" }}>
                  📌 Status:{" "}
                  <strong>{report.status}</strong>
                </p>

                <p
                  style={{
                    margin: "4px 0",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  GPS: {report.latitude.toFixed(5)},{" "}
                  {report.longitude.toFixed(5)}
                </p>

                <button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedReport(report);
    setUpdatedStatus(report.status);

    setTimeout(() => {
      document.querySelector(".details-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }}
                  style={{
                    marginTop: "8px",
                    width: "100%",
                    padding: "8px",
                    border: "none",
                    borderRadius: "7px",
                    background: "#0f172a",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {mappedReports.length === 0 && (
        <p
          style={{
            margin: "10px 0 0",
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          No complaints with GPS coordinates yet.
        </p>
      )}
    </div>
  );
})()}

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
      <small>
        {selectedReport.createdAt
          ? new Date(selectedReport.createdAt).toLocaleString()
          : "Submitted"}
      </small>
    </div>
  </div>


  <div className="timeline-item completed">
    <div className="timeline-dot">✓</div>

    <div className="timeline-content">
      <strong>AI Analysis Completed</strong>
      <span>
        {selectedReport.issue
          ? `${selectedReport.issue} detected and priority calculated`
          : "Issue detected and priority calculated"}
      </span>
      <small>Completed</small>
    </div>
  </div>


  <div className="timeline-item completed">
    <div className="timeline-dot">✓</div>

    <div className="timeline-content">
      <strong>Assigned to Department</strong>
      <span>
        {selectedReport.department || "Civic Department"} assigned
      </span>
      <small>Completed</small>
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

      <span>
        {selectedReport.status === "Pending"
          ? "Awaiting department action"
          : selectedReport.status === "In Progress"
          ? "Department is working on the issue"
          : "Department work completed"}
      </span>

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
      <strong>Complaint Resolved</strong>

      <span>
        {selectedReport.status === "Resolved"
          ? "Issue successfully verified and resolved"
          : "Issue not yet resolved"}
      </span>

      <small>
        {selectedReport.status === "Resolved"
          ? "Completed"
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