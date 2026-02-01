// --- Users Admin UI styles ---
export const usersAdminStyles = {
  page: {
    padding: 18,
    maxWidth: 1100,
    margin: "0 auto",
  },

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 14,
  },

  title: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },

  subtitle: {
    margin: "8px 0 0 0",
    opacity: 0.75,
  },

  headerActions: {
    display: "flex",
    gap: 10,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.25fr",
    gap: 16,
  },

  // cards
  card: {
    background: "#fff",
    border: "1px solid rgba(15, 23, 42, 0.12)",
    borderRadius: 14,
    padding: 16,
    boxShadow: "0 10px 25px rgba(2, 6, 23, 0.06)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },

  cardTitle: {
    margin: 0,
    fontSize: 16,
    letterSpacing: "-0.01em",
  },

  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(15, 23, 42, 0.14)",
    background: "rgba(2, 6, 23, 0.03)",
    opacity: 0.9,
  },

  // form
  form: {
    display: "grid",
    gap: 12,
  },

  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  field: {
    display: "grid",
    gap: 6,
  },

  label: {
    fontSize: 12,
    opacity: 0.75,
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(15, 23, 42, 0.16)",
    background: "#fff",
    outline: "none",
    fontSize: 14,
  },

  hint: {
    fontSize: 12,
    opacity: 0.6,
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    flexWrap: "wrap",
  },

  helperInline: {
    fontSize: 12,
    opacity: 0.7,
  },

  btn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: 600,
    userSelect: "none",
  },

  btnPrimary: (disabled) => ({
    background: disabled ? "rgba(2, 6, 23, 0.25)" : "rgba(2, 6, 23, 0.92)",
    color: "#fff",
    boxShadow: disabled ? "none" : "0 10px 25px rgba(2, 6, 23, 0.15)",
    cursor: disabled ? "not-allowed" : "pointer",
  }),

  btnSecondary: (disabled) => ({
    background: "rgba(2, 6, 23, 0.03)",
    border: "1px solid rgba(15, 23, 42, 0.14)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
  }),

  // alerts
  alert: {
    marginTop: 8,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(15, 23, 42, 0.12)",
    fontSize: 14,
  },

  alertOk: {
    background: "rgba(34, 197, 94, 0.12)",
  },

  alertErr: {
    background: "rgba(239, 68, 68, 0.12)",
  },

  // list / table
  listTop: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
  },

  counter: {
    fontSize: 20,
    fontWeight: 700,
  },

  counterLabel: {
    opacity: 0.7,
    fontSize: 12,
  },

  tableWrap: {
    borderRadius: 12,
    border: "1px solid rgba(15, 23, 42, 0.12)",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },

  th: {
    textAlign: "left",
    padding: 12,
    background: "rgba(2, 6, 23, 0.03)",
    borderBottom: "1px solid rgba(15, 23, 42, 0.12)",
    opacity: 0.9,
  },

  td: {
    padding: 12,
    borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
    verticalAlign: "top",
  },

  tdStrong: {
    fontWeight: 700,
  },

  tdMono: {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 12.5,
  },

  tdMuted: {
    opacity: 0.7,
    fontSize: 12,
  },

  pill: (role) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    border: "1px solid rgba(15, 23, 42, 0.14)",
    background: "rgba(2, 6, 23, 0.03)",
    fontWeight: role === "admin" ? 800 : 600,
    opacity: role === "admin" ? 1 : 0.85,
  }),

  empty: {
    padding: 18,
    textAlign: "center",
  },

  emptyTitle: {
    fontWeight: 800,
    marginBottom: 4,
  },

  emptySub: {
    opacity: 0.7,
    fontSize: 13,
  },

  footerNote: {
    marginTop: 10,
    opacity: 0.6,
    fontSize: 12,
  },

  // responsive helper (si querés forzar 1 columna manualmente)
  isNarrowHint: {
    opacity: 0.6,
    fontSize: 12,
  },
};
