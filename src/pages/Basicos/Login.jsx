import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardN2, Field, Alert, MyButton, TitlePage} from "../../estilos/ui"; 
import { login } from "../../services/authApi";
import { setToken } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const title = "🔐 Login ";
  const subtitle = "Logeate dale";

async function onLogin() {
  setMsg(null);

  if (!username.trim() || !password.trim()) {
    setMsg({ type: "error", text: "Usuario y password son obligatorios." });
    return;
  }

  try {
    setLoading(true);

    const data = await login(username.trim(), password);

    const token =
      data?.token ||
      data?.accessToken ||
      data?.data?.token ||
      data?.data?.accessToken;

    if (!token) throw new Error("Login OK pero no vino token en la respuesta.");

    setToken(token);
    
    navigate("/", { replace: true });
    setMsg({ type: "success", text: "Login exitoso. Redirigiendo..." });
  } catch (e) {
    const backendMsg =
      e?.data?.error?.message || e?.data?.message || e?.message;

    setMsg({ type: "error", text: backendMsg || "Error de login" });
  } finally {
    setLoading(false);
  }
}

  return (
      <TitlePage title={title} 
                 subtitle={subtitle} 
                 banner={{
                 background: "linear-gradient(135deg, #0f172a, #020617)", }}>
      {msg && (
        <Alert variant={msg.type === "error" ? "error" : "success"}
          title={msg.type === "error" ? "❌ Error" : "✅ OK"}>
          {msg.text}
        </Alert> 
      )}

      <CardN2 title="Credenciales">

        <div style={{ display: "grid", gap: 12 }}>

          <Field label="Usuario" value={username} onChange={setUser} placeholder="Usuario" />
          <Field label="Password" value={password} onChange={setPassword} placeholder="Password" type="password" />

          <div style={{ display: "flex", gap: 10 }}>
            <MyButton
              actionLabel={loading ? "⏳ Ingresando..." : "➡️ Ingresar"}
              onAction={onLogin}
              disabled={loading}/>
            <MyButton actionLabel="← Volver" onAction={() => navigate("/")} />
          </div>

        </div>

      </CardN2>
    </TitlePage>
  );
}
