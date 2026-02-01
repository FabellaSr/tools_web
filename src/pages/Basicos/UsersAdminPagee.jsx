import React, { useEffect, useMemo, useState } from "react";
import { usersAdminStyles as s } from "../../estilos/userAdmin.styles";

// ====== Config ======
const API_BASE = "";

// ====== Helper request ======
async function request(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (data && data.error) ||
      (typeof data === "string" ? data : "") ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export default function UsersAdminPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });

  const [creating, setCreating] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [users, setUsers] = useState([]);

  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const canSubmit = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const passOk = (form.password || "").length >= 6;
    const nameOk = (form.name || "").trim().length >= 2;
    const roleOk = form.role === "admin" || form.role === "user";
    return emailOk && passOk && nameOk && roleOk;
  }, [form]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function resetMessages() {
    setOkMsg("");
    setErrMsg("");
  }

  async function loadUsers() {
    setLoadingList(true);
    resetMessages();
    try {
      const data = await request("/api/admin/users");
      const list = Array.isArray(data) ? data : data?.data || [];
      setUsers(list);
    } catch (e) {
      setErrMsg(e.message || "Error cargando usuarios");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    resetMessages();

    if (!canSubmit) {
      setErrMsg("Revisá los campos: email válido, nombre (2+), password (6+) y rol.");
      return;
    }

    setCreating(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      };

      await request("/api/admin/users", { method: "POST", body: payload });

      setOkMsg("✅ Usuario creado correctamente.");
      setForm({ name: "", email: "", password: "", role: "user" });
      await loadUsers();
    } catch (e) {
      setErrMsg(e.message || "Error creando usuario");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Usuarios</h1>
          <p style={s.subtitle}>
            Alta y administración básica de usuarios en <span style={s.tdMono}>Mongo</span> (vía Gateway).
          </p>
        </div>

        <div style={s.headerActions}>
          <button
            type="button"
            onClick={loadUsers}
            disabled={loadingList}
            style={{ ...s.btn, ...s.btnSecondary(loadingList) }}
            title="Refrescar lista"
          >
            {loadingList ? "Actualizando..." : "Refrescar"}
          </button>
        </div>
      </div>

      <div style={s.grid}>
        {/* Crear */}
        <section style={s.card}>
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>Crear usuario</h2>
            <span style={s.badge}>Admin only</span>
          </div>

          <form onSubmit={onSubmit} style={s.form}>
            <div style={s.row2}>
              <div style={s.field}>
                <label style={s.label}>Nombre</label>
                <input
                  style={s.input}
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Ej: Juan Perez"
                  autoComplete="name"
                />
              </div>

              <div style={s.field}>
                <label style={s.label}>Email</label>
                <input
                  style={s.input}
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="usuario@dominio.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={s.row2}>
              <div style={s.field}>
                <label style={s.label}>Password</label>
                <input
                  style={s.input}
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="mínimo 6 caracteres"
                  autoComplete="new-password"
                />
                <div style={s.hint}>Mínimo 6 caracteres</div>
              </div>

              <div style={s.field}>
                <label style={s.label}>Rol</label>
                <select style={s.input} name="role" value={form.role} onChange={onChange}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <div style={s.hint}>Definí permisos del usuario</div>
              </div>
            </div>

            <div style={s.actions}>
              <button
                type="submit"
                disabled={!canSubmit || creating}
                style={{ ...s.btn, ...s.btnPrimary(!canSubmit || creating) }}
                title={!canSubmit ? "Completá los campos obligatorios" : "Crear usuario"}
              >
                {creating ? "Creando..." : "Crear usuario"}
              </button>

              {!canSubmit && <span style={s.helperInline}>Tip: email válido + nombre 2+ + password 6+</span>}
            </div>

            {okMsg && <div style={{ ...s.alert, ...s.alertOk }}>{okMsg}</div>}
            {errMsg && <div style={{ ...s.alert, ...s.alertErr }}>❌ {errMsg}</div>}
          </form>
        </section>

        {/* Lista */}
        <section style={s.card}>
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>Usuarios</h2>
            <div style={s.listTop}>
              <span style={s.counter}>{users.length}</span>
              <span style={s.counterLabel}>total</span>
            </div>
          </div>

          <div style={s.tableWrap}>
            {loadingList ? (
              <div style={s.empty}>Cargando...</div>
            ) : users.length === 0 ? (
              <div style={s.empty}>
                <div style={s.emptyTitle}>No hay usuarios para mostrar</div>
                <div style={s.emptySub}>Creá el primero desde el panel de la izquierda.</div>
              </div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Nombre</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Rol</th>
                    <th style={s.th}>Creado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id || u.id || `${u.email}-${u.role}`}>
                      <td style={{ ...s.td, ...s.tdStrong }}>{u.name || "-"}</td>
                      <td style={{ ...s.td, ...s.tdMono }}>{u.email}</td>
                      <td style={s.td}>
                        <span style={s.pill(u.role)}>{u.role}</span>
                      </td>
                      <td style={{ ...s.td, ...s.tdMuted }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={s.footerNote}>
            * La lista depende de <span style={s.tdMono}>GET /api/admin/users</span> en el Gateway.
          </div>
        </section>
      </div>
    </div>
  );
}
