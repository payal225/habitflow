const express = require("express");
const { body } = require("express-validator");
const { register, login, getMe, updatePreferences } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/register", [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be 6+ characters")
], register);

router.post("/login", [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required")
], login);

router.get("/me", protect, getMe);
router.put("/preferences", protect, updatePreferences);

module.exports = router;