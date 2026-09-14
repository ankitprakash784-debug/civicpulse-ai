const {
  analyzeResolutionImages
} = require("../services/verificationService");

async function verifyResolution(req, res) {
  try {
    if (!req.files || !req.files.beforeImage || !req.files.afterImage) {
      return res.status(400).json({
        success: false,
        message: "Before and after images are required"
      });
    }

    const beforeFile = req.files.beforeImage[0];
    const afterFile = req.files.afterImage[0];

    const beforeImageBase64 =
      beforeFile.buffer.toString("base64");

    const afterImageBase64 =
      afterFile.buffer.toString("base64");

    const result = await analyzeResolutionImages(
      beforeImageBase64,
      beforeFile.mimetype,
      afterImageBase64,
      afterFile.mimetype
    );

    return res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Resolution Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Resolution verification failed",
      error: error.message
    });
  }
}

module.exports = {
  verifyResolution
};
