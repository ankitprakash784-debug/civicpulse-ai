const {
  checkDuplicateComplaint
} = require("../services/duplicateService");

function checkDuplicate(req, res) {
  try {
    const {
      newComplaint,
      existingComplaints
    } = req.body;

    if (!newComplaint) {
      return res.status(400).json({
        success: false,
        message: "New complaint data is required"
      });
    }

    const result = checkDuplicateComplaint(
      newComplaint,
      existingComplaints || []
    );

    return res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Duplicate Detection Error:", error);

    return res.status(500).json({
      success: false,
      message: "Duplicate detection failed",
      error: error.message
    });
  }
}

module.exports = {
  checkDuplicate
};