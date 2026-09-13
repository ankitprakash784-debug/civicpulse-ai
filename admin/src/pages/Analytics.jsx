import { useState } from "react";
function Analytics({ onNavigate }) {
    const [selectedIssue, setSelectedIssue] = useState("All");
  return (
    <div className="analytics-page">

      <div className="page-title">
        <h2>Analytics</h2>
        <p>Overview of civic issues and resolution performance</p>
      </div>


      {/* ANALYTICS CARDS */}

      <div className="analytics-cards">

       <div
  className="analytics-card"
 onClick={() => onNavigate("reports")}
>
  <span>Total Reports</span>
  <strong>247</strong>
  <small>All reported issues</small>
</div>

        <div
  className="analytics-card"
 onClick={() => onNavigate("critical")}
>
  <span>Critical Issues</span>
  <strong>31</strong>
  <small>Require urgent attention</small>
</div>

        <div
  className="analytics-card"
  onClick={() => onNavigate("resolved")}
>
  <span>Resolved</span>
  <strong>140</strong>
  <small>Successfully resolved</small>
</div>

        <div
  className="analytics-card"
  onClick={() => alert("Opening resolution performance...")}
>
  <span>Resolution Rate</span>
  <strong>57%</strong>
  <small>Overall resolution rate</small>
</div>

      </div>


      {/* ISSUE DISTRIBUTION */}

      <div className="analytics-section">

        <h3>Issue Distribution</h3>

        <div
          className={`issue-bar ${
            selectedIssue === "Potholes" ? "selected" : ""
          }`}
          onClick={() => setSelectedIssue("Potholes")}
        >

          <div className="issue-label">
            <span>🕳️ Potholes</span>
            <strong>95</strong>
          </div>

          <div className="bar">
            <div
              className="bar-fill"
              style={{ width: "85%" }}
            ></div>
          </div>

        </div>


        <div
          className={`issue-bar ${
            selectedIssue === "Garbage" ? "selected" : ""
          }`}
         onClick={() => setSelectedIssue("Garbage")}
        >

          <div className="issue-label">
            <span>🗑️ Garbage</span>
            <strong>62</strong>
          </div>

          <div className="bar">
            <div
              className="bar-fill"
              style={{ width: "65%" }}
            ></div>
          </div>

        </div>


        <div
          className={`issue-bar ${
           selectedIssue === "Streetlights" ? "selected" : ""
        }`}
        onClick={() => setSelectedIssue("Streetlights")}
        >

          <div className="issue-label">
            <span>💡 Streetlights</span>
            <strong>48</strong>
          </div>

          <div className="bar">
            <div
              className="bar-fill"
              style={{ width: "50%" }}
            ></div>
          </div>

        </div>


       <div
         className={`issue-bar ${
           selectedIssue === "Water Leakage" ? "selected" : ""
   }`}
   onClick={() => setSelectedIssue("Water Leakage")}
   >

          <div className="issue-label">
            <span>🚰 Water Leakage</span>
            <strong>42</strong>
          </div>

          <div className="bar">
            <div
              className="bar-fill"
              style={{ width: "45%" }}
            ></div>
          </div>

        </div>
       {selectedIssue !== "All" && (
  <div className="selected-issue">
    <span>
      Selected: <strong>{selectedIssue}</strong>
    </span>

    <button
      onClick={() => setSelectedIssue("All")}
    >
      Clear
    </button>
  </div>
)}

      </div>


      {/* RESOLUTION */}

      <div className="analytics-section">

        <h3>Resolution Performance</h3>

        <div className="resolution-box">

          <div className="resolution-circle">
  <div className="circle-progress">
    <strong>57%</strong>
    <span>Resolved</span>
  </div>
</div>

          <div className="resolution-info">

           <p
  onClick={() => setSelectedIssue("Pending")}
  className={selectedIssue === "Pending" ? "resolution-selected" : ""}
>
  <span className="dot pending-dot"></span>
  Pending: <strong>76</strong>
</p>

           <p
  onClick={() => setSelectedIssue("In Progress")}
  className={
    selectedIssue === "In Progress"
      ? "resolution-selected"
      : ""
  }
>
  <span className="dot progress-dot"></span>
  In Progress: <strong>31</strong>
</p>

           <p
  onClick={() => setSelectedIssue("Resolved")}
  className={
    selectedIssue === "Resolved"
      ? "resolution-selected"
      : ""
  }
>
  <span className="dot resolved-dot"></span>
  Resolved: <strong>140</strong>
</p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;