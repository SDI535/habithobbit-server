const express = require("express");
const router = express.Router();
const {
  getHabits,
  setHabit,
  updateHabit,
  deleteHabit,
  getHabit,
} = require("../controllers/habit.controller");

const protect = require("../middleware/auth.middleware");

router.route("/").get(protect, getHabits).post(protect, setHabit);
router
  .route("/:id")
  .put(protect, updateHabit)
  .delete(protect, deleteHabit)
  .get(protect, getHabit);

module.exports = router;
