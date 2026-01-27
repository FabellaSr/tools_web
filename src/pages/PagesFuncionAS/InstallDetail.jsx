import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CardN2, OrderCards } from "../../components/ui";
import { MyButton, TitlePage } from "../../components/ui";
import { useEffect, useState } from "react";
import { getInstallDetail } from "../../services/installService";

function estadoIcon(estado) {
  if (estado === 1) return "✅";
  if (estado === 0) return "🕒";
  if (estado === -1) return "❌";
  return "❓";
}

function estadoLabel(estado) {
  if (estado === 1) return "Instalada";
  if (estado === 0) return "Pendiente";
  if (estado === -1) return "Error";
  return "Desconocido";
}

const title = "📄 Detalle";
const subtitle = "Instalaciones realizadas.";

export default function InstallDetail() {
  const navigate = useNavigate();
  const { tipo, nro } = useParams();
  const location = useLocation();

  const [item, setItem] = useState(location.state?.item || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    setError(null);

    getInstallDetail(tipo, nro)
      .then((data) => setItem(data))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!item) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, nro]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
        <TitlePage title={title} 
                   subtitle={subtitle} 
                   banner={{
                   background: "linear-gradient(135deg, #0f172a, #020617)", }}></TitlePage>


      {loading && <CardN2 title="⏳ Cargando">Buscando detalle...</CardN2>}

      {error && (
        <CardN2 title="❌ Error">
          <pre style={{ margin: 0, overflowX: "auto" }}>
            {JSON.stringify(error, null, 2)}
          </pre>
        </CardN2>
      )}

      {!loading && !error && !item && (
        <CardN2 title="ℹ️ No encontrado">
          No se encontró la instalación <b>{tipo} {nro}</b>.
        </CardN2>
      )}

      <OrderCards> 
        {item && (
          <CardN2 title={`${estadoIcon(item.estado)} ${item.tipo} ${item.nro}`}>
            <div style={{ display: "grid", gap: 6 }}>
              <div><b>Estado:</b> {estadoLabel(item.estado)}</div>
              <div><b>Usuario:</b> {item.usuario || "-"}</div>
              <div><b>Fecha ingreso:</b> {item.fechaIngreso || "-"}</div>
              <div><b>Fecha instalación:</b> {item.fechaInstalacion || "-"}</div>
              <div><b>Hora:</b> {item.hora || "-"}</div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <MyButton
                actionLabel="📜 Ver logs"
                onAction={() => navigate(`/logs/${tipo}/${nro}`)}
              />
              <MyButton
                actionLabel="🔄 Reintentar (mock)"
                onAction={() => alert("Reintento: lo hacemos en el próximo paso")}
              />
            </div>
          </CardN2>
        )}
      </OrderCards>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <MyButton actionLabel="← Volver" onAction={() => navigate(-1)} />
      </div>
    </div>
  );
}
