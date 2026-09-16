import { useState } from 'react';
import './ReportIssue.css';

const API_URL = 'http://localhost:5050';

function ReportIssue() {
  const [formData, setFormData] = useState({
  category: '',
  description: '',
  location: '',
  latitude: '',
  longitude: '',
});

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [complaint, setComplaint] = useState('');
  const [complaintLoading, setComplaintLoading] = useState(false);

  const [duplicateResult, setDuplicateResult] = useState(null);
  const [duplicateLoading, setDuplicateLoading] = useState(false);

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
    setDuplicateResult(null);
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

  // =========================
// GENERATE + SAVE COMPLAINT
// =========================

const handleGenerateComplaint = async () => {
  if (!aiResult) {
    return;
  }

  setComplaintLoading(true);
  setError('');

  try {
    // 1. Generate complaint
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
        result.message || 'Complaint generation failed'
      );
    }

    console.log(
      'Generated Complaint:',
      result.complaint
    );

    setComplaint(result.complaint);

    // 2. Save complaint to Firestore
    const saveFormData = new FormData();

saveFormData.append(
  'issueType',
  aiResult.issueType
);

saveFormData.append(
  'description',
  formData.description || aiResult.description
);

saveFormData.append(
  'severity',
  aiResult.severity
);

saveFormData.append(
  'safetyRisk',
  aiResult.safetyRisk
);

saveFormData.append(
  'confidence',
  aiResult.confidence
);

saveFormData.append(
  'priorityScore',
  aiResult.priorityScore
);

saveFormData.append(
  'priority',
  aiResult.priority
);

saveFormData.append(
  'department',
  aiResult.department
);

saveFormData.append(
  'status',
  'Pending'
);

saveFormData.append(
  'location',
  formData.location
);
saveFormData.append(
  'latitude',
  formData.latitude
);

saveFormData.append(
  'longitude',
  formData.longitude
);

saveFormData.append(
  'complaintText',
  result.complaint
);

if (image) {
  saveFormData.append('image', image);
}

const saveResponse = await fetch(
  `${API_URL}/api/complaints`,
  {
    method: 'POST',
    body: saveFormData,
  }
);

    const saveResult = await saveResponse.json();

    if (!saveResponse.ok || !saveResult.success) {
      throw new Error(
        saveResult.message || 'Failed to save complaint'
      );
    }

    console.log(
      '✅ Complaint saved to Firestore:',
      saveResult.data
    );

  } catch (err) {
    console.error(
      'Complaint Generation / Firestore Error:',
      err
    );

    setError(
      err.message ||
        'Unable to generate or save complaint.'
    );
  } finally {
    setComplaintLoading(false);
  }
};
    // =========================
  // DUPLICATE COMPLAINT CHECK
  // =========================

  const handleCheckDuplicate = async () => {
    if (!aiResult) {
      return;
    }

    setDuplicateLoading(true);
    setDuplicateResult(null);
    setError('');

    try {
      const response = await fetch(
        `${API_URL}/api/check-duplicate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
  newComplaint: {
    issueType: aiResult.issueType,
    description:
      formData.description || aiResult.description,
    latitude: formData.latitude,
    longitude: formData.longitude,
  },


            // Check against real complaints stored in Firestore
            body: JSON.stringify({
  newComplaint: {
    issueType: aiResult.issueType,
    description:
      formData.description || aiResult.description,
    latitude: formData.latitude,
    longitude: formData.longitude,
  },
}),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Duplicate check failed'
        );
      }

      console.log(
        'Duplicate Detection Result:',
        result.data
      );

      setDuplicateResult(result.data);

    } catch (err) {
      console.error(
        'Duplicate Detection Error:',
        err
      );

      setError(
        err.message ||
        'Unable to check duplicate complaints.'
      );
    } finally {
      setDuplicateLoading(false);
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
<button
  type="button"
  onClick={() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));

        setError("");
      },
      (error) => {
        console.error("Location error:", error);
        setError("Unable to get your current location.");
      }
    );
  }}
  style={{
  marginTop: "10px",
  width: "100%",
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid rgba(96, 165, 250, 0.35)",
  background: "rgba(30, 41, 59, 0.75)",
  color: "#e2e8f0",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
}}
>
  📍 Use My Current Location
</button>

{formData.latitude && formData.longitude && (
  <p style={{ marginTop: "8px", fontSize: "13px", color: "#16a34a" }}>
    ✅ GPS Location captured
  </p>
)}

        <label htmlFor="image">
          Upload Photo
        </label>

        <div className="file-upload-box">

          <input
  type="file"
  id="image"
  name="image"
  accept="image/*"
  capture="environment"
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
<button
  type="button"
  className="generate-complaint-btn"
  onClick={handleCheckDuplicate}
  disabled={duplicateLoading}
>
  {duplicateLoading
    ? 'Checking Duplicate...'
    : 'Check Duplicate Complaint'}
</button>

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
          DUPLICATE RESULT
          ========================= */}

      {duplicateResult && (
        <div className="complaint-result-card">

          <div className="complaint-header">
            <span>
              {duplicateResult.isDuplicate ? '⚠️' : '✅'}
            </span>

            <h2>
              {duplicateResult.isDuplicate
                ? 'Duplicate Complaint Detected'
                : 'No Duplicate Found'}
            </h2>
          </div>

          <div className="ai-description">

            <p>
              {duplicateResult.reason}
            </p>

            {duplicateResult.isDuplicate && (
              <p>
                <strong>
                  Existing Complaint:
                </strong>{' '}
                {duplicateResult.duplicateComplaintId}
              </p>
            )}

            {duplicateResult.distanceInKm !== undefined && (
              <p>
                <strong>
                  Distance:
                </strong>{' '}
                {duplicateResult.distanceInKm} km
              </p>
            )}

            {duplicateResult.similarity !== undefined && (
              <p>
                <strong>
                  Description Similarity:
                </strong>{' '}
                {(duplicateResult.similarity * 100).toFixed(0)}%
              </p>
            )}

          </div>

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