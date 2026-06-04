import { useState, useMemo } from "react";
import Select from "react-select";
import useDepositos from "./useDepositos";
import useTipoDepositos from "../TipoDeposito/useTipoDepositos";
import {getOperatorOptions} from "../../middleware/options"

export default function Depositos({ onNavigate }) {
  const { items: depositos, loading, error, refetch } = useDepositos();
  const { items: tipoDepositos } = useTipoDepositos();

  const [filters, setFilters] = useState({
    tipoDepositoId: null,
    descricao: "",
    capacidadeTotal: "",
    operadorCapacidade: "igual",
    altura: "",
    operadorAltura: "igual"
  });

  const operators = getOperatorOptions();

  // Create options for deposito ID and tipo
  const tipoOptions = useMemo(() =>
    Array.isArray(tipoDepositos) ? tipoDepositos.map(t => ({ value: t.id, label: t.tipo })) : [],
    [tipoDepositos]
  );

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    const filterValues = {
      tipoDepositoId: filters.tipoDepositoId?.value || null,
      descricao: filters.descricao,
      capacidadeTotal: filters.capacidadeTotal,
      operadorCapacidade: filters.operadorCapacidade,
      altura: filters.altura,
      operadorAltura: filters.operadorAltura
    };
    refetch(filterValues);
  };

  const handleClearFilters = () => {
    setFilters({
      tipoDepositoId: null,
      descricao: "",
      capacidadeTotal: "",
      operadorCapacidade: "igual",
      altura: "",
      operaadorAltura: "igual"
    });
    refetch(null);
  };

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

      {/* Filter Section */}
      <div style={{ margin: "16px 0", padding: 16, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Filtros</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Tipo de Depósito</label>
            <Select
              options={tipoOptions}
              value={filters.tipoDepositoId}
              onChange={(option) => handleFilterChange("tipoDepositoId", option)}
              placeholder="Selecionar tipo"
              isClearable
              isSearchable
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: 6,
                  borderColor: "#d1d5db",
                  minHeight: 38
                })
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Descrição</label>
            <input
              type="text"
              value={filters.descricao}
              onChange={(e) => handleFilterChange("descricao", e.target.value)}
              placeholder="Pesquisar por descrição"
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Capacidade Total</label>
            <div style={{ display: "flex", gap: 8 }}>
              <Select
                options={operators}
                value={filters.operadorCapacidade}
                onChange={(option) => handleFilterChange("operadorCapacidade", option)}
                placeholder="Selecionar operador"
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: 6,
                    borderColor: "#d1d5db",
                    minHeight: 38
                  })
                }}
              />
              <input
                type="number"
                value={filters.capacidadeTotal}
                onChange={(e) => handleFilterChange("capacidadeTotal", e.target.value)}
                placeholder="Valor"
                style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Altura</label>
            <div style={{ display: "flex", gap: 8 }}>
              <Select
                options={operators}
                value={filters.operadorAltura}
                onChange={(option) => handleFilterChange("operadorAltura", option)}
                placeholder="Selecionar operador"
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: 6,
                    borderColor: "#d1d5db",
                    minHeight: 38
                  })
                }}
              />
              <input
                type="number"
                value={filters.altura}
                onChange={(e) => handleFilterChange("altura", e.target.value)}
                placeholder="Valor"
                style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db" }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              background: "#3b82f6",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? "Carregando..." : "Aplicar Filtros"}
          </button>
          <button
            onClick={handleClearFilters}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: "white",
              color: "#374151",
              cursor: "pointer"
            }}
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {loading && <p>Loading depositos...</p>}
      {error && <p style={{ color: "#b91c1c" }}>Error loading depositos: {error}</p>}

      {!loading && !error && (
        <>
          <div style={{ margin: "16px 0", padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 320 }}>
            <div style={{ color: "#666", fontSize: 14 }}>Total de depósitos</div>
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
