const express = require("express");
const { body } = require("express-validator");
const {
  getHabits, createHabit, getHabit, updateHabit,
  deleteHabit, toggleCompletion, getAnalytics
} = require("../controllers/habitController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.use(protect);
router.get("/analytics/summary", getAnalytics);
router.route("/").get(getHabits).post([
  body("name").trim().notEmpty().withMessage("Habit name required")
], createHabit);
router.route("/:id").get(getHabit).put(updateHabit).delete(deleteHabit);
router.post("/:id/complete", toggleCompletion);

module.exports = router;