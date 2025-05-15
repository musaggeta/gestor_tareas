import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  const login = async (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      console.warn("Token inválido o expirado");
      logout();
    }
  };

  if (token) {
    fetchUser();
  }
}, [token]);



  return (
    <AuthContext.Provider value={{ token, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
