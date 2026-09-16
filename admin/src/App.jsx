import { useEffect, useState } from "react";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import GoogleMap from "./GoogleMap";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [reports, setReports] = useState([]);
  useEffect(() => {
  fetch("http://localhost:5050/api/complaints")
    .then((res) => res.json())
    .then((result) => {
      setReports(result.data || []);
      setLoadingReports(false);
    })
    .catch((error) => {
      console.error("Failed to fetch reports:", error);
      setLoadingReports(false);
    });
}, []);
  const [loadingReports, setLoadingReports] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
const [adminEmail, setAdminEmail] = useState("admin@civicpulse.ai");
  const [profileImage, setProfileImage] = useState(null);
  const [showCritical, setShowCritical] = useState(false);
const [showResolved, setShowResolved] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
const [notifications, setNotifications] = useState([
  {
    id: 1,
    message: "Critical pothole reported",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    message: "New garbage complaint received",
    time: "15 min ago",
    read: false,
  },
  {
    id: 3,
    message: "Streetlight issue pending",
    time: "1 hour ago",
    read: true,
  },
]);
  return (
    <>
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <div className={darkMode ? "admin-app dark-mode" : "admin-app"}>
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
         >
          ☰
        </button>

          {/* SIDEBAR */}
          <aside className={mobileMenuOpen ? "sidebar mobile-open" : "sidebar"}>

            <h1>CivicPulse</h1>

            <p className="admin-text">
              ADMIN PANEL
            </p>

            <nav>

              <button
               className={page === "dashboard" && !showCritical && !showResolved ? "nav-active" : ""}
               onClick={() => {
                setPage("dashboard");
                setShowCritical(false);
                setShowResolved(false);
              }}
            >
             Dashboard
          </button>

              <button
                className={page === "reports" ? "nav-active" : ""}
                onClick={() => setPage("reports")}
              >
                Reports
              </button>

              <button
               className={showCritical ? "nav-active" : ""}
               onClick={() => {
                setShowCritical(true);
                setShowResolved(false);
                setPage("dashboard");
            }}
            >
            Critical Issues
           </button>
              <button
  className="notification-button"
  onClick={() => setShowNotifications(!showNotifications)}
>
  🔔 Notifications
  <span className="notification-badge">
  {notifications.filter((notification) => !notification.read).length}
</span>
</button>

             <button
  className={page === "analytics" ? "nav-active" : ""}
  onClick={() => {
    setPage("analytics");
    setShowCritical(false);
    setShowResolved(false);
  }}
>
  Analytics
</button>

              <button
                className={showResolved ? "nav-active" : ""}
                onClick={() => {
                  setShowResolved(true);
                  setShowCritical(false);
                  setPage("dashboard");
                }}
              >
                Resolved
              </button>

            </nav>

          </aside>

          {showNotifications && (
 <div className="notification-panel">

  <div className="notification-header">
    <h3>Notifications</h3>
    <button
  className="mark-read-button"
  onClick={() => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  }}
>
  Mark all as read
</button>

    <button
      className="notification-close"
      onClick={() => setShowNotifications(false)}
    >
      ✕
    </button>
  </div>

  {notifications.map((notification) => (
  <div
    key={notification.id}
    className={`notification-item ${
      notification.read ? "read" : "unread"
    }`}
    onClick={() => {
      setNotifications(
        notifications.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item
        )
      );

      setShowNotifications(false);

     if (notification.id === 1) {
  // Critical pothole
  setShowCritical(true);
  setShowResolved(false);
  setPage("dashboard");
}

if (notification.id === 2) {
  // New garbage complaint
  setShowCritical(false);
  setShowResolved(false);
  setPage("reports");
}
    }}
  >
    <span className="notification-icon">
      {notification.id === 1
        ? "🚨"
        : notification.id === 2
        ? "🗑️"
        : "💡"}
    </span>

    <div className="notification-content">
      <strong>{notification.message}</strong>
      <small>{notification.time}</small>
    </div>
  </div>
))}
  </div>
)}

          {/* MAIN CONTENT */}
          <main className="main-content">

            {page === "reports" ? (
  <Reports />

) : page === "analytics" ? (
  <Analytics onNavigate={setPage} />

) : showCritical ? (
  <section className="reports-section">

    <div className="section-header">
      <div>
        <h3>Critical Issues</h3>
        <p>Issues requiring urgent attention</p>
      </div>
    </div>

    <div className="report-table">

      <div className="table-header">
        <span>Issue</span>
        <span>Location</span>
        <span>Priority</span>
        <span>Status</span>
      </div>

      <div className="table-row">
        <span>🕳️ Pothole</span>
        <span>Main Road</span>
        <span className="priority-high">92</span>
        <span className="status pending-status">Pending</span>
      </div>

      <div className="table-row">
        <span>🚰 Water Leakage</span>
        <span>Sector 12</span>
        <span className="priority-high">81</span>
        <span className="status pending-status">Pending</span>
      </div>

    </div>

  </section>

) : showResolved ? (
  <section className="reports-section">

    <div className="section-header">
      <div>
        <h3>Resolved Issues</h3>
        <p>Successfully resolved civic issues</p>
      </div>
    </div>

    <div className="report-table">

      <div className="table-header">
        <span>Issue</span>
        <span>Location</span>
        <span>Priority</span>
        <span>Status</span>
      </div>

      <div className="table-row">
        <span>💡 Streetlight</span>
        <span>Market Road</span>
        <span className="priority-medium">54</span>
        <span className="status resolved-status">Resolved</span>
      </div>

    </div>

  </section>

) : (

              <>

                {/* TOP BAR */}
                <header className="topbar">

                  <div>
                    <h2>Admin Dashboard</h2>

                    <p>
                      Monitor and manage civic issues
                    </p>
                  </div>
                 <button
                  className="theme-toggle"
                  onClick={() => setDarkMode(!darkMode)}
                 >
                  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                 </button>
                  <div className="admin-user">
                    👤 Admin

                    <button
                     className="view-profile-button"
                     onClick={() => setShowProfile(true)}
                  >
                   👤 View Profile
                  </button>

                    <button
                      className="logout-button"
                      onClick={() => setIsLoggedIn(false)}
                    >
                      Logout
                    </button>
                  </div>

                </header>

                {/* STAT CARDS */}
                <section className="stats-grid">

                  <div className="stat-card">
                    <span>Total Issues</span>
                    <strong>{reports.length}</strong>
                  </div>

                  <div className="stat-card critical">
                    <span>Critical</span>
                   <strong>
                     {reports.filter(
                       (report) => report.priorityLevel === "CRITICAL"
                   ).length}
                 </strong>
                  </div>

                  <div className="stat-card pending">
                    <span>Pending</span>
                    <strong>
  {reports.filter(
    (report) => report.status === "Pending"
  ).length}
</strong>
                  </div>

                  <div className="stat-card resolved">
                    <span>Resolved</span>
                    <strong>
  {reports.filter(
    (report) => report.status === "Resolved"
  ).length}
</strong>
                  </div>

                </section>
{/* ISSUE LOCATIONS */}

<section className="location-section">

  <div className="section-header">
    <div>
      <h3>Issue Locations</h3>
      <p>Reported civic issues across the city</p>
    </div>
  </div>

  <div className="location-content">

    <div className="location-map">

      <div className="map-title">
        🗺️ Civic Issue Map
      </div>

      <GoogleMap />

    </div>

    <div className="location-list">

      <div className="location-item">
        <span>🕳️</span>
        <div>
          <strong>Pothole</strong>
          <small>Main Road</small>
        </div>
        <b>92</b>
      </div>

      <div className="location-item">
        <span>🗑️</span>
        <div>
          <strong>Garbage</strong>
          <small>Sector 15</small>
        </div>
        <b>67</b>
      </div>

      <div className="location-item">
        <span>💡</span>
        <div>
          <strong>Streetlight</strong>
          <small>Market Road</small>
        </div>
        <b>54</b>
      </div>

      <div className="location-item">
        <span>💧</span>
        <div>
          <strong>Water Leakage</strong>
          <small>Sector 12</small>
        </div>
        <b>81</b>
      </div>

    </div>

  </div>

</section>
                {/* RECENT REPORTS */}
                <section className="reports-section">

                  <div className="section-header">

                    <h3>
                      Recent Civic Issues
                    </h3>

                    <button
                      className="view-button"
                      onClick={() => setPage("reports")}
                    >
                      View All
                    </button>

                  </div>

                  <div className="report-table">

                    <div className="table-header">
                      <span>Issue</span>
                      <span>Location</span>
                      <span>Priority</span>
                      <span>Status</span>
                    </div>

                    <div className="table-row">

                      <span>🕳️ Pothole</span>

                      <span>Main Road</span>

                      <span className="priority-high">
                        92
                      </span>

                      <span className="status pending-status">
                        Pending
                      </span>

                    </div>

                    <div className="table-row">

                      <span>🗑️ Garbage</span>

                      <span>Sector 15</span>

                      <span className="priority-medium">
                        67
                      </span>

                      <span className="status progress-status">
                        In Progress
                      </span>

                    </div>

                    <div className="table-row">

                      <span>💡 Streetlight</span>

                      <span>Market Road</span>

                      <span className="priority-medium">
                        54
                      </span>

                      <span className="status resolved-status">
                        Resolved
                      </span>

                    </div>

                  </div>

                </section>

              </>
            )}
{showProfile && (
  <div className="profile-overlay">
    <div className="profile-card">

      <button
        className="profile-close"
        onClick={() => setShowProfile(false)}
      >
        ✕
    </button>

     <div className="profile-avatar">
       {profileImage ? (
         <img src={profileImage} alt="Admin Profile" />
      ) : (
        "👤"
    )}
</div>

<label className="upload-photo-button">
  📷 Choose Photo
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];

      if (file) {
        setProfileImage(URL.createObjectURL(file));
      }
    }}
  />
