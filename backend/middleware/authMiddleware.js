const jwt = require("jsonwebtoken");
const { BlacklistedToken } = require("../models");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifica si el token está en la lista negra
    const blacklisted = await BlacklistedToken.findOne({ where: { token } });
    console.log("Token:", token);
    console.log("¿Está en blacklist?:", !!blacklisted);

    if (blacklisted) {
      return res.status(401).json({ message: "Token inválido (logout)" });
    }

const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.userId = decoded.id; 
next();

  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
