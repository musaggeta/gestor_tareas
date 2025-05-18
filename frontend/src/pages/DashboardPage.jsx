import { useEffect, useState } from "react";
import { getUserTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import "./DashboardPage.css";


const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();
    const [filter, setFilter] = useState("todas");
    const [search, setSearch] = useState("");
    const [dueFrom, setDueFrom] = useState("");
    const [dueTo, setDueTo] = useState("");



    useEffect(() => {
        fetchTasks();
    }, [token]);

    const fetchTasks = async () => {
        try {
            const query = {};
            if (filter !== "todas") query.status = filter;
            if (search.trim()) query.q = search;
            if (dueFrom) query.dueFrom = dueFrom;
            if (dueTo) query.dueTo = dueTo;

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

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(token, taskId);
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
        } catch (err) {
            console.error("Error al eliminar la tarea:", err);
        }
    };

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-content">
                <h2>Bienvenido, {user?.name || "Usuario"} </h2>
                <button onClick={handleLogout}>Cerrar sesión</button>

                <TaskForm onTaskCreated={handleCreateTask} />

                <div className="filters">
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
                    />

                    <div className="date-filters">
                        <label>Desde: </label>
                        <input type="date" value={dueFrom} onChange={(e) => setDueFrom(e.target.value)} />
                        <label>Hasta: </label>
                        <input type="date" value={dueTo} onChange={(e) => setDueTo(e.target.value)} />
                    </div>

                    <button onClick={fetchTasks}>Aplicar filtros</button>
                </div>

                <h3>Tus tareas:</h3>
                {tasks.length === 0 ? (
                    <p>No tienes tareas aún.</p>
                ) : (
                    <div className="task-grid">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );



};


export default DashboardPage;
