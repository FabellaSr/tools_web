import { useEffect, useRef, useState } from "react";
import { postChatMessage, extractChatReply } from "../services/chatAiService";
import { chatWidgetStyles } from "../estilos/uiChats"; // ajustá path si hace falta

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hola 👋 Soy tu asistente. ¿Qué querés consultar?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

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
      const replyText = extractChatReply(data);
      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ Error: ${e?.response?.data?.error || e.message}` },
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
        style={chatWidgetStyles.fabButton}
        aria-label="Abrir chat"
        title="Abrir chat"
      >
        💬
      </button>
    );
  }

  const sendDisabled = loading || !input.trim();

  return (
    <div style={chatWidgetStyles.panel} role="dialog" aria-label="Chat">
      {/* Header */}
      <div style={chatWidgetStyles.header}>
        <div style={chatWidgetStyles.headerTitle}>💬 Chat de pólizas</div>

        <button
          onClick={() => setOpen(false)}
          style={chatWidgetStyles.closeButton}
          aria-label="Cerrar chat"
          title="Cerrar"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div ref={listRef} style={chatWidgetStyles.body}>
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div key={idx} style={chatWidgetStyles.row(isUser)}>
              <div style={chatWidgetStyles.bubble(isUser)}>{m.content}</div>
            </div>
          );
        })}

        {loading && (
          <div style={chatWidgetStyles.row(false)}>
            <div style={chatWidgetStyles.typingBubble}>Escribiendo…</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={chatWidgetStyles.inputBar}>
        <div style={chatWidgetStyles.inputRow}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder="Escribí tu consulta… (Enter envía)"
            style={chatWidgetStyles.textarea}
            disabled={loading}
          />
          <button onClick={send} disabled={sendDisabled} style={chatWidgetStyles.sendButton(sendDisabled)}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
