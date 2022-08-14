const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to HabitHobbit REST API SERVER");
});

module.exports = router;
