import useEquipamentos from "./useEquipamentos.js";

export default function Equipamentos({ onNavigate }) {
  const { equipamentos, loading, error } = useEquipamentos();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Equipamentos</h2>
        <button
          onClick={() => onNavigate("add-equipamento")}
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          Add Equipamento
        </button>
      </div>

      {loading && <p>Loading equipamentos...</p>}
      {error && <p style={{ color: "#b91c1c" }}>Error loading equipamentos: {error}</p>}

      {!loading && !error && (
        <>
          <div style={{ margin: "16px 0", padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 320 }}>
            <div style={{ color: "#666", fontSize: 14 }}>Total registered equipamentos</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{equipamentos.length}</div>
          </div>

          {equipamentos.length === 0 ? (
            <p>No equipamentos found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "12px 8px" }}>ID</th>
                    <th style={{ padding: "12px 8px" }}>Código</th>
                    <th style={{ padding: "12px 8px" }}>Ativo</th>
                    <th style={{ padding: "12px 8px" }}>Bateria</th>
                    <th style={{ padding: "12px 8px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {equipamentos.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 8px" }}>{item.id}</td>
                      <td style={{ padding: "12px 8px" }}>{item.codigo}</td>
                      <td style={{ padding: "12px 8px" }}>{item.ativo ? "Sim" : "Não"}</td>
                      <td style={{ padding: "12px 8px" }}>{item.bateria}</td>
                      <td style={{ padding: "12px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={() => onNavigate("edit-equipamento", item)}
                          style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onNavigate("delete-equipamento", item)}
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
