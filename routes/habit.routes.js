const express = require("express");
const router = express.Router();
const {
  getHabits,
  setHabit,
  updateHabit,
  deleteHabit,
} = require("../controllers/habit.controller");

const protect = require("../middleware/auth.middleware");

router.route("/").get(protect, getHabits).post(protect, setHabit);
router.route("/:id").put(protect, updateHabit).delete(protect, deleteHabit);

module.exports = router;
