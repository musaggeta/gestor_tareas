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
    const [filter, setFilter] = useState("todas");
    const [search, setSearch] = useState("");


    useEffect(() => {
        fetchTasks();
    }, [token]);

    const fetchTasks = async () => {
        try {
            const query = {};
            if (filter !== "todas") query.status = filter;
            if (search.trim()) query.q = search;

            const data = await getUserTasks(token, query);
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
            <div>
                <label>Filtrar por estado: </label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="todas">Todas</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="en progreso">En progreso</option>
                    <option value="completada">Completada</option>
                </select>

                <input
                    type="text"
                    placeholder="Buscar por título o descripción"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginLeft: "1rem" }}
                />

                <button onClick={fetchTasks} style={{ marginLeft: "1rem" }}>Aplicar filtros</button>
            </div>


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
