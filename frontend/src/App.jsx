import { useState } from "react";
import Mapa from "./mapa.jsx";
import Backoffice from "./backoffice/Backoffice.jsx";
import Dashboard from "./backoffice/Dashboard.jsx";
import Login from "./Login.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Sidebar from "./backoffice/Sidebar.jsx";
import {
  UserRound,
  Map,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [page, setPage] = useState("dashboard");
  const [selectedItem, setSelectedItem] = useState(null);
  const [ecopontoMapCoordinates, setEcopontoMapCoordinates] = useState(null);
  const [empresaMapCoordinates, setEmpresaMapCoordinates] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { authUser, loading, login, logout } = useAuth();
  const isAdmin = authUser?.cargo === 1 || authUser?.cargo === 2;

  const resetNavigationForUser = (user) => {
    setMobileSidebarOpen(false);
    setSelectedItem(null);
    setEcopontoMapCoordinates(null);
    setEmpresaMapCoordinates(null);

    if (user?.cargo === 1 || user?.cargo === 2) {
      setView("dashboard");
      setPage("dashboard");
    } else {
      setView("map");
      setPage("map");
    }
  };

  const handleLogin = (user) => {
    login(user);
    resetNavigationForUser(user);
  };

  const handleLogout = async () => {
    await logout();
    setView("dashboard");
    setPage("dashboard");
    setMobileSidebarOpen(false);
  };

  const getBasePage = (currentPage) => {
    if (currentPage === "dashboard") return "dashboard";
    if (currentPage === "map") return "map";
    if (currentPage.includes("empresa")) return "empresas";
    if (currentPage.includes("utilizador")) return "utilizadores";
    if (currentPage.includes("ecopontoequipamento")) return "ecopontoequipamentos";
    if (currentPage.includes("ecopontolog")) return "ecopontologs";
    if (currentPage.includes("tipoecoponto")) return "tipoecopontos";
    if (currentPage.includes("tipodeposito")) return "tipodepositos";
    if (currentPage.includes("ecoponto")) return "ecopontos";
    if (currentPage.includes("equipamento")) return "equipamentos";
    if (currentPage.includes("deposito")) return "depositos";
    return currentPage;
  };

  const navigate = (newPage, item = null, options = {}) => {
    if (!isAdmin && newPage !== "map") {
      setSelectedItem(null);
      setView("map");
      setPage("map");
      setMobileSidebarOpen(false);
      return;
    }

    if (options.ecopontoCoordinates) {
      setEcopontoMapCoordinates({
        ...options.ecopontoCoordinates,
        version: Date.now(),
      });
    } else if (options.empresaCoordinates) {
      setEmpresaMapCoordinates({
        ...options.empresaCoordinates,
        version: Date.now(),
      });
    } else if (newPage === "ecopontos" || newPage === "add-ecoponto" || newPage === "edit-ecoponto") {
      setEcopontoMapCoordinates(null);
    } else if (newPage === "empresas" || newPage === "add-empresa" || newPage === "edit-empresa") {
      setEmpresaMapCoordinates(null);
    }

    setSelectedItem(item);
    const basePage = getBasePage(newPage);

    if (basePage === "dashboard") {
      setPage("dashboard");
      setView("dashboard");
    } else if (basePage === "map") {
      setPage("map");
      setView("map");
    } else {
      setPage(newPage);
      setView("backoffice");
    }

    setMobileSidebarOpen(false);
  };

  const handleAddEcopontoAt = (coordinates) => {
    navigate("add-ecoponto", null, { ecopontoCoordinates: coordinates });
  };

  if (loading) {
    return <div className="app-loading">A carregar...</div>;
  }

  if (!authUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          {isAdmin && (
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setMobileSidebarOpen((isOpen) => !isOpen)}
              aria-label={mobileSidebarOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileSidebarOpen}
            >
              {mobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
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
          <>
            <Sidebar
              page={page}
              onNavigate={navigate}
              isOpen={mobileSidebarOpen}
              onClose={() => setMobileSidebarOpen(false)}
            />
            {mobileSidebarOpen && (
              <button
                type="button"
                className="mobile-sidebar-backdrop"
                aria-label="Fechar menu"
                onClick={() => setMobileSidebarOpen(false)}
              />
            )}
          </>
        )}

        <main className={`main-stage main-stage-${isAdmin ? view : "map"}`}>
          {isAdmin && view === "dashboard" && <Dashboard onNavigate={navigate} />}

          {(!isAdmin || view === "map") && (
            <section className="map-region map-region-fullscreen">
              <Mapa onAddEcopontoAt={isAdmin ? handleAddEcopontoAt : undefined} />
            </section>
          )}

          {isAdmin && view === "backoffice" && (
            <section className="backoffice-stage">
              <Backoffice
                page={page}
                selectedItem={selectedItem}
                onNavigate={navigate}
                ecopontoMapCoordinates={ecopontoMapCoordinates}
                empresaMapCoordinates={empresaMapCoordinates}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
