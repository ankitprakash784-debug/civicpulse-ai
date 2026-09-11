import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>CivicPulse AI</h1>
        <p className="tagline">Don't just report problems. Prove they're fixed.</p>
        <Link to="/report" className="cta-btn">Report an Issue</Link>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step-card">
            <span className="step-number">1</span>
            <h3>Upload a Photo</h3>
            <p>Snap a picture of a pothole, garbage, streetlight, or water leakage.</p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h3>AI Analyzes It</h3>
            <p>Our AI detects the issue, calculates severity, and routes it to the right department.</p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h3>Track Progress</h3>
            <p>Follow your complaint status from Pending to In Progress to Resolved.</p>
          </div>
          <div className="step-card">
            <span className="step-number">4</span>
            <h3>Verified Fix</h3>
            <p>After repair, AI compares before/after photos to confirm the issue is truly resolved.</p>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2>What Can You Report?</h2>
        <div className="category-tags">
          <span>🕳️ Pothole</span>
          <span>🗑️ Garbage</span>
          <span>💡 Broken Streetlight</span>
          <span>💧 Water Leakage</span>
        </div>
      </section>
    </div>
  );
}

export default Home;