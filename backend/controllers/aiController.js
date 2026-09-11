const { analyzeCivicImage } = require("../services/geminiService");
const { calculatePriority } = require("../services/priorityService");

async function analyzeImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const imageBase64 = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    // AI image analysis
    const result = await analyzeCivicImage(
      imageBase64,
      mimeType
    );

    // Calculate civic priority
    const priorityResult = calculatePriority(
      result.severity,
      result.safetyRisk,
      1
    );

    return res.json({
      success: true,
      data: {
        ...result,
        priorityScore: priorityResult.score,
        priority: priorityResult.priority
      }
    });

  } catch (error) {
    console.error("AI Analysis Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI analysis failed",
      error: error.message
    });
  }
}

module.exports = {
  analyzeImage
};