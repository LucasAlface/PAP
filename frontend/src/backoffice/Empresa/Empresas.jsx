import { UseState, useEffect } from 'react';
import Select from 'react-select';
import useEmpresas from './useEmpresas.js';

export default function Empresas({ onNavigate }) {
  const { items: empresas, loading, error, refetch } = useEmpresas();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Empresas</h2>
        <button
          onClick={() => onNavigate("add-empresa")}
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          Add Empresa
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>ID</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>Nome</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>NIF</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>Email</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>Telefone</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map(empresa => (
              <tr key={empresa.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: 8 }}>{empresa.id}</td>
                <td style={{ padding: 8 }}>{empresa.nome}</td>
                <td style={{ padding: 8 }}>{empresa.nif}</td>
                <td style={{ padding: 8 }}>{empresa.email}</td>
                <td style={{ padding: 8 }}>{empresa.telefone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}