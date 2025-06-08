import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://gs-java1-production.up.railway.app";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token JWT em todas as requisições autenticadas
api.interceptors.request.use(
  async (config) => {
    // Rotas que não precisam de autenticação
    if (
      config.url.endsWith("/auth/login") ||
      config.url.endsWith("/auth/register")
    ) {
      return config;
    }

    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Serviços de Autenticação ---
export const login = (email, senha) => {
  return api.post("/auth/login", { email, senha });
};

export const register = (userData) => {
  return api.post("/auth/register", userData);
};

// --- Serviços de Usuário (CRUD) ---

// READ (Listar todos)
export const getAllUsers = () => {
  return api.get("/usuarios");
};

// READ (Buscar um usuário pelo ID)
export const getUserById = (id) => {
  return api.get(`/usuarios/${id}`);
};

// UPDATE
export const updateUser = (id, userData) => {
  return api.put(`/usuarios/${id}`, userData);
};

// DELETE
export const deleteUser = (id) => {
  return api.delete(`/usuarios/${id}`);
};

// --- Serviços de Psicólogo ---
export const getAllPsychologists = () => {
  return api.get("/psicologos");
};

export default api;
