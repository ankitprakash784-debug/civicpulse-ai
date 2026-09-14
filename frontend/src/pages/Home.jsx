import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            ✨ AI-Powered Civic Reporting
          </div>

          <h1>
            Cleaner Cities.
            <br />
            <span>Greener</span> Tomorrows.
          </h1>

          <p>
            CivicPulse AI empowers citizens to report civic issues,
            track progress, and build cleaner, greener, and smarter
            cities together.
          </p>

          <div className="hero-buttons">
            <Link to="/report" className="hero-primary-btn">
              📢 &nbsp; Report an Issue →
            </Link>

            <Link to="/status" className="hero-secondary-btn">
              📍 &nbsp; View on Map
            </Link>
          </div>

        </div>


        {/* EARTH / CITY VISUAL */}
        <div className="hero-visual">

          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>

          <div className="earth">
            🌍
          </div>

          <div className="floating-card cleaner-card">
            🌿
            <div>
              <strong>Cleaner</strong>
              <span>Environments</span>
            </div>
          </div>

          <div className="floating-card green-card">
            🌳
            <div>
              <strong>Greener</strong>
              <span>Cities</span>
            </div>
          </div>

          <div className="floating-card community-card">
            👥
            <div>
              <strong>Stronger</strong>
              <span>Communities</span>
            </div>
          </div>

          <div className="floating-card governance-card">
            🏛️
            <div>
              <strong>Smarter</strong>
              <span>Governance</span>
            </div>
          </div>

          <div className="impact-text">
            Small
            <br />
            Reports
            <br />
            <span>Big Impact 🌿</span>
          </div>

        </div>

      </section>


      {/* STATS */}
      <section className="stats-section">

        <div className="stat-item">
          <div className="stat-icon">👥</div>
          <div>
            <strong>2,500+</strong>
            <span>Active Citizens</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon green">🌿</div>
          <div>
            <strong>1,200+</strong>
            <span>Issues Resolved</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon green">🌳</div>
          <div>
            <strong>50+</strong>
            <span>Greener Initiatives</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon purple">🏛️</div>
          <div>
            <strong>Cleaner Cities</strong>
            <span>Stronger Communities</span>
          </div>
        </div>

      </section>
{/* ENVIRONMENTAL IMPACT */}

<section className="impact-section">

  <div className="impact-heading">
    <div className="section-badge">
      OUR IMPACT
    </div>

    <h2>
      Small Actions.
      <span> Big Impact.</span>
    </h2>

    <p>
      Every report helps create cleaner streets, greener spaces,
      and stronger communities.
    </p>
  </div>


  <div className="impact-cards">

    <div className="impact-card">
      <div className="impact-card-icon">
        🌱
      </div>

      <div className="impact-card-content">
        <strong>1,200+</strong>
        <span>Issues Resolved</span>
      </div>
    </div>


    <div className="impact-card">
      <div className="impact-card-icon">
        💧
      </div>

      <div className="impact-card-content">
        <strong>340+</strong>
        <span>Water Issues Fixed</span>
      </div>
    </div>


    <div className="impact-card">
      <div className="impact-card-icon">
        🌳
      </div>

      <div className="impact-card-content">
        <strong>50+</strong>
        <span>Green Initiatives</span>
      </div>
    </div>


    <div className="impact-card">
      <div className="impact-card-icon">
        🏙️
      </div>

      <div className="impact-card-content">
        <strong>2,500+</strong>
        <span>Active Citizens</span>
      </div>
    </div>

  </div>


  <div className="impact-message">
    <span>🌿</span>
    Together, we're building a cleaner and greener future.
    <span>🌍</span>
  </div>

</section>

      {/* HOW IT WORKS */}
      <section className="how-section">

        <div className="section-badge">
          OUR PROCESS
        </div>

        <h2>
          How It <span>Works</span>
        </h2>

        <p>
          From reporting to resolution — together for a better tomorrow.
        </p>

        <div className="process-cards">

          <div className="process-card">
            <div className="process-icon">📄</div>
            <h3>Report</h3>
            <span>Submit a civic issue</span>
          </div>

          <div className="process-card">
            <div className="process-icon blue">📍</div>
            <h3>Locate</h3>
            <span>Pin the exact location</span>
          </div>

          <div className="process-card">
            <div className="process-icon green">📊</div>
            <h3>Track</h3>
            <span>Monitor progress</span>
          </div>

          <div className="process-card">
            <div className="process-icon purple">👥</div>
            <h3>Resolve</h3>
            <span>See the impact</span>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;