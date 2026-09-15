const {
  checkDuplicateComplaint,
} = require("../services/duplicateService");

const {
  getComplaints,
} = require("../services/firestoreService");

async function checkDuplicate(req, res) {
  try {
    const { newComplaint } = req.body;

    if (!newComplaint) {
      return res.status(400).json({
        success: false,
        message: "New complaint data is required",
      });
    }

    // Get real existing complaints from Firestore
    const existingComplaints = await getComplaints();

    const result = checkDuplicateComplaint(
      newComplaint,
      existingComplaints
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Duplicate Detection Error:", error);

    return res.status(500).json({
      success: false,
      message: "Duplicate detection failed",
      error: error.message,
    });
  }
}

module.exports = {
  checkDuplicate,
};