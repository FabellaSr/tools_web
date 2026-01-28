import { apiClient } from "./apiClient";

/**
 * POST Chat IA
 * Devuelve: { reply, intent, entities, missing, ... }
 */
export function postChatMessage(message) {
  return apiClient
    .post("/api/chat", { message })
    .then((res) => res.data);
}

/**
 * Helper por si el backend devuelve estructuras distintas.
 * (Opcional, pero te salva si el gateway/bus cambia envoltorio)
 */
export function extractChatReply(payload) {
  return (
    payload?.reply ||
    payload?.data?.reply ||
    payload?.data?.data?.reply ||
    "No recibí respuesta del servidor."
  );
}
