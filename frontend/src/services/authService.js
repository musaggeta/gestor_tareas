import axios from "axios";

const API_URL = "http://localhost:4000/api/auth"; // cambia a producción luego

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data.token;
};

export const registerUser = async (name, email, password) => {
  const response = await axios.post("http://localhost:4000/api/auth/register", {
    name,
    email,
    password,
  });
  return response.data;
};
