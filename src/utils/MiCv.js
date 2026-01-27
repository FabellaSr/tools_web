import React from "react";
export function getDefaultCv() {
  return {
    nombre: "Tu Nombre",
    rol: "Rol / Puesto",
    email: "tuemail@mail.com",
    telefono: "+54 11 1234-5678",
    linkedin: "linkedin.com/in/tuusuario",
    ubicacion: "Buenos Aires, AR",
    resumen:
      "Breve resumen profesional. 3–5 líneas sobre tu experiencia, tecnologías y lo que buscás.",
    fotoDataUrl: "",

    // Secciones con toggle
    secciones: {
      perfil: true,
      experiencia: true,
      educacion: true,
      proyectos: false,
      idiomas: false,
      certificaciones: false,
    },

    // Orden de secciones MAIN (derecha)
    ordenMain: ["perfil", "experiencia", "proyectos", "educacion"],

    // Orden de bloques SIDEBAR (izquierda)
    ordenSidebar: ["contacto", "skills", "idiomas", "certificaciones"],

    experiencia: [
      {
        id: cryptoId(),
        empresa: "Empresa X",
        puesto: "Puesto",
        desde: "2023",
        hasta: "Actual",
        bullets: [
          "Logro o responsabilidad #1",
          "Logro o responsabilidad #2",
          "Tecnologías: React, Node, IBM i…",
        ],
      },
    ],

    educacion: [
      {
        id: cryptoId(),
        institucion: "Institución",
        titulo: "Título / Carrera",
        desde: "2018",
        hasta: "2022",
      },
    ],

    proyectos: [
      {
        id: cryptoId(),
        nombre: "Proyecto X",
        link: "https://",
        descripcion: "Breve descripción del proyecto y tu aporte.",
        tech: "React, Node, etc.",
      },
    ],

    idiomas: [{ id: cryptoId(), idioma: "Inglés", nivel: "Intermedio" }],

    certificaciones: [
      { id: cryptoId(), nombre: "Certificación", entidad: "Entidad", anio: "2025" },
    ],

    skills: ["React", "Node.js", "IBM i", "RPGLE", "SQL", "Git", "ACE"],
  };
}

export function cryptoId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "id-" + Math.random().toString(16).slice(2) + "-" + Date.now();
}

export function SidebarTitle({ title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.4 }}>{title.toUpperCase()}</div>
      <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.12)" }} />
    </div>
  );
}

export function SidebarItem({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: "grid", gap: 2 }}>
      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{label}</div>
      <div style={{ fontSize: 12.5, color: "#E5E7EB", wordBreak: "break-word" }}>{value}</div>
    </div>
  );
}

export function MainSectionTitle({ title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 0.6, color: "#111827" }}>
        {title.toUpperCase()}
      </div>
      <div style={{ height: 1, flex: 1, background: "#E5E7EB" }} />
    </div>
  );
}

