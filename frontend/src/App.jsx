import { useState } from "react";
import Mapa from "./mapa.jsx";
import Backoffice from "./backoffice/Backoffice.jsx";
import Login from "./Login.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Sidebar from "./backoffice/Sidebar.jsx";
import {
  UserRound,
  Map,
  LayoutDashboard,
  LogOut
} from "lucide-react";

export default function App() {
  const [view, setView] = useState("map");
  const [page, setPage] = useState("dashboard");
  const [selectedItem, setSelectedItem] = useState(null);
  const { authUser, loading, login, logout } = useAuth();
  const isAdmin = authUser?.cargo === 1 || authUser?.cargo === 2;

  const handleLogout = async () => {
    await logout();
    setView("map");
  };

  const getBasePage = (currentPage) => {
    if (currentPage === "dashboard") return "dashboard";
    if (currentPage.includes("empresa")) return "empresas";
    if (currentPage.includes("utilizador")) return "utilizadores";
    if (currentPage.includes("ecopontoequipamento")) return "ecopontoequipamentos";
    if (currentPage.includes("tipoecoponto")) return "tipoecopontos";
    if (currentPage.includes("tipodeposito")) return "tipodepositos";
    if (currentPage.includes("ecoponto")) return "ecopontos";
    if (currentPage.includes("equipamento")) return "equipamentos";
    if (currentPage.includes("deposito")) return "depositos";
    return currentPage;
  };

  const navigate = (newPage, item = null, options = {}) => {
    if (options.toggleIfActive && view === "backoffice" && getBasePage(page) === newPage) {
      setSelectedItem(null);
      setPage(newPage);
      setView("map");
      return;
    }

    setSelectedItem(item);
    setPage(newPage);
    if (view !== "backoffice") {
      setView("backoffice");
    }
  };

  if (loading) {
    return <div className="app-loading">A carregar...</div>;
  }

  if (!authUser) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <div className="app-brand-mark">
            <Map size={20} />
          </div>
          <div>
            <h1>EcoSensor</h1>
          </div>
        </div>

        <div className="app-header-actions">
          <div className="user-chip" title={authUser?.email}>
            <UserRound size={17} />
            <span>{authUser?.nome ?? authUser?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="header-btn header-btn-danger"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <div className="app-body">
        {isAdmin && (
          <Sidebar page={page} onNavigate={navigate} />
        )}

        <main className="main-stage">
          <section className={`map-region ${view === "backoffice" ? "map-region-with-backoffice" : "map-region-full"}`}>
            <Mapa />
          </section>

          {isAdmin && view === "backoffice" && (
            <section className="backoffice-dock">
              <Backoffice page={page} selectedItem={selectedItem} onNavigate={navigate} />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
