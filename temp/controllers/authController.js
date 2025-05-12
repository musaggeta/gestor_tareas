const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validar campos
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Verificar si ya existe el usuario
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email ya registrado." });

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Usuario registrado correctamente", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error });
  }
};