export function moveItem(arr, from, to) {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function reorderByKeys(list, keyOrder, getKey) {
  const map = new Map(list.map((x) => [getKey(x), x]));
  const ordered = [];
  for (const k of keyOrder) {
    const item = map.get(k);
    if (item) ordered.push(item);
  }
  for (const x of list) {
    const k = getKey(x);
    if (!keyOrder.includes(k)) ordered.push(x);
  }
  return ordered;
}


/* -------------------- Template: Minimal Sidebar -------------------- */

export function CVTemplateMinimalSidebar({ cv, experienciaOrdenada, proyectosOrdenados }) {
  const sidebarBg = "#111827";
  const sidebarText = "#E5E7EB";
  const sidebarMuted = "#9CA3AF";

  const renderSidebarBlock = (key) => {
    switch (key) {
      case "contacto":
        return (
          <div key={key} style={{ marginTop: 18 }}>
            <SidebarTitle title="Contacto" />
            <div style={{ marginTop: 10, display: "grid", gap: 8, fontSize: 12.5 }}>
              <SidebarItem label="Email" value={cv.email} />
              <SidebarItem label="Tel" value={cv.telefono} />
              <SidebarItem label="LinkedIn" value={cv.linkedin} />
              <SidebarItem label="Ubicación" value={cv.ubicacion} />
            </div>
          </div>
        );

      case "skills":
        return (
          <div key={key} style={{ marginTop: 18 }}>
            <SidebarTitle title="Skills" />
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {cv.skills.map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 12,
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        );

      case "idiomas":
        if (!cv.secciones.idiomas) return null;
        return (
          <div key={key} style={{ marginTop: 18 }}>
            <SidebarTitle title="Idiomas" />
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              {cv.idiomas.map((it) => (
                <div key={it.id}>
                  <div style={{ fontSize: 12.5, color: sidebarText }}>{it.idioma || "Idioma"}</div>
                  <div style={{ fontSize: 12, color: sidebarMuted }}>{it.nivel || "Nivel"}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "certificaciones":
        if (!cv.secciones.certificaciones) return null;
        return (
          <div key={key} style={{ marginTop: 18 }}>
            <SidebarTitle title="Certificaciones" />
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              {cv.certificaciones.map((it) => (
                <div key={it.id}>
                  <div style={{ fontSize: 12.5, color: sidebarText }}>
                    {it.nombre || "Certificación"}
                  </div>
                  <div style={{ fontSize: 12, color: sidebarMuted }}>
                    {(it.entidad || "Entidad") + (it.anio ? ` · ${it.anio}` : "")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderMainSection = (key) => {
    if (!cv.secciones[key]) return null;

    switch (key) {
      case "perfil":
        return (
          <React.Fragment key={key}>
            <MainSectionTitle title="Perfil" />
            <p style={{ marginTop: 10, fontSize: 13.2, lineHeight: 1.7, color: "#111827" }}>
              {cv.resumen}
            </p>
          </React.Fragment>
        );

      case "experiencia":
        return (
          <div key={key} style={{ marginTop: 18 }}>
            <MainSectionTitle title="Experiencia" />
            <div style={{ marginTop: 12, display: "grid", gap: 14 }}>
              {experienciaOrdenada.map((exp) => (
                <div key={exp.id} style={{ paddingBottom: 12, borderBottom: "1px solid #E5E7EB" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontSize: 13.2, fontWeight: 800, color: "#111827" }}>
                      {exp.puesto || "Puesto"}
                      <span style={{ fontWeight: 700, color: "#374151" }}>
                        {" "}
                        · {exp.empresa || "Empresa"}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280", whiteSpace: "nowrap" }}>
                      {exp.desde || "—"} – {exp.hasta || "—"}
                    </div>
                  </div>

                  <ul style={{ marginTop: 8, paddingLeft: 16, color: "#111827" }}>
                    {exp.bullets
                      .filter((b) => b.trim().length > 0)
                      .map((b, bIdx) => (
                        <li key={bIdx} style={{ fontSize: 12.8, lineHeight: 1.65, marginTop: 5 }}>
                          {b}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case "proyectos":
        return (
          <div key={key} style={{ marginTop: 18 }}>
            <MainSectionTitle title="Proyectos" />
            <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
              {proyectosOrdenados.map((p) => (
                <div key={p.id} style={{ paddingBottom: 12, borderBottom: "1px solid #E5E7EB" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontSize: 13.2, fontWeight: 800, color: "#111827" }}>
                      {p.nombre || "Proyecto"}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{p.link ? p.link : ""}</div>
                  </div>

                  {p.descripcion ? (
                    <p style={{ marginTop: 6, fontSize: 12.8, lineHeight: 1.65, color: "#374151" }}>
                      {p.descripcion}
                    </p>
                  ) : null}

                  {p.tech ? (
                    <div style={{ marginTop: 6, fontSize: 12, color: "#6B7280" }}>
                      Tech: {p.tech}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        );

      case "educacion":
        return (
          <div key={key} style={{ marginTop: 18 }}>
            <MainSectionTitle title="Educación" />
            <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
              {cv.educacion.map((ed) => (
                <div key={ed.id} style={{ paddingBottom: 12, borderBottom: "1px solid #E5E7EB" }}>
                  <div style={{ fontSize: 13.2, fontWeight: 800, color: "#111827" }}>
                    {ed.titulo || "Título"}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12.5, color: "#374151" }}>
                    {ed.institucion || "Institución"}
                  </div>
                  <div style={{ marginTop: 3, fontSize: 12, color: "#6B7280" }}>
                    {ed.desde || "—"} – {ed.hasta || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system", background: "#fff" }}>
      <div style={{ display: "grid", gridTemplateColumns: "0.92fr 2fr", minHeight: 1122 }}>
        {/* Sidebar */}
        <aside style={{ background: sidebarBg, color: sidebarText, padding: 26 }}>
          <div
            style={{
              width: 118,
              height: 118,
              borderRadius: 18,
              overflow: "hidden",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            {cv.fotoDataUrl ? (
              <img
                src={cv.fotoDataUrl}
                alt="Foto"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : null}
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>
              {cv.nombre || "Tu Nombre"}
            </div>
            <div style={{ marginTop: 6, fontSize: 12.5, fontWeight: 600, color: sidebarMuted }}>
              {cv.rol || "Rol / Puesto"}
            </div>
          </div>

          {cv.ordenSidebar.map((k) => renderSidebarBlock(k))}
        </aside>

        {/* Main */}
        <main style={{ padding: 30 }}>
          {cv.ordenMain.map((k) => renderMainSection(k))}
        </main>
      </div>
    </div>
  );
}
