import { apiClient } from "./apiClient";
import mockAudit from "../data/audit/mockAudit.json";

/**
 * GET AUDIT (MOCK)
 */
export function getAudit() {
  // return Promise.resolve(mockAudit.items);

  // con simulación de tiempo:
  return new Promise((resolve) => setTimeout(() => resolve(mockAudit.items), 250));
}

/**
 * GET AUDIT (REAL) - descomentar cuando Node lo exponga
 * (ej: GET /api/audit)
 */
// export function getAudit() {
//   return apiClient.get("/api/audit").then((res) => res.data?.items || res.data);
// }
