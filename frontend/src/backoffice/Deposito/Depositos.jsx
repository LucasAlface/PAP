import useDepositos from "./useDepositos";
import useTipoDepositos from "../TipoDeposito/useTipoDepositos";

export default function Depositos({ onNavigate }) {
  const { depositos, loading, error, refetch } = useDepositos();
  const { items: tipoDepositos } = useTipoDepositos();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Depósitos</h2>
        <button
          onClick={() => onNavigate("add-deposito")}
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          Add Depósito
        </button>
      </div>

      {loading && <p>Loading depositos...</p>}
      {error && <p style={{ color: "#b91c1c" }}>Error loading depositos: {error}</p>}

      {!loading && !error && (
        <>
          <div style={{ margin: "16px 0", padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 320 }}>
            <div style={{ color: "#666", fontSize: 14 }}>Total registered depósitos</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{depositos.length}</div>
          </div>

          {depositos.length === 0 ? (
            <p>No depósitos found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "12px 8px" }}>ID</th>
                    <th style={{ padding: "12px 8px" }}>Capacidade Total</th>
                    <th style={{ padding: "12px 8px" }}>Altura</th>
                    <th style={{ padding: "12px 8px" }}>Tipo</th>
                    <th style={{ padding: "12px 8px" }}>Descrição</th>
                    <th style={{ padding: "12px 8px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {depositos.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 8px" }}>{item.id}</td>
                      <td style={{ padding: "12px 8px" }}>{item.capacidadeTotal}</td>
                      <td style={{ padding: "12px 8px" }}>{item.altura}</td>
                      <td style={{ padding: "12px 8px" }}>
                        {Array.isArray(tipoDepositos)
                          ? tipoDepositos.find((t) => t.id === item.tipoDepositoId)?.tipo ??
                            "Tipo de depósito não encontrado"
                          : "Loading..."}
                      </td>
                      <td style={{ padding: "12px 8px" }}>{item.descricao}</td>
                      <td style={{ padding: "12px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={() => onNavigate("edit-deposito", item)}
                          style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onNavigate("delete-deposito", item)}
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
