import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardN2, MyButton, Alert, Field, OrderCards, TitlePage } from "../../components/ui";
import { getAudit } from "../../services/auditService";

function statusIcon(status) {
  if (status >= 200 && status < 300) return "✅";
  if (status === 401) return "🔒";
  if (status >= 400) return "❌";
  return "ℹ️";
}

export default function Audit() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [onlyErrors, setOnlyErrors] = useState(false);

  const title = "🕵️ Auditoría ";
  const subtitle = "Auditorias! Registros de acciones realizadas en el sistema.";

  function load() {
    setLoading(true);
    setError(null);

    getAudit()
      .then((data) => setItems(Array.isArray(data) ? data : data?.items || []))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let arr = [...items];

    if (onlyErrors) arr = arr.filter((x) => (x.status || 0) >= 400);

    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      arr = arr.filter((x) =>
        String(x.requestId || "").toLowerCase().includes(qq) ||
        String(x.usuario || "").toLowerCase().includes(qq) ||
        String(x.accion || "").toLowerCase().includes(qq) ||
        String(x.path || "").toLowerCase().includes(qq) ||
        String(x.tipo || "").toLowerCase().includes(qq) ||
        String(x.numero || "").toLowerCase().includes(qq)
      );
    }

    // último primero
    arr.sort((a, b) => String(b.ts || "").localeCompare(String(a.ts || "")));
    return arr;
  }, [items, q, onlyErrors]);

  function goToRelated(entry) {
    // Si viene tipo/numero, te mando directo al detalle o logs según acción
    const tipo = entry.tipo;
    const nro = entry.numero;

    if (entry.accion === "GET_LOGS" && tipo && nro !== undefined) {
      navigate(`/logs/${encodeURIComponent(tipo)}/${encodeURIComponent(nro)}`);
      return;
    }

    if (tipo && nro !== undefined) {
      navigate(`/installs/${encodeURIComponent(tipo)}/${encodeURIComponent(nro)}`);
      return;
    }

    // fallback: si no hay relación, volvemos a installs
    navigate("/installs");
  }

  return (

    <div style={{ display: "grid", gap: 16 }}>
      <TitlePage title={title} 
                 subtitle={subtitle} 
                 banner={{
                 background: "linear-gradient(135deg, #0f172a, #020617)", }}>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <MyButton
            actionLabel={loading ? "⏳ Cargando..." : "🔄 Refrescar"}
            onAction={load}
            disabled={loading}
          />
          <MyButton
            actionLabel={onlyErrors ? "✅ Ver todo" : "❌ Solo errores"}
            onAction={() => setOnlyErrors((v) => !v)}
          />
        </div>
      </TitlePage>
    

      <CardN2 title="🔎 Filtros">
        <div style={{ display: "grid", gap: 12 }}>
          <Field
            label="Buscar"
            value={q}
            onChange={setQ}
            placeholder="requestId, usuario, acción, path, tipo o número..."
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <MyButton actionLabel="🧹 Limpiar" onAction={() => setQ("")} disabled={!q.trim()} />
          </div>
        </div>
      </CardN2>

      {error && (
        <Alert variant="error" title="❌ Error">
          {error?.data?.error?.message || error?.message || "Error desconocido"}
        </Alert>
      )}

      {loading && (
        <Alert variant="info" title="⏳ Cargando">
          Obteniendo auditoría...
        </Alert>
      )}

      {!loading && !error && filtered.length === 0 && (
        <Alert variant="info" title="ℹ️ Sin registros">
          No hay eventos de auditoría para mostrar.
        </Alert>
      )}

      <OrderCards>  
      {filtered.map((e, idx) => (
        <CardN2
          key={`${e.requestId || "rid"}-${idx}`}
          title={`${statusIcon(e.status)} ${e.accion || "EVENT"} — ${e.ts || "-"}`}>

          <div style={{ display: "grid", gap: 6 }}>
            <div><b>Status:</b> {e.status ?? "-"}</div>
            <div><b>Usuario:</b> {e.usuario || "-"}</div>
            <div><b>RequestId:</b> {e.requestId || "-"}</div>
            <div><b>Path:</b> {e.path || "-"}</div>
            {(e.tipo || e.numero !== undefined) && (
              <div><b>Referencia:</b> {e.tipo || "-"} {e.numero ?? "-"}</div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
              <MyButton actionLabel="🔎 Ir" onAction={() => goToRelated(e)} />
              {e.requestId && (
                <MyButton
                  actionLabel="📋 Copiar requestId"
                  onAction={() => navigator.clipboard.writeText(e.requestId)}
                />
              )}
            </div>
          </div>
          
        </CardN2>
      ))}
      </OrderCards>
    </div>
  );
}
