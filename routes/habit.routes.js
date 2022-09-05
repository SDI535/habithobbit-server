const express = require("express");
const router = express.Router();
const {
  getHabits,
  setHabit,
  updateHabit,
  deleteHabit,
  getHabit,
  getPublicHabits,
  likeHabit,
  unlikeHabit,
} = require("../controllers/habit.controller");

const protect = require("../middleware/auth.middleware");

router.route("/").get(protect, getHabits).post(protect, setHabit);
router
  .route("/:id")
  .put(protect, updateHabit)
  .delete(protect, deleteHabit)
  .get(protect, getHabit);

router.get("/public", protect, getPublicHabits);

//like a habit
router.put("/:id/like", protect, likeHabit);

//dislike a habit
router.put("/:id/unlike", protect, unlikeHabit);

module.exports = router;
