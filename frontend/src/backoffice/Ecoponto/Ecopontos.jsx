import useDepositos from "../Deposito/useDepositos.js";
import useEcopontos from "./useEcopontos.js";

export default function Ecopontos({ onNavigate }) {
  const { depositos } = useDepositos();
  const { ecopontos, loading, error } = useEcopontos();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Ecopontos</h2>
        <button
          onClick={() => onNavigate("add-ecoponto")}
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          Add Ecoponto
        </button>
      </div>

      {loading && <p>Loading ecopontos...</p>}
      {error && <p style={{ color: "#b91c1c" }}>Error loading ecopontos: {error}</p>}

      {!loading && !error && (
        <>
          <div style={{ margin: "16px 0", padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 320 }}>
            <div style={{ color: "#666", fontSize: 14 }}>Total registered ecopontos</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{ecopontos.length}</div>
          </div>

          {ecopontos.length === 0 ? (
            <p>No ecopontos found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "12px 8px" }}>Código</th>
                    <th style={{ padding: "12px 8px" }}>Tipo</th>
                    <th style={{ padding: "12px 8px" }}>Depósito</th>
                    <th style={{ padding: "12px 8px" }}>Capacidade</th>
                    <th style={{ padding: "12px 8px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ecopontos.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 8px" }}>{item.codigo}</td>
                      <td style={{ padding: "12px 8px" }}>{item.tipoEcopontoId}</td>
                      <td style={{ padding: "12px 8px" }}>
                      {Array.isArray(depositos)
                        ? depositos.find((d) => d.id === item.depositoId)?.descricao ??
                          "Depósito não encontrado"
                        : "Loading..."}
                    </td>
                      <td style={{ padding: "12px 8px" }}>{item.capacidadeAtual}</td>
                      <td style={{ padding: "12px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={() => onNavigate("edit-ecoponto", item)}
                          style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onNavigate("delete-ecoponto", item)}
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
