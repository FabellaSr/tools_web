import { apiClient } from "./apiClient";
import mockInstalls from "../data/Installs/mockInstalls.json";

/**
 * GET INSTALACIONES (MOCK)
 */
//export function getInstalls() { 
//  return Promise.resolve(mockInstalls);

  // Simulacion de tiempo
  //return new Promise((resolve) => setTimeout(() => resolve(mockInstalls), 400));
//}

/**
 * GET INSTALACIONES (REAL) - 
 * - 
 */
// export function getInstalls() {
//   return apiClient.get("/api/as400/wsriwl/A/CA/1")
//     .then((res) => res.data?.data?.items ?? []);
// }
export function getInstalls() {
  return apiClient.get("/api/as400/wsriwl/A/CA/1").then((res) => res.data);
}
/**
 * GET DETALLE INSTALACIÓN (MOCK)
 * Busca en el JSON local por tipo+nro
 */
export function getInstallDetail(tipo, nro) {
  return Promise.resolve(
    mockInstalls.find((x) => String(x.tipo) === String(tipo) && String(x.nro) === String(nro)) || null
  );

  // Simulación de tiempo:
  // return new Promise((resolve) =>
  //   setTimeout(() => resolve(mockInstalls.find((x) => String(x.tipo) === String(tipo) && String(x.nro) === String(nro)) || null), 250)
  // );
}
/**
 * GET DETALLE INSTALACIÓN (REAL) - (descomentar cuando Node lo exponga)
 */
// export function getInstallDetail(tipo, nro) {
//   return apiClient
//     .get(`/api/installs/${encodeURIComponent(tipo)}/${encodeURIComponent(nro)}`)
//     .then((res) => res.data);
// }

// POST iniciar instalación
export async function startInstall(requestBody) {
  const res = await apiClient.post("/install/start", requestBody);
  return res.data;
}

