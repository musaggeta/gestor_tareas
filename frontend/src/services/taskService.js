import axios from "axios";

const API_URL = "http://localhost:4000/api/tasks";

export const getUserTasks = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // se espera que devuelva un array de tareas
};

export const createTask = async (token, taskData) => {
  const response = await axios.post("http://localhost:4000/api/tasks", taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.task;
};

export const updateTask = async (token, taskId, updates) => {
  const response = await axios.put(`http://localhost:4000/api/tasks/${taskId}`, updates, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.task;
};
