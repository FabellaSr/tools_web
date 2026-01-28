import { apiClient } from "./apiClient";
import mockInstalls from "../data/Installs/mockInstalls.json";


/**
 * GET INSTALACIONES (REAL) - 
 * - 
 */
export function getInstalls() {
  return apiClient.get("/api/bus/instalaciones").then((res) => res.data);
}
/**
 * GET DETALLE INSTALACIÓN (MOCK)
 * Busca en el JSON local por tipo+nro
 */
export function getInstallDetail(tipo, nro) {
  return Promise.resolve(
    mockInstalls.find((x) => String(x.tipo) === String(tipo) && String(x.nro) === String(nro)) || null
  );
}

// POST iniciar instalación
export async function startInstall(requestBody) {
  const res = await apiClient.post("/install/start", requestBody);
  return res.data;
}

