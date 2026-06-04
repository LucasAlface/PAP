import { useState, useEffect } from "react";
import Mapa from "./mapa.jsx";
import Backoffice from "./backoffice/Backoffice.jsx";
import Login from "./Login.jsx";

export default function App() {
  const [view, setView] = useState("map");
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await apiRequest(
          "http://localhost:3000/login/me",
          "GET"
        );

        setAuthUser(user);
      } catch {
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const handleLogin = (user) => {
    setAuthUser(user);
  };

  const handleLogout = async () => {
    try {
      await apiRequest(
        "http://localhost:3000/auth/logout",
        "POST"
      );
    } catch {}

    setAuthUser(null);
    setView("map");
  };

  if (loading) {
    return <div>A carregar...</div>;
  }

  if (!authUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header style={{ padding: 12, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18 }}>PAP - Admin</h1>
          <div style={{ fontSize: 13, color: "#555" }}>
            Entrou como {authUser?.nome ?? authUser?.email}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setView("map")}
            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", cursor: "pointer", background: view === "map" ? "#e6f0ff" : undefined }}
          >
            Mapa
          </button>
          <button
            onClick={() => setView("backoffice")}
            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", cursor: "pointer", background: view === "backoffice" ? "#e6f0ff" : undefined }}
          >
            Backoffice
          </button>
          <button
            onClick={handleLogout}
            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", cursor: "pointer", background: "#ff5858", color: "#fff" }}
          >
            Sair
          </button>
        </div>
      </header>

      <main style={{ flex: 1, position: "relative" }}>
        {view === "map" ? <Mapa /> : <Backoffice />}
      </main>
    </div>
  );
}