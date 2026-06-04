import { useMemo } from "react";
import useUtilizadores from "./useUtilizadores.js";
import useEmpresas from "../Empresa/useEmpresas.js";
import useCargos from "./useCargos.js";

export default function Utilizadores({ onNavigate }) {
  const { items: utilizadores, loading, error, refetch } = useUtilizadores();
  const { items: empresas } = useEmpresas();
  const { items: cargos } = useCargos();

  const cargoById = useMemo(
    () => new Map(cargos.map((cargo) => [cargo.id, cargo.nome || cargo.id])),
    [cargos]
  );

  const empresaById = useMemo(
    () => new Map(empresas.map((empresa) => [empresa.id, empresa.nome || empresa.id])),
    [empresas]
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Utilizadores</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={refetch}
            style={{ padding: "10px 16px", borderRadius: 6, cursor: "pointer" }}
          >
            Refresh
          </button>
          <button
            onClick={() => onNavigate("add-utilizador")}
            style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
          >
            Add Utilizador
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>ID</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>Nome</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>Email</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>Cargo</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>Empresa</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilizadores.map((utilizador) => (
              <tr key={utilizador.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: 8 }}>{utilizador.id}</td>
                <td style={{ padding: 8 }}>{utilizador.nome}</td>
                <td style={{ padding: 8 }}>{utilizador.email}</td>
                <td style={{ padding: 8 }}>{cargoById.get(utilizador.cargoId) || utilizador.cargoId}</td>
                <td style={{ padding: 8 }}>{empresaById.get(utilizador.empresaId) || utilizador.empresaId || "-"}</td>
                <td style={{ padding: 8, display: "flex", gap: 8 }}>
                  <button
                    onClick={() => onNavigate("edit-utilizador", utilizador)}
                    style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onNavigate("delete-utilizador", utilizador)}
                    style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer", background: "#fee2e2" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
