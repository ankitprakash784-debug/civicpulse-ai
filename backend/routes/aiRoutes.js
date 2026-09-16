const express = require("express");
const multer = require("multer");

const { analyzeImage } = require("../controllers/aiController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

router.post("/analyze", upload.single("image"), analyzeImage);

module.exports = router;