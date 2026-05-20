export default function Sidebar({ page, onNavigate }) {
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
        <div style={itemStyle(page === "users")} onClick={() => onNavigate("users")}>
          Users
        </div>
        <div style={itemStyle(page === "ecopontos")} onClick={() => onNavigate("ecopontos")}>
          Ecopontos
        </div>
        <div style={itemStyle(page === "add-ecoponto")} onClick={() => onNavigate("add-ecoponto")}>
          Add Ecoponto
        </div>
      </div>
    </aside>
  );
}
