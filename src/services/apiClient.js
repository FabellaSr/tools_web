import axios from "axios";
import { ENV } from "../config/env";
import { getToken, clearToken } from "./authService";

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
function makeRequestId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return String(Date.now());
}
/**
 * ✅ Request interceptor: agrega Authorization: Bearer <token>
 * a TODAS las requests si existe token.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    const rid = makeRequestId();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["X-Request-ID"] = rid;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * ✅ Response interceptor: normaliza error y limpia token si 401
 */
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const data = err?.response?.data;

    if (status === 401) {
      // Token faltante/expirado/incorrecto → lo limpiamos
      clearToken();
    }

    return Promise.reject({
      message: err?.message || "Error de red",
      status,
      data,
    });
  },
);
