const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://tudominio.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // si usas cookies o autenticación basada en sesiones (no necesario con JWT)
}));
//middleware
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.use('/api/tasks', require('./routes/taskRoutes'));


// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

const { sequelize } = require("./models");

sequelize.authenticate()
  .then(() => console.log("Conexión con la base de datos establecida"))
  .catch((err) => console.error("Error al conectar con la base de datos:", err));

  