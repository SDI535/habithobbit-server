const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/user.controller");

const protect = require("../middleware/auth.middleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

module.exports = router;