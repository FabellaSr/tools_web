import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import fondo from "../assets/fondo.png";
import layout from "../assets/layout.jpg";
import { MyButton, Sidebar } from "../components/ui"; 
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

const linkStyle = (collapsed) => ({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: collapsed ? 0 : 10,
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  color: isActive ? "white" : "#979292ff",
  background: isActive ? "#111" : "transparent",
  justifyContent: collapsed ? "center" : "flex-start",
});

const iconStyle = {
  fontSize: 18,
  width: 22,
  textAlign: "center",
};

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundImage: ` 
          url(${fondo})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: collapsed ? 72 : 260,
          padding: 12,
          borderRight: "1px solid #ddd",
          backgroundImage: `
            linear-gradient(135deg, rgba(15,23,42,0.85), rgba(2,6,23,0.9)),
            url(${layout})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "width 0.2s ease",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 , }}>
          <div style={{ fontWeight: 900, fontSize: 18, whiteSpace: "nowrap" ,  color: "#f3e5e5ff",}}>
            ⚙️ {collapsed ? "" : "AS400 Tools"}
          </div>

          <button
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? "Expandir" : "Colapsar"}
            style={{
              marginLeft: "auto",
              border: "1px solid #ddd",
              background: "white",
              borderRadius: 10,
              padding: "6px 10px",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            {collapsed ? "»" : "«"}
          </button>

        </div>

        {!collapsed && (
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            React + APIs IBM i
          </div>
        )}

        {/* Nav */}
        <nav style={{ display: "grid", gap: 8, marginTop: 16 }}>
          <NavLink to="/" end style={linkStyle(collapsed)}>
            <span style={iconStyle}>🏠</span>
            {!collapsed && <span>Home</span>}
          </NavLink>
          <NavLink to="/audit" style={linkStyle(collapsed)}>
            <span style={iconStyle}>🕵️</span>
            {!collapsed && <span>Auditoría</span>}
          </NavLink>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ marginLeft: "auto" }}>
              <MyButton actionLabel="🚪 Cerrar sesión" onAction={onLogout} />
            </div>
          </div>
        </nav>
        
      </aside>

      {/* Main */}
      <main
        style={{
          flex: 1,
          padding: 24,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
