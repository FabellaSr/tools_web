import { useMemo, useState } from "react";
import {
  INSTALL_TYPES,
  buildEmptyInstallRequest,
} from "../../models/installModels";
import { Field, Select, CardN2, TitlePage, MyButton} from "../../estilos/ui";
import { startInstall } from "../../services/installService";

const title = "🛠️ Realizar instalación ";
const subtitle = "Primer paso para desplegar objetos o fuentes en AS400.";

export default function Install() {
  const [req, setReq] = useState(() => buildEmptyInstallRequest());
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [setError] = useState(null);
  
  const typeOptions = useMemo(
    () => [
      { value: INSTALL_TYPES.OBJECTS, label: "Objetos" },
      { value: INSTALL_TYPES.SOURCES, label: "Fuentes (miembros)" },
      { value: INSTALL_TYPES.DESA   , label: "Instalación desde DESA" },
    ],
    []
  );

  function setCommon(field, value) {
    setReq((prev) => ({ ...prev, [field]: value }));
  }

  function setPayload(field, value) {
    setReq((prev) => ({ ...prev, payload: { ...prev.payload, [field]: value } }));
  }

  function changeType(newType) {
    // Resetea payload para evitar mezclar campos de distintos tipos
    setReq((prev) => ({
      ...prev,
      tipoInstalacion: newType,
      payload: {},
    }));
    setResponse(null);
  }

  function validate() {
    const errors = [];

    if (!req.descripcion.trim()) errors.push("La descripción es obligatoria.");

    if (req.tipoInstalacion === INSTALL_TYPES.OBJECTS) {
      if (!req.payload.objectName?.trim()) errors.push("objectName es obligatorio.");
      if (!req.payload.objectType?.trim()) errors.push("objectType es obligatorio.");
      if (!req.payload.libFrom?.trim()) errors.push("libFrom es obligatorio.");
      if (!req.payload.libTo?.trim()) errors.push("libTo es obligatorio.");
    }

    if (req.tipoInstalacion === INSTALL_TYPES.SOURCES) {
      if (!req.payload.fileFrom?.trim()) errors.push("fileFrom es obligatorio.");
      if (!req.payload.libFrom?.trim()) errors.push("libFrom es obligatorio.");
      if (!req.payload.fileTo?.trim()) errors.push("fileTo es obligatorio.");
      if (!req.payload.libTo?.trim()) errors.push("libTo es obligatorio.");
      if (!req.payload.member?.trim()) errors.push("member es obligatorio.");
      if (!req.payload.action?.trim()) errors.push("action es obligatorio.");
    }
    return errors;
  }
    
  function onRun() {
    //setError(null);

    const errs = validate();
    if (errs.length) {
      setResponse({
        ok: false,
        message: "Validación falló",
        errors: errs,
        warnings: [],
        log: [],
      });
      return;
    }

    setLoading(true);

    startInstall(req)
      .then((data) => {
        setResponse(data); // response real del backend
      }).catch((e) => {
        //  setError(e);
        setResponse({
          ok: false,
          message: "Error llamando a la API",
          errors: [e?.message || "Error desconocido"],
          warnings: [],
          log: [],
        });
      }).finally(() => {
        setLoading(false);
      });
  }


  return (
      <TitlePage title={title} 
                 subtitle={subtitle} 
                 banner={{
                 background: "linear-gradient(135deg, #0f172a, #020617)",
        }}>
      <CardN2 title="📌 Datos generales">
        <div style={{ display: "grid", gap: 12 }}>
          <Select
            label="Tipo de instalación"
            value={req.tipoInstalacion}
            onChange={changeType}
            options={typeOptions}
          />

          <Select
            label="Entorno"
            value={req.entorno}
            onChange={(v) => setCommon("entorno", v)}
            options={[
              { value: "DEV", label: "DEV" },
              { value: "TEST", label: "TEST" },
              { value: "PROD", label: "PROD" },
            ]}
          />
        </div>
      </CardN2>

      {req.tipoInstalacion === INSTALL_TYPES.OBJECTS && (
        <CardN2 title="📦 Payload: Objetos">
          <div style={{ display: "grid", gap: 12 }}>
            <Field
              label="objectName"
              value={req.payload.objectName || ""}
              onChange={(v) => setPayload("objectName", v)}
              placeholder="Ej: MI_PGM"
            />
            <Field
              label="objectType"
              value={req.payload.objectType || ""}
              onChange={(v) => setPayload("objectType", v)}
              placeholder="Ej: PGM, SRVPGM, FILE"
            />
            <Field
              label="libFrom"
              value={req.payload.libFrom || ""}
              onChange={(v) => setPayload("libFrom", v)}
              placeholder="Ej: DESA_0836"
            />
            <Field
              label="libTo"
              value={req.payload.libTo || ""}
              onChange={(v) => setPayload("libTo", v)}
              placeholder="Ej: PROD_LIB"
            />
            <Select
              label="replace"
              value={req.payload.replace || "Y"}
              onChange={(v) => setPayload("replace", v)}
              options={[
                { value: "Y", label: "Sí" },
                { value: "N", label: "No" },
              ]}
            />
          </div>
        </CardN2>
      )}

      {req.tipoInstalacion === INSTALL_TYPES.DESA && (
        <CardN2 title="🏷️ Payload: Instalación desde DESA">
            <div style={{ display: "grid", gap: 12 }}>
            <Field
                label="desaName"
                value={req.payload.desaName || ""}
                onChange={(v) => setPayload("desaName", v)}
                placeholder="Ej: DESA_0536"
            />
            <Field
                label="descripcion"
                value={req.payload.descripcion || ""}
                onChange={(v) => setPayload("descripcion", v)}
                placeholder="Ej: Restore SAVF y listar objetos/fuentes"
            />
            </div>
        </CardN2>
        )}


      {req.tipoInstalacion === INSTALL_TYPES.SOURCES && (
        <CardN2 title="📄 Payload: Fuentes (miembros)">
          <div style={{ display: "grid", gap: 12 }}>
            <Field
              label="fileFrom"
              value={req.payload.fileFrom || ""}
              onChange={(v) => setPayload("fileFrom", v)}
              placeholder="Ej: QRPGLESRC"
            />
            <Field
              label="libFrom"
              value={req.payload.libFrom || ""}
              onChange={(v) => setPayload("libFrom", v)}
              placeholder="Ej: DESA_0836"
            />
            <Field
              label="fileTo"
              value={req.payload.fileTo || ""}
              onChange={(v) => setPayload("fileTo", v)}
              placeholder="Ej: QRPGLESRC"
            />
            <Field
              label="libTo"
              value={req.payload.libTo || ""}
              onChange={(v) => setPayload("libTo", v)}
              placeholder="Ej: PROD_LIB"
            />
            <Field
              label="member"
              value={req.payload.member || ""}
              onChange={(v) => setPayload("member", v)}
              placeholder="Ej: MIEMBRO01"
            />
            <Select
              label="action"
              value={req.payload.action || "REPLACE"}
              onChange={(v) => setPayload("action", v)}
              options={[
                { value: "REPLACE", label: "Reemplazar" },
                { value: "COPY", label: "Copiar si no existe" },
                { value: "BACKUP_AND_REPLACE", label: "Backup y reemplazar" },
              ]}
            />
          </div>
        </CardN2>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <MyButton actionLabel="▶ Ejecutar" onAction={onRun}>
          {loading ? "⏳ Ejecutando..." : "▶ Ejecutar"}
        </MyButton>

        <MyButton actionLabel="↩ Reset" onAction={() => {
            setReq(buildEmptyInstallRequest());
            setResponse(null);
          }}/>
      </div>

      <CardN2 title="🧾 Request JSON (preview)">
        <pre style={{ margin: 0, overflowX: "auto" }}>
          {JSON.stringify(req, null, 2)}
        </pre>
      </CardN2>

      {response && (
        <CardN2 title={response.ok ? "✅ Resultado" : "❌ Resultado"}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>{response.message}</div>

          {response.errors?.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 800 }}>Errores</div>
              <ul style={{ margin: "6px 0 0 18px" }}>
                {response.errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {response.log?.length > 0 && (
            <div>
              <div style={{ fontWeight: 800 }}>Log</div>
              <pre style={{ margin: 0, overflowX: "auto" }}>
                {response.log.join("\n")}
              </pre>
            </div>
          )}
        </CardN2>
      )}
    </TitlePage>
  );
}
