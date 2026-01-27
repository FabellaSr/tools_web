import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Field,  MyButton } from "../components/ui";
import { STORAGE_KEY, MAIN_LABELS, SIDEBAR_LABELS } from "../config/env";
import { getDefaultCv, 
         cryptoId, 
         moveItem,
         reorderByKeys,
         CVTemplateMinimalSidebar
        } from "../utils/MiCv";
import { DragRow, TextArea} from "../components/ui";
/**
 * MiCvPage
 * - Template minimal con sidebar
 * - Export PDF
 * - 3) Secciones ON/OFF
 * - 4) Drag & drop:
 *    4.0 MAIN sections order
 *    4.1 SIDEBAR blocks orderrrtar
 *    4.2 EXPERIENCE items order
 *    4.2b PROJECTS items order ✅ (nuevo)
 * - 4.3 Persistencia:
 *    - Auto-save LocalStorage
 *    - Export/Import JSON
 *    - Reset
 */

export default function MiCvPage() {
  const previewRef = useRef(null);

  // Load initial from LocalStorage (4.3)
  const [cv, setCv] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultCv();
    try {
      const parsed = JSON.parse(raw);

      const base = getDefaultCv();
      return {
        ...base,
        ...parsed,
        secciones: { ...base.secciones, ...(parsed.secciones || {}) },
        ordenMain: parsed.ordenMain?.length ? parsed.ordenMain : base.ordenMain,
        ordenSidebar: parsed.ordenSidebar?.length ? parsed.ordenSidebar : base.ordenSidebar,
      };
    } catch {
      return getDefaultCv();
    }
  });

  // Auto-save (4.3)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
  }, [cv]);

  const setField = (key, value) => setCv((p) => ({ ...p, [key]: value }));

  const toggleSeccion = (key) =>
    setCv((p) => ({
      ...p,
      secciones: { ...p.secciones, [key]: !p.secciones[key] },
    }));

  // Foto
  const onFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setField("fotoDataUrl", String(reader.result));
    reader.readAsDataURL(file);
  };

  // Skills textarea
  const skillsText = useMemo(() => cv.skills.join(", "), [cv.skills]);
  const onSkillsText = (text) => {
    const arr = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("skills", arr);
  };

  // ---------------- 4.0 MAIN Drag ----------------
  const [dragMainFrom, setDragMainFrom] = useState(null);
  const onDropMain = (index) => {
    if (dragMainFrom === null || dragMainFrom === index) return;
    setCv((p) => ({ ...p, ordenMain: moveItem(p.ordenMain, dragMainFrom, index) }));
    setDragMainFrom(null);
  };

  // ---------------- 4.1 SIDEBAR Drag ----------------
  const [dragSidebarFrom, setDragSidebarFrom] = useState(null);
  const onDropSidebar = (index) => {
    if (dragSidebarFrom === null || dragSidebarFrom === index) return;
    setCv((p) => ({ ...p, ordenSidebar: moveItem(p.ordenSidebar, dragSidebarFrom, index) }));
    setDragSidebarFrom(null);
  };

  // ---------------- 4.2 EXPERIENCE Drag ----------------
  const expIds = useMemo(() => cv.experiencia.map((x) => x.id), [cv.experiencia]);
  const [experienciaOrder, setExperienciaOrder] = useState(() => expIds);

  // useEffect(() => {
  //   setExperienciaOrder((prev) => {
  //     const all = cv.experiencia.map((x) => x.id);
  //     const filtered = prev.filter((id) => all.includes(id));
  //     const missing = all.filter((id) => !filtered.includes(id));
  //     return [...filtered, ...missing];
  //   });
  // }, [cv.experiencia]);

  const [dragExpFrom, setDragExpFrom] = useState(null);
  const onDropExp = (index) => {
    if (dragExpFrom === null || dragExpFrom === index) return;
    setExperienciaOrder((p) => moveItem(p, dragExpFrom, index));
    setDragExpFrom(null);
  };

  const experienciaOrdenada = useMemo(() => {
    return reorderByKeys(cv.experiencia, experienciaOrder, (x) => x.id);
  }, [cv.experiencia, experienciaOrder]);

  useEffect(() => {
    setCv((p) => ({
      ...p,
      experiencia: reorderByKeys(p.experiencia, experienciaOrder, (x) => x.id),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaOrder]);

  // ---------------- ✅ 4.2b PROJECTS Drag ----------------
  const projIds = useMemo(() => cv.proyectos.map((x) => x.id), [cv.proyectos]);
  const [proyectosOrder, setProyectosOrder] = useState(() => projIds);

  // useEffect(() => {
  //   setProyectosOrder((prev) => {
  //     const all = cv.proyectos.map((x) => x.id);
  //     const filtered = prev.filter((id) => all.includes(id));
  //     const missing = all.filter((id) => !filtered.includes(id));
  //     return [...filtered, ...missing];
  //   });
  // }, [cv.proyectos]);

  const [dragProjFrom, setDragProjFrom] = useState(null);
  const onDropProj = (index) => {
    if (dragProjFrom === null || dragProjFrom === index) return;
    setProyectosOrder((p) => moveItem(p, dragProjFrom, index));
    setDragProjFrom(null);
  };

  const proyectosOrdenados = useMemo(() => {
    return reorderByKeys(cv.proyectos, proyectosOrder, (x) => x.id);
  }, [cv.proyectos, proyectosOrder]);

  useEffect(() => {
    setCv((p) => ({
      ...p,
      proyectos: reorderByKeys(p.proyectos, proyectosOrder, (x) => x.id),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyectosOrder]);

  // ---------------- CRUD: Experiencia ----------------
  const addExp = () =>
    setCv((p) => ({
      ...p,
      experiencia: [
        ...p.experiencia,
        { id: cryptoId(), empresa: "", puesto: "", desde: "", hasta: "", bullets: [""] },
      ],
    }));

  const updateExp = (id, patch) =>
    setCv((p) => ({
      ...p,
      experiencia: p.experiencia.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const addExpBullet = (id) =>
    setCv((p) => ({
      ...p,
      experiencia: p.experiencia.map((it) =>
        it.id === id ? { ...it, bullets: [...it.bullets, ""] } : it
      ),
    }));

  const updateExpBullet = (id, bIdx, value) =>
    setCv((p) => ({
      ...p,
      experiencia: p.experiencia.map((it) => {
        if (it.id !== id) return it;
        const bullets = it.bullets.map((b, j) => (j === bIdx ? value : b));
        return { ...it, bullets };
      }),
    }));

  const removeExp = (id) =>
    setCv((p) => ({ ...p, experiencia: p.experiencia.filter((it) => it.id !== id) }));

  // ---------------- CRUD: Educación ----------------
  const addEdu = () =>
    setCv((p) => ({
      ...p,
      educacion: [...p.educacion, { id: cryptoId(), institucion: "", titulo: "", desde: "", hasta: "" }],
    }));

  const updateEdu = (id, patch) =>
    setCv((p) => ({
      ...p,
      educacion: p.educacion.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const removeEdu = (id) =>
    setCv((p) => ({ ...p, educacion: p.educacion.filter((it) => it.id !== id) }));

  // ---------------- CRUD: Proyectos ----------------
  const addProyecto = () =>
    setCv((p) => ({
      ...p,
      proyectos: [...p.proyectos, { id: cryptoId(), nombre: "", link: "", descripcion: "", tech: "" }],
    }));

  const updateProyecto = (id, patch) =>
    setCv((p) => ({
      ...p,
      proyectos: p.proyectos.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const removeProyecto = (id) =>
    setCv((p) => ({ ...p, proyectos: p.proyectos.filter((it) => it.id !== id) }));

  // ---------------- CRUD: Idiomas ----------------
  const addIdioma = () =>
    setCv((p) => ({ ...p, idiomas: [...p.idiomas, { id: cryptoId(), idioma: "", nivel: "" }] }));

  const updateIdioma = (id, patch) =>
    setCv((p) => ({
      ...p,
      idiomas: p.idiomas.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const removeIdioma = (id) =>
    setCv((p) => ({ ...p, idiomas: p.idiomas.filter((it) => it.id !== id) }));

  // ---------------- CRUD: Certificaciones ----------------
  const addCert = () =>
    setCv((p) => ({
      ...p,
      certificaciones: [...p.certificaciones, { id: cryptoId(), nombre: "", entidad: "", anio: "" }],
    }));

  const updateCert = (id, patch) =>
    setCv((p) => ({
      ...p,
      certificaciones: p.certificaciones.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const removeCert = (id) =>
    setCv((p) => ({ ...p, certificaciones: p.certificaciones.filter((it) => it.id !== id) }));

  // ---------------- Export PDF ----------------
  const exportarPDF = async () => {
    const node = previewRef.current;
    if (!node) return;

    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      pdf.save("MiCv.pdf");
      return;
    }

    let y = 0;
    let remaining = imgHeight;
    while (remaining > 0) {
      pdf.addImage(imgData, "JPEG", 0, y, imgWidth, imgHeight);
      remaining -= pageHeight;
      if (remaining > 0) {
        pdf.addPage();
        y -= pageHeight;
      }
    }

    pdf.save("MiCv.pdf");
  };

  // ---------------- 4.3 Persistencia ----------------
  const guardarAhora = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
    alert("Guardado en LocalStorage ✅");
  };

  const resetear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCv(getDefaultCv());
    alert("Reset OK ✅");
  };

  const exportarJSON = () => {
    const blob = new Blob([JSON.stringify(cv, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MiCv.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <h1 className="text-xl font-semibold tracking-tight">MiCv</h1>

          <div className="flex flex-wrap gap-2">

            <MyButton actionLabel={'Exportar PDF'} onAction={exportarPDF} />
            <MyButton actionLabel={'Guardar'} onAction={guardarAhora} />
            <MyButton actionLabel={'Exportar JSON'} onAction={exportarJSON} />           
            <MyButton actionLabel={'Reset'} onAction={resetear} />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-2">
        {/* Editor */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
          <h2 className="mb-3 text-base font-semibold">Editor</h2>

          {/* Secciones ON/OFF */}
          <div className="mb-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-3">
            <div className="mb-2 text-sm font-semibold">Secciones</div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                <MyButton actionLabel={'Perfil'} onAction={() => toggleSeccion("perfil")} />
                <MyButton actionLabel={'Experiencia'} onAction={() => toggleSeccion("experiencia")} />
                <MyButton actionLabel={'Educación'} onAction={() => toggleSeccion("educacion")} />
                <MyButton actionLabel={'Proyectos'} onAction={() => toggleSeccion("proyectos")} />
                <MyButton actionLabel={'Idiomas'} onAction={() => toggleSeccion("idiomas")} />
                <MyButton actionLabel={'Certificaciones'} onAction={() => toggleSeccion("certificaciones")} />
              </div>
            </div>
          </div>

          {/* Orden MAIN */}
          <div className="mb-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-3">
            <div className="mb-2 text-sm font-semibold">Orden MAIN (arrastrá y soltá)</div>
            <div className="space-y-2">
              {cv.ordenMain.map((key, idx) => (
                <DragRow
                  key={key}
                  label={MAIN_LABELS[key]}
                  badge={cv.secciones[key] ? "ON" : "OFF"}
                  badgeActive={cv.secciones[key]}
                  onDragStart={() => setDragMainFrom(idx)}
                  onDrop={() => onDropMain(idx)}
                />
              ))}
            </div>
          </div>

          {/* Orden SIDEBAR */}
          <div className="mb-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-3">
            <div className="space-y-2">
              {cv.ordenSidebar.map((key, idx) => (
                <DragRow
                  key={key}
                  label={SIDEBAR_LABELS[key]}
                  badge={
                    key === "idiomas"
                      ? cv.secciones.idiomas ? "ON" : "OFF"
                      : key === "certificaciones"
                        ? cv.secciones.certificaciones ? "ON" : "OFF"
                        : "—"
                  }
                  badgeActive={
                    key === "idiomas"
                      ? cv.secciones.idiomas
                      : key === "certificaciones"
                        ? cv.secciones.certificaciones
                        : true
                  }
                  onDragStart={() => setDragSidebarFrom(idx)}
                  onDrop={() => onDropSidebar(idx)}
                />
              ))}
            </div>
          </div>

          {/* Datos base */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                {cv.fotoDataUrl ? (
                  <img src={cv.fotoDataUrl} alt="Foto" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-sm text-neutral-500">Sin foto</div>
                )}
              </div>

              <label className="flex-1">
                <div className="text-sm text-neutral-300">Foto</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFotoChange}
                  className="mt-1 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
                />
              </label>
            </div>

            <Field label="Nombre" value={cv.nombre} onChange={(v) => setField("nombre", v)} />
            <Field label="Rol" value={cv.rol} onChange={(v) => setField("rol", v)} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="Email" value={cv.email} onChange={(v) => setField("email", v)} />
              <Field label="Teléfono" value={cv.telefono} onChange={(v) => setField("telefono", v)} />
              <Field label="LinkedIn" value={cv.linkedin} onChange={(v) => setField("linkedin", v)} />
              <Field label="Ubicación" value={cv.ubicacion} onChange={(v) => setField("ubicacion", v)} />
            </div>

            {cv.secciones.perfil ? (
              <TextArea label="Resumen" value={cv.resumen} onChange={(v) => setField("resumen", v)} rows={4} />
            ) : null}

            <TextArea label="Skills (separadas por coma)" value={skillsText} onChange={onSkillsText} rows={2} />

            {/* Experiencia */}
            {cv.secciones.experiencia ? (
              <div className="mt-2">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Experiencia</h3>
                  <MyButton actionLabel={' + Agregar'} onAction={addExp} />
                </div>

                <div className="mb-3 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-3">
                  <div className="space-y-2">
                    {cv.experiencia.map((exp, idx) => (
                      <div
                        key={exp.id}
                        draggable
                        onDragStart={() => setDragExpFrom(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDropExp(idx)}
                        className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/30 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-400">☰</span>
                          <span className="text-sm text-neutral-200">
                            {exp.puesto || "Puesto"}{" "}
                            <span className="text-neutral-400">· {exp.empresa || "Empresa"}</span>
                          </span>
                        </div>
                        <span className="text-xs text-neutral-500">#{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {cv.experiencia.map((exp) => (
                    <div key={exp.id} className="rounded-2xl border border-neutral-800 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs text-neutral-400">{exp.id.slice(0, 8)}</div>
                        
                       <MyButton actionLabel={'Eliminar'} onAction={() => removeExp(exp.id)} />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <Field label="Empresa" value={exp.empresa} onChange={(v) => updateExp(exp.id, { empresa: v })} />
                        <Field label="Puesto" value={exp.puesto} onChange={(v) => updateExp(exp.id, { puesto: v })} />
                        <Field label="Desde" value={exp.desde} onChange={(v) => updateExp(exp.id, { desde: v })} />
                        <Field label="Hasta" value={exp.hasta} onChange={(v) => updateExp(exp.id, { hasta: v })} />
                      </div>

                      <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between">
                          <div className="text-sm text-neutral-300">Bullets</div>
                          <button
                            onClick={() => addExpBullet(exp.id)}
                            className="rounded-xl border border-neutral-700 px-3 py-1 text-xs hover:bg-neutral-800"
                          >
                            + Bullet
                          </button>
                        </div>
                        <div className="space-y-2">
                          {exp.bullets.map((b, bIdx) => (
                            <input
                              key={bIdx}
                              value={b}
                              onChange={(e) => updateExpBullet(exp.id, bIdx, e.target.value)}
                              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
                              placeholder="Ej: Mejoré performance del proceso..."
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* ✅ Proyectos (con orden drag & drop) */}
            {cv.secciones.proyectos ? (
              <div className="mt-2">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Proyectos</h3>
                  <MyButton actionLabel={' + Agregar'} onAction={addProyecto} />

                </div>

                <div className="mb-3 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-3">
                  <div className="mb-2 text-sm font-semibold">Orden de proyectos (drag & drop)</div>
                  <div className="space-y-2">
                    {cv.proyectos.map((p, idx) => (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={() => setDragProjFrom(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDropProj(idx)}
                        className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/30 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-400">☰</span>
                          <span className="text-sm text-neutral-200">
                            {p.nombre || "Proyecto"}{" "}
                            <span className="text-neutral-400">· {p.link || "sin link"}</span>
                          </span>
                        </div>
                        <span className="text-xs text-neutral-500">#{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {cv.proyectos.map((p) => (
                    <div key={p.id} className="rounded-2xl border border-neutral-800 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs text-neutral-400">{p.id.slice(0, 8)}</div>
                        
                       <MyButton actionLabel={'Eliminar'} onAction={() => removeProyecto(p.id)} />
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <Field label="Nombre" value={p.nombre} onChange={(v) => updateProyecto(p.id, { nombre: v })} />
                        <Field label="Link" value={p.link} onChange={(v) => updateProyecto(p.id, { link: v })} />
                        <TextArea label="Descripción" value={p.descripcion} onChange={(v) => updateProyecto(p.id, { descripcion: v })} rows={3} />
                        <Field label="Tech" value={p.tech} onChange={(v) => updateProyecto(p.id, { tech: v })} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Educación */}
            {cv.secciones.educacion ? (
              <div className="mt-2">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Educación</h3>
                  <MyButton actionLabel={' + Agregar'} onAction={addEdu} />
                </div>

                <div className="space-y-3">
                  {cv.educacion.map((ed) => (
                    <div key={ed.id} className="rounded-2xl border border-neutral-800 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs text-neutral-400">{ed.id.slice(0, 8)}</div>
                        <MyButton actionLabel={'Eliminar'} onAction={() => removeEdu(ed.id)} />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <Field label="Institución" value={ed.institucion} onChange={(v) => updateEdu(ed.id, { institucion: v })} />
                        <Field label="Título" value={ed.titulo} onChange={(v) => updateEdu(ed.id, { titulo: v })} />
                        <Field label="Desde" value={ed.desde} onChange={(v) => updateEdu(ed.id, { desde: v })} />
                        <Field label="Hasta" value={ed.hasta} onChange={(v) => updateEdu(ed.id, { hasta: v })} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Idiomas */}
            {cv.secciones.idiomas ? (
              <div className="mt-2">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Idiomas</h3>
                  
                  <MyButton actionLabel={' + Agregar'} onAction={addIdioma} />
        
                </div>

                <div className="space-y-3">
                  {cv.idiomas.map((it) => (
                    <div key={it.id} className="rounded-2xl border border-neutral-800 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs text-neutral-400">{it.id.slice(0, 8)}</div>
                        <MyButton actionLabel={'Eliminar'} onAction={() => removeIdioma(it.id)} />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <Field label="Idioma" value={it.idioma} onChange={(v) => updateIdioma(it.id, { idioma: v })} />
                        <Field label="Nivel" value={it.nivel} onChange={(v) => updateIdioma(it.id, { nivel: v })} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Certificaciones */}
            {cv.secciones.certificaciones ? (
              <div className="mt-2">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Certificaciones</h3>
                   <MyButton actionLabel={' + Agregar'} onAction={addCert} />
                </div>

                <div className="space-y-3">
                  {cv.certificaciones.map((it) => (
                    <div key={it.id} className="rounded-2xl border border-neutral-800 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs text-neutral-400">{it.id.slice(0, 8)}</div>
                       <MyButton actionLabel={'Eliminar'} onAction={() => removeCert(it.id)} />
                        
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                        <Field label="Nombre" value={it.nombre} onChange={(v) => updateCert(it.id, { nombre: v })} />
                        <Field label="Entidad" value={it.entidad} onChange={(v) => updateCert(it.id, { entidad: v })} />
                        <Field label="Año" value={it.anio} onChange={(v) => updateCert(it.id, { anio: v })} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Preview</h2>
            <div className="text-xs text-neutral-400">Minimal Sidebar</div>
          </div>

          <div className="overflow-auto rounded-2xl bg-white p-0 text-neutral-900">
            <div ref={previewRef} className="min-h-[980px] w-full">
              <CVTemplateMinimalSidebar
                cv={cv}
                experienciaOrdenada={experienciaOrdenada}
                proyectosOrdenados={proyectosOrdenados}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
