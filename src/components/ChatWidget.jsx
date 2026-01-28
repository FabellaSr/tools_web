import { useEffect, useRef, useState } from "react";
import { postChatMessage, extractChatReply } from "../services/chatAiService";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hola 👋 Soy tu asistente. ¿Qué querés consultar?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!open) return;
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const data = await postChatMessage(text);

      // reply normalizado (por si cambia envoltorio)
      const replyText = extractChatReply(data);

      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);

      // Si querés mostrar debug (intent/missing) mientras desarrollás:
      // setMessages((prev) => [
      //   ...prev,
      //   { role: "assistant", content: `${replyText}\n\n[${data.intent} missing=${(data.missing||[]).join(",")}]` },
      // ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Error: ${e?.response?.data?.error || e.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // Cerrado: botón flotante
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
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
        }}
        aria-label="Abrir chat"
        title="Abrir chat"
      >
        💬
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        width: 380,
        background: "#fff",
        borderLeft: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        zIndex: 3000,
        boxShadow: "-10px 0 30px rgba(0,0,0,0.12)",
      }}
      role="dialog"
      aria-label="Chat"
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 700 }}>💬 Chat de pólizas</div>

        <button
          onClick={() => setOpen(false)}
          style={{
            border: "1px solid #ddd",
            background: "#fff",
            borderRadius: 10,
            width: 34,
            height: 34,
            cursor: "pointer",
          }}
          aria-label="Cerrar chat"
          title="Cerrar"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div
        ref={listRef}
        style={{ flex: 1, overflow: "auto", padding: 12, background: "#fafafa" }}
      >
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                margin: "8px 0",
              }}
            >
              <div
                style={{
                  maxWidth: "78%",
                  whiteSpace: "pre-wrap",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid #e5e5e5",
                  background: isUser ? "#e8f0ff" : "#fff",
                  fontSize: 14,
                  lineHeight: 1.35,
                }}
              >
                {m.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", margin: "8px 0" }}>
            <div
              style={{
                maxWidth: "78%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #e5e5e5",
                background: "#fff",
                opacity: 0.8,
                fontSize: 14,
              }}
            >
              Escribiendo…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ borderTop: "1px solid #eee", padding: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder="Escribí tu consulta… (Enter envía)"
            style={{
              flex: 1,
              resize: "none",
              padding: 10,
              borderRadius: 12,
              border: "1px solid #ddd",
              outline: "none",
              fontSize: 14,
            }}
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              padding: "0 14px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: loading || !input.trim() ? "#f2f2f2" : "#fff",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
