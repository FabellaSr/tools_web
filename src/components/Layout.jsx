import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import fondo from "../assets/fondo.png";
import layout from "../assets/layout.jpg";
import {
  MyButton,
  Sidebar,
  LayoutLeft,
  linkStyle,
  iconStyle,
} from "../components/ui";
import { logout, hasToken } from "../services/authService";
import ChatWidget from "../components/ChatWidget";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const authenticated = hasToken();

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <LayoutLeft fondo={fondo}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} layoutImage={layout}>
        <Sidebar.Header>
          <Sidebar.Title
            title="Tools-Web"
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </Sidebar.Header>

        <Sidebar.Nav>
          {/* Links públicos */}
          <NavLink to="/" end style={linkStyle(collapsed)}>
            <span style={iconStyle}>🏠</span>
            {!collapsed && <span>Home</span>}
          </NavLink>

          {/* Links solo si está logeado */}
          {authenticated && (
            <>
              <NavLink to="/audit" style={linkStyle(collapsed)}>
                <span style={iconStyle}>🕵️</span>
                {!collapsed && <span>Auditoría</span>}
              </NavLink>

              <Sidebar.Footer>
                <MyButton actionLabel="🚪 Cerrar sesión" onAction={onLogout} />
              </Sidebar.Footer>
            </>
          )}
        </Sidebar.Nav>
      </Sidebar>

      {/* Main */}
      <main
        style={{
          flex: 1,
          padding: 24,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
         <ChatWidget />
        <Outlet />
      </main>
    </LayoutLeft>
  );
}
