const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { registerValidation, loginValidation } = require("../validators/authValidator");
const validate = require("../middleware/validationResult");
const auth = require("../middleware/authMiddleware");

const jwt = require('jsonwebtoken');
const { BlacklistedToken } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/me", auth, getMe);

router.post('/logout', authMiddleware, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token);

  try {
    await BlacklistedToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000) // guardamos hasta que expire
    });

    res.json({ message: 'Logout exitoso' });
  } catch (err) {
    res.status(500).json({ message: 'Error al cerrar sesión', error: err.message });
  }
});

module.exports = router;