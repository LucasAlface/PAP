import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar({ page, onNavigate }) {
  const { authUser } = useAuth();
  const isAdmin = authUser?.cargo === 1;
  const itemStyle = (active) => ({
    padding: "12px 16px",
    cursor: "pointer",
    background: active ? "#f0f6ff" : undefined,
    borderLeft: active ? "4px solid #3b82f6" : "4px solid transparent",
  });

  return (
    <aside style={{ width: 220, borderRight: "1px solid #eee", paddingTop: 12 }}>
      <div style={{ padding: "0 16px 12px 16px", fontWeight: 600 }}>Backoffice</div>
      <div>
        <div style={itemStyle(page === "dashboard")} onClick={() => onNavigate("dashboard")}>
          Dashboard
        </div>
        <div style={itemStyle(page === "ecopontos")} onClick={() => onNavigate("ecopontos")}>
          Ecopontos
        </div>
        <div style={itemStyle(page === "equipamentos")} onClick={() => onNavigate("equipamentos")}>
          Equipamentos
        </div>
        <div style={itemStyle(page === "depositos")} onClick={() => onNavigate("depositos")}>
          Depósitos
        </div>
        <div style={itemStyle(page === "tipoecopontos")} onClick={() => onNavigate("tipoecopontos")}>
          Tipo Ecopontos
        </div>
        <div style={itemStyle(page === "tipodepositos")} onClick={() => onNavigate("tipodepositos")}>
          Tipo Depósitos
        </div>
        <div style={itemStyle(page === "ecopontoequipamentos")} onClick={() => onNavigate("ecopontoequipamentos")}>
          Ecoponto Equipamentos
        </div>
        {isAdmin && (
          <div style={itemStyle(page === "empresas")} onClick={() => onNavigate("empresas")}>
            Empresas
          </div>
        )}
        <div style={itemStyle(page === "utilizadores")} onClick={() => onNavigate("utilizadores")}>
          Utilizadores
        </div>
      </div>
    </aside>
  );
}
