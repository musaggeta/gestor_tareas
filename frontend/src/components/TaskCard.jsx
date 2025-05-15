import { useState } from "react";

const TaskCard = ({ task, onUpdate }) => {
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
      <button onClick={() => setIsEditing(true)}>Editar</button>
    </div>
  );
};

export default TaskCard;
