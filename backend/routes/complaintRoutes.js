const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const {
  createComplaint,
} = require("../controllers/complaintController");

const {
  createComplaint: saveComplaint,
  getComplaints,
  updateComplaintStatus,
} = require("../services/firestoreService");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const uniqueName =
      `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});
// Existing complaint generation
router.post("/generate-complaint", createComplaint);

// Save complaint to Firestore
router.post(
  "/complaints",
  upload.single("image"),
  async (req, res) => {
  try {
    const complaintData = {
  ...req.body,

  severity: Number(req.body.severity),
  safetyRisk: Number(req.body.safetyRisk),
  confidence: Number(req.body.confidence),
  priorityScore: Number(req.body.priorityScore),

  photoUrl: req.file
    ? `/uploads/${req.file.filename}`
    : null,
};

const complaint = await saveComplaint(complaintData);

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error("Firestore save error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save complaint",
      error: error.message,
    });
  }
});

// Get all complaints from Firestore
router.get("/complaints", async (req, res) => {
  try {
    const complaints = await getComplaints();

    res.json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error("Firestore fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
});

// Update complaint status in Firestore
router.patch("/complaints/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updatedComplaint = await updateComplaintStatus(id, status);

    res.json({
      success: true,
      data: updatedComplaint,
    });
  } catch (error) {
    console.error("Firestore status update error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update complaint status",
      error: error.message,
    });
  }
});

module.exports = router;