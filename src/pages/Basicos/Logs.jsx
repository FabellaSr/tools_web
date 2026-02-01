import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CardN2, MyButton, Alert, Field } from "../../estilos/ui";
import { getLogsByTipoNro } from "../../services/logService";

function levelIcon(level) {
  if (level === "ERROR") return "❌";
  if (level === "WARN") return "⚠️";
  return "ℹ️";
}

function normalizeLevel(level) {
  const v = String(level || "").toUpperCase();
  if (v === "WARNING") return "WARN";
  if (v === "ERR") return "ERROR";
  return v || "INFO";
}

function toText(lines) {
  return lines
    .map((l) => `${l.ts || "-"} [${normalizeLevel(l.level)}] ${l.msg || ""}`)
    .join("\n");
}

function downloadFile(filename, content, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Logs() {
  const navigate = useNavigate();
  const { tipo, nro } = useParams();

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function load() {
    if (!tipo || !nro) return;

    setLoading(true);
    setError(null);

    getLogsByTipoNro(tipo, nro)
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.items || [];
        setItems(list);
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, nro]);

  const filtered = useMemo(() => {
    let arr = items.map((l) => ({
      ...l,
      level: normalizeLevel(l.level),
      msg: l.msg ?? l.message ?? "",
      ts: l.ts ?? l.timestamp ?? "",
    }));

    if (filter !== "ALL") arr = arr.filter((x) => x.level === filter);

    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      arr = arr.filter((x) => (x.msg || "").toLowerCase().includes(qq));
    }

    return arr;
  }, [items, filter, q]);

  // ✅ /logs sin params (pantalla general)
  if (!tipo || !nro) {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <h1 style={{ margin: 0, color: "black" }}>📜 Logs</h1>
        <Alert variant="info" title="ℹ️ Seleccioná una instalación">
          Entrá a una instalación y tocá <b>Ver logs</b>.
        </Alert>
        <MyButton actionLabel="🧾 Ir a instalaciones" onAction={() => navigate("/installs")} />
      </div>
    );
  }

  function onCopy() {
    const text = toText(filtered);
    if (!text.trim()) return;
    navigator.clipboard.writeText(text);
  }

  function onDownloadTxt() {
    const text = toText(filtered);
    downloadFile(`logs-${tipo}-${nro}.txt`, text, "text/plain;charset=utf-8");
  }

  function onDownloadJson() {
    const payload = {
      tipo,
      nro,
      items: filtered,
    };
    downloadFile(`logs-${tipo}-${nro}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <MyButton actionLabel="← Volver" onAction={() => navigate(-1)} />
        <h1 style={{ margin: 0, color: "black" }}>
          📜 Logs — {tipo} {nro}
        </h1>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <MyButton
            actionLabel={loading ? "⏳ Cargando..." : "🔄 Refrescar"}
            onAction={load}
            disabled={loading}
          />
          <MyButton actionLabel="📋 Copiar" onAction={onCopy} disabled={filtered.length === 0} />
          <MyButton actionLabel="⬇ .txt" onAction={onDownloadTxt} disabled={filtered.length === 0} />
          <MyButton actionLabel="⬇ .json" onAction={onDownloadJson} disabled={filtered.length === 0} />
        </div>
      </div>

      {/* Filtros */}
      <CardN2 title="🎛️ Filtros">
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <MyButton actionLabel="Todos" onAction={() => setFilter("ALL")} />
            <MyButton actionLabel="Info" onAction={() => setFilter("INFO")} />
            <MyButton actionLabel="Warn" onAction={() => setFilter("WARN")} />
            <MyButton actionLabel="Error" onAction={() => setFilter("ERROR")} />
            <MyButton actionLabel="🧹 Limpiar búsqueda" onAction={() => setQ("")} disabled={!q.trim()} />
          </div>

          <Field
            label="Buscar en mensaje"
            value={q}
            onChange={setQ}
            placeholder="Ej: restore, SAVF, objeto, error..."
          />
        </div>
      </CardN2>

      {error && (
        <Alert variant="error" title="❌ Error">
          {error?.data?.error?.message || error?.message || "Error desconocido"}
        </Alert>
      )}

      {loading && (
        <Alert variant="info" title="⏳ Cargando">
          Obteniendo logs...
        </Alert>
      )}

      {!loading && !error && filtered.length === 0 && (
        <Alert variant="info" title="ℹ️ Sin logs">
          No hay logs para mostrar.
        </Alert>
      )}

      {/* Timeline */}
      {filtered.map((l, idx) => (
        <CardN2 key={`${l.ts}-${idx}`} title={`${levelIcon(l.level)} ${l.level} — ${l.ts || "-"}`}>
          <div style={{ whiteSpace: "pre-wrap" }}>{l.msg}</div>
        </CardN2>
      ))}
    </div>
  );
}
