import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Dashboard from "./Dashboard.jsx";
import Users from "./Users.jsx";
import Ecopontos from "./Ecopontos.jsx";
import Add from "./Add.jsx";

export default function Backoffice() {
  const [page, setPage] = useState("dashboard");

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar page={page} onNavigate={setPage} />

      <div style={{ flex: 1, padding: 20, overflow: "auto" }}>
        {page === "dashboard" && <Dashboard />}
        {page === "users" && <Users />}
        {page === "ecopontos" && <Ecopontos />}
        {page === "add-ecoponto" && <Add />}
      </div>
    </div>
  );
}
