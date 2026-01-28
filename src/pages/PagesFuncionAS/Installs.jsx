import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardN2, MyButton, Alert, OrderCards, TitlePage } from "../../components/ui";
import { getInstalls } from "../../services/installService";

export default function Installs() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const title = "🧾 Instalaciones realizadas!! ";
  const subtitle = "Instalaciones realizadas.";
  
  function load() {
    setLoading(true);
    setError(null);

    getInstalls()
      .then((data) => {
        const list =
          (Array.isArray(data) && data) ||
          data?.items ||
          data?.data?.items ||
          data?.data?.data ||
          [];

        setItems(list);
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const sortedItems = useMemo(() => {
    // Como el backend no trae "estado", ordenamos por tipo+numero
    return [...items].sort((a, b) => {
      const t = String(a.tipo || "").localeCompare(String(b.tipo || ""));
      if (t !== 0) return t;
      return Number(a.numero || 0) - Number(b.numero || 0);
    });
  }, [items]);

  return (
    <TitlePage title={title} 
               subtitle={subtitle} 
               banner={{
               background: "linear-gradient(135deg, #0f172a, #020617)", }}>
      <div style={{ display: "flex", gap: 10 }}>
        <MyButton
          actionLabel={loading ? "⏳ Cargando..." : "🔄 Refrescar"}
          onAction={load}
          disabled={loading}
        />
      </div>

      {error && (
        <Alert variant="error" title="❌ Error">
          {error?.data?.error?.message || error?.message || "Error desconocido"}
        </Alert>
      )}

      {!loading && !error && sortedItems.length === 0 && (
        <Alert variant="info" title="ℹ️ Sin datos">
          No hay instalaciones para mostrar.
        </Alert>
      )}

      <OrderCards> 
        {sortedItems.map((i, idx) => (
          <CardN2
            key={`${i.Instalaciontipo}-${i.Instalacionnume}-${idx}`}
            title={`📦 ${i.Instalaciontipo} ${i.Instalacionnume}`}
          >
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <div><b>Detalle:</b> {i.detalle || "-"}</div>
                <div><b>Usuario:</b> {i.usuario || "-"}</div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <MyButton
                  actionLabel="Ver detalle"
                  onAction={() =>
                    navigate(`/installs/${encodeURIComponent(i.tipo)}/${encodeURIComponent(i.numero)}`)
                  }
                />
              </div>
            </div>
          </CardN2>
        ))}
      </OrderCards>
    </TitlePage>
  );
}
