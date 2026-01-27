export function Field({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #ddd",
          outline: "none",
        }}
      />
    </label>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #ddd",
          outline: "none",
          background: "white",
        }}
      >
        {options.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MyButton({ actionLabel, onAction,  disabled = false }) {
  return (
      
      <button
        onClick={disabled ? undefined : 
          (e) => {
          e.stopPropagation(); // ✅ evita doble disparo (botón + card)
          onAction?.();
        }}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #fffafaff",
          background: "#111",
          color: "white",
          cursor: "pointer",
          fontWeight: 700,
          opacity: disabled ? 0.7 : 1,
        }}
      >
        {actionLabel}
      </button>

  );
}


export function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      <div className="text-sm text-neutral-300">{label}</div>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full resize-y rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
      />
    </label>
  );
}

export function DragRow({ label, badge, badgeActive, onDragStart, onDrop }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/30 px-3 py-2"
    >
      <div className="flex items-center gap-2">
        <span className="text-neutral-400">☰</span>
        <span className="text-sm text-neutral-200">{label}</span>
      </div>

      <span
        className={[
          "text-xs px-2 py-1 rounded-full border",
          badgeActive ? "border-neutral-700 text-neutral-300" : "border-neutral-800 text-neutral-500",
        ].join(" ")}
      >
        {badge}
      </span>
    </div>
  );
}

export function Alert({ variant = "info", title, children }) {
  const stylesByVariant = {
    info:   { border: "1px solid #60a5fa", bg: "rgba(59,130,246,0.10)" },
    error:  { border: "1px solid #f87171", bg: "rgba(239,68,68,0.10)" },
    success:{ border: "1px solid #34d399", bg: "rgba(16,185,129,0.10)" },
    warn:   { border: "1px solid #fbbf24", bg: "rgba(245,158,11,0.10)" },
  };

  const s = stylesByVariant[variant] || stylesByVariant.info;

  return (
    <div
      style={{
        border: s.border,
        background: s.bg,
        borderRadius: 12,
        padding: 12,
        color: "white",
      }}
    >
      {title && <div style={{ fontWeight: 900, marginBottom: 6 }}>{title}</div>}
      <div>{children}</div>
    </div>
  );
}
// helpers de estilo reutilizables

export const iconStyle = {
  fontSize: 18,
  width: 22,
  textAlign: "center",
};

export const linkStyle = (collapsed) => ({ isActive }) => ({
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

//Layout component

export function LayoutLeft({ fondo , children, style }) {
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
      }}>
        {children}
       </div>
  );
}
// Sidebar component con subcomponentes Header, Nav y Footer
export function Sidebar({ collapsed, layoutImage, widthOpen = 260, widthCollapsed = 72, children, style }) {
  return (
    <aside
      style={{
        width: collapsed ? widthCollapsed : widthOpen,
        padding: 12,
        borderRight: "1px solid #ddd",
        backgroundImage: `
          linear-gradient(135deg, rgba(15,23,42,0.85), rgba(2,6,23,0.9)),
          url(${layoutImage})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "width 0.2s ease",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </aside>
  );
}

// Header como "slot": vos ponés lo que quieras adentro
Sidebar.Header = function SidebarHeader({ children, style }) {
  return <div style={{ ...style }}>{children}</div>;
};

Sidebar.Nav = function SidebarNav({ children, style }) {
  return (
    <nav style={{ display: "grid", gap: 8, marginTop: 16, ...style }}>
      {children}
    </nav>
  );
};

Sidebar.Footer = function SidebarFooter({ children, style }) {
  return (
    <div style={{ marginTop: 16, display: "grid", gap: 10, ...style }}>
      {children}
    </div>
  );
};

Sidebar.Title = function SidebarTitle({ title, collapsed, setCollapsed, tittle2 = '' }) {
  return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            <div style={{ fontWeight: 900, fontSize: 18, color: "#f3e5e5ff", whiteSpace: "nowrap" }}>
              🧰 {collapsed ? "" : title}
            </div>

            <button
              onClick={() => setCollapsed(v => !v)}
              title={collapsed ? "Expandir" : "Colapsar"}
              style={{ marginLeft: "auto", border: "1px solid #ddd", background: "white", borderRadius: 10, padding: "6px 10px", cursor: "pointer", fontWeight: 800 }}
            >
              {collapsed ? "»" : "«"}
            </button>

            {!collapsed && (
              <div style={{ fontSize: 12, color: "#c9c9c9", marginTop: 4 }}>
                {tittle2}
              </div>
            )}
          </div>
  );
}

//pages
export  function CardN1({ icon, title, description, actionLabel, onAction }) {
  const isClickable = typeof onAction === "function";

  return (
    <div
      //onClick={isClickable ? onAction : undefined}
      className={`home-card ${isClickable ? "home-card-clickable" : ""}`}
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 14,
        padding: 16,
        background: "white",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 160,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: isClickable ? "pointer" : "default",
      }}
    >
      <div style={{ fontSize: 28 }}>{icon}</div>

      <div>
        <div style={{ fontWeight: 800, fontSize: 18 }}>{title}</div>
        <div style={{ color: "#555", marginTop: 6, lineHeight: 1.35 }}>
          {description}
        </div>
      </div>
      <div style={{ marginTop: "auto" }}>
        <MyButton actionLabel={actionLabel} onAction={onAction} />
      </div>
    </div>
  );
}

export function CardN2({ title, children, actionLabel, onAction }) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 14,
        padding: 16,
        background: "white",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontWeight: 900, marginBottom: 12 }}>{title}</div>

      {children}

      {actionLabel && (
        <div style={{ marginTop: "auto" }}>
          <div style={{ marginTop: "auto" }}>
            <MyButton actionLabel={actionLabel} onAction={onAction} />
          </div>
        </div>
      )}
    </div>
  );
}

export function TitlePage({ title, subtitle, banner, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {banner ? (
        <div
          style={{
            padding: "32px 24px",
            marginBottom: 24,
            borderRadius: 16,
            background:
              banner.background ??
              "linear-gradient(135deg, #0f172a, #020617)",
            color: banner.color ?? "white",
          }}
        >
          <h1 style={{ margin: 0 }}>{title}</h1>
          {subtitle && (
            <p style={{ marginTop: 8, color: banner.subColor ?? "#cbd5f5" }}>
              {subtitle}
            </p>
          )}
        </div>
      ) : (
        <>
          <h1 style={{ marginTop: 0, color: "#01012eff" }}>{title}</h1>
          {subtitle && (
            <p style={{ color: "#02000dff", marginTop: 4 }}>{subtitle}</p>
          )}
        </>
      )}

      {children}
    </div>
  );
}

export function OrderCards({ children }) {
  return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginTop: 18,
          }}>
          {children}
        </div>
  );
}