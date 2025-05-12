const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const { registerValidation, loginValidation } = require("../validators/authValidator");
const validate = require("../middleware/validationResult");

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/me", auth, getMe);

module.exports = router;
