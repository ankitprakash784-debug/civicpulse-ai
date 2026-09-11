const { generateComplaint } = require("../services/complaintService");

function createComplaint(req, res) {
  try {
    const { analysis, location } = req.body;

    if (!analysis) {
      return res.status(400).json({
        success: false,
        message: "Analysis data is required"
      });
    }

    const complaint = generateComplaint(
      analysis,
      location
    );

    return res.json({
      success: true,
      complaint
    });

  } catch (error) {
    console.error("Complaint Generation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Complaint generation failed",
      error: error.message
    });
  }
}

module.exports = {
  createComplaint
};