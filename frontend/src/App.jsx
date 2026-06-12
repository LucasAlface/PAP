import { useState } from "react";
import Mapa from "./mapa.jsx";
import Backoffice from "./backoffice/Backoffice.jsx";
import Login from "./Login.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Sidebar from "./backoffice/Sidebar.jsx";
import {
  UserRound,
  ChevronDown,
  Map,
  LayoutDashboard
} from "lucide-react";

export default function App() {
  const [view, setView] = useState("map");
  const [page, setPage] = useState("dashboard");
  const [selectedItem, setSelectedItem] = useState(null);
  const [openUserMenu, setOpenUserMenu] =
  useState(false);
  const { authUser, loading, login, logout } = useAuth();
  const isAdmin = authUser?.cargo === 1 || authUser?.cargo === 2;

  const handleLogout = async () => {
    await logout();
    setView("map");
  };

  const navigate = (newPage, item = null) => {
    setSelectedItem(item);
    setPage(newPage);
    if (view !== "backoffice") {
      setView("backoffice");
    }
  };

  if (loading) {
    return <div>A carregar...</div>;
  }

  if (!authUser) {
    return <Login onLogin={login} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

        <header className="bg-slate-900 text-white">      
          <div>
  <h1 className="text-2xl font-bold">
    EcoTrack
  </h1>

  <p className="text-slate-400 text-sm">
    Gestão Inteligente de Ecopontos
  </p>
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
          {isAdmin && (
            <button
              onClick={() => setView("backoffice")}
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", cursor: "pointer", background: view === "backoffice" ? "#e6f0ff" : undefined }}
            >
              Backoffice
            </button>
          )}
            <button 
            onClick={() => setOpenUserMenu(!openUserMenu)} className="flex items-center gap-2">
              <UserRound />
              <span>{authUser.nome}</span>
              <ChevronDown />
            </button>
             <button
            onClick={handleLogout}
            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", cursor: "pointer", background: "#ff5858", color: "#fff" }}
          >
            Sair
          </button>
          </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {isAdmin && (
          <Sidebar page={view === "backoffice" ? page : null} onNavigate={navigate} />
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Map always visible */}
          <div style={{ flex: view === "backoffice" ? "0 0 45%" : "1", position: "relative", minHeight: 200 }}>
            <Mapa />
          </div>

          {/* Backoffice panel at the bottom */}
          {view === "backoffice" && (
            <div style={{ flex: 1, borderTop: "2px solid #e5e7eb", overflow: "auto", background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 12px 0" }}>
                <button
                  onClick={() => setView("map")}
                  style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer", fontSize: 13 }}
                >
                  ✕ Fechar
                </button>
              </div>
              <Backoffice page={page} selectedItem={selectedItem} onNavigate={navigate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}