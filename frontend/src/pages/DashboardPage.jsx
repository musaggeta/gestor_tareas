import { useEffect, useState } from "react";
import { getUserTasks, createTask, updateTask } from "../services/taskService";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";


const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, [token]);

    const fetchTasks = async () => {
        try {
            const data = await getUserTasks(token);
            setTasks(data);
        } catch {
            logout();
            navigate("/login");
        }
    };

    const handleCreateTask = async (newTask) => {
        try {
            const createdTask = await createTask(token, newTask);
            setTasks((prev) => [...prev, createdTask]);
        } catch (err) {
            console.error("Error al crear la tarea:", err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleUpdateTask = async (taskId, updates) => {
        try {
            const updated = await updateTask(token, taskId, updates);
            setTasks((prev) =>
                prev.map((t) => (t.id === updated.id ? updated : t))
            );
        } catch (err) {
            console.error("Error al actualizar la tarea:", err);
        }
    };


    return (
        <div>
            <h2>Bienvenido, {user?.name || "Usuario"} </h2>
            <button onClick={handleLogout}>Cerrar sesión</button>

            <TaskForm onTaskCreated={handleCreateTask} />

            <h3>Tus tareas:</h3>
            {tasks.length === 0 ? (
                <p>No tienes tareas aún.</p>
            ) : (
                tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onUpdate={handleUpdateTask} />
                ))

            )}
        </div>
    );
};


export default DashboardPage;
