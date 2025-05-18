import { useState } from "react";

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate?.split("T")[0] || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    onUpdate(task.id, formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="task-card" style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
        <input name="title" value={formData.title} onChange={handleChange} />
        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="pendiente">Pendiente</option>
          <option value="en progreso">En progreso</option>
          <option value="completada">Completada</option>
        </select>
        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
        <button onClick={handleUpdate}>Guardar</button>
        <button onClick={() => setIsEditing(false)}>Cancelar</button>
      </div>
    );
  }

  return (
    <div className="task-card" style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p><strong>Estado:</strong> {task.status}</p>
      {task.dueDate && <p><strong>Fecha límite:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>}
      
      {(task.status === "pendiente" || task.status === "en progreso") && (
        <button
          onClick={() => {
            const siguienteEstado =
              task.status === "pendiente" ? "en progreso" : "completada";

            if (confirm(`¿Pasar esta tarea a "${siguienteEstado}"?`)) {
              onUpdate(task.id, { status: siguienteEstado });
            }
          }}
          style={{ marginTop: "0.5rem", backgroundColor: "#1976d2", color: "white" }}
        >
          Marcar como "{task.status === "pendiente" ? "en progreso" : "completada"}"
        </button>
      )}
      <button onClick={() => setIsEditing(true)}>Editar</button>

      {task.status === "completada" && (
        <button
          onClick={() => {
            if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
              onDelete(task.id);
            }
          }}
          style={{ marginTop: "0.5rem", backgroundColor: "#f44336", color: "white" }}
        >
          Eliminar
        </button>
      )}

    </div>
  );
};

export default TaskCard;
