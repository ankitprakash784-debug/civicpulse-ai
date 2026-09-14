import { useState } from 'react';
import './ReportIssue.css';

function ReportIssue() {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      setFormData((prev) => ({
        ...prev,
        location: `${latitude}, ${longitude}`,
      }));
    },
    () => {
      alert('Location access allow karo, phir dobara 📍 button dabao.');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('Image:', image);
    // Backend API call yahan aage add karenge
    alert('Complaint submitted (test) — backend connection abhi baaki hai');
  };

  return (
    <div className="report-container page-fade">
      <h1>Report an Issue</h1>
      <form className="report-form" onSubmit={handleSubmit}>
        <label htmlFor="category">Issue Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Category --</option>
          <option value="pothole">Pothole</option>
          <option value="garbage">Garbage</option>
          <option value="streetlight">Broken Streetlight</option>
          <option value="water_leakage">Water Leakage</option>
        </select>

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          placeholder="Describe the issue..."
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="location">Location</label>
        <div className="location-input-wrapper">
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
    className="location-button"
    onClick={getCurrentLocation}
    title="Use my current location"
  >
    📍
  </button>
</div>

<label htmlFor="image">Upload Photo</label>
<div className="file-upload-box">
  <input
    type="file"
    id="image"
    name="image"
    accept="image/*"
    onChange={handleImageChange}
    required
  />
  <label htmlFor="image" className="file-upload-label">
    <span className="upload-icon">📷</span>
    <span>{image ? image.name : 'Click to upload or drag a photo here'}</span>
  </label>
</div>

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <button type="submit" className="submit-btn">Submit Complaint</button>
      </form>
    </div>
  );
}

export default ReportIssue;