</label> 

      <h2>Admin Profile</h2>

      <div className="profile-info">
        {editProfile ? (
  <>
    <p>
      <strong>Name:</strong>{" "}
      <input
        className="profile-input"
        value={adminName}
        onChange={(e) => setAdminName(e.target.value)}
      />
    </p>

    <p>
      <strong>Email:</strong>{" "}
      <input
        className="profile-input"
        value={adminEmail}
        onChange={(e) => setAdminEmail(e.target.value)}
      />
    </p>
  </>
) : (
  <>
    <p><strong>Name:</strong> {adminName}</p>
    <p><strong>Email:</strong> {adminEmail}</p>
  </>
)}
        <p>
         <strong>Status:</strong>{" "}
         <span className="active-status">● Active</span>
       </p>
      </div>
      {editProfile ? (
  <div className="profile-edit-actions">
    <button
      className="save-profile-button"
      onClick={() => setEditProfile(false)}
    >
      ✓ Save Changes
    </button>

    <button
      className="cancel-profile-button"
      onClick={() => setEditProfile(false)}
    >
      Cancel
    </button>
  </div>
) : (
  <button
    className="edit-profile-button"
    onClick={() => setEditProfile(true)}
  >
    ✏️ Edit Profile
  </button>
)}

    </div>
  </div>
)}
          </main>

        </div>
      )}
  </>
  );
}

export default App;