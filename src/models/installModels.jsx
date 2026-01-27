// Tipos de instalación soportados
export const INSTALL_TYPES = {
  DESA   : "DESA", 
  OBJECTS: "OBJECTS",
  SOURCES: "SOURCES",

};

// Plantilla Request (lo que el front enviará al AS400)
export function buildEmptyInstallRequest() {
  return {
    requestId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    tipoInstalacion: INSTALL_TYPES.OBJECTS,

    // Datos comunes
    entorno: "DEV",
    usuario: "web-user",
    descripcion: "",

    // Payload específico
    payload: {},
  };
}
// Respuesta estándar esperada del AS400
export const mockInstallResponse = {
  ok: true,
  message: "Simulación OK (mock)",
  warnings: [],
  errors: [],
  log: ["Paso 1: Validación OK", "Paso 2: Simulación de instalación OK"],
};
export function buildInstallResponse({ ok, message, data = null, warnings = [], errors = [], log = [] }) {
  return { ok, message, data, warnings, errors, log };
} 