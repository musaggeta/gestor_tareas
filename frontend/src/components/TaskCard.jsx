const TaskCard = ({ task }) => {
  return (
    <div className="task-card" style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p><strong>Estado:</strong> {task.status}</p>
      {task.dueDate && <p><strong>Fecha límite:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>}
    </div>
  );
};

export default TaskCard;
