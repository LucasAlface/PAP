import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Dashboard from "./Dashboard.jsx";
import Users from "./Users.jsx";
import Ecopontos from "./Ecoponto/Ecopontos.jsx";
import AddEcoponto from "./Ecoponto/Add.jsx";
import Equipamentos from "./Equipamento/Equipamentos.jsx";
import AddEquipamento from "./Equipamento/Add.jsx";

export default function Backoffice() {
  const [page, setPage] = useState("dashboard");

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar page={page} onNavigate={setPage} />

      <div style={{ flex: 1, padding: 20, overflow: "auto" }}>
        {page === "dashboard" && <Dashboard />}
        {page === "users" && <Users />}
        {page === "ecopontos" && <Ecopontos onNavigate={setPage} />}
        {page === "add-ecoponto" && <AddEcoponto />}
        {page === "equipamentos" && <Equipamentos onNavigate={setPage} />}
        {page === "add-equipamento" && <AddEquipamento />}
      </div>
    </div>
  );
}
