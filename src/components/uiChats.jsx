// --- Chat UI styles ---
export const chatWidgetStyles = {
  // Botón flotante (cuando está cerrado)
  fabButton: {
    position: "fixed",
    right: 18,
    bottom: 18,
    width: 54,
    height: 54,
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    zIndex: 3000,
    boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
  },

  // Panel fijo a la derecha
    panel: {
        position: "fixed",
        right: 18,
        bottom: 18,
        width: 380,
        height: "40vh",      // 👈 más corto
        maxHeight: 650,      // 👈 tope
        minHeight: 420,      // 👈 mínimo
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 14,    // 👈 ventanita
        display: "flex",
        flexDirection: "column",
        zIndex: 3000,
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
    },


  header: {
    padding: "10px 12px",
    borderBottom: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  headerTitle: {
    fontWeight: 700,
  },

  closeButton: {
    border: "1px solid #ddd",
    background: "#fff",
    borderRadius: 10,
    width: 34,
    height: 34,
    cursor: "pointer",
  },

  body: {
    flex: 1,
    overflow: "auto",
    padding: 12,
    background: "#fafafa",
  },

  row: (isUser) => ({
    display: "flex",
    justifyContent: isUser ? "flex-end" : "flex-start",
    margin: "8px 0",
  }),

  bubble: (isUser) => ({
    maxWidth: "78%",
    whiteSpace: "pre-wrap",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e5e5",
    background: isUser ? "#e8f0ff" : "#fff",
    fontSize: 14,
    lineHeight: 1.35,
  }),

  typingBubble: {
    maxWidth: "78%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e5e5",
    background: "#fff",
    opacity: 0.8,
    fontSize: 14,
  },

  inputBar: {
    borderTop: "1px solid #eee",
    padding: 10,
  },

  inputRow: {
    display: "flex",
    gap: 8,
  },

  textarea: {
    flex: 1,
    resize: "none",
    padding: 10,
    borderRadius: 12,
    border: "1px solid #ddd",
    outline: "none",
    fontSize: 14,
  },

  sendButton: (disabled) => ({
    padding: "0 14px",
    borderRadius: 12,
    border: "1px solid #ddd",
    background: disabled ? "#f2f2f2" : "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600,
  }),
};
