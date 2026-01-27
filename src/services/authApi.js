import { apiClient } from "./apiClient";

/**
 * LOGIN (REAL) - Node
 * POST /auth/login
 */
export function login(username, password) {
  return apiClient
    .post("/auth/login", { username, password })
    .then((res) => res.data);
}
