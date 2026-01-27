import { apiClient } from "./apiClient";
import mockLogs from "../data/logs/mockLogs.json";

/**
 * GET LOGS (MOCK)
 */
export function getLogsByTipoNro(tipo, nro) {
  const key = `${tipo}-${nro}`;
  return Promise.resolve(mockLogs[key] || []);
}

/**
 * GET LOGS (REAL) - (descomentar cuando el backend esté listo y token resuelto)
 */
// export function getLogsByTipoNro(tipo, nro) {
//   return apiClient.get(`/api/logs/${encodeURIComponent(tipo)}/${encodeURIComponent(nro)}`)
//     .then((res) => res.data);
// }
