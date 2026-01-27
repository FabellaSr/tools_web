export function estadoToLabel(estado) {
  if (estado === 1) return "Instalada";
  if (estado === 0) return "Pendiente";
  if (estado === -1) return "Error";
  return "Desconocido";
}

export function estadoToIcon(estado) {
  if (estado === 1) return "✅";
  if (estado === 0) return "🕒";
  if (estado === -1) return "❌";
  return "❓";
}
