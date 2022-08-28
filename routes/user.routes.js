const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  uploadUrl,
  updateProfile,
} = require("../controllers/user.controller");

const protect = require("../middleware/auth.middleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/uploadurl", protect, uploadUrl);
router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

module.exports = router;
