import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CardN2 , MyButton, Alert} from "../../components/ui";  
import { getLogsByTipoNro } from "../../services/logService";

function levelIcon(level) {
  if (level === "ERROR") return "❌";
  if (level === "WARN") return "⚠️";
  return "ℹ️";
}

export default function Logs() {
  const navigate = useNavigate();
  const { tipo, nro } = useParams();

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function load() { 
    setLoading(true);
    setError(null);

    getLogsByTipoNro(tipo, nro)
      .then((data) => setItems(Array.isArray(data) ? data : data.items || []))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [tipo, nro]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return items;
    return items.filter((x) => x.level === filter);
  }, [items, filter]);

  if (!tipo || !nro) {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <h1 style={{ margin: 0, color: "white" }}>📜 Logs</h1>

        <Alert variant="info" title="ℹ️ Seleccioná una instalación">
          Entrá a una instalación y tocá <b>Ver logs</b>.
        </Alert>

        <MyButton actionLabel="🧾 Ir a instalaciones" onAction={() => navigate("/installs")} />
      </div>
    );
  }

  // ✅ Modo "detalle" (/logs/:tipo/:nro)
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <MyButton actionLabel="← Volver" onAction={() => navigate(-1)} />
        <h1 style={{ margin: 0, color: "white" }}>
          📜 Logs — {tipo} {nro}
        </h1>
      </div>

      <CardN2 title="🎛️ Filtros">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <MyButton actionLabel="Todos" onAction={() => setFilter("ALL")} />
          <MyButton actionLabel="Info" onAction={() => setFilter("INFO")} />
          <MyButton actionLabel="Warn" onAction={() => setFilter("WARN")} />
          <MyButton actionLabel="Error" onAction={() => setFilter("ERROR")} />

          <div style={{ marginLeft: "auto" }}>
            <MyButton
              actionLabel={loading ? "⏳ Cargando..." : "🔄 Refrescar"}
              onAction={load}
              disabled={loading}
            />
          </div>
        </div>
      </CardN2>

      {error && (
        <CardN2 title="❌ Error">
          <pre style={{ margin: 0, overflowX: "auto" }}>
            {JSON.stringify(error, null, 2)}
          </pre>
        </CardN2>
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

      {filtered.map((l, idx) => (
        <CardN2 key={`${l.ts}-${idx}`} title={`${levelIcon(l.level)} ${l.level} — ${l.ts}`}>
          <div>{l.msg}</div>
        </CardN2>
      ))}
    </div>
  );
}

