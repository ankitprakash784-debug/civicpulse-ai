const express = require("express");
const multer = require("multer");

const {
  verifyResolution
} = require("../controllers/verificationController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

router.post(
  "/verify-resolution",
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 }
  ]),
  verifyResolution
);

module.exports = router;
