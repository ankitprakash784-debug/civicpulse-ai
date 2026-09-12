import { useState } from 'react';
import './ReportIssue.css';

const API_URL = 'http://localhost:5050';

function ReportIssue() {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [complaint, setComplaint] = useState('');
  const [complaintLoading, setComplaintLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setAiResult(null);
      setComplaint('');
      setError('');
    }
  };

  // =========================
  // AI IMAGE ANALYSIS
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Please upload an image.');
      return;
    }

    setLoading(true);
    setError('');
    setAiResult(null);
    setComplaint('');

    try {
      const uploadData = new FormData();

      uploadData.append('image', image);

      const response = await fetch(
        `${API_URL}/api/ai/analyze`,
        {
          method: 'POST',
          body: uploadData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'AI analysis failed'
        );
      }

      console.log(
        'CivicPulse AI Result:',
        result.data
      );

      setAiResult(result.data);

    } catch (err) {
      console.error(
        'AI Analysis Error:',
        err
      );

      setError(
        err.message ||
        'Unable to connect to CivicPulse AI backend.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GENERATE COMPLAINT
  // =========================

  const handleGenerateComplaint = async () => {
    if (!aiResult) {
      return;
    }

    setComplaintLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_URL}/api/generate-complaint`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            analysis: aiResult,
            location: formData.location,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
          'Complaint generation failed'
        );
      }

      console.log(
        'Generated Complaint:',
        result.complaint
      );

      setComplaint(result.complaint);

    } catch (err) {
      console.error(
        'Complaint Generation Error:',
        err
      );

      setError(
        err.message ||
        'Unable to generate complaint.'
      );
    } finally {
      setComplaintLoading(false);
    }
  };

  return (
    <div className="home-container page-fade">

      <h1>Report an Issue</h1>

      <form
        className="report-form"
        onSubmit={handleSubmit}
      >

        <label htmlFor="category">
          Issue Category
        </label>

        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">
            -- Select Category --
          </option>

          <option value="pothole">
            Pothole
          </option>

          <option value="garbage">
            Garbage
          </option>

          <option value="streetlight">
            Broken Streetlight
          </option>

          <option value="water_leakage">
            Water Leakage
          </option>
        </select>


        <label htmlFor="description">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows="4"
          placeholder="Describe the issue..."
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>


        <label htmlFor="location">
          Location
        </label>

        <input
          type="text"
          id="location"
          name="location"
          placeholder="Enter address or landmark"
          value={formData.location}
          onChange={handleChange}
          required
        />


        <label htmlFor="image">
          Upload Photo
        </label>

        <div className="file-upload-box">

          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          <label
            htmlFor="image"
            className="file-upload-label"
          >
            <span className="upload-icon">
              📷
            </span>

            <span>
              {image
                ? image.name
                : 'Click to upload or drag a photo here'}
            </span>
          </label>

        </div>


        {preview && (
          <div className="image-preview">
            <img
              src={preview}
              alt="Preview"
            />
          </div>
        )}


        {error && (
          <div className="ai-error">
            {error}
          </div>
        )}


        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading
            ? 'Analyzing with AI...'
            : 'Submit Complaint'}
        </button>

      </form>


      {/* =========================
          AI RESULT
          ========================= */}

      {aiResult && (
        <div className="ai-result-card">

          <div className="ai-result-header">

            <div>
              <span className="ai-icon">
                🤖
              </span>

              <h2>
                CivicPulse AI Result
              </h2>
            </div>

            <span
              className={`priority-badge priority-${aiResult.priority?.toLowerCase()}`}
            >
              {aiResult.priority}
            </span>

          </div>


          <div className="ai-result-grid">

            <div className="ai-result-item">
              <span className="result-label">
                Issue
              </span>

              <strong>
                {aiResult.issueType}
              </strong>
            </div>


            <div className="ai-result-item">
              <span className="result-label">
                Confidence
              </span>

              <strong>
                {(aiResult.confidence * 100).toFixed(0)}%
              </strong>
            </div>


            <div className="ai-result-item">
              <span className="result-label">
                Severity
              </span>

              <strong>
                {aiResult.severity}/5
              </strong>
            </div>


            <div className="ai-result-item">
              <span className="result-label">
                Safety Risk
              </span>

              <strong>
                {aiResult.safetyRisk}/5
              </strong>
            </div>


            <div className="ai-result-item">
              <span className="result-label">
                Priority Score
              </span>

              <strong>
                {aiResult.priorityScore}
              </strong>
            </div>


            <div className="ai-result-item">
              <span className="result-label">
                Department
              </span>

              <strong>
                {aiResult.department}
              </strong>
            </div>

          </div>


          <div className="ai-description">

            <span className="result-label">
              AI Description
            </span>

            <p>
              {aiResult.description}
            </p>

          </div>


          {/* GENERATE COMPLAINT BUTTON */}

          <button
            type="button"
            className="generate-complaint-btn"
            onClick={handleGenerateComplaint}
            disabled={complaintLoading}
          >
            {complaintLoading
              ? 'Generating Complaint...'
              : 'Generate Complaint'}
          </button>

        </div>
      )}


      {/* =========================
          GENERATED COMPLAINT
          ========================= */}

      {complaint && (
        <div className="complaint-result-card">

          <div className="complaint-header">
            <span>📄</span>

            <h2>
              Generated Complaint
            </h2>
          </div>

          <pre className="complaint-text">
            {complaint}
          </pre>

        </div>
      )}

    </div>
  );
}

export default ReportIssue;