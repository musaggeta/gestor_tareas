const { Task } = require('../models');

// Crear tarea
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Título obligatorio" });

    const task = await Task.create({
      title,
      description,
      dueDate,
      userId: req.userId, // del middleware
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la tarea", error: error.message });
  }
};

exports.editTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;

  try {
    const task = await Task.findOne({
      where: {
        id,
        userId: req.userId, // Asegura que el usuario solo edite sus tareas
      }
    });

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    // No se puede editar una tarea completada
    if (task.status === "completada") {
      return res.status(400).json({ message: "No se puede editar una tarea completada" });
    }

    // Validaciones de transición de estado
    if (status && status !== task.status) {
      if (task.status === "pendiente" && status !== "en progreso") {
        return res.status(400).json({ message: "Solo se puede pasar de 'pendiente' a 'en progreso'" });
      }

      if (task.status === "en progreso" && status !== "completada") {
        return res.status(400).json({ message: "Solo se puede pasar de 'en progreso' a 'completada'" });
      }

      if (task.status !== "pendiente" && status === "pendiente") {
        return res.status(400).json({ message: "No se puede volver a 'pendiente'" });
      }
    }

    // Actualización
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.dueDate = dueDate ?? task.dueDate;
    if (status) task.status = status;

    await task.save();
    res.json({ message: "Tarea actualizada", task });

  } catch (error) {
    res.status(500).json({ message: "Error al editar la tarea", error: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.userId },
      order: [["createdAt", "DESC"]],
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las tareas", error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({
      where: {
        id,
        userId: req.userId // Solo puede eliminar su propia tarea
      }
    });

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (task.status !== "completada") {
      return res.status(400).json({ message: "Solo se pueden eliminar tareas completadas" });
    }

    await task.destroy();
    res.json({ message: "Tarea eliminada exitosamente" });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la tarea", error: error.message });
  }
};
