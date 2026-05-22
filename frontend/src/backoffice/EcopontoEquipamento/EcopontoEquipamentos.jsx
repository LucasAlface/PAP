import useEcopontoEquipamentos from "./useEcopontoEquipamentos.js";
import useEcopontos from "../Ecoponto/useEcopontos.js";
import useEquipamentos from "../Equipamento/useEquipamentos.js";

export default function EcopontoEquipamentos({ onNavigate }) {
  const { items, loading, error } = useEcopontoEquipamentos();
  const { ecopontos } = useEcopontos();
  const { equipamentos } = useEquipamentos();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Ecoponto Equipamentos</h2>
        <button
          onClick={() => onNavigate("add-ecopontoequipamento")}
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          Add Ecoponto Equipamento
        </button>
      </div>

      {loading && <p>Loading ecoponto equipamentos...</p>}
      {error && <p style={{ color: "#b91c1c" }}>Error loading ecoponto equipamentos: {error}</p>}

      {!loading && !error && (
        <>
          <div style={{ margin: "16px 0", padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 320 }}>
            <div style={{ color: "#666", fontSize: 14 }}>Total registered ecoponto equipamentos</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{items.length}</div>
          </div>

          {items.length === 0 ? (
            <p>No ecoponto equipamentos found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "12px 8px" }}>Ecoponto</th>
                    <th style={{ padding: "12px 8px" }}>Equipamento</th>
                    <th style={{ padding: "12px 8px" }}>Ativo</th>
                    <th style={{ padding: "12px 8px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={`${item.ecopontoId}-${item.equipamentoId}`} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      {Array.isArray(ecopontos)
                          ? ecopontos.find((e) => e.id === item.ecopontoId)?.codigo ??
                            "Ecoponto não encontrado"
                          : "Loading..."}
                      <td style={{ padding: "12px 8px" }}>
                      {Array.isArray(equipamentos)
                          ? equipamentos.find((eq) => eq.id === item.equipamentoId)?.codigo ??
                            "Equipamento não encontrado"
                          : "Loading..."}                      </td>
                      <td style={{ padding: "12px 8px" }}>{item.ativo ? "Sim" : "Não"}</td>
                      <td style={{ padding: "12px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={() => onNavigate("edit-ecopontoequipamento", item)}
                          style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onNavigate("delete-ecopontoequipamento", item)}
                          style={{ padding: "8px 10px", borderRadius: 6, background: "#dc2626", color: "white", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
