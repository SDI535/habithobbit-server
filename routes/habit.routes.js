const express = require("express");
const router = express.Router();
const {
  getHabits,
  setHabit,
  updateHabit,
  deleteHabit,
  getHabit,
  getPublicHabits,
} = require("../controllers/habit.controller");

const protect = require("../middleware/auth.middleware");

router.route("/").get(protect, getHabits).post(protect, setHabit);
router
  .route("/:id")
  .put(protect, updateHabit)
  .delete(protect, deleteHabit)
  .get(protect, getHabit);

router.get("/public", protect, getPublicHabits);

module.exports = router;
