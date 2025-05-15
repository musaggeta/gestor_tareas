import { useEffect, useState } from "react";
import { getUserTasks } from "../services/taskService";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";


const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getUserTasks(token);
        setTasks(data);
      } catch (err) {
        console.error("Error al cargar tareas:", err);
      }
    };

    fetchTasks();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h2>Bienvenido, {user?.name || "Usuario"} </h2>
      <button onClick={handleLogout} style={{ marginBottom: "1rem" }}>Cerrar sesión</button>
      <h3>Tus tareas:</h3>
      {tasks.length === 0 ? (
        <p>No tienes tareas aún.</p>
      ) : (
        tasks.map((task) => <TaskCard key={task.id} task={task} />)
      )}
    </div>
  );
};

export default DashboardPage;
