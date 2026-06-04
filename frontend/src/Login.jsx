import { useState } from "react";
import { apiRequest } from "./middleware/request.js";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
  await apiRequest(
    "http://localhost:3000/login",
    "POST",
    { email, password }
  );

  const user = await apiRequest(
    "http://localhost:3000/login/me",
    "GET"
  );

  onLogin(user);

} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f2f7ff",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          background: "#ffffff",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 18px 40px rgba(50, 75, 120, 0.12)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 24, color: "#1f2a44" }}>Entrar</h2>
        <p style={{ margin: 0, color: "#5f6f8d" }}>
          Faça login para aceder ao backoffice.
        </p>

        <label style={{ display: "flex", flexDirection: "column", gap: 8, color: "#344767" }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #d1d7e4",
              outline: "none",
              fontSize: 14,
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 8, color: "#344767" }}>
          Palavra-passe
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #d1d7e4",
              outline: "none",
              fontSize: 14,
            }}
          />
        </label>

        {error && (
          <div style={{ color: "#d32f2f", fontSize: 14, lineHeight: 1.4 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 14px",
            borderRadius: 10,
            border: "none",
            background: "#2f6bff",
            color: "#ffffff",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            pointerEvents: loading ? "none" : "auto",
            fontWeight: 600,
            fontSize: 15,
            lineHeight: "20px",
          }}
        >
          {loading ? "A iniciar sessão..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
